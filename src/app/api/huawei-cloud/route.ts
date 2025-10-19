import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/huawei-cloud - Kullanıcının Huawei Cloud hesap bilgilerini getir
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

    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return NextResponse.json(
        { message: 'Kullanıcı bulunamadı' },
        { status: 404 }
      );
    }

    // Mock Huawei Cloud hesap bilgileri
    const accountInfo = {
      status: 'Active',
      credits: 1000,
      region: 'Turkey',
      accountType: 'Free Tier',
      expirationDate: '30 Kasım 2025',
      services: ['CCE', 'OBS', 'AOM', 'SWR'],
      accountId: '1234567890',
      lastLogin: '2 gün önce'
    };

    const services = [
      {
        name: 'Cloud Container Engine (CCE)',
        description: 'Kubernetes tabanlı container orkestrasyonu',
        status: 'Available',
        usage: '0/100 hours',
        consoleUrl: 'https://console.huaweicloud.com/cce'
      },
      {
        name: 'Object Storage Service (OBS)',
        description: 'Bulut tabanlı dosya depolama',
        status: 'Available',
        usage: '0/50 GB',
        consoleUrl: 'https://console.huaweicloud.com/obs'
      },
      {
        name: 'Application Operations Management (AOM)',
        description: 'Uygulama izleme ve yönetimi',
        status: 'Available',
        usage: '0/30 days',
        consoleUrl: 'https://console.huaweicloud.com/aom'
      },
      {
        name: 'Software Repository (SWR)',
        description: 'Container image registry',
        status: 'Available',
        usage: '0/10 images',
        consoleUrl: 'https://console.huaweicloud.com/swr'
      }
    ];

    return NextResponse.json({
      success: true,
      account: accountInfo,
      services
    });

  } catch (error) {
    console.error('Huawei Cloud API error:', error);
    return NextResponse.json(
      { message: 'Sunucu hatası' },
      { status: 500 }
    );
  }
}

// PUT /api/huawei-cloud - Huawei Cloud hesap ayarlarını güncelle
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, settings } = body;

    if (!userId) {
      return NextResponse.json(
        { message: 'Kullanıcı ID gerekli' },
        { status: 400 }
      );
    }

    // Burada gerçek hesap ayarları güncellemesi yapılabilir
    // Şimdilik mock response döndürüyoruz
    
    return NextResponse.json({
      success: true,
      message: 'Huawei Cloud hesap ayarları güncellendi'
    });

  } catch (error) {
    console.error('Huawei Cloud update error:', error);
    return NextResponse.json(
      { message: 'Sunucu hatası' },
      { status: 500 }
    );
  }
}
