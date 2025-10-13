import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { TaskStatus } from '@prisma/client';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const task = await prisma.task.findUnique({
      where: { id },
    });

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    return NextResponse.json(task);
  } catch (error) {
    console.error('Error fetching task:', error);
    return NextResponse.json(
      { error: 'Failed to fetch task' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { status } = await request.json();
    
    console.log('Task update request:', { id, status });

    // Convert lowercase status to uppercase enum
    let taskStatus: TaskStatus;
    if (status === 'pending') {
      taskStatus = TaskStatus.PENDING;
    } else if (status === 'completed') {
      taskStatus = TaskStatus.COMPLETED;
    } else if (status === 'rejected') {
      taskStatus = TaskStatus.REJECTED;
    } else {
      console.log('Invalid status received:', status);
      return NextResponse.json(
        { error: 'Invalid status. Must be pending, completed, or rejected' },
        { status: 400 }
      );
    }

    console.log('Updating task with status:', taskStatus);

    const updatedTask = await prisma.task.update({
      where: { id },
      data: { status: taskStatus },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            teamMembers: {
              include: {
                members: true
              }
            }
          }
        }
      }
    });

    // Eğer görev onaylandıysa (COMPLETED), takım üyelerine bildirim gönder
    try {
      if (taskStatus === TaskStatus.COMPLETED && updatedTask.user?.teamMembers) {
        const teamMembers = updatedTask.user.teamMembers.members;
        
        // Her takım üyesi için bildirim oluştur
        for (const member of teamMembers) {
          if (member.id !== updatedTask.userId) { // Görev sahibi hariç
            await prisma.notification.create({
              data: {
                type: 'TASK',
                title: 'Görev Onaylandı',
                message: `${updatedTask.user.fullName} tarafından yüklenen "${updatedTask.title}" görevi onaylandı`,
                actionUrl: '/dashboard/tasks',
                userId: member.id, // Kişiye özel bildirim
                read: false
              }
            });
          }
        }
        
        // Görev sahibine de bildirim gönder
        await prisma.notification.create({
          data: {
            type: 'TASK',
            title: 'Göreviniz Onaylandı',
            message: `"${updatedTask.title}" göreviniz onaylandı`,
            actionUrl: '/dashboard/tasks',
            userId: updatedTask.userId, // Görev sahibine özel bildirim
            read: false
          }
        });
      }
    } catch (notificationError) {
      console.error('Error creating notifications:', notificationError);
      // Bildirim hatası görev güncellemeyi engellemez
    }

    console.log('Task updated successfully:', updatedTask);
    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json(
      { error: 'Failed to update task' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await prisma.task.delete({
      where: { id },
    });
    return NextResponse.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json(
      { error: 'Failed to delete task' },
      { status: 500 }
    );
  }
}