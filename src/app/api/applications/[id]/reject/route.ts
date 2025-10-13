import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ApplicationStatus } from '@prisma/client';

// POST - Başvuruyu reddet
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { notes, reviewedBy } = body;

    // Başvuruyu getir
    const application = await prisma.application.findUnique({
      where: { id: params.id },
    });

    if (!application) {
      return NextResponse.json(
        { error: 'Başvuru bulunamadı' },
        { status: 404 }
      );
    }

    if (application.status !== ApplicationStatus.PENDING) {
      return NextResponse.json(
        { error: 'Bu başvuru zaten değerlendirilmiş' },
        { status: 400 }
      );
    }

    // Başvuruyu reddet
    const updatedApplication = await prisma.application.update({
      where: { id: params.id },
      data: {
        status: ApplicationStatus.REJECTED,
        reviewedBy,
        reviewedAt: new Date(),
        notes,
      },
    });

    // TODO: Mail gönderme işlemi burada yapılacak
    console.log(`
      ✉️ Mail Gönderilecek:
      To: ${application.email}
      Subject: Başvuru Sonucu
      Body: Merhaba ${application.fullName},
      
      Maalesef bu dönem için başvurunuz onaylanmadı.
      ${notes ? `\nNot: ${notes}` : ''}
    `);

    return NextResponse.json({
      message: 'Başvuru reddedildi',
      application: updatedApplication,
    });
  } catch (error) {
    console.error('Error rejecting application:', error);
    return NextResponse.json(
      { error: 'Başvuru reddedilirken bir hata oluştu' },
      { status: 500 }
    );
  }
}



