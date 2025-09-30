import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { LoginRequest } from '@/types/user';
import { prisma } from '@/lib/prisma';

const JWT_SECRET = 'your-super-secret-jwt-key-for-afet-maratonu-2024';
const JWT_EXPIRES_IN = '7d';
const REFRESH_TOKEN_EXPIRES_IN = '30d';

export async function POST(request: NextRequest) {
  try {
    const body: LoginRequest = await request.json();
    const { email, password } = body;

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { message: 'E-posta ve şifre gereklidir' },
        { status: 400 }
      );
    }

    // Find user in database (check both User and Admin tables)
    const user = await prisma.user.findUnique({
      where: { email },
    });

    const admin = await prisma.admin.findUnique({
      where: { email },
    });

    const foundUser = user || admin;
    if (!foundUser) {
      return NextResponse.json(
        { message: 'Geçersiz e-posta veya şifre' },
        { status: 401 }
      );
    }

    // Check if user is active
    if (!foundUser.isActive) {
      return NextResponse.json(
        { message: 'Hesabınız deaktif durumda' },
        { status: 401 }
      );
    }

    // For now, we'll use a simple password check
    // In a real app, you'd store hashed passwords in the database
    const validPassword = password === 'admin123'; // Temporary for testing
    if (!validPassword) {
      return NextResponse.json(
        { message: 'Geçersiz e-posta veya şifre' },
        { status: 401 }
      );
    }

    // Generate tokens
    const token = jwt.sign(
      { 
        userId: foundUser.id, 
        email: foundUser.email, 
        role: foundUser.role 
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    const refreshToken = jwt.sign(
      { 
        userId: foundUser.id, 
        email: foundUser.email, 
        role: foundUser.role,
        type: 'refresh'
      },
      JWT_SECRET,
      { expiresIn: REFRESH_TOKEN_EXPIRES_IN }
    );

    // Format user data for response
    const userResponse = {
      id: foundUser.id,
      email: foundUser.email,
      fullName: foundUser.fullName,
      role: foundUser.role,
      isActive: foundUser.isActive,
      createdAt: foundUser.createdAt.toISOString(),
      updatedAt: foundUser.updatedAt.toISOString(),
      // Add participant-specific fields if it's a user
      ...(user && {
        marathonId: user.marathonId,
        phone: user.phone,
        university: user.university,
        department: user.department,
        teamRole: user.teamRole,
      }),
      // Add admin-specific fields if it's an admin
      ...(admin && {
        phone: admin.phone,
      }),
    };

    return NextResponse.json({
      user: userResponse,
      token,
      refreshToken,
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Sunucu hatası' },
      { status: 500 }
    );
  }
}
