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

    const updateData: any = {};
    
    if (status) updateData.status = status;
    if (feedback !== undefined) updateData.notes = feedback;
    if (score !== undefined) updateData.score = score;

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

    // Revizyon durumunda kullanıcıya bildirim gönder
    if (status === 'NEEDS_REVISION' && submission.userId) {
      await prisma.notification.create({
        data: {
          type: 'TASK_REVISION',
          title: 'Ödev Revizyon Gerekli',
          message: `Ödeviniz revizyon gerektiriyor: ${feedback || 'Lütfen ödevinizi gözden geçirin.'}`,
          userId: submission.userId,
          isRead: false
        }
      });
    }

    // Onay durumunda kullanıcıya bildirim gönder
    if (status === 'APPROVED' && submission.userId) {
      await prisma.notification.create({
        data: {
          type: 'TASK_APPROVED',
          title: 'Ödev Onaylandı',
          message: `Ödeviniz onaylandı!${score ? ` Puanınız: ${score}/100` : ''}`,
          userId: submission.userId,
          isRead: false
        }
      });
    }

    // Red durumunda kullanıcıya bildirim gönder
    if (status === 'REJECTED' && submission.userId) {
      await prisma.notification.create({
        data: {
          type: 'TASK_REJECTED',
          title: 'Ödev Reddedildi',
          message: `Ödeviniz reddedildi: ${feedback || 'Lütfen ödevinizi yeniden gözden geçirin.'}`,
          userId: submission.userId,
          isRead: false
        }
      });
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
