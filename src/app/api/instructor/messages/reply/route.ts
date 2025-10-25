import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';

const JWT_SECRET = 'your-super-secret-jwt-key-for-afet-maratonu-2024';

export async function POST(request: NextRequest) {
  try {
    console.log('=== MESSAGE REPLY START ===');
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    console.log('Token exists:', !!token);
    
    if (!token) {
      return NextResponse.json({ message: 'Token gerekli' }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as any;
      console.log('Token decoded successfully:', { userId: decoded.userId, role: decoded.role });
    } catch (jwtError) {
      console.error('JWT verification failed:', jwtError);
      return NextResponse.json({ message: 'Geçersiz token' }, { status: 401 });
    }

    // Eğitmen kontrolü
    if (decoded.role !== 'INSTRUCTOR') {
      return NextResponse.json({ message: 'Yetkisiz erişim' }, { status: 403 });
    }

    const requestBody = await request.json();
    console.log('Request body received:', requestBody);
    const { messageId, reply } = requestBody;

    if (!messageId || !reply) {
      return NextResponse.json({ message: 'Mesaj ID ve cevap gerekli' }, { status: 400 });
    }

    // Önce orijinal mesajı bul
    const originalMessage = await prisma.message.findUnique({
      where: { id: messageId },
      include: { 
        fromUser: {
          select: {
            id: true,
            fullName: true,
            email: true,
            role: true
          }
        }
      }
    });

    if (!originalMessage) {
      return NextResponse.json({ message: 'Mesaj bulunamadı' }, { status: 404 });
    }

    // Cevap mesajı oluştur (Message modelinde)
    const replyMessage = await prisma.message.create({
      data: {
        fromUserId: decoded.userId,
        toUserId: originalMessage.fromUserId, // Orijinal mesajı gönderen kişiye cevap
        subject: `Eğitmen cevap verdi: Soru ${originalMessage.id.slice(-4)}`,
        body: reply,
        messageType: 'answer',
        toRole: originalMessage.fromUser?.role || 'PARTICIPANT'
      },
      include: {
        fromUser: {
          select: {
            fullName: true,
            email: true
          }
        },
        toUser: {
          select: {
            fullName: true,
            email: true
          }
        }
      }
    });

    // Orijinal mesajı cevaplandı olarak işaretle
    const updatedMessage = await prisma.message.update({
      where: { id: messageId },
      data: {
        isAnswered: true
      }
    });

    console.log('Message updated successfully:', updatedMessage.id);
    
    return NextResponse.json({
      success: true,
      message: 'Cevap başarıyla gönderildi',
      updatedMessage
    });

  } catch (error) {
    console.error('Error replying to message:', error);
    console.error('Error details:', error);
    return NextResponse.json({ 
      message: 'Sunucu hatası', 
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error instanceof Error ? error.stack : 'No details'
    }, { status: 500 });
  }
}

