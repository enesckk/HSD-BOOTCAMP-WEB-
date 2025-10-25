import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Duyuruları listele
export async function GET(request: NextRequest) {
  try {
    const announcements = await prisma.announcement.findMany({
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

    const newAnnouncement = await prisma.announcement.create({
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

    // Tüm kullanıcılara bildirim gönder (güçlü duplicate kontrolü ile)
    try {
      const allUsers = await prisma.user.findMany({
        select: { id: true }
      });

      // Son 1 saat içinde aynı başlıklı duyuru için bildirim var mı kontrol et
      const recentNotification = await prisma.notification.findFirst({
        where: {
          type: 'ANNOUNCEMENT',
          title: 'Yeni Duyuru',
          message: {
            contains: title
          },
          createdAt: {
            gte: new Date(Date.now() - 60 * 60 * 1000) // 1 saat önce
          }
        }
      });

      // Eğer son 1 saat içinde aynı başlıklı duyuru için bildirim yoksa gönder
      if (!recentNotification) {
        // Önce tüm kullanıcılar için aynı anda bildirim oluştur
        const notifications = allUsers.map(user => ({
          type: 'ANNOUNCEMENT' as const,
          title: 'Yeni Duyuru',
          message: `${title} - ${summary || content.substring(0, 50)}...`,
          actionUrl: '/dashboard/announcements',
          userId: user.id,
          read: false
        }));

        // Bulk insert ile tek seferde tüm bildirimleri oluştur
        await prisma.notification.createMany({
          data: notifications
        });

        console.log(`✅ Bildirim gönderildi: ${allUsers.length} kullanıcıya - ${title}`);
      } else {
        console.log(`⚠️ Duplicate bildirim engellendi - son 1 saat içinde "${title}" başlıklı duyuru için bildirim mevcut`);
      }
    } catch (notificationError) {
      console.error('❌ Bildirim gönderme hatası:', notificationError);
      // Bildirim hatası duyuru oluşturmayı engellemez
    }

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
