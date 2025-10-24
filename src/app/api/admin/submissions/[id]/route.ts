import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Tek teslim getir
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const submission = await prisma.task.findUnique({
      where: { id: id },
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

    if (!submission) {
      return NextResponse.json(
        { success: false, error: 'Teslim bulunamadı' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      submission: {
        id: submission.id,
        userId: submission.userId,
        userName: submission.user?.fullName || 'Bilinmeyen Kullanıcı',
        userEmail: submission.user?.email || 'Bilinmeyen Email',
        taskTitle: submission.title,
        taskDescription: submission.description,
        submissionType: submission.uploadType,
        fileUrl: submission.fileUrl,
        linkUrl: submission.linkUrl,
        fileName: submission.fileUrl ? submission.fileUrl.split('/').pop() : undefined,
        status: submission.status,
        submittedAt: submission.createdAt,
        score: submission.score,
        feedback: submission.notes,
      },
    });
  } catch (error) {
    console.error('Error fetching submission:', error);
    return NextResponse.json(
      { success: false, error: 'Teslim getirilemedi' },
      { status: 500 }
    );
  }
}

// PUT - Teslim durumunu güncelle
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    const { status, feedback, score } = body;
    const { id } = await params;

    // Durum ve not güncelleme
    const updateData: any = {};
    
    console.log('Updating submission with:', { status, feedback, score });
    
    if (status !== undefined) updateData.status = status;
    if (feedback !== undefined) updateData.notes = feedback;
    if (score !== undefined) updateData.score = score;
    
    console.log('Update data:', updateData);

    const submission = await prisma.task.update({
      where: { id: id },
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
    
    console.log('Updated submission:', {
      id: submission.id,
      status: submission.status,
      notes: submission.notes,
      score: submission.score
    });

    // Durum değişikliği bildirimi gönder
    if (submission.userId) {
      let notificationTitle = '';
      let notificationMessage = '';
      
      if (status === 'APPROVED') {
        notificationTitle = 'Ödev Onaylandı';
        notificationMessage = 'Tebrikler! Ödeviniz onaylandı.';
      } else if (status === 'REJECTED') {
        notificationTitle = 'Ödev Reddedildi';
        notificationMessage = 'Ödeviniz reddedildi. Lütfen tekrar gözden geçirin.';
      } else if (status === 'NEEDS_REVISION') {
        notificationTitle = 'Ödev Revizyon Gerekli';
        notificationMessage = 'Ödevinizde revizyon gerekiyor. Lütfen düzeltin.';
      }
      
      if (feedback) {
        notificationMessage += ` Geri bildirim: ${feedback}`;
      }
      
      if (notificationTitle) {
        await prisma.notification.create({
          data: {
            type: 'TASK',
            title: notificationTitle,
            message: notificationMessage,
            userId: submission.userId,
            read: false
          }
        });
      }
    }

    return NextResponse.json({
      success: true,
      submission: {
        id: submission.id,
        userId: submission.userId,
        userName: submission.user?.fullName || 'Bilinmeyen Kullanıcı',
        userEmail: submission.user?.email || 'Bilinmeyen Email',
        taskTitle: submission.title,
        taskDescription: submission.description,
        submissionType: submission.uploadType,
        fileUrl: submission.fileUrl,
        linkUrl: submission.linkUrl,
        fileName: submission.fileUrl ? submission.fileUrl.split('/').pop() : undefined,
        status: submission.status,
        submittedAt: submission.createdAt,
        score: submission.score,
        feedback: submission.notes,
      },
    });
  } catch (error) {
    console.error('Error updating submission:', error);
    return NextResponse.json(
      { success: false, error: 'Teslim güncellenemedi' },
      { status: 500 }
    );
  }
}
