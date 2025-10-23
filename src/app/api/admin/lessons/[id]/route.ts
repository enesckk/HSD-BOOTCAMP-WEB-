import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// PUT - Ders güncelle
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    const { title, description, youtubeUrl, duration, instructor, category, week, tags, showDate, prerequisites, objectives, resources } = body;
    const { id } = await params;

    if (!title || !description || !youtubeUrl || !instructor) {
      return NextResponse.json(
        { error: 'Gerekli alanlar eksik' },
        { status: 400 }
      );
    }

    // YouTube URL'den video ID'yi çıkar
    const youtubeId = youtubeUrl.split('v=')[1]?.split('&')[0];
    const thumbnailUrl = youtubeId ? `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg` : null;

    // Veritabanında güncelle
    const updatedLesson = await (prisma as any).lesson.update({
      where: { id: id },
      data: {
        title,
        description,
        youtubeUrl,
        duration: duration || '00:00',
        instructor,
        category: category || 'Genel',
        week: week || 1,
        thumbnailUrl,
        tags: tags ? tags.split(',').map((tag: string) => tag.trim()).join(',') : '',
        showDate: showDate ? new Date(showDate) : new Date(),
        prerequisites: prerequisites || '',
        objectives: objectives || '',
        resources: resources || ''
      }
    });

    return NextResponse.json({
      success: true,
      lesson: updatedLesson,
    });
  } catch (error) {
    console.error('Error updating lesson:', error);
    return NextResponse.json(
      { error: 'Ders güncellenemedi' },
      { status: 500 }
    );
  }
}

// DELETE - Ders sil
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await (prisma as any).lesson.delete({
      where: { id: id }
    });

    return NextResponse.json({
      success: true,
      message: 'Ders başarıyla silindi',
    });
  } catch (error) {
    console.error('Error deleting lesson:', error);
    return NextResponse.json(
      { error: 'Ders silinemedi' },
      { status: 500 }
    );
  }
}