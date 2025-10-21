import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

// JWT token'dan user bilgilerini çıkar
async function getUserFromToken(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('No authorization header or invalid format');
      return null;
    }
    
    const token = authHeader.substring(7);
    if (!token || token === 'null' || token === 'undefined') {
      console.log('Invalid token:', token);
      return null;
    }
    
    const JWT_SECRET = 'your-super-secret-jwt-key-for-afet-maratonu-2024';
    
    // Token'ı decode etmeyi dene
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as any;
    } catch (jwtError) {
      console.error('JWT verification failed:', jwtError);
      return null;
    }
    
    if (!decoded || !decoded.userId) {
      console.log('Invalid decoded token:', decoded);
      return null;
    }
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });
    
    if (!user) {
      console.log('User not found for ID:', decoded.userId);
      return null;
    }
    
    return user;
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}

// Katılımcı paneli için mesaj gönderme
export async function POST(req: NextRequest) {
  try {
    console.log('POST /api/messages/participant - Starting participant message creation');
    
    // Kullanıcı authentication kontrolü
    const user = await getUserFromToken(req);
    if (!user) {
      console.log('Authentication failed for participant message');
      return NextResponse.json({ error: 'Authentication failed' }, { status: 401 });
    }
    
    console.log('Participant user authenticated:', user.id, user.fullName);

    const { to, subject, body } = await req.json();
    console.log('Participant message data received:', { to, subject, body });
    
    // Admin kullanıcısını bul (alıcı)
    const adminUser = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    });
    
    if (!adminUser) {
      console.log('No admin user found');
      return NextResponse.json({ error: 'Admin user not found' }, { status: 404 });
    }
    
    // Katılımcıdan admin'e mesaj oluştur
    const message = await prisma.message.create({
      data: {
        fromUserId: user.id, // Katılımcı gönderen
        toUserId: adminUser.id, // Admin alıcı
        toRole: 'admin',
        subject,
        body
      },
      include: {
        fromUser: {
          select: {
            id: true,
            fullName: true,
            email: true,
          }
        },
        toUser: {
          select: {
            id: true,
            fullName: true,
            email: true,
          }
        }
      }
    });
    
    console.log('Participant message created successfully:', message.id);
    return NextResponse.json({ item: message });
  } catch (error) {
    console.error('Error creating participant message:', error);
    return NextResponse.json(
      { error: 'Failed to create message: ' + error.message },
      { status: 500 }
    );
  }
}

// Katılımcı paneli için mesajları getir
export async function GET(req: NextRequest) {
  try {
    console.log('GET /api/messages/participant - Starting participant message fetch');
    
    // Kullanıcı authentication kontrolü
    const user = await getUserFromToken(req);
    if (!user) {
      console.log('Authentication failed for participant message fetch');
      return NextResponse.json({ error: 'Authentication failed' }, { status: 401 });
    }
    
    console.log('Participant user authenticated for fetch:', user.id, user.fullName);

    const box = req.nextUrl.searchParams.get('box') || 'inbox';
    console.log('Fetching messages for box:', box);
    
    if (box === 'sent') {
      // Bu kullanıcının gönderdiği mesajlar
      const sent = await prisma.message.findMany({
        where: {
          fromUserId: user.id // Bu kullanıcının gönderdiği mesajlar
        },
        include: {
          fromUser: {
            select: {
              id: true,
              fullName: true,
              email: true,
            }
          },
          toUser: {
            select: {
              id: true,
              fullName: true,
              email: true,
            }
          },
        },
        orderBy: { createdAt: 'desc' }
      });
      console.log('Found sent messages for participant:', sent.length);
      return NextResponse.json({ items: sent });
    } else {
      // Bu kullanıcıya gelen mesajlar
      const inbox = await prisma.message.findMany({
        where: {
          OR: [
            { toUserId: user.id }, // Bu kullanıcıya özel mesajlar
            { 
              toRole: 'participant',
              toUserId: null
            } // Tüm katılımcılara gönderilen genel mesajlar
          ]
        },
        include: {
          fromUser: {
            select: {
              id: true,
              fullName: true,
              email: true,
            }
          },
          toUser: {
            select: {
              id: true,
              fullName: true,
              email: true,
            }
          },
        },
        orderBy: { createdAt: 'desc' }
      });
      console.log('Found inbox messages for participant:', inbox.length);
      return NextResponse.json({ items: inbox });
    }
  } catch (error) {
    console.error('Error fetching participant messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

// Katılımcı paneli için mesaj güncelleme
export async function PUT(req: NextRequest) {
  try {
    // Kullanıcı authentication kontrolü
    const user = await getUserFromToken(req);
    if (!user) {
      console.log('Authentication failed for PUT request');
      return NextResponse.json({ ok: true });
    }

    const { ids, action } = await req.json();
    
    if (action === 'markRead') {
      await prisma.message.updateMany({
        where: { 
          id: { in: ids },
          OR: [
            { toUserId: user.id }, // Bu kullanıcıya gelen mesajlar
            { 
              toRole: 'participant',
              toUserId: null,
              toTeamId: null
            } // Tüm katılımcılara gönderilen genel mesajlar
          ]
        },
        data: { unread: false }
      });
    } else if (action === 'markUnread') {
      await prisma.message.updateMany({
        where: { 
          id: { in: ids },
          OR: [
            { toUserId: user.id }, // Bu kullanıcıya gelen mesajlar
            { 
              toRole: 'participant',
              toUserId: null,
              toTeamId: null
            } // Tüm katılımcılara gönderilen genel mesajlar
          ]
        },
        data: { unread: true }
      });
    } else if (action === 'deleteSent') {
      await prisma.message.deleteMany({
        where: { 
          id: { in: ids },
          fromUserId: user.id // Sadece bu kullanıcının gönderdiği mesajları sil
        }
      });
    }
    
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Error updating participant messages:', error);
    return NextResponse.json(
      { error: 'Failed to update messages' },
      { status: 500 }
    );
  }
}
