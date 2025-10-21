import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Katılımcıları listele
export async function GET(request: NextRequest) {
  try {
    const participants = await prisma.user.findMany({
      where: {
        role: 'PARTICIPANT'
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({
      success: true,
      participants: participants,
    });
  } catch (error) {
    console.error('Error fetching participants:', error);
    return NextResponse.json(
      { error: 'Katılımcılar getirilemedi' },
      { status: 500 }
    );
  }
}
