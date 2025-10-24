import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// PUT - Duyuru güncelle
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { title, content } = body;

    if (!title || !content) {
      return NextResponse.json(
        { success: false, error: 'Başlık ve içerik gerekli' },
        { status: 400 }
      );
    }

    const updatedAnnouncement = await (prisma as any).announcement.update({
      where: { id },
      data: {
        title,
        content,
        summary: content.substring(0, 100) + '...',
      }
    });

    return NextResponse.json({
      success: true,
      announcement: updatedAnnouncement,
    });
  } catch (error) {
    console.error('Error updating announcement:', error);
    return NextResponse.json(
      { success: false, error: 'Duyuru güncellenemedi' },
      { status: 500 }
    );
  }
}

// DELETE - Duyuru sil
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    await (prisma as any).announcement.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: 'Duyuru başarıyla silindi'
    });
  } catch (error) {
    console.error('Error deleting announcement:', error);
    return NextResponse.json(
      { success: false, error: 'Duyuru silinemedi' },
      { status: 500 }
    );
  }
}
