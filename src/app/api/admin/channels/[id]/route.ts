import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// PUT - Kanalı güncelle
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { displayName, description, category, isPrivate } = body;

    const channel = await prisma.channel.update({
      where: { id },
      data: {
        displayName,
        description,
        category,
        isPrivate
      }
    });

    return NextResponse.json({ channel });
  } catch (error) {
    console.error('Error updating channel:', error);
    return NextResponse.json(
      { error: 'Kanal güncellenemedi' },
      { status: 500 }
    );
  }
}

// DELETE - Kanalı sil
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Önce kanaldaki tüm mesajları sil
    await prisma.channelMessage.deleteMany({
      where: { channelId: id }
    });

    // Kanal okuma kayıtlarını sil
    await prisma.userChannelRead.deleteMany({
      where: { channelId: id }
    });

    // Sonra kanalı sil
    await prisma.channel.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting channel:', error);
    return NextResponse.json(
      { error: 'Kanal silinemedi' },
      { status: 500 }
    );
  }
}
