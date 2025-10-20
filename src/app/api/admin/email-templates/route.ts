import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - E-posta şablonları
export async function GET(request: NextRequest) {
  try {
    const templates = await prisma.emailTemplate.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      templates: templates.map(template => ({
        id: template.id,
        name: template.name,
        subject: template.subject,
        content: template.content,
        type: template.type,
        attachments: template.attachments,
        createdAt: template.createdAt,
      })),
    });
  } catch (error) {
    console.error('Error fetching email templates:', error);
    return NextResponse.json(
      { success: false, error: 'Şablonlar getirilemedi' },
      { status: 500 }
    );
  }
}

// POST - Yeni şablon oluştur
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      subject,
      content,
      type,
      attachments = [],
    } = body;

    // Gerekli alanları kontrol et
    if (!name || !subject || !content || !type) {
      return NextResponse.json(
        { success: false, error: 'Gerekli alanlar eksik' },
        { status: 400 }
      );
    }

    const template = await prisma.emailTemplate.create({
      data: {
        name,
        subject,
        content,
        type: type as any,
        attachments,
      },
    });

    return NextResponse.json({
      success: true,
      template: {
        id: template.id,
        name: template.name,
        subject: template.subject,
        content: template.content,
        type: template.type,
        attachments: template.attachments,
        createdAt: template.createdAt,
      },
    });
  } catch (error) {
    console.error('Error creating email template:', error);
    return NextResponse.json(
      { success: false, error: 'Şablon oluşturulamadı' },
      { status: 500 }
    );
  }
}
