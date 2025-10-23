import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Tüm görevleri getir
export async function GET(request: NextRequest) {
  console.log('=== GET ADMIN TASKS API CALLED ===');
  
  try {
    // Gerçek veritabanından admin görevlerini getir
    const adminTasks = await prisma.task.findMany({
      where: {
        userId: null, // Admin tarafından oluşturulan görevler (userId null)
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    console.log('Admin tasks found:', adminTasks.length);
    
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
    
    const { title, description, startDate, dueDate, status } = body;

    console.log('Parsed data:', { title, description, startDate, dueDate, status });

    // Basit validasyon
    if (!title || !description) {
      console.log('Validation failed: Missing title or description');
      return NextResponse.json(
        { success: false, error: 'Başlık ve açıklama gereklidir' },
        { status: 400 }
      );
    }

    if (!startDate || !dueDate) {
      console.log('Validation failed: Missing dates');
      return NextResponse.json(
        { success: false, error: 'Başlama ve bitiş tarihi gereklidir' },
        { status: 400 }
      );
    }

    // Tarih kontrolü
    if (new Date(startDate) >= new Date(dueDate)) {
      console.log('Validation failed: Invalid date range');
      return NextResponse.json(
        { success: false, error: 'Bitiş tarihi başlama tarihinden sonra olmalıdır' },
        { status: 400 }
      );
    }

    console.log('Validation passed, creating task in database...');

    // Gerçek veritabanına admin görevi oluştur
    const task = await prisma.task.create({
      data: {
        title: title.trim(),
        description: description.trim(),
        startDate: new Date(startDate),
        dueDate: new Date(dueDate),
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
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Admin görevi oluşturulamadı', 
        detail: error?.message || 'Bilinmeyen hata' 
      },
      { status: 500 }
    );
  }
}
