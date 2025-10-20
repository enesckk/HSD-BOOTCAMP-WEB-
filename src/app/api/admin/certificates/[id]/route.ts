import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Tek sertifika getir
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const certificate = await prisma.certificate.findUnique({
      where: { id: params.id },
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

    if (!certificate) {
      return NextResponse.json(
        { success: false, error: 'Sertifika bulunamadı' },
        { status: 404 }
      );
    }

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
    console.error('Error fetching certificate:', error);
    return NextResponse.json(
      { success: false, error: 'Sertifika getirilemedi' },
      { status: 500 }
    );
  }
}

// PUT - Sertifika güncelle
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { status, score, notes, downloadUrl } = body;

    const updateData: any = {};
    
    if (status) updateData.status = status;
    if (score !== undefined) updateData.score = score;
    if (notes !== undefined) updateData.notes = notes;
    if (downloadUrl !== undefined) updateData.downloadUrl = downloadUrl;
    
    // Eğer onaylandıysa, issuedAt tarihini güncelle
    if (status === 'APPROVED') {
      updateData.issuedAt = new Date();
    }

    const certificate = await prisma.certificate.update({
      where: { id: params.id },
      data: updateData,
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
    console.error('Error updating certificate:', error);
    return NextResponse.json(
      { success: false, error: 'Sertifika güncellenemedi' },
      { status: 500 }
    );
  }
}

// DELETE - Sertifika sil
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.certificate.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      success: true,
      message: 'Sertifika başarıyla silindi',
    });
  } catch (error) {
    console.error('Error deleting certificate:', error);
    return NextResponse.json(
      { success: false, error: 'Sertifika silinemedi' },
      { status: 500 }
    );
  }
}
