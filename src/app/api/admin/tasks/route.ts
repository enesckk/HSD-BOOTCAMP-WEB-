import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Tüm görevleri getir
export async function GET(request: NextRequest) {
  console.log('=== GET ADMIN TASKS API CALLED ===');
  
  try {
    // Sadece admin görevlerini getir (userId null olan görevler)
    const adminTasks = await prisma.task.findMany({
      where: {
        userId: null // Sadece admin tarafından oluşturulan görevler
      },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        startDate: true,
        endDate: true,
        startTime: true,
        endTime: true,
        dueDate: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    console.log('Admin tasks found:', adminTasks.length);
    console.log('Sample task data:', adminTasks[0]);
    
    return NextResponse.json({
      success: true,
      tasks: adminTasks,
      count: adminTasks.length,
      message: 'Admin görevleri başarıyla getirildi'
    });
    
  } catch (error) {
    console.error('=== GET ADMIN TASKS ERROR ===');
    console.error('Error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'API hatası',
      detail: error instanceof Error ? error.message : 'Bilinmeyen hata'
    }, { status: 500 });
  }
}

// POST - Yeni görev oluştur
export async function POST(request: NextRequest) {
  console.log('=== CREATE ADMIN TASK API CALLED ===');
  
  try {
    const body = await request.json();
    console.log('Request body:', body);
    
    const { title, description, startDate, endDate, startTime, endTime, dueDate, status } = body;

    console.log('Parsed data:', { title, description, startDate, endDate, startTime, endTime, dueDate, status });

    // Basit validasyon
    if (!title || !description) {
      console.log('Validation failed: Missing title or description');
      return NextResponse.json(
        { success: false, error: 'Başlık ve açıklama gereklidir' },
        { status: 400 }
      );
    }

    console.log('Validation passed, creating task in database...');

    // Gerçek veritabanına admin görevi oluştur
    const task = await prisma.task.create({
      data: {
        title: title.trim(),
        description: description.trim(),
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        startTime: startTime || null,
        endTime: endTime || null,
        dueDate: dueDate ? new Date(dueDate) : null,
        status: (status || 'PENDING') as any, // TaskStatus enum'u
        userId: null, // Admin görevi (userId null)
        huaweiCloudAccount: '',
        uploadType: 'FILE'
      }
    });

    console.log('Admin task created in database:', task);

    return NextResponse.json({ 
      success: true,
      task,
      message: 'Admin görevi başarıyla oluşturuldu'
    });
    
  } catch (error: any) {
    console.error('=== CREATE ADMIN TASK ERROR ===');
    console.error('Error:', error);
    console.error('Error message:', error?.message);
    console.error('Error stack:', error?.stack);
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Admin görevi oluşturulamadı', 
        detail: error?.message || 'Bilinmeyen hata',
        stack: error?.stack
      },
      { status: 500 }
    );
  }
}

// PUT - Görev güncelle
export async function PUT(request: NextRequest) {
  console.log('=== UPDATE ADMIN TASK API CALLED ===');
  
  try {
    const body = await request.json();
    const { id, title, description, startDate, dueDate, status } = body;
    
    console.log('Update request:', { id, title, description, startDate, dueDate, status });

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Görev ID gereklidir' },
        { status: 400 }
      );
    }

    // Görevi güncelle
    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        ...(title && { title: title.trim() }),
        ...(description && { description: description.trim() }),
        ...(startDate && { startDate: new Date(startDate) }),
        ...(dueDate && { dueDate: new Date(dueDate) }),
        ...(status && { status: status as any })
      }
    });

    console.log('Task updated successfully:', updatedTask);

    return NextResponse.json({
      success: true,
      task: updatedTask,
      message: 'Görev başarıyla güncellendi'
    });

  } catch (error: any) {
    console.error('=== UPDATE ADMIN TASK ERROR ===');
    console.error('Error:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Görev güncellenemedi', 
        detail: error?.message || 'Bilinmeyen hata' 
      },
      { status: 500 }
    );
  }
}
