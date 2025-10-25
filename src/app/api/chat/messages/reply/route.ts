import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';

const JWT_SECRET = 'your-super-secret-jwt-key-for-afet-maratonu-2024';

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json({ message: 'Token gerekli' }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as any;
    } catch (jwtError) {
      return NextResponse.json({ message: 'Geçersiz token' }, { status: 401 });
    }

    const { messageId, content } = await request.json();

    if (!messageId || !content) {
      return NextResponse.json({ message: 'Mesaj ID ve içerik gerekli' }, { status: 400 });
    }

    // Ana mesajı bul
    const parentMessage = await prisma.channelMessage.findUnique({
      where: { id: messageId },
      include: {
        channel: true,
        user: true,
      },
    });

    if (!parentMessage) {
      return NextResponse.json({ message: 'Ana mesaj bulunamadı' }, { status: 404 });
    }

    // Yanıt mesajı oluştur
    const reply = await prisma.channelMessage.create({
      data: {
        channelId: parentMessage.channelId,
        userId: decoded.userId,
        content,
        messageType: 'reply',
        parentId: messageId,
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            role: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Yanıt başarıyla gönderildi',
      reply: {
        id: reply.id,
        content: reply.content,
        messageType: reply.messageType,
        createdAt: reply.createdAt,
        user: reply.user,
      },
    });

  } catch (error) {
    console.error('Error creating reply:', error);
    return NextResponse.json(
      { success: false, message: 'Yanıt oluşturulamadı' },
      { status: 500 }
    );
  }
}
