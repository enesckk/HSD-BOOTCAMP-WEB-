import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Dersleri listele
export async function GET(request: NextRequest) {
  try {
    const lessons = await (prisma as any).lesson.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({
      success: true,
      lessons: lessons,
    });
  } catch (error) {
    console.error('Error fetching lessons:', error);
    return NextResponse.json(
      { error: 'Dersler getirilemedi' },
      { status: 500 }
    );
  }
}

// POST - Yeni ders oluştur
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, youtubeUrl, duration, instructor, category, week, tags, showDate, prerequisites, objectives, resources } = body;

    if (!title || !description || !youtubeUrl || !instructor) {
      return NextResponse.json(
        { error: 'Gerekli alanlar eksik' },
        { status: 400 }
      );
    }

    // YouTube URL'den video ID'yi çıkar
    const youtubeId = youtubeUrl.split('v=')[1]?.split('&')[0];
    const thumbnailUrl = youtubeId ? `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg` : null;

    // Veritabanına kaydet
    const newLesson = await (prisma as any).lesson.create({
      data: {
        title,
        description,
        youtubeUrl,
        duration: duration || '00:00',
        instructor,
        category: category || 'Genel',
        week: week || 1,
        isPublished: false,
        thumbnailUrl,
        tags: tags ? tags.split(',').map((tag: string) => tag.trim()).join(',') : '',
        showDate: showDate ? new Date(showDate) : new Date(),
        isActive: false,
        order: 0,
        prerequisites: prerequisites || '',
        objectives: objectives || '',
        resources: resources || ''
      }
    });

    return NextResponse.json({
      success: true,
      lesson: newLesson,
    });
  } catch (error) {
    console.error('Error creating lesson:', error);
    return NextResponse.json(
      { error: 'Ders oluşturulamadı' },
      { status: 500 }
    );
  }
}