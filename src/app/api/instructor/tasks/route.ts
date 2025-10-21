import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Görevleri listele
export async function GET(request: NextRequest) {
  try {
    const tasks = await (prisma as any).task.findMany({
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

    // Görev verilerini formatla
    const formattedTasks = tasks.map((task: any) => ({
      id: task.id,
      title: task.title,
      description: task.description,
      dueDate: task.dueDate?.toISOString() || new Date().toISOString(),
      priority: task.priority || 'MEDIUM',
      status: task.status || 'PENDING',
      submissions: task.fileUrl || task.linkUrl ? 1 : 0,
      totalStudents: 1 // Şimdilik 1, daha sonra gerçek sayı hesaplanacak
    }));

    return NextResponse.json({
      success: true,
      tasks: formattedTasks,
    });
  } catch (error) {
    console.error('Error fetching tasks:', error);
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

    const newTask = await (prisma as any).task.create({
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