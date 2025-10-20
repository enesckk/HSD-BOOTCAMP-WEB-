import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Tüm görevleri getir
export async function GET(request: NextRequest) {
  try {
    const tasks = await prisma.task.findMany({
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
      dueDate,
      status,
      priority,
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
        dueDate: dueDate ? new Date(dueDate) : null,
        status: status || 'PENDING',
        priority: (priority as any) || 'MEDIUM',
        category: category || null,
        tags: tags || null,
        estimatedHours: toInt(estimatedHours),
        assignedBy: assignedBy || null,
        notes: notes || null,
        huaweiCloudAccount: huaweiCloudAccount || null,
        uploadType: uploadType || 'FILE',
        fileUrl: fileUrl || null,
        linkUrl: linkUrl || null,
        userId: userId || null,
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
