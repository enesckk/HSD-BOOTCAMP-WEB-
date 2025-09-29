import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { valid: false, message: 'Token bulunamadı' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      
      // Find user in database (check both User and Admin tables)
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
      });

      const admin = await prisma.admin.findUnique({
        where: { id: decoded.userId },
      });

      const foundUser = user || admin;
      
      if (!foundUser) {
        return NextResponse.json(
          { valid: false, message: 'Kullanıcı bulunamadı' },
          { status: 401 }
        );
      }

      if (!foundUser.isActive) {
        return NextResponse.json(
          { valid: false, message: 'Hesap deaktif' },
          { status: 401 }
        );
      }

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
        valid: true,
        user: userResponse,
      });

    } catch (jwtError) {
      return NextResponse.json(
        { valid: false, message: 'Geçersiz token' },
        { status: 401 }
      );
    }

  } catch (error) {
    console.error('Token verification error:', error);
    return NextResponse.json(
      { valid: false, message: 'Sunucu hatası' },
      { status: 500 }
    );
  }
}