import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - E-posta şablonlarını listele
export async function GET(request: NextRequest) {
  try {
    const templates = await prisma.emailTemplate.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({
      success: true,
      templates: templates,
    });
  } catch (error) {
    console.error('Error fetching email templates:', error);
    return NextResponse.json(
      { error: 'Şablonlar getirilemedi' },
      { status: 500 }
    );
  }
}

// POST - Yeni şablon oluştur
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, subject, content, type, attachments } = body;

    if (!name || !subject || !content || !type) {
      return NextResponse.json(
        { error: 'Gerekli alanlar eksik' },
        { status: 400 }
      );
    }

    const template = await prisma.emailTemplate.create({
      data: {
        name,
        subject,
        content,
        type,
        attachments: attachments || ''
      }
    });

    return NextResponse.json({
      success: true,
      template: template,
    });
  } catch (error) {
    console.error('Error creating template:', error);
    return NextResponse.json(
      { error: 'Şablon oluşturulamadı' },
      { status: 500 }
    );
  }
}