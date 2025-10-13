import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { decrypt } from '@/utils/crypto';
import { ApplicationStatus } from '@prisma/client';

// GET - Tüm başvuruları getir (admin için)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const where = status ? { status: status as ApplicationStatus } : {};

    const [applications, total] = await Promise.all([
      prisma.application.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.application.count({ where }),
    ]);

    // initialPasswordEnc alanını admin arayüzü için çözüp initialPassword olarak dön
    const appsWithPassword = applications.map((a: any) => ({
      ...a,
      initialPassword: a.initialPasswordEnc ? decrypt(a.initialPasswordEnc) : undefined,
    }));

    return NextResponse.json({
      applications: appsWithPassword,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json(
      { error: 'Başvurular getirilemedi' },
      { status: 500 }
    );
  }
}

// POST - Yeni başvuru oluştur
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      fullName,
      email,
      phone,
      university,
      department,
      teamRole,
      projectIdea,
      youtubeVideo,
      logicQuestion1,
      logicQuestion2,
    } = body;

    // Validasyon
    if (!fullName || !email || !phone || !university || !department || !projectIdea || !youtubeVideo || !logicQuestion1 || !logicQuestion2 || !teamRole) {
      return NextResponse.json(
        { error: 'Tüm alanlar doldurulmalıdır' },
        { status: 400 }
      );
    }

    // Email validasyonu
    if (!/\S+@\S+\.\S+/.test(email)) {
      return NextResponse.json(
        { error: 'Geçerli bir e-posta adresi giriniz' },
        { status: 400 }
      );
    }

    // YouTube link validasyonu
    if (!youtubeVideo.includes('youtube.com') && !youtubeVideo.includes('youtu.be')) {
      return NextResponse.json(
        { error: 'Geçerli bir YouTube linki giriniz' },
        { status: 400 }
      );
    }

    // Aynı email ile daha önce başvuru yapılmış mı kontrol et
    const existingApplication = await prisma.application.findFirst({
      where: { email }
    });

    if (existingApplication) {
      return NextResponse.json(
        { error: 'Bu e-posta adresi ile zaten başvuru yapılmış' },
        { status: 400 }
      );
    }

    const application = await prisma.application.create({
      data: {
        fullName,
        email,
        phone,
        university,
        department,
        projectIdea,
        teamRole,
        youtubeVideo,
        logicQuestion1,
        logicQuestion2,
        status: ApplicationStatus.PENDING,
      },
    });

    // Admin için bildirim oluştur
    try {
      await prisma.notification.create({
        data: {
          type: 'APPLICATION',
          title: 'Yeni Başvuru',
          message: `${fullName} tarafından yeni başvuru yapıldı`,
          actionUrl: '/admin/applications',
          read: false
        }
      });
    } catch (notificationError) {
      console.error('Error creating admin notification:', notificationError);
    }

    return NextResponse.json(
      { 
        message: 'Başvurunuz başarıyla gönderildi',
        application 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating application:', error);
    return NextResponse.json(
      { error: 'Başvuru oluşturulamadı' },
      { status: 500 }
    );
  }
}


