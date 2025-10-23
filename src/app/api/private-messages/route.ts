import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Kullanıcının özel mesajlarını getir
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Kullanıcı bilgisi bulunamadı' },
        { status: 401 }
      );
    }

    // Kullanıcının gönderdiği ve aldığı mesajları getir
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { fromUserId: userId },
          { toUserId: userId }
        ]
      },
      include: {
        fromUser: {
          select: {
            id: true,
            fullName: true,
            email: true,
            role: true
          }
        },
        toUser: {
          select: {
            id: true,
            fullName: true,
            email: true,
            role: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({
      success: true,
      messages
    });
  } catch (error) {
    console.error('Error fetching private messages:', error);
    return NextResponse.json(
      { success: false, error: 'Mesajlar getirilemedi' },
      { status: 500 }
    );
  }
}

// POST - Özel mesaj gönder
export async function POST(request: NextRequest) {
  try {
    console.log('Private message POST request received');
    const userId = request.headers.get('x-user-id');
    console.log('User ID from header:', userId);
    
    if (!userId) {
      console.log('No user ID found in headers');
      return NextResponse.json(
        { success: false, error: 'Kullanıcı bilgisi bulunamadı' },
        { status: 401 }
      );
    }

    const body = await request.json();
    console.log('Request body:', body);
    const { content, tags, toRole = 'ADMIN' } = body;

    if (!content?.trim()) {
      console.log('No content provided');
      return NextResponse.json(
        { success: false, error: 'Mesaj içeriği gereklidir' },
        { status: 400 }
      );
    }

    // Alıcı kullanıcıyı bul (ADMIN veya INSTRUCTOR)
    console.log('Looking for user with role:', toRole);
    let toUser;
    if (toRole === 'ADMIN') {
      toUser = await prisma.user.findFirst({
        where: { role: 'ADMIN' }
      });
    } else if (toRole === 'INSTRUCTOR') {
      toUser = await prisma.user.findFirst({
        where: { role: 'INSTRUCTOR' }
      });
    }

    console.log('Found toUser:', toUser ? toUser.id : 'null');
    if (!toUser) {
      console.log('No user found with role:', toRole);
      return NextResponse.json(
        { success: false, error: 'Alıcı kullanıcı bulunamadı' },
        { status: 404 }
      );
    }

    // Özel mesaj oluştur
    console.log('Creating message with data:', {
      fromUserId: userId,
      toUserId: toUser.id,
      toRole: toRole,
      subject: tags ? `[${tags}] Eğitmene Sor` : 'Eğitmene Sor',
      body: content,
      messageType: 'question'
    });
    
    const message = await prisma.message.create({
      data: {
        fromUserId: userId,
        toUserId: toUser.id,
        toRole: toRole,
        subject: tags ? `[${tags}] Eğitmene Sor` : 'Eğitmene Sor',
        body: content,
        messageType: 'question'
      },
      include: {
        fromUser: {
          select: {
            id: true,
            fullName: true,
            email: true,
            role: true
          }
        },
        toUser: {
          select: {
            id: true,
            fullName: true,
            email: true,
            role: true
          }
        }
      }
    });

    // Alıcıya bildirim oluştur
    await prisma.notification.create({
      data: {
        type: 'MESSAGE',
        title: 'Yeni Özel Mesaj',
        message: `Yeni bir mesaj aldınız: ${content.substring(0, 50)}...`,
        userId: toUser.id,
        isRead: false
      }
    });

    return NextResponse.json({
      success: true,
      message
    });
  } catch (error) {
    console.error('Error sending private message:', error);
    return NextResponse.json(
      { success: false, error: 'Mesaj gönderilemedi: ' + (error instanceof Error ? error.message : 'Bilinmeyen hata') },
      { status: 500 }
    );
  }
}
