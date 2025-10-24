import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';

const JWT_SECRET = 'your-super-secret-jwt-key-for-afet-maratonu-2024';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log('=== UPDATE LESSON START ===');
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
    const { 
      title, 
      description, 
      youtubeUrl, 
      duration, 
      instructor, 
      category, 
      week, 
      showDate, 
      prerequisites, 
      objectives, 
      resources, 
      tags,
      isPublished 
    } = requestBody;

    // Ders güncelle
    console.log('Updating lesson...');
    const updatedLesson = await prisma.lesson.update({
      where: { id: params.id },
      data: {
        title,
        description,
        youtubeUrl,
        duration,
        instructor,
        category,
        week,
        showDate: showDate ? new Date(showDate) : null,
        prerequisites,
        objectives,
        resources,
        tags,
        isPublished: isPublished !== undefined ? isPublished : false,
      }
    });

    console.log('Lesson updated successfully:', updatedLesson.id);
    
    return NextResponse.json({
      success: true,
      message: 'Ders başarıyla güncellendi',
      lesson: updatedLesson
    });

  } catch (error) {
    console.error('Error updating lesson:', error);
    console.error('Error details:', error);
    return NextResponse.json({ 
      message: 'Sunucu hatası', 
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error instanceof Error ? error.stack : 'No details'
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log('=== DELETE LESSON START ===');
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

    // Ders sil
    console.log('Deleting lesson...');
    await prisma.lesson.delete({
      where: { id: params.id }
    });

    console.log('Lesson deleted successfully:', params.id);
    
    return NextResponse.json({
      success: true,
      message: 'Ders başarıyla silindi'
    });

  } catch (error) {
    console.error('Error deleting lesson:', error);
    console.error('Error details:', error);
    return NextResponse.json({ 
      message: 'Sunucu hatası', 
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error instanceof Error ? error.stack : 'No details'
    }, { status: 500 });
  }
}
