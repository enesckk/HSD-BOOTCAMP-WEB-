import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Tüm ödev teslimlerini getir
export async function GET(request: NextRequest) {
  try {
    const tasks = await prisma.task.findMany({
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 200,
    });

    const submissions = tasks.filter((t) => {
      const hasFile = t.fileUrl && t.fileUrl.trim() !== '';
      const hasLink = (t as any).linkUrl && (t as any).linkUrl.trim() !== '';
      return hasFile || hasLink;
    });

    return NextResponse.json({
      success: true,
      submissions: submissions.map(task => ({
        id: task.id,
        userId: task.userId,
        userName: task.user.fullName,
        userEmail: task.user.email,
        taskTitle: task.title,
        taskDescription: task.description,
        submissionType: task.uploadType,
        fileUrl: task.fileUrl,
        linkUrl: task.linkUrl,
        fileName: task.fileUrl ? task.fileUrl.split('/').pop() : undefined,
        status: task.status,
        submittedAt: task.createdAt,
        score: task.score,
        feedback: task.notes,
      })),
    });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return NextResponse.json(
      { success: false, error: 'Teslimler getirilemedi' },
      { status: 500 }
    );
  }
}
