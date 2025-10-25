import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';

const JWT_SECRET = 'your-super-secret-jwt-key-for-afet-maratonu-2024';

export async function GET(request: NextRequest) {
  try {
    console.log('=== TASKS API START ===');
    
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    console.log('Token exists:', !!token);
    
    if (!token) {
      return NextResponse.json({ message: 'Token gerekli' }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as any;
      console.log('Token decoded successfully:', { userId: decoded.userId, role: decoded.role });
    } catch (jwtError) {
      console.error('JWT verification failed:', jwtError);
      return NextResponse.json({ message: 'Geçersiz token' }, { status: 401 });
    }

    // Eğitmen kontrolü
    if (decoded.role !== 'INSTRUCTOR') {
      return NextResponse.json({ message: 'Yetkisiz erişim' }, { status: 403 });
    }

    // Görevleri getir
    console.log('Fetching tasks...');
    const tasks = await prisma.task.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log('Found tasks:', tasks.length);
    console.log('Tasks data:', tasks);

    return NextResponse.json({
      tasks,
      total: tasks.length
    });

  } catch (error) {
    console.error('Error fetching tasks:', error);
    console.error('Error details:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack');
    return NextResponse.json({ 
      message: 'Sunucu hatası', 
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error instanceof Error ? error.stack : 'No details'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('=== CREATE TASK START ===');
    
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    console.log('Token exists:', !!token);
    
    if (!token) {
      return NextResponse.json({ message: 'Token gerekli' }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as any;
      console.log('Token decoded successfully:', { userId: decoded.userId, role: decoded.role });
    } catch (jwtError) {
      console.error('JWT verification failed:', jwtError);
      return NextResponse.json({ message: 'Geçersiz token' }, { status: 401 });
    }

    // Eğitmen kontrolü
    if (decoded.role !== 'INSTRUCTOR') {
      return NextResponse.json({ message: 'Yetkisiz erişim' }, { status: 403 });
    }

    const requestBody = await request.json();
    console.log('Request body received:', requestBody);
    const { title, description, startDate, endDate, startTime, endTime } = requestBody;

    // Tarih ve saatleri birleştir
    let startDateTime = null;
    let endDateTime = null;
    
    if (startDate && startTime) {
      startDateTime = new Date(`${startDate}T${startTime}`);
    }
    
    if (endDate && endTime) {
      endDateTime = new Date(`${endDate}T${endTime}`);
    }

    // Görev oluştur
    console.log('Creating task...');
    console.log('Task data:', {
      title,
      description,
      dueDate: endDateTime || new Date(),
      priority: 'MEDIUM',
      status: 'PENDING',
      startDate: startDateTime
    });

    const newTask = await prisma.task.create({
      data: {
        title,
        description,
        dueDate: endDateTime || new Date(), // Eğer bitiş tarihi yoksa bugün
        priority: 'MEDIUM', // Varsayılan öncelik
        status: 'PENDING', // Varsayılan olarak beklemede
        startDate: startDateTime, // Başlangıç tarihi
        // Yeni alanlar eklenebilir: startDate, endDate, startTime, endTime
      }
    });

    console.log('Task created successfully:', newTask.id);

    // Görev oluşturulduktan sonra otomatik kontrol yap
    try {
      const autoCheckResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/tasks/auto-schedule`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (autoCheckResponse.ok) {
        const autoCheckData = await autoCheckResponse.json();
        console.log('Auto check completed for instructor task:', autoCheckData);
      }
    } catch (error) {
      console.error('Auto check error for instructor task:', error);
    }
    
    return NextResponse.json({
      message: 'Görev başarıyla oluşturuldu',
      task: newTask
    });

  } catch (error) {
    console.error('Error creating task:', error);
    console.error('Error details:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack');
    return NextResponse.json({ 
      message: 'Sunucu hatası', 
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error instanceof Error ? error.stack : 'No details'
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    console.log('=== UPDATE TASK START ===');
    
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    console.log('Token exists:', !!token);
    
    if (!token) {
      return NextResponse.json({ message: 'Token gerekli' }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as any;
      console.log('Token decoded successfully:', { userId: decoded.userId, role: decoded.role });
    } catch (jwtError) {
      console.error('JWT verification failed:', jwtError);
      return NextResponse.json({ message: 'Geçersiz token' }, { status: 401 });
    }

    // Eğitmen kontrolü
    if (decoded.role !== 'INSTRUCTOR') {
      return NextResponse.json({ message: 'Yetkisiz erişim' }, { status: 403 });
    }

    const requestBody = await request.json();
    console.log('Request body received:', requestBody);
    const { taskId, status } = requestBody;

    // Görev durumunu güncelle
    console.log('Updating task status...');
    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: { status },
      select: {
        id: true,
        title: true,
        description: true,
        dueDate: true,
        status: true,
        createdAt: true,
        updatedAt: true
      }
    });

    console.log('Task updated successfully:', updatedTask.id);
    
    return NextResponse.json({
      message: 'Görev durumu başarıyla güncellendi',
      task: updatedTask
    });

  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json({ 
      message: 'Sunucu hatası', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    console.log('=== DELETE TASK START ===');
    
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    console.log('Token exists:', !!token);
    
    if (!token) {
      return NextResponse.json({ message: 'Token gerekli' }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as any;
      console.log('Token decoded successfully:', { userId: decoded.userId, role: decoded.role });
    } catch (jwtError) {
      console.error('JWT verification failed:', jwtError);
      return NextResponse.json({ message: 'Geçersiz token' }, { status: 401 });
    }

    // Eğitmen kontrolü
    if (decoded.role !== 'INSTRUCTOR') {
      return NextResponse.json({ message: 'Yetkisiz erişim' }, { status: 403 });
    }

    const requestBody = await request.json();
    console.log('Request body received:', requestBody);
    const { taskId } = requestBody;

    if (!taskId) {
      return NextResponse.json({ message: 'Görev ID gerekli' }, { status: 400 });
    }

    // Görevi sil
    console.log('Deleting task...');
    await prisma.task.delete({
      where: { id: taskId }
    });

    console.log('Task deleted successfully:', taskId);

    return NextResponse.json({
      success: true,
      message: 'Görev başarıyla silindi'
    });

  } catch (error) {
    console.error('Error deleting task:', error);
    console.error('Error details:', error);
    return NextResponse.json({ 
      message: 'Sunucu hatası', 
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error instanceof Error ? error.stack : 'No details'
    }, { status: 500 });
  }
}