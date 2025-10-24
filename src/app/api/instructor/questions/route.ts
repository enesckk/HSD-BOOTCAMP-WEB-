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

// POST - Soruya cevap ver
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { questionId, answer } = body;

    if (!questionId || !answer) {
      return NextResponse.json(
        { success: false, error: 'Soru ID ve cevap gereklidir' },
        { status: 400 }
      );
    }

    // Önce soruyu bul
    const question = await prisma.message.findUnique({
      where: { id: questionId },
      include: {
        fromUser: {
          select: {
            id: true,
            fullName: true,
            email: true
          }
        }
      }
    });

    if (!question) {
      return NextResponse.json(
        { success: false, error: 'Soru bulunamadı' },
        { status: 404 }
      );
    }

    // Cevap mesajı oluştur
    const replyMessage = await prisma.message.create({
      data: {
        fromUserId: question.fromUserId, // Soruyu soran kullanıcı
        toUserId: question.fromUserId, // Cevap aynı kullanıcıya gidecek
        toRole: 'PARTICIPANT',
        subject: `Cevap: ${question.subject}`,
        body: answer,
        messageType: 'reply',
        unread: true
      }
    });

    // Orijinal soruyu cevaplandı olarak işaretle
    await prisma.message.update({
      where: { id: questionId },
      data: { unread: false }
    });

    // Kullanıcıya bildirim gönder
    if (question.fromUserId) {
      await prisma.notification.create({
        data: {
          type: 'MESSAGE',
          title: 'Soru Cevabı',
          message: `Sorunuza cevap verildi: ${answer.substring(0, 100)}...`,
          userId: question.fromUserId,
          read: false
        }
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Cevap başarıyla gönderildi',
      reply: replyMessage
    });

  } catch (error) {
    console.error('Error replying to question:', error);
    return NextResponse.json(
      { success: false, error: 'Cevap gönderilemedi' },
      { status: 500 }
    );
  }
}
