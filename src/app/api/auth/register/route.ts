import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { RegisterRequest } from '@/types/user';
import { prisma } from '@/lib/prisma';

const JWT_SECRET = 'your-super-secret-jwt-key-for-afet-maratonu-2024';
const JWT_EXPIRES_IN = '7d';
const REFRESH_TOKEN_EXPIRES_IN = '30d';

export async function POST(request: NextRequest) {
  try {
    const body: RegisterRequest = await request.json();
    const { marathonId, email, fullName, phone, university, department, password } = body;

    // Validation
    if (!marathonId || !email || !fullName || !phone || !university || !department || !password) {
      return NextResponse.json(
        { message: 'Tüm alanlar gereklidir' },
        { status: 400 }
      );
    }

    // Check if marathon ID exists and is available
    const marathonIdRecord = await prisma.marathonId.findUnique({
      where: { marathonId },
    });

    if (!marathonIdRecord) {
      return NextResponse.json(
        { message: 'Geçersiz marathon ID' },
        { status: 400 }
      );
    }

    if (marathonIdRecord.isUsed) {
      return NextResponse.json(
        { message: 'Bu marathon ID zaten kullanılmış' },
        { status: 400 }
      );
    }

    // Check if email already exists (both in User and Admin tables)
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    const existingAdmin = await prisma.admin.findUnique({
      where: { email },
    });

    if (existingUser || existingAdmin) {
      return NextResponse.json(
        { message: 'Bu e-posta adresi zaten kayıtlı' },
        { status: 400 }
      );
    }


    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user in database
    const newUser = await prisma.user.create({
      data: {
        marathonId,
        email,
        fullName,
        phone,
        university,
        department,
        role: 'PARTICIPANT',
        isActive: true,
      },
    });

    // Mark marathon ID as used
    await prisma.marathonId.update({
      where: { marathonId },
      data: {
        isUsed: true,
        usedAt: new Date(),
        usedBy: newUser.id,
      },
    });

    // Generate tokens
    const token = jwt.sign(
      { 
        userId: newUser.id, 
        email: newUser.email, 
        role: newUser.role 
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    const refreshToken = jwt.sign(
      { 
        userId: newUser.id, 
        email: newUser.email, 
        role: newUser.role,
        type: 'refresh'
      },
      JWT_SECRET,
      { expiresIn: REFRESH_TOKEN_EXPIRES_IN }
    );

    // Format user data for response
    const userResponse = {
      id: newUser.id,
      marathonId: newUser.marathonId,
      email: newUser.email,
      fullName: newUser.fullName,
      phone: newUser.phone,
      university: newUser.university,
      department: newUser.department,
      role: newUser.role,
      isActive: newUser.isActive,
      createdAt: newUser.createdAt.toISOString(),
      updatedAt: newUser.updatedAt.toISOString(),
    };

    return NextResponse.json({
      user: userResponse,
      token,
      refreshToken,
    });

  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json(
      { message: 'Sunucu hatası' },
      { status: 500 }
    );
  }
}