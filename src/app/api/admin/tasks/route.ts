import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Tüm görevleri getir
export async function GET(request: NextRequest) {
  try {
    // Admin tarafından oluşturulan görevleri getir (userId null olan)
    const tasks = await prisma.task.findMany({
      where: {
        userId: null // Admin tarafından oluşturulan görevler
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ tasks });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json(
      { error: 'Görevler getirilemedi' },
      { status: 500 }
    );
  }
}

// POST - Yeni görev oluştur
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      startDate,
      dueDate,
      status,
      category,
      tags,
      estimatedHours,
      assignedBy,
      notes,
      huaweiCloudAccount,
      uploadType,
      fileUrl,
      linkUrl,
      userId,
    } = body;

    // Admin kullanıcısını bul
    const adminUser = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    });

    if (!adminUser) {
      return NextResponse.json(
        { error: 'Admin kullanıcısı bulunamadı' },
        { status: 400 }
      );
    }

    if (!title || !description) {
      return NextResponse.json(
        { error: 'Başlık ve açıklama gereklidir' },
        { status: 400 }
      );
    }

    const toInt = (v: any) => {
      if (v === undefined || v === null || v === '') return null;
      const n = parseInt(v as string, 10);
      return Number.isFinite(n) ? n : null;
    };

    const task = await prisma.task.create({
      data: {
        title,
        description,
        startDate: startDate ? new Date(startDate) : null,
        dueDate: dueDate ? new Date(dueDate) : null,
        status: status || 'PENDING',
        category: category || null,
        tags: tags || null,
        estimatedHours: toInt(estimatedHours),
        assignedBy: assignedBy || null,
        notes: notes || null,
        huaweiCloudAccount: huaweiCloudAccount || null,
        uploadType: uploadType || 'FILE',
        fileUrl: fileUrl || null,
        linkUrl: linkUrl || null,
        userId: adminUser.id, // Admin tarafından oluşturulan görev
      }
    });

    return NextResponse.json({ task });
  } catch (error: any) {
    console.error('Error creating task:', error);
    return NextResponse.json(
      { error: 'Görev oluşturulamadı', detail: String(error?.message || error) },
      { status: 500 }
    );
  }
}
