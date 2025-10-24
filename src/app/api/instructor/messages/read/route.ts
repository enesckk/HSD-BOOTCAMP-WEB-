import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';

const JWT_SECRET = 'your-super-secret-jwt-key-for-afet-maratonu-2024';

export async function POST(request: NextRequest) {
  try {
    console.log('=== MARK MESSAGE AS READ START ===');
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
    const { messageId } = requestBody;

    if (!messageId) {
      return NextResponse.json({ message: 'Mesaj ID gerekli' }, { status: 400 });
    }

    // Mesajı okundu olarak işaretle
    console.log('Marking message as read...');
    const updatedMessage = await prisma.message.update({
      where: { id: messageId },
      data: {
        unread: false
      }
    });

    console.log('Message marked as read:', updatedMessage.id);
    
    return NextResponse.json({
      success: true,
      message: 'Mesaj okundu olarak işaretlendi'
    });

  } catch (error) {
    console.error('Error marking message as read:', error);
    console.error('Error details:', error);
    return NextResponse.json({ 
      message: 'Sunucu hatası', 
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error instanceof Error ? error.stack : 'No details'
    }, { status: 500 });
  }
}
