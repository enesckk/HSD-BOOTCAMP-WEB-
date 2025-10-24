import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';

const JWT_SECRET = 'your-super-secret-jwt-key-for-afet-maratonu-2024';

export async function GET(request: NextRequest) {
  try {
    console.log('=== STUDENTS API START ===');
    
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    console.log('Token exists:', !!token);
    
    if (!token) {
      return NextResponse.json({ message: 'Token gerekli' }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as any;
      console.log('Token decoded successfully:', { userId: decoded.userId, role: decoded.role });
    } catch (jwtError) {
      console.error('JWT verification failed:', jwtError);
      return NextResponse.json({ message: 'Geçersiz token' }, { status: 401 });
    }

    // Eğitmen kontrolü
    if (decoded.role !== 'INSTRUCTOR') {
      return NextResponse.json({ message: 'Yetkisiz erişim' }, { status: 403 });
    }

    // Katılımcıları getir
    console.log('Fetching students...');
    
    // Önce tüm kullanıcıları kontrol et
    const allUsers = await prisma.user.findMany({
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        isActive: true
      }
    });
    console.log('All users in database:', allUsers.length);
    console.log('All users:', allUsers);
    
    const students = await prisma.user.findMany({
      where: {
        role: 'PARTICIPANT',
        isActive: true
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        university: true,
        department: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log('Found students:', students.length);
    console.log('Students data:', students);
    
    return NextResponse.json({
      students,
      total: students.length
    });

  } catch (error) {
    console.error('Error fetching students:', error);
    return NextResponse.json({ 
      message: 'Sunucu hatası', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}