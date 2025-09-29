import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { marathonId: string } }
) {
  try {
    const { marathonId } = params;

    if (!marathonId) {
      return NextResponse.json(
        { message: 'Marathon ID gereklidir' },
        { status: 400 }
      );
    }

    const marathonIdRecord = await prisma.marathonId.findUnique({
      where: { marathonId },
    });

    const isAvailable = marathonIdRecord && !marathonIdRecord.isUsed;
    
    return NextResponse.json({
      available: isAvailable,
      message: isAvailable ? 'Marathon ID kullanılabilir' : 'Marathon ID kullanılamaz'
    });

  } catch (error) {
    console.error('Check marathon ID error:', error);
    return NextResponse.json(
      { message: 'Sunucu hatası' },
      { status: 500 }
    );
  }
}
