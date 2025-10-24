import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';

const JWT_SECRET = 'your-super-secret-jwt-key-for-afet-maratonu-2024';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('=== GET MESSAGE REPLIES START ===');
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

    const { id } = params;
    console.log('Getting replies for message:', id);

    // Bu mesaja verilen cevapları getir
    const replies = await prisma.message.findMany({
      where: {
        messageType: 'answer',
        toUserId: decoded.userId, // Eğitmene gelen cevaplar
        subject: {
          contains: id // Subject'te mesaj ID'si olan cevaplar
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

    console.log('Replies found:', replies.length);

    return NextResponse.json({
      success: true,
      replies: replies.map(reply => ({
        id: reply.id,
        content: reply.body,
        user: {
          fullName: reply.fromUser?.fullName || 'Bilinmeyen Kullanıcı',
          email: reply.fromUser?.email || 'Bilinmeyen Email'
        },
        createdAt: reply.createdAt
      }))
    });

  } catch (error) {
    console.error('Error fetching replies:', error);
    return NextResponse.json({ 
      message: 'Sunucu hatası', 
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
