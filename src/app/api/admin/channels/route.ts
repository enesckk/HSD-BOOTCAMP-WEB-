import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Tüm kanalları getir
export async function GET(request: NextRequest) {
  try {
    const channels = await prisma.channel.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: {
            messages: true
          }
        }
      }
    });

    return NextResponse.json({ channels });
  } catch (error) {
    console.error('Error fetching channels:', error);
    return NextResponse.json(
      { error: 'Kanallar getirilemedi' },
      { status: 500 }
    );
  }
}

// POST - Yeni kanal oluştur
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      displayName,
      description,
      category,
      type,
      isPrivate
    } = body;

    if (!name || !displayName) {
      return NextResponse.json(
        { error: 'Kanal adı ve görünen ad gereklidir' },
        { status: 400 }
      );
    }

    // Kanal adının benzersiz olup olmadığını kontrol et
    const existingChannel = await prisma.channel.findUnique({
      where: { name }
    });

    if (existingChannel) {
      return NextResponse.json(
        { error: 'Bu kanal adı zaten kullanılıyor' },
        { status: 400 }
      );
    }

    const channel = await prisma.channel.create({
      data: {
        name,
        displayName,
        description: description || '',
        category: category || 'GENEL',
        type: type || 'public',
        isPrivate: isPrivate || false
      }
    });

    return NextResponse.json({ channel });
  } catch (error) {
    console.error('Error creating channel:', error);
    return NextResponse.json(
      { error: 'Kanal oluşturulamadı' },
      { status: 500 }
    );
  }
}