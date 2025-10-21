import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// PUT - Sertifika durumunu güncelle
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { status } = body;

    if (!status || !['PENDING', 'APPROVED', 'REJECTED'].includes(status)) {
      return NextResponse.json(
        { error: 'Geçersiz durum değeri' },
        { status: 400 }
      );
    }

    const certificate = await (prisma as any).certificate.update({
      where: { id },
      data: { 
        status,
        ...(status === 'APPROVED' && { issuedAt: new Date() }),
      },
    });

    return NextResponse.json({
      success: true,
      certificate,
    });
  } catch (error) {
    console.error('Error updating certificate:', error);
    return NextResponse.json(
      { error: 'Sertifika güncellenemedi' },
      { status: 500 }
    );
  }
}

// DELETE - Sertifikayı sil
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    await (prisma as any).certificate.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Sertifika silindi',
    });
  } catch (error) {
    console.error('Error deleting certificate:', error);
    return NextResponse.json(
      { error: 'Sertifika silinemedi' },
      { status: 500 }
    );
  }
}