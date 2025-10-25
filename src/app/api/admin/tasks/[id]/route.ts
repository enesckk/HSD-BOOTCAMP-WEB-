import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// PUT - Görevi güncelle
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, description, startDate, endDate, startTime, endTime, dueDate, status } = body;

    const task = await prisma.task.update({
      where: { id },
      data: {
        title,
        description,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        startTime: startTime || null,
        endTime: endTime || null,
        dueDate: dueDate ? new Date(dueDate) : null,
        status
      }
    });

    // Görev güncellendikten sonra otomatik kontrol yap
    try {
      const autoCheckResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/tasks/auto-schedule`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (autoCheckResponse.ok) {
        const autoCheckData = await autoCheckResponse.json();
        console.log('Auto check completed after update:', autoCheckData);
      }
    } catch (error) {
      console.error('Auto check error after update:', error);
    }

    return NextResponse.json({ task });
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json(
      { error: 'Görev güncellenemedi' },
      { status: 500 }
    );
  }
}

// DELETE - Görevi sil
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.task.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json(
      { error: 'Görev silinemedi' },
      { status: 500 }
    );
  }
}
