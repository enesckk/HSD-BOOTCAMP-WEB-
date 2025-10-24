import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';

const JWT_SECRET = 'your-super-secret-jwt-key-for-afet-maratonu-2024';

export async function GET(request: NextRequest) {
  try {
    console.log('=== MESSAGES API START ===');
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

    // Tüm kanalları listele
    console.log('Listing all channels...');
    const allChannels = await prisma.channel.findMany();
    console.log('All channels:', allChannels);

    // Eğitmene sor mesajlarını getir (Message modelinden)
    console.log('Fetching instructor messages from Message model...');
    const messages = await prisma.message.findMany({
      where: {
        messageType: 'question',
        toRole: 'INSTRUCTOR'
      },
      include: {
        fromUser: {
          select: {
            id: true,
            fullName: true,
            email: true
          }
        },
        toUser: {
          select: {
            id: true,
            fullName: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Her mesaj için cevapları getir
    const messagesWithReplies = await Promise.all(
      messages.map(async (msg) => {
        const replies = await prisma.message.findMany({
          where: {
            messageType: 'answer',
            subject: {
              contains: msg.id // Subject'te mesaj ID'si olan cevaplar
            }
          },
          include: {
            fromUser: {
              select: {
                fullName: true,
                email: true
              }
            }
          },
          orderBy: {
            createdAt: 'asc'
          }
        });

        return {
          ...msg,
          replies: replies.map(reply => ({
            id: reply.id,
            content: reply.body,
            user: {
              fullName: reply.fromUser?.fullName || 'Bilinmeyen Kullanıcı',
              email: reply.fromUser?.email || 'Bilinmeyen Email'
            },
            createdAt: reply.createdAt
          }))
        };
      })
    );

    console.log('Messages with replies found:', messagesWithReplies.length);

    return NextResponse.json({
      success: true,
      messages: messagesWithReplies.map(msg => ({
        id: msg.id,
        content: msg.body,
        user: {
          fullName: msg.fromUser?.fullName || 'Bilinmeyen Kullanıcı',
          email: msg.fromUser?.email || 'Bilinmeyen Email'
        },
        channel: {
          name: 'egitmene-sor',
          displayName: 'Eğitmene Sor'
        },
        messageType: msg.messageType,
        isPinned: false,
        createdAt: msg.createdAt,
        updatedAt: msg.updatedAt,
        isAnswered: msg.isAnswered || false,
        replies: msg.replies || []
      })),
      total: messagesWithReplies.length
    });

  } catch (error) {
    console.error('Error fetching messages:', error);
    console.error('Error details:', error);
    return NextResponse.json({ 
      message: 'Sunucu hatası', 
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error instanceof Error ? error.stack : 'No details'
    }, { status: 500 });
  }
}


