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

    if (!user && !admin) {
      return NextResponse.json(
        { message: 'Geçersiz e-posta veya şifre' },
        { status: 401 }
      );
    }

    // Password check
    let isValid = false;
    let principal: any = user || admin;

    if (user) {
      // Kullanıcılar için hash doğrulaması
      if (!user.password) {
        return NextResponse.json(
          { message: 'Hesap şifresi ayarlı değil' },
          { status: 401 }
        );
      }
      isValid = await bcrypt.compare(password, user.password);
    } else if (admin) {
      // Admin için geçici parola kontrolü (gerekirse Admin modeline password alanı eklenebilir)
      isValid = password === 'admin123';
    }

    if (!isValid) {
      return NextResponse.json(
        { message: 'Geçersiz e-posta veya şifre' },
        { status: 401 }
      );
    }

    // Check if active
    if (!principal.isActive) {
      return NextResponse.json(
        { message: 'Hesabınız deaktif durumda' },
        { status: 401 }
      );
    }

    // Generate tokens
    const token = jwt.sign(
      { 
        userId: principal.id, 
        email: principal.email, 
        role: principal.role 
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    const refreshToken = jwt.sign(
      { 
        userId: principal.id, 
        email: principal.email, 
        role: principal.role,
        type: 'refresh'
      },
      JWT_SECRET,
      { expiresIn: REFRESH_TOKEN_EXPIRES_IN }
    );

    // Format user data for response
    const userResponse = {
      id: principal.id,
      email: principal.email,
      fullName: principal.fullName,
      role: principal.role,
      isActive: principal.isActive,
      createdAt: principal.createdAt.toISOString(),
      updatedAt: principal.updatedAt.toISOString(),
      ...(user && {
        marathonId: user.marathonId,
        phone: user.phone,
        university: user.university,
        department: user.department,
        teamRole: user.teamRole,
      }),
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
