import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Tüm ödev teslimlerini getir
export async function GET(request: NextRequest) {
  try {
    // Sadece kullanıcılar tarafından teslim edilen görevleri getir
    // (userId null olmayan ve fileUrl/linkUrl olan görevler)
    const tasks = await prisma.task.findMany({
      where: {
        userId: { not: null }, // Kullanıcı tarafından oluşturulan görevler
        OR: [
          { fileUrl: { not: null } },
          { linkUrl: { not: null } }
        ]
      },
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

    // Görevlere göre grupla
    const groupedByTask = tasks.reduce((acc: any, task: any) => {
      const taskTitle = task.title;
      if (!acc[taskTitle]) {
        acc[taskTitle] = {
          taskTitle: taskTitle,
          taskDescription: task.description,
          submissions: []
        };
      }
      acc[taskTitle].submissions.push({
        id: task.id,
        userId: task.userId,
        userName: task.user?.fullName || 'Bilinmeyen Kullanıcı',
        userEmail: task.user?.email || 'Bilinmeyen Email',
        submissionType: task.uploadType,
        fileUrl: task.fileUrl,
        linkUrl: task.linkUrl,
        fileName: task.fileUrl ? task.fileUrl.split('/').pop() : undefined,
        fileSize: null,
        fileType: task.fileUrl ? task.fileUrl.split('.').pop() : undefined,
        status: task.status,
        submittedAt: task.createdAt,
        reviewedAt: task.updatedAt,
        score: task.score,
        feedback: task.notes,
      });
      return acc;
    }, {});

    return NextResponse.json({
      success: true,
      groupedSubmissions: Object.values(groupedByTask),
    });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return NextResponse.json(
      { success: false, error: 'Teslimler getirilemedi' },
      { status: 500 }
    );
  }
}
