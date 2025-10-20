import { NextRequest, NextResponse } from 'next/server';

// GET - Admin dashboard istatistikleri
export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      stats: {
        totalUsers: 0,
        totalAnnouncements: 0,
        totalMessages: 0,
        totalNotifications: 0,
      },
      recentActivities: {
        channelMessages: [],
        announcements: [],
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


