import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'your-super-secret-jwt-key-for-afet-maratonu-2024';

// GET - Katılımcının sorularını ve cevaplarını getir
export async function GET(request: NextRequest) {
  try {
    // JWT token kontrolü
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Yetkilendirme gerekli' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as any;
    } catch (error) {
      return NextResponse.json(
        { success: false, error: 'Geçersiz token' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Kullanıcı ID gereklidir' },
        { status: 400 }
      );
    }

    // Token'daki kullanıcı ID'si ile istek edilen ID'nin aynı olduğunu kontrol et
    if (decoded.userId !== userId) {
      return NextResponse.json(
        { success: false, error: 'Bu kullanıcının sorularına erişim yetkiniz yok' },
        { status: 403 }
      );
    }

    // Kullanıcının sorularını ve cevaplarını getir (Message modelinden)
    const questions = await prisma.message.findMany({
      where: {
        fromUserId: userId,
        messageType: 'question'
      },
      include: {
        fromUser: {
          select: {
            id: true,
            fullName: true,
            email: true
          }
        },
        toUser: {
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

    // Her soru için cevapları getir
    const questionsWithReplies = await Promise.all(
      questions.map(async (question) => {
        const replies = await prisma.message.findMany({
          where: {
            messageType: 'answer',
            subject: {
              contains: question.id // Subject'te soru ID'si olan cevaplar
            }
          },
          include: {
            fromUser: {
              select: {
                fullName: true,
                email: true
              }
            }
          },
          orderBy: {
            createdAt: 'asc'
          }
        });

        return {
          id: question.id,
          content: question.body,
          tags: question.subject?.replace(/^\[(.*?)\].*$/, '$1') || '',
          createdAt: question.createdAt,
          replies: replies.map(reply => ({
            id: reply.id,
            content: reply.body,
            user: {
              fullName: reply.fromUser?.fullName || 'Bilinmeyen Kullanıcı',
              email: reply.fromUser?.email || 'Bilinmeyen Email'
            },
            createdAt: reply.createdAt
          }))
        };
      })
    );

    return NextResponse.json({
      success: true,
      questions: questionsWithReplies
    });

  } catch (error) {
    console.error('Error fetching participant questions:', error);
    return NextResponse.json(
      { success: false, error: 'Sorular getirilemedi' },
      { status: 500 }
    );
  }
}

