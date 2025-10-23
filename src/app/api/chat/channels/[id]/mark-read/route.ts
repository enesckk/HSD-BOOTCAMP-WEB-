import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = request.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Kullanıcı bilgisi bulunamadı' },
        { status: 401 }
      );
    }

    // Kullanıcının bu kanalı okundu olarak işaretle
    await prisma.userChannelRead.upsert({
      where: {
        userId_channelId: {
          userId: userId,
          channelId: id
        }
      },
      update: {
        lastReadAt: new Date()
      },
      create: {
        userId: userId,
        channelId: id,
        lastReadAt: new Date()
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Kanal okundu olarak işaretlendi'
    });

  } catch (error) {
    console.error('Error marking channel as read:', error);
    return NextResponse.json(
      { success: false, error: 'Kanal okundu işaretlenemedi' },
      { status: 500 }
    );
  }
}
