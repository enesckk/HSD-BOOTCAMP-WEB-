import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ApplicationStatus, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { encrypt } from '@/utils/crypto';

// POST - Başvuruyu onayla ve kullanıcı oluştur
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { password, notes, reviewedBy } = body;

    if (!password) {
      return NextResponse.json(
        { error: 'Şifre gereklidir' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Şifre en az 8 karakter olmalıdır' },
        { status: 400 }
      );
    }

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

    // Email ile kullanıcı var mı kontrol et
    const existingUser = await prisma.user.findUnique({
      where: { email: application.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Bu e-posta adresi ile zaten bir kullanıcı mevcut' },
        { status: 400 }
      );
    }

    // Şifreyi hashle
    const hashedPassword = await bcrypt.hash(password, 10);

    // Transaction ile başvuruyu güncelle ve kullanıcı oluştur
    const [updatedApplication, newUser] = await prisma.$transaction([
      prisma.application.update({
        where: { id: params.id },
        data: {
          status: ApplicationStatus.APPROVED,
          reviewedBy,
          reviewedAt: new Date(),
          notes,
          initialPasswordEnc: encrypt(password),
        },
      }),
      prisma.user.create({
        data: {
          email: application.email,
          password: hashedPassword,
          fullName: application.fullName,
          phone: application.phone,
          university: application.university,
          department: application.department,
          teamRole: application.teamRole || undefined,
          role: UserRole.PARTICIPANT,
          isActive: true,
        },
      }),
    ]);

    // TODO: Mail gönderme işlemi burada yapılacak
    // Şimdilik konsola yazdıralım
    console.log(`
      ✉️ Mail Gönderilecek:
      To: ${application.email}
      Subject: Başvurunuz Onaylandı
      Body: Merhaba ${application.fullName},
      
      Afet Yönetimi Teknolojileri Fikir Maratonu başvurunuz onaylandı!
      
      Giriş Bilgileriniz:
      E-posta: ${application.email}
      Şifre: ${password}
      
      Giriş için: /login
    `);

    return NextResponse.json({
      message: 'Başvuru onaylandı ve kullanıcı oluşturuldu',
      application: updatedApplication,
      user: {
        id: newUser.id,
        email: newUser.email,
        fullName: newUser.fullName,
      },
    });
  } catch (error) {
    console.error('Error approving application:', error);
    return NextResponse.json(
      { error: 'Başvuru onaylanırken bir hata oluştu' },
      { status: 500 }
    );
  }
}


