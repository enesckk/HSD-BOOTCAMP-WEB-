import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';

const JWT_SECRET = 'your-super-secret-jwt-key-for-afet-maratonu-2024';

export async function GET(request: NextRequest) {
  try {
    console.log('=== LESSONS API START ===');
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

    // Dersleri getir
    console.log('Fetching lessons...');
    const lessons = await prisma.lesson.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log('Found lessons:', lessons.length);
    console.log('Lessons data:', lessons);
    
    return NextResponse.json({
      success: true,
      lessons,
      total: lessons.length
    });

  } catch (error) {
    console.error('Error fetching lessons:', error);
    console.error('Error details:', error);
    return NextResponse.json({ 
      message: 'Sunucu hatası', 
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error instanceof Error ? error.stack : 'No details'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('=== CREATE LESSON START ===');
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
      tags 
    } = requestBody;

    // Ders oluştur
    console.log('Creating lesson...');
    const newLesson = await prisma.lesson.create({
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
        isPublished: false, // Varsayılan olarak taslak
      }
    });

    console.log('Lesson created successfully:', newLesson.id);
    
    return NextResponse.json({
      success: true,
      message: 'Ders başarıyla oluşturuldu',
      lesson: newLesson
    });

  } catch (error) {
    console.error('Error creating lesson:', error);
    console.error('Error details:', error);
    return NextResponse.json({ 
      message: 'Sunucu hatası', 
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error instanceof Error ? error.stack : 'No details'
    }, { status: 500 });
  }
}