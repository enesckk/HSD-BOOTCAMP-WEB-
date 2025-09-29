import { NextRequest, NextResponse } from 'next/server';
import { MarathonId } from '@/types/user';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const availableMarathonIds = await prisma.marathonId.findMany({
      where: { isUsed: false },
      select: {
        id: true,
        marathonId: true,
        isUsed: true,
      },
    });

    const formattedIds: MarathonId[] = availableMarathonIds.map(item => ({
      id: item.marathonId,
      isUsed: item.isUsed,
    }));

    return NextResponse.json(formattedIds);

  } catch (error) {
    console.error('Get available marathon IDs error:', error);
    return NextResponse.json(
      { message: 'Sunucu hatası' },
      { status: 500 }
    );
  }
}
