import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Tek teslim getir
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const submission = await prisma.task.findUnique({
      where: { id: params.id },
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
        userName: submission.user.fullName,
        userEmail: submission.user.email,
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
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { status, feedback, score } = body;

    const updateData: any = {};
    
    if (status) updateData.status = status;
    if (feedback !== undefined) updateData.notes = feedback;
    if (score !== undefined) updateData.score = score;

    const submission = await prisma.task.update({
      where: { id: params.id },
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

    return NextResponse.json({
      success: true,
      submission: {
        id: submission.id,
        userId: submission.userId,
        userName: submission.user.fullName,
        userEmail: submission.user.email,
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
