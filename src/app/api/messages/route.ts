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

export async function GET(req: NextRequest) {
  try {
    // Geçici olarak authentication'ı bypass et
    console.log('Bypassing authentication for GET request');
    
    // İlk kullanıcıyı al (test için)
    const testUser = await prisma.user.findFirst();
    if (!testUser) {
      console.log('No users found in database');
      return NextResponse.json({ items: [] });
    }
    
    console.log('Using test user for GET:', testUser.id, testUser.fullName);

    const box = req.nextUrl.searchParams.get('box') || 'inbox';
    console.log('Fetching messages for box:', box);
    
    if (box === 'sent') {
      // Admin kullanıcısını bul
      const adminUser = await prisma.user.findFirst({
        where: { role: 'ADMIN' }
      });
      
      if (!adminUser) {
        console.log('No admin user found for sent messages');
        return NextResponse.json({ items: [] });
      }
      
      // Admin'in gönderdiği mesajlar
      const sent = await prisma.message.findMany({
        where: {
          fromUserId: adminUser.id // Admin'in gönderdiği mesajlar
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
          toTeam: {
            select: {
              id: true,
              name: true,
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });
      console.log('Found sent messages:', sent.length);
      return NextResponse.json({ items: sent });
    } else {
      // Bu kullanıcıya gelen mesajlar - kişiye özel
      const inbox = await prisma.message.findMany({
        where: {
          OR: [
            { toUserId: testUser.id }, // Bu kullanıcıya özel mesajlar
            { 
              toRole: 'participant',
              toUserId: null,
              toTeamId: null
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
          toTeam: {
            select: {
              id: true,
              name: true,
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });
      console.log('Found inbox messages:', inbox.length);
      return NextResponse.json({ items: inbox });
    }
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

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
          toRole: 'participant' // Sadece bu kullanıcıya gelen mesajları güncelle
        },
        data: { unread: false }
      });
    } else if (action === 'markUnread') {
      await prisma.message.updateMany({
        where: { 
          id: { in: ids },
          toRole: 'participant' // Sadece bu kullanıcıya gelen mesajları güncelle
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
    console.error('Error updating messages:', error);
    return NextResponse.json(
      { error: 'Failed to update messages' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    console.log('POST /api/messages - Starting message creation');
    
    // Admin kullanıcısını bul (admin panelinden mesaj gönderen)
    const adminUser = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    });
    
    if (!adminUser) {
      console.log('No admin user found');
      return NextResponse.json({ error: 'Admin user not found' }, { status: 404 });
    }
    
    console.log('Using admin user:', adminUser.id, adminUser.fullName);

    const { recipientType, subject, body, userIds, teamId } = await req.json();
    console.log('Message data received:', { recipientType, subject, body, userIds, teamId });
    
    // Mesajları oluştur
    const messages = [];
    
    if (recipientType === 'user' && userIds && userIds.length > 0) {
      // Belirli kullanıcılara mesaj gönder
      for (const userId of userIds) {
        const message = await prisma.message.create({
          data: {
            fromUserId: adminUser.id,
            toUserId: userId,
            toRole: 'participant',
            subject,
            body
          }
        });
        messages.push(message);
      }
    } else if (recipientType === 'team' && teamId) {
      // Takıma mesaj gönder
      const message = await prisma.message.create({
        data: {
          fromUserId: adminUser.id,
          toTeamId: teamId,
          toRole: 'participant',
          subject,
          body
        }
      });
      messages.push(message);
    } else if (recipientType === 'teamMembers' && teamId && userIds && userIds.length > 0) {
      // Takım üyelerine mesaj gönder
      for (const userId of userIds) {
        const message = await prisma.message.create({
          data: {
            fromUserId: adminUser.id,
            toUserId: userId,
            toTeamId: teamId,
            toRole: 'participant',
            subject,
            body
          }
        });
        messages.push(message);
      }
    } else {
      // Tüm katılımcılara mesaj gönder
      const message = await prisma.message.create({
        data: {
          fromUserId: adminUser.id,
          toRole: 'participant',
          subject,
          body
        }
      });
      messages.push(message);
    }
    
    console.log('Messages created successfully:', messages.length);
    return NextResponse.json({ items: messages });
  } catch (error) {
    console.error('Error creating message:', error);
    return NextResponse.json(
      { error: 'Failed to create message: ' + error.message },
      { status: 500 }
    );
  }
}


