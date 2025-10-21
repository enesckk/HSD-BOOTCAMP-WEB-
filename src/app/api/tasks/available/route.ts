import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Admin tarafından oluşturulan tüm görevleri getir
    const availableTasks = await prisma.task.findMany({
      where: {
        // Admin tarafından oluşturulan görevler (userId null veya admin kullanıcılar)
        user: {
          role: 'ADMIN'
        }
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            role: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(availableTasks);
  } catch (error) {
    console.error('Error fetching available tasks:', error);
    return NextResponse.json(
      { error: 'Mevcut görevler getirilemedi' },
      { status: 500 }
    );
  }
}
