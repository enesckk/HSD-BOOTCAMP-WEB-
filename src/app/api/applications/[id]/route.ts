import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ApplicationStatus } from '@prisma/client';

// GET - Tek başvuru getir
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const application = await prisma.application.findUnique({
      where: { id: params.id },
    });

    if (!application) {
      return NextResponse.json(
        { error: 'Başvuru bulunamadı' },
        { status: 404 }
      );
    }

    return NextResponse.json(application);
  } catch (error) {
    console.error('Error fetching application:', error);
    return NextResponse.json(
      { error: 'Başvuru getirilemedi' },
      { status: 500 }
    );
  }
}

// PUT - Başvuru durumunu güncelle (admin için)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { status, notes, reviewedBy } = body;

    if (!Object.values(ApplicationStatus).includes(status)) {
      return NextResponse.json(
        { error: 'Geçersiz durum' },
        { status: 400 }
      );
    }

    const application = await prisma.application.update({
      where: { id: params.id },
      data: {
        status,
        notes,
        reviewedBy,
        reviewedAt: new Date(),
      },
    });

    return NextResponse.json({
      message: 'Başvuru durumu güncellendi',
      application,
    });
  } catch (error) {
    console.error('Error updating application:', error);
    return NextResponse.json(
      { error: 'Başvuru güncellenemedi' },
      { status: 500 }
    );
  }
}

// DELETE - Başvuru sil (admin için)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.application.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      message: 'Başvuru silindi',
    });
  } catch (error) {
    console.error('Error deleting application:', error);
    return NextResponse.json(
      { error: 'Başvuru silinemedi' },
      { status: 500 }
    );
  }
}
