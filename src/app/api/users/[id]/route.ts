import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await prisma.user.findUnique({
      where: { id: id }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    const { fullName, phone, university, department, email, password } = body;
    const { id } = await params;

    // Email değişiyorsa, başka kullanıcıda aynı email var mı kontrol et
    if (email) {
      const existingUser = await prisma.user.findFirst({
        where: {
          email: email,
          id: { not: id }
        }
      });

      if (existingUser) {
        return NextResponse.json(
          { error: 'Bu e-posta adresi zaten kullanılıyor' },
          { status: 400 }
        );
      }
    }

    const data: any = {
      fullName,
      phone,
      university,
      department,
    };

    if (email) {
      data.email = email;
    }

    if (password) {
      const saltRounds = 10;
      const hashed = await bcrypt.hash(password, saltRounds);
      data.password = hashed;
    }

    const user = await prisma.user.update({
      where: { id: id },
      data
    });

    return NextResponse.json({
      success: true,
      user: user
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Kullanıcının var olup olmadığını kontrol et
    const user = await prisma.user.findUnique({
      where: { id: id }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Kullanıcı bulunamadı' },
        { status: 404 }
      );
    }

    // Kullanıcıyı sil
    await prisma.user.delete({
      where: { id: id }
    });

    return NextResponse.json({
      success: true,
      message: 'Kullanıcı başarıyla silindi'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Kullanıcı silinirken bir hata oluştu' },
      { status: 500 }
    );
  }
}
