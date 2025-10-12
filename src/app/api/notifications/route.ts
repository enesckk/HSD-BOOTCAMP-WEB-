import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const panel = searchParams.get('panel'); // 'admin' or 'participant'
    
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
    } else if (panel === 'participant') {
      // Katılımcı paneli için kişisel bildirimler
      whereClause = {
        OR: [
          { type: 'TASK' },
          { type: 'PRESENTATION' },
          { type: 'ANNOUNCEMENT' }
        ]
      };
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

