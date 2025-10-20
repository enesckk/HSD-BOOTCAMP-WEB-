import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Tek ders getir
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const lesson = await prisma.lesson.findUnique({
      where: { id: params.id },
    });

    if (!lesson) {
      return NextResponse.json(
        { success: false, error: 'Ders bulunamadı' },
        { status: 404 }
      );
    }

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
    console.error('Error fetching lesson:', error);
    return NextResponse.json(
      { success: false, error: 'Ders getirilemedi' },
      { status: 500 }
    );
  }
}

// PUT - Ders güncelle
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
      isPublished,
      thumbnailUrl,
      tags,
    } = body;

    const updateData: any = {};
    
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (youtubeUrl) {
      // YouTube URL formatını kontrol et
      const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
      if (!youtubeRegex.test(youtubeUrl)) {
        return NextResponse.json(
          { success: false, error: 'Geçersiz YouTube URL formatı' },
          { status: 400 }
        );
      }
      updateData.youtubeUrl = youtubeUrl;
    }
    if (duration) updateData.duration = duration;
    if (instructor) updateData.instructor = instructor;
    if (category) updateData.category = category;
    if (week) updateData.week = parseInt(week);
    if (isPublished !== undefined) updateData.isPublished = isPublished;
    if (thumbnailUrl !== undefined) updateData.thumbnailUrl = thumbnailUrl;
    if (tags !== undefined) updateData.tags = tags;

    const lesson = await prisma.lesson.update({
      where: { id: params.id },
      data: updateData,
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
    console.error('Error updating lesson:', error);
    return NextResponse.json(
      { success: false, error: 'Ders güncellenemedi' },
      { status: 500 }
    );
  }
}

// DELETE - Ders sil
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.lesson.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      success: true,
      message: 'Ders başarıyla silindi',
    });
  } catch (error) {
    console.error('Error deleting lesson:', error);
    return NextResponse.json(
      { success: false, error: 'Ders silinemedi' },
      { status: 500 }
    );
  }
}
