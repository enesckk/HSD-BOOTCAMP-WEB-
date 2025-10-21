import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { action, content } = body;

    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Kullanıcı bilgisi bulunamadı' },
        { status: 401 }
      );
    }

    let updateData: any = {};

    switch (action) {
      case 'pin':
        updateData = { isPinned: true };
        break;
      case 'unpin':
        updateData = { isPinned: false };
        break;
      case 'delete':
        updateData = { 
          isDeleted: true, 
          deletedBy: userId 
        };
        break;
      case 'restore':
        updateData = { 
          isDeleted: false, 
          deletedBy: null 
        };
        break;
      case 'answer':
        updateData = { isAnswered: true };
        break;
      case 'edit':
        if (content) {
          updateData = { 
            content,
            updatedAt: new Date()
          };
        }
        break;
      default:
        return NextResponse.json(
          { success: false, error: 'Geçersiz işlem' },
          { status: 400 }
        );
    }

    const message = await prisma.channelMessage.update({
      where: { id: params.id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            role: true
          }
        },
        channel: {
          select: {
            id: true,
            name: true,
            displayName: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      message
    });

  } catch (error) {
    console.error('Error updating message:', error);
    return NextResponse.json(
      { success: false, error: 'Mesaj güncellenemedi' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Kullanıcı bilgisi bulunamadı' },
        { status: 401 }
      );
    }

    // Mesajı kalıcı olarak sil
    await prisma.channelMessage.delete({
      where: { id: params.id }
    });

    return NextResponse.json({
      success: true,
      message: 'Mesaj kalıcı olarak silindi'
    });

  } catch (error) {
    console.error('Error deleting message:', error);
    return NextResponse.json(
      { success: false, error: 'Mesaj silinemedi' },
      { status: 500 }
    );
  }
}
