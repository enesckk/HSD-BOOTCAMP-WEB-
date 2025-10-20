import { NextRequest, NextResponse } from 'next/server';

// GET - Tüm dersleri getir
export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      success: true,
      lessons: [],
    });
  } catch (error) {
    console.error('Error fetching lessons:', error);
    return NextResponse.json(
      { success: false, error: 'Dersler getirilemedi' },
      { status: 500 }
    );
  }
}

// POST - Yeni ders oluştur
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      youtubeUrl,
      duration,
      instructor,
      category,
      week,
      isPublished = false,
      thumbnailUrl,
      tags = '',
      showDate,
      prerequisites,
      objectives,
      resources,
    } = body;

    // Gerekli alanları kontrol et
    if (!title || !youtubeUrl || !instructor || !category || !week) {
      return NextResponse.json(
        { success: false, error: 'Gerekli alanlar eksik' },
        { status: 400 }
      );
    }

    // YouTube URL formatını kontrol et
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    if (!youtubeRegex.test(youtubeUrl)) {
      return NextResponse.json(
        { success: false, error: 'Geçersiz YouTube URL formatı' },
        { status: 400 }
      );
    }

    // Dersi oluştur
    const lesson = await prisma.lesson.create({
      data: {
        title,
        description,
        youtubeUrl,
        duration,
        instructor,
        category,
        week: parseInt(week),
        isPublished,
        thumbnailUrl,
        tags,
        showDate: showDate ? new Date(showDate) : null,
        prerequisites,
        objectives,
        resources,
      },
    });

    return NextResponse.json({
      success: true,
      lesson: {
        id: lesson.id,
        title: lesson.title,
        description: lesson.description,
        youtubeUrl: lesson.youtubeUrl,
        duration: lesson.duration,
        instructor: lesson.instructor,
        category: lesson.category,
        week: lesson.week,
        isPublished: lesson.isPublished,
        createdAt: lesson.createdAt,
        updatedAt: lesson.updatedAt,
        thumbnailUrl: lesson.thumbnailUrl,
        tags: lesson.tags,
      },
    });
  } catch (error) {
    console.error('Error creating lesson:', error);
    return NextResponse.json(
      { success: false, error: 'Ders oluşturulamadı' },
      { status: 500 }
    );
  }
}
