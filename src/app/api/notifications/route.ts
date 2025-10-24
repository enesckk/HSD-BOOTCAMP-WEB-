import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const panel = searchParams.get('panel'); // 'admin' or 'participant'
    const userId = searchParams.get('userId'); // Katılımcı için userId
    
    let whereClause = {};
    
    if (panel === 'admin') {
      // Admin paneli için genel bildirimler
      whereClause = {
        OR: [
          { type: 'APPLICATION' },
          { type: 'MESSAGE' },
          { type: 'ANNOUNCEMENT' },
          { type: 'TEAM' },
          { type: 'ADMIN_TASK' },
          { type: 'ADMIN_PRESENTATION' }
        ]
      };
    } else if (panel === 'instructor') {
      // Eğitmen paneli için bildirimler
      if (userId) {
        whereClause = {
          OR: [
            { type: 'ANNOUNCEMENT' }, // Duyurular
            { type: 'MESSAGE' }, // Mesajlar
            { type: 'TASK' }, // Görevler
            { type: 'LESSON' }, // Dersler
            { 
              AND: [
                { type: { in: ['TASK', 'PRESENTATION'] } },
                { userId: userId } // Kişisel bildirimler
              ]
            }
          ]
        };
      } else {
        whereClause = {
          OR: [
            { type: 'ANNOUNCEMENT' },
            { type: 'MESSAGE' },
            { type: 'TASK' },
            { type: 'LESSON' }
          ]
        };
      }
    } else if (panel === 'participant') {
      // Katılımcı paneli için kişisel bildirimler
      if (userId) {
        whereClause = {
          OR: [
            { type: 'ANNOUNCEMENT' }, // Duyurular herkese
            { 
              AND: [
                { type: { in: ['TASK', 'PRESENTATION'] } },
                { userId: userId } // Kişisel bildirimler
              ]
            }
          ]
        };
      } else {
        // userId yoksa sadece duyurular
        whereClause = {
          type: 'ANNOUNCEMENT'
        };
      }
    } else {
      // Panel belirtilmemişse tüm bildirimleri getir
      whereClause = {};
    }
    
    // Veritabanından bildirimleri çek
    const notifications = await prisma.notification.findMany({
      where: whereClause,
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({ notifications });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { type, title, message, actionUrl, userId } = await request.json();
    
    // Yeni bildirim oluştur
    const notification = await prisma.notification.create({
      data: {
        type,
        title,
        message,
        actionUrl,
        userId,
        read: false
      }
    });
    
    return NextResponse.json(notification, { status: 201 });
  } catch (error) {
    console.error('Error creating notification:', error);
    return NextResponse.json(
      { error: 'Failed to create notification' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { notificationId, read } = await request.json();
    
    // Veritabanında bildirimi güncelle
    await prisma.notification.update({
      where: { id: notificationId },
      data: { read }
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating notification:', error);
    return NextResponse.json(
      { error: 'Failed to update notification' },
      { status: 500 }
    );
  }
}

