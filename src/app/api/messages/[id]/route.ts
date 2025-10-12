import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Mesaj detayını getir
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    const message = await prisma.message.findUnique({
      where: { id },
      include: {
        fromUser: {
          select: {
            id: true,
            fullName: true,
            email: true,
          }
        },
        toUser: {
          select: {
            id: true,
            fullName: true,
            email: true,
          }
        },
        toTeam: {
          select: {
            id: true,
            name: true,
          }
        }
      }
    });

    if (!message) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 });
    }

    return NextResponse.json({ item: message });
  } catch (error) {
    console.error('Error fetching message:', error);
    return NextResponse.json(
      { error: 'Failed to fetch message' },
      { status: 500 }
    );
  }
}

// PUT - Mesajı güncelle
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { subject, body, unread } = await request.json();
    
    const updateData: any = {};
    if (subject !== undefined) updateData.subject = subject;
    if (body !== undefined) updateData.body = body;
    if (unread !== undefined) updateData.unread = unread;
    
    const message = await prisma.message.update({
      where: { id },
      data: updateData,
      include: {
        fromUser: {
          select: {
            id: true,
            fullName: true,
            email: true,
          }
        },
        toUser: {
          select: {
            id: true,
            fullName: true,
            email: true,
          }
        },
        toTeam: {
          select: {
            id: true,
            name: true,
          }
        }
      }
    });

    return NextResponse.json({ item: message });
  } catch (error) {
    console.error('Error updating message:', error);
    return NextResponse.json(
      { error: 'Failed to update message' },
      { status: 500 }
    );
  }
}

// DELETE - Mesajı sil
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    await prisma.message.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting message:', error);
    return NextResponse.json(
      { error: 'Failed to delete message' },
      { status: 500 }
    );
  }
}