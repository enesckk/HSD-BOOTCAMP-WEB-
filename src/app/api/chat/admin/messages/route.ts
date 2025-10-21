import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const channelId = searchParams.get('channelId');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const whereClause: any = {
      isDeleted: false
    };

    if (channelId) {
      whereClause.channelId = channelId;
    }

    const messages = await prisma.channelMessage.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            role: true,
            email: true
          }
        },
        channel: {
          select: {
            id: true,
            name: true,
            displayName: true
          }
        },
        replies: {
          where: {
            isDeleted: false
          },
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                role: true
              }
            }
          },
          orderBy: {
            createdAt: 'asc'
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit,
      skip: offset
    });

    return NextResponse.json({
      success: true,
      messages
    });

  } catch (error) {
    console.error('Error fetching admin messages:', error);
    return NextResponse.json(
      { success: false, error: 'Mesajlar getirilemedi' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, channelId, messageType, tags, isAnnouncement } = body;

    // Kullanıcı bilgisini header'dan al
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Kullanıcı bilgisi bulunamadı' },
        { status: 401 }
      );
    }

    const message = await prisma.channelMessage.create({
      data: {
        content,
        messageType: messageType || 'text',
        tags: tags || null,
        channelId,
        userId,
        isPinned: isAnnouncement || false
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

    return NextResponse.json({
      success: true,
      message
    });

  } catch (error) {
    console.error('Error creating admin message:', error);
    return NextResponse.json(
      { success: false, error: 'Mesaj oluşturulamadı' },
      { status: 500 }
    );
  }
}
