import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Öğrencileri listele
export async function GET(request: NextRequest) {
  try {
    const students = await (prisma as any).user.findMany({
      where: {
        role: 'PARTICIPANT'
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        university: true,
        department: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        tasks: {
          select: {
            id: true,
            status: true,
            score: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Öğrenci verilerini formatla
    const formattedStudents = students.map((student: any) => {
      const completedTasks = student.tasks.filter((task: any) => task.status === 'COMPLETED').length;
      const totalTasks = student.tasks.length;
      const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
      
      return {
        id: student.id,
        fullName: student.fullName,
        email: student.email,
        phone: student.phone,
        university: student.university,
        department: student.department,
        role: student.role,
        createdAt: student.createdAt,
        progress: progress,
        lastActive: student.updatedAt,
        completedLessons: completedTasks,
        totalLessons: totalTasks
      };
    });

    return NextResponse.json({
      success: true,
      students: formattedStudents,
    });
  } catch (error) {
    console.error('Error fetching students:', error);
    return NextResponse.json(
      { success: false, error: 'Öğrenciler getirilemedi' },
      { status: 500 }
    );
  }
}