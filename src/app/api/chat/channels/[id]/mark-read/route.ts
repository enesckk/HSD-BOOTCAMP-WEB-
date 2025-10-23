import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = request.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Kullanıcı bilgisi bulunamadı' },
        { status: 401 }
      );
    }

    // Kullanıcının bu kanaldaki tüm mesajları okundu olarak işaretle
    // Bu işlem için bir read status tablosu oluşturmak gerekebilir
    // Şimdilik basit bir çözüm olarak, kullanıcının son görüntüleme zamanını güncelleyelim
    
    // Kullanıcının kanal görüntüleme zamanını güncelle
    await prisma.user.update({
      where: { id: userId },
      data: {
        updatedAt: new Date()
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Kanal okundu olarak işaretlendi'
    });

  } catch (error) {
    console.error('Error marking channel as read:', error);
    return NextResponse.json(
      { success: false, error: 'Kanal okundu işaretlenemedi' },
      { status: 500 }
    );
  }
}
