import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Admin için tüm kanal mesajlarını getir
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const channelId = searchParams.get('channelId');
    const limit = parseInt(searchParams.get('limit') || '100');

    let whereClause = {};
    if (channelId) {
      whereClause = { channelId };
    }

    const messages = await prisma.channelMessage.findMany({
      where: whereClause,
      include: {
        user: {
          select: { 
            id: true, 
            fullName: true, 
            email: true,
            role: true 
          }
        },
        channel: {
          select: { 
            id: true, 
            name: true, 
            displayName: true 
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit
    });

    // Kanal istatistikleri
    const channelStats = await prisma.channel.findMany({
      include: {
        _count: {
          select: { messages: true }
        }
      }
    });

    return NextResponse.json({ 
      messages, 
      channelStats 
    });
  } catch (error) {
    console.error('Error fetching admin channel data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch channel data' },
      { status: 500 }
    );
  }
}

// DELETE - Mesaj sil (Admin only)
export async function DELETE(request: NextRequest) {
  try {
    const { messageId } = await request.json();

    await prisma.channelMessage.delete({
      where: { id: messageId }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting message:', error);
    return NextResponse.json(
      { error: 'Failed to delete message' },
      { status: 500 }
    );
  }
}
