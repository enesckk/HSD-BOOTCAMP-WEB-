import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ApplicationStatus, TaskStatus } from '@prisma/client';

// GET - Admin dashboard istatistikleri
export async function GET(request: NextRequest) {
  try {
    // Paralel olarak tüm sayıları getir
    const [
      totalUsers,
      totalTeams,
      totalTasks,
      completedTasks,
      pendingTasks,
      totalPresentations,
      totalAnnouncements,
      totalMessages,
      unreadMessages,
      totalApplications,
      pendingApplications,
      approvedApplications,
      rejectedApplications,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.team.count(),
      prisma.task.count(),
      prisma.task.count({ where: { status: TaskStatus.COMPLETED } }),
      prisma.task.count({ where: { status: TaskStatus.PENDING } }),
      prisma.presentation.count(),
      prisma.announcement.count(),
      prisma.message.count(),
      prisma.message.count({ where: { unread: true } }),
      prisma.application.count(),
      prisma.application.count({ where: { status: ApplicationStatus.PENDING } }),
      prisma.application.count({ where: { status: ApplicationStatus.APPROVED } }),
      prisma.application.count({ where: { status: ApplicationStatus.REJECTED } }),
    ]);

    // Son aktiviteleri getir (son 10 başvuru)
    const recentApplications = await prisma.application.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        fullName: true,
        status: true,
        createdAt: true,
      },
    });

    // Son mesajları getir
    const recentMessages = await prisma.message.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        subject: true,
        unread: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      stats: {
        totalUsers,
        totalTeams,
        totalTasks,
        completedTasks,
        pendingTasks,
        totalPresentations,
        totalAnnouncements,
        totalMessages,
        unreadMessages,
        totalApplications,
        pendingApplications,
        approvedApplications,
        rejectedApplications,
      },
      recentActivities: {
        applications: recentApplications,
        messages: recentMessages,
      },
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { error: 'İstatistikler getirilemedi' },
      { status: 500 }
    );
  }
}


