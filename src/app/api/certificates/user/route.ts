import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Kullanıcının sertifikalarını getir
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Kullanıcı ID gerekli' },
        { status: 400 }
      );
    }

    // Kullanıcının sertifikalarını getir
    const certificates = await prisma.certificate.findMany({
      where: {
        userId: userId,
        status: 'UPLOADED' // Sadece yüklenmiş sertifikalar
      },
      include: {
        user: {
          select: {
            tasks: {
              where: {
                status: 'APPROVED'
              },
              select: {
                id: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Her sertifika için onaylanan görev sayısını hesapla
    const certificatesWithApprovedTasks = certificates.map(cert => ({
      ...cert,
      approvedTasks: cert.user.tasks.length
    }));

    return NextResponse.json({
      success: true,
      certificates: certificatesWithApprovedTasks
    });

  } catch (error) {
    console.error('Error fetching user certificates:', error);
    return NextResponse.json(
      { success: false, message: 'Sertifikalar getirilemedi' },
      { status: 500 }
    );
  }
}
