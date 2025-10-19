import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/certificates - Kullanıcının sertifika durumunu getir
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { message: 'Kullanıcı ID gerekli' },
        { status: 400 }
      );
    }

    // Kullanıcının sertifika durumunu hesapla
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        tasks: true,
        notifications: true
      }
    });

    if (!user) {
      return NextResponse.json(
        { message: 'Kullanıcı bulunamadı' },
        { status: 404 }
      );
    }

    // İlerleme hesaplamaları
    const totalTasks = user.tasks.length;
    const completedTasks = user.tasks.filter(task => task.status === 'COMPLETED').length;
    const programCompletion = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    // Sertifika durumu
    const isEligible = programCompletion >= 80;
    const certificateStatus = isEligible ? 'Eligible' : 'In Progress';

    const certificateData = {
      status: certificateStatus,
      programCompletion,
      projectSubmission: 0, // Şimdilik 0
      examScore: 0, // Şimdilik 0
      overallProgress: programCompletion,
      requirements: [
        'Programı %80 oranında tamamlama',
        'Final projesini başarıyla teslim etme',
        'Sertifikasyon sınavında %70 başarı',
        'Tüm haftalık görevleri tamamlama'
      ],
      examInfo: {
        date: '24 Kasım 2025',
        time: '20:00',
        duration: '90 dakika',
        questions: 50,
        passingScore: 70,
        format: 'Online, Çoktan seçmeli'
      }
    };

    return NextResponse.json({
      success: true,
      certificate: certificateData
    });

  } catch (error) {
    console.error('Certificate API error:', error);
    return NextResponse.json(
      { message: 'Sunucu hatası' },
      { status: 500 }
    );
  }
}

// PUT /api/certificates - Sertifika durumunu güncelle
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, examScore, projectSubmitted } = body;

    if (!userId) {
      return NextResponse.json(
        { message: 'Kullanıcı ID gerekli' },
        { status: 400 }
      );
    }

    // Burada gerçek veritabanı güncellemesi yapılabilir
    // Şimdilik mock response döndürüyoruz
    
    return NextResponse.json({
      success: true,
      message: 'Sertifika durumu güncellendi'
    });

  } catch (error) {
    console.error('Certificate update error:', error);
    return NextResponse.json(
      { message: 'Sunucu hatası' },
      { status: 500 }
    );
  }
}
