import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST - Görev teslimi yap
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const taskId = formData.get('taskId') as string;
    const userId = formData.get('userId') as string;
    const uploadType = formData.get('uploadType') as string;
    const file = formData.get('file') as File;
    const linkUrl = formData.get('linkUrl') as string;
    const notes = formData.get('notes') as string;

    if (!taskId || !userId) {
      return NextResponse.json(
        { error: 'Görev ID ve kullanıcı ID gereklidir' },
        { status: 400 }
      );
    }

    // Görevi kontrol et
    const task = await prisma.task.findUnique({
      where: { id: taskId }
    });

    if (!task) {
      return NextResponse.json(
        { error: 'Görev bulunamadı' },
        { status: 404 }
      );
    }

    // Tarih kontrolü - sadece başlama tarihi gelmiş olanlar teslim edilebilir
    const now = new Date();
    if (task.startDate && new Date(task.startDate) > now) {
      return NextResponse.json(
        { error: 'Bu görev henüz başlamamış' },
        { status: 400 }
      );
    }

    // Dosya yükleme (basit implementasyon)
    let fileUrl = null;
    if (uploadType === 'FILE' && file) {
      // Burada gerçek dosya yükleme işlemi yapılacak
      // Şimdilik mock URL
      fileUrl = `/uploads/${Date.now()}-${file.name}`;
    }

    // Görevi güncelle
    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: {
        status: 'COMPLETED',
        uploadType: uploadType || 'FILE',
        fileUrl: fileUrl,
        linkUrl: uploadType === 'LINK' ? linkUrl : null,
        notes: notes,
        actualHours: task.estimatedHours, // Basit implementasyon
        updatedAt: new Date()
      }
    });

    return NextResponse.json({ 
      success: true, 
      task: updatedTask,
      message: 'Görev başarıyla teslim edildi'
    });
  } catch (error) {
    console.error('Error submitting task:', error);
    return NextResponse.json(
      { error: 'Görev teslim edilemedi' },
      { status: 500 }
    );
  }
}
