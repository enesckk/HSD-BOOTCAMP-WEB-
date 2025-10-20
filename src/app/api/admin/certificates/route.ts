import { NextRequest, NextResponse } from 'next/server';

// GET - Tüm sertifikaları getir
export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      success: true,
      certificates: [],
    });
  } catch (error) {
    console.error('Error fetching certificates:', error);
    return NextResponse.json(
      { success: false, error: 'Sertifikalar getirilemedi' },
      { status: 500 }
    );
  }
}

// POST - Yeni sertifika oluştur
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId,
      programName,
      completionDate,
      score,
      notes,
    } = body;

    // Gerekli alanları kontrol et
    if (!userId || !programName || !completionDate) {
      return NextResponse.json(
        { success: false, error: 'Gerekli alanlar eksik' },
        { status: 400 }
      );
    }

    // Kullanıcının var olup olmadığını kontrol et
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Kullanıcı bulunamadı' },
        { status: 404 }
      );
    }

    // Sertifikayı oluştur
    const certificate = await prisma.certificate.create({
      data: {
        userId,
        programName,
        completionDate: new Date(completionDate),
        status: 'PENDING',
        score: score || null,
        notes: notes || null,
      },
      include: {
        user: {
          select: {
            id: true,
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
        completionDate: certificate.completionDate,
        status: certificate.status,
        score: certificate.score,
        notes: certificate.notes,
        issuedAt: certificate.issuedAt,
        downloadUrl: certificate.downloadUrl,
      },
    });
  } catch (error) {
    console.error('Error creating certificate:', error);
    return NextResponse.json(
      { success: false, error: 'Sertifika oluşturulamadı' },
      { status: 500 }
    );
  }
}
