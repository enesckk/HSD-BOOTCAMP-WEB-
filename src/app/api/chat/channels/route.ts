import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    
    const channels = await prisma.channel.findMany({
      where: {
        isActive: true
      },
      orderBy: [
        { category: 'asc' },
        { name: 'asc' }
      ],
      include: {
        messages: {
          take: 1,
          orderBy: { createdAt: 'desc' },
          include: {
            user: {
              select: {
                fullName: true
              }
            }
          }
        },
        _count: {
          select: {
            messages: true
          }
        }
      }
    });

    // Kullanıcının son görüntüleme zamanını al (basit çözüm)
    let userLastSeen = new Date(0); // Varsayılan olarak çok eski bir tarih
    if (userId) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { updatedAt: true }
      });
      if (user) {
        userLastSeen = user.updatedAt;
      }
    }

    const formattedChannels = await Promise.all(channels.map(async (channel) => {
      // Son 24 saat içindeki mesaj sayısını hesapla
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      const recentMessageCount = await prisma.channelMessage.count({
        where: {
          channelId: channel.id,
          createdAt: {
            gte: yesterday
          }
        }
      });

      return {
        id: channel.id,
        name: channel.name,
        displayName: channel.displayName,
        description: channel.description,
        category: channel.category,
        isPrivate: channel.isPrivate,
        messageCount: recentMessageCount, // Son 24 saatteki mesaj sayısı
        lastMessage: channel.messages[0] ? {
          content: channel.messages[0].content,
          user: channel.messages[0].user.fullName,
          time: channel.messages[0].createdAt
        } : null
      };
    }));

    return NextResponse.json({
      success: true,
      channels: formattedChannels
    });

  } catch (error) {
    console.error('Error fetching channels:', error);
    return NextResponse.json(
      { success: false, error: 'Kanallar getirilemedi' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, displayName, description, category, isPrivate } = body;

    const channel = await prisma.channel.create({
      data: {
        name,
        displayName,
        description,
        category,
        isPrivate: isPrivate || false,
        type: 'chat',
        isActive: true
      }
    });

    return NextResponse.json({
      success: true,
      channel
    });

  } catch (error) {
    console.error('Error creating channel:', error);
    return NextResponse.json(
      { success: false, error: 'Kanal oluşturulamadı' },
      { status: 500 }
    );
  }
}
