import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';

const JWT_SECRET = 'your-super-secret-jwt-key-for-afet-maratonu-2024';

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json({ message: 'Token gerekli' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const instructor = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        role: true,
        university: true,
        department: true
      }
    });

    if (!instructor || instructor.role !== 'INSTRUCTOR') {
      return NextResponse.json({ message: 'Eğitmen bulunamadı' }, { status: 404 });
    }

    return NextResponse.json({ instructor });
  } catch (error) {
    console.error('Error fetching instructor profile:', error);
    return NextResponse.json({ message: 'Sunucu hatası' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    console.log('=== PROFILE UPDATE START ===');
    
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    console.log('Token exists:', !!token);
    
    if (!token) {
      return NextResponse.json({ message: 'Token gerekli' }, { status: 401 });
    }

    let decoded;
    try {
      // Token'ı manuel olarak decode et (verify olmadan)
      const decodedWithoutVerify = jwt.decode(token);
      console.log('Token decoded without verify:', decodedWithoutVerify);
      
      decoded = jwt.verify(token, JWT_SECRET) as any;
      console.log('Token decoded successfully:', { userId: decoded.userId, role: decoded.role });
    } catch (jwtError) {
      console.error('JWT verification failed:', jwtError);
      console.error('JWT Error details:', jwtError);
      return NextResponse.json({ message: 'Geçersiz token' }, { status: 401 });
    }
    
    const requestBody = await request.json();
    console.log('Request body received:', requestBody);
    const { fullName, email, phone, password } = requestBody;

    // Eğitmeni bul - önce User tablosunda ara
    console.log('Looking for instructor with ID:', decoded.userId);
    let instructor = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });
    console.log('Found in User table:', instructor ? 'Yes' : 'No');
    
    // Eğer User tablosunda bulunamazsa Admin tablosunda ara
    if (!instructor) {
      console.log('Not found in User table, checking Admin table...');
      const adminUser = await prisma.admin.findUnique({
        where: { id: decoded.userId }
      });
      console.log('Found in Admin table:', adminUser ? 'Yes' : 'No');
      
      if (adminUser && adminUser.role === 'INSTRUCTOR') {
        // Admin tablosundaki eğitmeni User formatına çevir
        instructor = {
          id: adminUser.id,
          fullName: adminUser.fullName,
          email: adminUser.email,
          phone: adminUser.phone || '',
          role: adminUser.role,
          university: '',
          department: '',
          password: null,
          isActive: adminUser.isActive,
          createdAt: new Date(),
          updatedAt: new Date()
        } as any;
        console.log('Converted admin to user format');
      }
    }

    if (!instructor || instructor.role !== 'INSTRUCTOR') {
      console.log('Instructor not found or wrong role:', instructor?.role);
      return NextResponse.json({ message: 'Eğitmen bulunamadı' }, { status: 404 });
    }

    // E-posta değişikliği kontrolü
    if (email !== instructor.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });

      if (existingUser) {
        return NextResponse.json({ message: 'Bu e-posta adresi zaten kullanılıyor' }, { status: 400 });
      }
    }

    // Güncelleme verisi hazırla
    const updateData: any = {
      fullName,
      email,
      phone
    };

    // Şifre değişikliği
    if (password && password.trim() !== '') {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    // Profili güncelle
    console.log('Updating instructor with data:', updateData);
    const updatedInstructor = await prisma.user.update({
      where: { id: decoded.userId },
      data: updateData,
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        role: true,
        university: true,
        department: true
      }
    });
    console.log('Profile updated successfully');

    return NextResponse.json({ 
      message: 'Profil başarıyla güncellendi',
      instructor: updatedInstructor 
    });

  } catch (error) {
    console.error('Error updating instructor profile:', error);
    console.error('Error details:', error);
    return NextResponse.json({ 
      message: 'Sunucu hatası', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}