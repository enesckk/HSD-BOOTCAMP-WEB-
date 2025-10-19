import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Tüm kanalları getir
export async function GET(request: NextRequest) {
  try {
    const channels = await prisma.channel.findMany({
      where: { isActive: true },
      include: {
        messages: {
          take: 1,
          orderBy: { createdAt: 'desc' },
          include: {
            user: {
              select: { fullName: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'asc' }
    });

    return NextResponse.json({ channels });
  } catch (error) {
    console.error('Error fetching channels:', error);
    return NextResponse.json(
      { error: 'Failed to fetch channels' },
      { status: 500 }
    );
  }
}

// POST - Yeni kanal oluştur (Admin only)
export async function POST(request: NextRequest) {
  try {
    const { name, displayName, description, type } = await request.json();

    const channel = await prisma.channel.create({
      data: {
        name,
        displayName,
        description,
        type: type || 'chat'
      }
    });

    return NextResponse.json({ channel }, { status: 201 });
  } catch (error) {
    console.error('Error creating channel:', error);
    return NextResponse.json(
      { error: 'Failed to create channel' },
      { status: 500 }
    );
  }
}
