import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Eğitmene sorulan soruları listele
export async function GET(request: NextRequest) {
  try {
    // Eğitmene Sor DM kanalını bul
    const dmChannel = await (prisma as any).channel.findFirst({
      where: {
        name: 'egitmene-sor-dm'
      }
    });

    if (!dmChannel) {
      return NextResponse.json({
        success: true,
        questions: [],
      });
    }

    // Bu kanaldaki mesajları getir
    const questions = await (prisma as any).channelMessage.findMany({
      where: {
        channelId: dmChannel.id,
        isDeleted: false,
        messageType: 'question'
      },
      include: {
        user: {
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
      content: question.content,
      tags: question.tags || '',
      createdAt: question.createdAt.toISOString(),
      user: {
        fullName: question.user.fullName,
        email: question.user.email
      },
      isAnswered: question.isAnswered || false
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
