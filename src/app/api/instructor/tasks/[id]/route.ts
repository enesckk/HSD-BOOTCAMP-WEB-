import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';

const JWT_SECRET = 'your-super-secret-jwt-key-for-afet-maratonu-2024';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log('=== UPDATE TASK BY ID START ===');
    
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

    const { id } = params;
    const requestBody = await request.json();
    console.log('Request body received:', requestBody);
    const { title, description, dueDate, startDate, endDate, startTime, endTime } = requestBody;

    if (!title || !description) {
      return NextResponse.json({ message: 'Başlık ve açıklama gerekli' }, { status: 400 });
    }

    // Görevi güncelle
    console.log('Updating task...');
    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        title,
        description,
        dueDate: dueDate ? new Date(dueDate) : null,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        startTime: startTime || null,
        endTime: endTime || null,
      },
      select: {
        id: true,
        title: true,
        description: true,
        dueDate: true,
        startDate: true,
        endDate: true,
        startTime: true,
        endTime: true,
        status: true,
        createdAt: true,
        updatedAt: true
      }
    });

    console.log('Task updated successfully:', updatedTask.id);

    // Görev güncellendikten sonra otomatik kontrol yap
    try {
      const autoCheckResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/tasks/auto-schedule`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (autoCheckResponse.ok) {
        const autoCheckData = await autoCheckResponse.json();
        console.log('Auto check completed for instructor task update:', autoCheckData);
      }
    } catch (error) {
      console.error('Auto check error for instructor task update:', error);
    }
    
    return NextResponse.json({
      success: true,
      message: 'Görev başarıyla güncellendi',
      task: updatedTask
    });

  } catch (error) {
    console.error('Error updating task:', error);
    console.error('Error details:', error);
    return NextResponse.json({ 
      message: 'Sunucu hatası', 
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error instanceof Error ? error.stack : 'No details'
    }, { status: 500 });
  }
}
