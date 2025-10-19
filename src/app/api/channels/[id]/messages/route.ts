import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Belirli kanalın mesajlarını getir
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const messages = await prisma.channelMessage.findMany({
      where: { channelId: params.id },
      include: {
        user: {
          select: { 
            id: true, 
            fullName: true, 
            role: true 
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset
    });

    return NextResponse.json({ messages });
  } catch (error) {
    console.error('Error fetching channel messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

// POST - Kanal mesajı gönder
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { content, messageType, userId } = await request.json();

    // Kullanıcı doğrulama (basit)
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const message = await prisma.channelMessage.create({
      data: {
        channelId: params.id,
        userId,
        content,
        messageType: messageType || 'text'
      },
      include: {
        user: {
          select: { 
            id: true, 
            fullName: true, 
            role: true 
          }
        }
      }
    });

    return NextResponse.json({ message }, { status: 201 });
  } catch (error) {
    console.error('Error creating channel message:', error);
    return NextResponse.json(
      { error: 'Failed to create message' },
      { status: 500 }
    );
  }
}
