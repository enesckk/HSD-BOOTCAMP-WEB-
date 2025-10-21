import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, tags } = body;

    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Kullanıcı bilgisi bulunamadı' },
        { status: 401 }
      );
    }

    // Eğitmene Sor DM kanalını bul
    const dmChannel = await prisma.channel.findFirst({
      where: {
        name: 'egitmene-sor-dm'
      }
    });

    if (!dmChannel) {
      return NextResponse.json(
        { success: false, error: 'Eğitmene Sor kanalı bulunamadı' },
        { status: 404 }
      );
    }

    // Eğitmene sor mesajını DM kanalına gönder
    const message = await prisma.channelMessage.create({
      data: {
        content: content,
        messageType: 'question',
        tags: tags || null,
        channelId: dmChannel.id,
        userId,
        isPinned: true // Eğitmen sorularını otomatik sabitle
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
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
      }
    });

    // Eğitmenlere bildirim oluştur
    const instructors = await prisma.user.findMany({
      where: {
        role: 'INSTRUCTOR'
      },
      select: {
        id: true
      }
    });

    // Her eğitmen için bildirim oluştur
    for (const instructor of instructors) {
      await prisma.notification.create({
        data: {
          type: 'MESSAGE',
          title: 'Yeni Eğitmen Sorusu',
          message: `Yeni bir soru alındı: ${content.substring(0, 50)}...`,
          userId: instructor.id,
          isRead: false
        }
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Sorunuz eğitmenlere iletildi',
      data: message
    });

  } catch (error) {
    console.error('Error asking instructor:', error);
    return NextResponse.json(
      { success: false, error: 'Soru gönderilemedi' },
      { status: 500 }
    );
  }
}
