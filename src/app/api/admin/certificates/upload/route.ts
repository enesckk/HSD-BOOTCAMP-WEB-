import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const certificateId = formData.get('certificateId') as string;
    const uploadType = formData.get('uploadType') as string;
    const notes = formData.get('notes') as string;

    if (!certificateId || !uploadType) {
      return NextResponse.json(
        { error: 'Gerekli alanlar eksik' },
        { status: 400 }
      );
    }

    let fileUrl = null;
    let linkUrl = null;

    if (uploadType === 'FILE') {
      const file = formData.get('file') as File;
      if (!file) {
        return NextResponse.json(
          { error: 'Dosya seçilmedi' },
          { status: 400 }
        );
      }

      // Dosyayı kaydet
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      const fileName = `${Date.now()}_${file.name}`;
      const filePath = join(process.cwd(), 'public', 'uploads', 'certificates', fileName);
      
      // Klasörü oluştur
      const fs = require('fs');
      const dir = join(process.cwd(), 'public', 'uploads', 'certificates');
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      await writeFile(filePath, buffer);
      fileUrl = `/uploads/certificates/${fileName}`;
    } else if (uploadType === 'LINK') {
      linkUrl = formData.get('linkUrl') as string;
      if (!linkUrl) {
        return NextResponse.json(
          { error: 'Link URL gerekli' },
          { status: 400 }
        );
      }
    }

    // Sertifikayı güncelle
    const certificate = await prisma.certificate.update({
      where: { id: certificateId },
      data: {
        fileUrl,
        linkUrl,
        notes: notes || null,
        status: 'UPLOADED', // Yükleme sonrası yüklendi durumu
        issuedAt: new Date()
      },
      include: {
        user: {
          select: {
            fullName: true,
            email: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Sertifika başarıyla yüklendi',
      certificate: {
        id: certificate.id,
        userName: certificate.user.fullName,
        userEmail: certificate.user.email,
        programName: certificate.programName,
        fileUrl: certificate.fileUrl,
        linkUrl: certificate.linkUrl,
        status: certificate.status,
        issuedAt: certificate.issuedAt
      }
    });
  } catch (error) {
    console.error('Error uploading certificate:', error);
    return NextResponse.json(
      { error: 'Sertifika yüklenemedi' },
      { status: 500 }
    );
  }
}
