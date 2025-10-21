import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Duyuruları listele
export async function GET(request: NextRequest) {
  try {
    const announcements = await (prisma as any).announcement.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({
      success: true,
      announcements: announcements,
    });
  } catch (error) {
    console.error('Error fetching announcements:', error);
    return NextResponse.json(
      { success: false, error: 'Duyurular getirilemedi' },
      { status: 500 }
    );
  }
}

// POST - Yeni duyuru oluştur
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, summary, content, category, date, time } = body;

    if (!title || !content) {
      return NextResponse.json(
        { success: false, error: 'Gerekli alanlar eksik' },
        { status: 400 }
      );
    }

    const newAnnouncement = await (prisma as any).announcement.create({
      data: {
        title,
        summary: summary || content.substring(0, 100) + '...',
        content,
        category: category || 'GENEL',
        date: date || new Date().toLocaleDateString('tr-TR'),
        time: time || new Date().toLocaleTimeString('tr-TR'),
        pinned: false
      }
    });

    return NextResponse.json({
      success: true,
      announcement: newAnnouncement,
    });
  } catch (error) {
    console.error('Error creating announcement:', error);
    return NextResponse.json(
      { success: false, error: 'Duyuru oluşturulamadı' },
      { status: 500 }
    );
  }
}
