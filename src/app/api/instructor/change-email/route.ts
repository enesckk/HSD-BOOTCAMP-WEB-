import { NextRequest, NextResponse } from 'next/server';
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
    const { newEmail } = await request.json();

    // Eğitmeni bul
    const instructor = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });

    if (!instructor || instructor.role !== 'INSTRUCTOR') {
      return NextResponse.json({ message: 'Eğitmen bulunamadı' }, { status: 404 });
    }

    // E-posta formatını kontrol et
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      return NextResponse.json({ message: 'Geçersiz e-posta formatı' }, { status: 400 });
    }

    // E-posta zaten kullanılıyor mu kontrol et
    const existingUser = await prisma.user.findUnique({
      where: { email: newEmail }
    });

    if (existingUser) {
      return NextResponse.json({ message: 'Bu e-posta adresi zaten kullanılıyor' }, { status: 400 });
    }

    // E-posta adresini güncelle
    await prisma.user.update({
      where: { id: decoded.userId },
      data: { email: newEmail }
    });

    return NextResponse.json({ 
      message: 'E-posta adresi başarıyla değiştirildi',
      newEmail 
    });

  } catch (error) {
    console.error('Error changing email:', error);
    return NextResponse.json({ message: 'Sunucu hatası' }, { status: 500 });
  }
}
