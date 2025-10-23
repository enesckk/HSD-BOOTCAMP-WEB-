import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Katılımcılar için dersleri listele (sadece yayınlanan)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const week = searchParams.get('week');
    const search = searchParams.get('search');

    const whereClause: any = {
      // Tüm dersleri göster (yayınlanmamış olanları da)
    };

    if (category && category !== 'all') {
      whereClause.category = category;
    }

    if (week && week !== 'all') {
      whereClause.week = parseInt(week);
    }

    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { instructor: { contains: search, mode: 'insensitive' } }
      ];
    }

    const lessons = await (prisma as any).lesson.findMany({
      where: whereClause,
      orderBy: [
        { week: 'asc' },
        { order: 'asc' },
        { createdAt: 'desc' }
      ]
    });

    return NextResponse.json({
      success: true,
      lessons: lessons,
    });
  } catch (error) {
    console.error('Error fetching lessons for participants:', error);
    return NextResponse.json(
      { success: false, error: 'Dersler getirilemedi' },
      { status: 500 }
    );
  }
}
