import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Görevleri listele
export async function GET(request: NextRequest) {
  try {
    console.log('=== INSTRUCTOR TASKS API CALLED ===');
    
    // Veritabanından tüm görevleri çek
    const tasks = await prisma.task.findMany({
      where: {
        status: {
          in: ['PENDING', 'SUBMITTED', 'APPROVED', 'REJECTED', 'NEEDS_REVISION']
        }
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Görevleri formatla
    const formattedTasks = tasks.map((task: any) => ({
      id: task.id,
      title: task.title,
      description: task.description,
      startDate: task.startDate ? task.startDate.toISOString() : null,
      dueDate: task.dueDate ? task.dueDate.toISOString() : null,
      priority: task.priority,
      status: task.status,
      submissions: 0, // Şimdilik 0, daha sonra hesaplanabilir
      totalStudents: 1, // Şimdilik 1, daha sonra hesaplanabilir
      assignedTo: task.user ? task.user.fullName : null,
      createdAt: task.createdAt.toISOString(),
      updatedAt: task.updatedAt.toISOString()
    }));

    console.log('Instructor tasks found:', formattedTasks.length);

    return NextResponse.json({
      success: true,
      tasks: formattedTasks,
    });
  } catch (error) {
    console.error('=== INSTRUCTOR TASKS ERROR ===');
    console.error('Error:', error);
    return NextResponse.json(
      { success: false, error: 'Görevler getirilemedi' },
      { status: 500 }
    );
  }
}

// POST - Yeni görev oluştur
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, dueDate, priority, category, tags, estimatedHours, notes } = body;

    if (!title || !description) {
      return NextResponse.json(
        { success: false, error: 'Gerekli alanlar eksik' },
        { status: 400 }
      );
    }

    const newTask = await prisma.task.create({
      data: {
        title,
        description,
        dueDate: dueDate ? new Date(dueDate) : null,
        priority: priority || 'MEDIUM',
        category: category || null,
        tags: tags || null,
        estimatedHours: estimatedHours ? parseInt(estimatedHours) : null,
        notes: notes || null,
        status: 'PENDING'
      }
    });

    return NextResponse.json({
      success: true,
      task: newTask,
    });
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json(
      { success: false, error: 'Görev oluşturulamadı' },
      { status: 500 }
    );
  }
}