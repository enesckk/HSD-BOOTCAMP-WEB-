import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Admin dashboard istatistikleri
export async function GET(request: NextRequest) {
  try {
    const totalUsers = await prisma.user.count({
      where: {
        role: 'PARTICIPANT'
      }
    });
    const totalAnnouncements = await prisma.announcement.count();
    const totalMessages = await prisma.channelMessage.count();
    const totalNotifications = await prisma.notification.count();
    const totalLessons = await prisma.lesson.count();

    const recentChannelMessages = await prisma.channelMessage.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            fullName: true,
            role: true
          }
        },
        channel: {
          select: {
            displayName: true
          }
        }
      }
    });

    const recentAnnouncements = await prisma.notification.findMany({
      take: 5,
      where: { type: 'ANNOUNCEMENT' },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({
      stats: {
        totalUsers,
        totalAnnouncements,
        totalMessages,
        totalNotifications,
        totalLessons
      },
      recentActivities: {
        channelMessages: recentChannelMessages,
        announcements: recentAnnouncements
      }
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { error: 'İstatistikler getirilemedi' },
      { status: 500 }
    );
  }
}