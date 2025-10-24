import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Görevleri listele
export async function GET(request: NextRequest) {
  try {
    console.log('=== INSTRUCTOR TASKS API CALLED ===');
    
    // Geçici olarak mock data döndür
    const mockTasks = [
      {
        id: '1',
        title: 'Örnek Görev 1',
        description: 'Bu bir örnek görevdir',
        dueDate: new Date().toISOString(),
        priority: 'MEDIUM',
        status: 'PENDING',
        submissions: 0,
        totalStudents: 1
      },
      {
        id: '2',
        title: 'Örnek Görev 2',
        description: 'Bu da bir örnek görevdir',
        dueDate: new Date().toISOString(),
        priority: 'HIGH',
        status: 'PENDING',
        submissions: 1,
        totalStudents: 1
      }
    ];

    return NextResponse.json({
      success: true,
      tasks: mockTasks,
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