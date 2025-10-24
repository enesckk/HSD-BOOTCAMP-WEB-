import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';

const JWT_SECRET = 'your-super-secret-jwt-key-for-afet-maratonu-2024';

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json({ message: 'Token gerekli' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const { currentPassword, newPassword } = await request.json();

    // Eğitmeni bul
    const instructor = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });

    if (!instructor || instructor.role !== 'INSTRUCTOR') {
      return NextResponse.json({ message: 'Eğitmen bulunamadı' }, { status: 404 });
    }

    // Mevcut şifreyi kontrol et
    if (instructor.password) {
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, instructor.password);
      if (!isCurrentPasswordValid) {
        return NextResponse.json({ message: 'Mevcut şifre yanlış' }, { status: 400 });
      }
    }

    // Yeni şifreyi hashle
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Şifreyi güncelle
    await prisma.user.update({
      where: { id: decoded.userId },
      data: { password: hashedNewPassword }
    });

    return NextResponse.json({ message: 'Şifre başarıyla değiştirildi' });

  } catch (error) {
    console.error('Error changing password:', error);
    return NextResponse.json({ message: 'Sunucu hatası' }, { status: 500 });
  }
}
