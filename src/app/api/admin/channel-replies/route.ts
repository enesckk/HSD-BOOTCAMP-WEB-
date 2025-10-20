import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST - Admin cevap gönder
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messageId, content, adminId } = body;

    // Gerekli alanları kontrol et
    if (!messageId || !content || !adminId) {
      return NextResponse.json(
        { success: false, error: 'Gerekli alanlar eksik' },
        { status: 400 }
      );
    }

    // Ana mesajı bul
    const parentMessage = await prisma.channelMessage.findUnique({
      where: { id: messageId },
      include: {
        channel: true,
        user: true,
      },
    });

    if (!parentMessage) {
      return NextResponse.json(
        { success: false, error: 'Ana mesaj bulunamadı' },
        { status: 404 }
      );
    }

    // Admin cevabını oluştur
    const reply = await prisma.channelMessage.create({
      data: {
        channelId: parentMessage.channelId,
        userId: adminId,
        content,
        messageType: 'answer',
        parentId: messageId,
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            role: true,
          },
        },
      },
    });

    // Ana mesajı cevaplandı olarak işaretle
    await prisma.channelMessage.update({
      where: { id: messageId },
      data: { isAnswered: true },
    });

    return NextResponse.json({
      success: true,
      reply: {
        id: reply.id,
        content: reply.content,
        messageType: reply.messageType,
        createdAt: reply.createdAt,
        user: reply.user,
      },
    });
  } catch (error) {
    console.error('Error creating admin reply:', error);
    return NextResponse.json(
      { success: false, error: 'Cevap oluşturulamadı' },
      { status: 500 }
    );
  }
}

// GET - Cevap bekleyen sorular
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const channelId = searchParams.get('channelId');

    const whereClause: any = {
      messageType: 'question',
      isAnswered: false,
    };

    if (channelId) {
      whereClause.channelId = channelId;
    }

    const unansweredQuestions = await prisma.channelMessage.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            role: true,
          },
        },
        channel: {
          select: {
            id: true,
            name: true,
            displayName: true,
          },
        },
        replies: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                role: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      questions: unansweredQuestions.map(question => ({
        id: question.id,
        content: question.content,
        createdAt: question.createdAt,
        isAnswered: question.isAnswered,
        user: question.user,
        channel: question.channel,
        replies: question.replies,
      })),
    });
  } catch (error) {
    console.error('Error fetching unanswered questions:', error);
    return NextResponse.json(
      { success: false, error: 'Sorular getirilemedi' },
      { status: 500 }
    );
  }
}
