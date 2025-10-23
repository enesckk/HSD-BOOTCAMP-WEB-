import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Eğitmene sorulan soruları listele (Messages)
export async function GET(request: NextRequest) {
  try {
    // Admin'e gönderilen mesajları getir
    const questions = await prisma.message.findMany({
      where: {
        toRole: 'ADMIN',
        messageType: 'question'
      },
      include: {
        fromUser: {
          select: {
            id: true,
            fullName: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Soruları formatla
    const formattedQuestions = questions.map((question: any) => ({
      id: question.id,
      content: question.body,
      tags: question.subject.includes('[') ? question.subject.split(']')[0].replace('[', '') : '',
      createdAt: question.createdAt.toISOString(),
      user: {
        fullName: question.fromUser?.fullName || 'Bilinmeyen',
        email: question.fromUser?.email || ''
      },
      isAnswered: question.unread === false
    }));

    return NextResponse.json({
      success: true,
      questions: formattedQuestions,
    });
  } catch (error) {
    console.error('Error fetching instructor questions:', error);
    return NextResponse.json(
      { success: false, error: 'Sorular getirilemedi' },
      { status: 500 }
    );
  }
}
