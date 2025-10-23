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
    console.log('Deleting channel with ID:', id);

    // Önce kanaldaki tüm mesajları sil
    const deletedMessages = await prisma.channelMessage.deleteMany({
      where: { channelId: id }
    });
    console.log('Deleted messages:', deletedMessages.count);

    // Kanal okuma kayıtlarını sil
    const deletedReads = await prisma.userChannelRead.deleteMany({
      where: { channelId: id }
    });
    console.log('Deleted read records:', deletedReads.count);

    // Sonra kanalı sil
    const deletedChannel = await prisma.channel.delete({
      where: { id }
    });
    console.log('Deleted channel:', deletedChannel.name);

    return NextResponse.json({ 
      success: true, 
      message: 'Kanal başarıyla silindi',
      deletedChannel: deletedChannel.name 
    });
  } catch (error) {
    console.error('Error deleting channel:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Kanal silinemedi: ' + error.message 
      },
      { status: 500 }
    );
  }
}
