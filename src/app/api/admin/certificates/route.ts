import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Sertifikaları listele
export async function GET(request: NextRequest) {
  try {
    const certificates = await (prisma as any).certificate.findMany({
      include: {
        user: {
          select: {
            fullName: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    const formattedCertificates = certificates.map((cert: any) => ({
      id: cert.id,
      userId: cert.userId,
      userName: cert.user.fullName,
      userEmail: cert.user.email,
      programName: cert.programName,
      completionDate: cert.completionDate.toISOString(),
      status: cert.status,
      score: cert.score,
      notes: cert.notes,
      issuedAt: cert.issuedAt?.toISOString(),
      downloadUrl: cert.downloadUrl,
    }));

    return NextResponse.json({
      success: true,
      certificates: formattedCertificates,
    });
  } catch (error) {
    console.error('Error fetching certificates:', error);
    return NextResponse.json(
      { error: 'Sertifikalar getirilemedi' },
      { status: 500 }
    );
  }
}

// POST - Yeni sertifika oluştur
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, programName, completionDate, score, notes } = body;

    if (!userId || !programName || !completionDate) {
      return NextResponse.json(
        { error: 'Gerekli alanlar eksik' },
        { status: 400 }
      );
    }

    const certificate = await (prisma as any).certificate.create({
      data: {
        userId,
        programName,
        completionDate: new Date(completionDate),
        score: score ? parseInt(score) : null,
        notes: notes || null,
        status: 'PENDING',
      },
      include: {
        user: {
          select: {
            fullName: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      certificate: {
        id: certificate.id,
        userId: certificate.userId,
        userName: certificate.user.fullName,
        userEmail: certificate.user.email,
        programName: certificate.programName,
        completionDate: certificate.completionDate.toISOString(),
        status: certificate.status,
        score: certificate.score,
        notes: certificate.notes,
        issuedAt: certificate.issuedAt?.toISOString(),
        downloadUrl: certificate.downloadUrl,
      },
    });
  } catch (error) {
    console.error('Error creating certificate:', error);
    return NextResponse.json(
      { error: 'Sertifika oluşturulamadı' },
      { status: 500 }
    );
  }
}