import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const announcements = await prisma.announcement.findMany({
      orderBy: [
        { pinned: 'desc' },
        { createdAt: 'desc' }
      ]
    });
    
    return NextResponse.json({ items: announcements });
  } catch (error) {
    console.error('Error fetching announcements:', error);
    return NextResponse.json(
      { error: 'Failed to fetch announcements' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, summary, content, category, date, time, pinned } = body;

    // Boş değerleri kontrol et ve varsayılan değerler ata
    const announcementData: any = {
      title: title || 'Duyuru',
      summary: summary || '',
      content: content || '',
      category: category || 'genel',
      pinned: pinned || false
    };

    // Date alanı için kontrol
    if (date && date.trim() !== '') {
      announcementData.date = date;
    } else {
      announcementData.date = new Date().toISOString().split('T')[0]; // Bugünün tarihi
    }

    // Time alanı için kontrol
    if (time && time.trim() !== '') {
      announcementData.time = time;
    } else {
      announcementData.time = new Date().toTimeString().split(' ')[0]; // Şu anki saat
    }

    const announcement = await prisma.announcement.create({
      data: announcementData
    });

    // Tüm kullanıcılara bildirim gönder
    try {
      const allUsers = await prisma.user.findMany({
        select: { id: true }
      });

      // Her kullanıcıya bildirim oluştur
      const notificationPromises = allUsers.map(user => 
        prisma.notification.create({
          data: {
            type: 'ANNOUNCEMENT',
            title: 'Yeni Duyuru',
            message: `${title} - ${summary || content.substring(0, 50)}...`,
            actionUrl: '/dashboard/announcements',
            userId: user.id,
            read: false
          }
        })
      );

      await Promise.all(notificationPromises);
      console.log(`Bildirim gönderildi: ${allUsers.length} kullanıcıya`);
    } catch (notificationError) {
      console.error('Bildirim gönderme hatası:', notificationError);
      // Bildirim hatası duyuru oluşturmayı engellemez
    }

    return NextResponse.json(announcement, { status: 201 });
  } catch (error) {
    console.error('Error creating announcement:', error);
    return NextResponse.json(
      { error: 'Failed to create announcement' },
      { status: 500 }
    );
  }
}


