import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { UserRole } from '@prisma/client';

// GET - Tüm kullanıcıları getir (sadece katılımcılar)
export async function GET(request: NextRequest) {
  try {
    const users = await prisma.user.findMany({
      where: {
        role: UserRole.PARTICIPANT, // Sadece katılımcılar
        isActive: true, // Sadece aktif kullanıcılar
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        university: true,
        department: true,
        teamRole: true,
        isActive: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      users,
      total: users.length,
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Kullanıcılar getirilemedi' },
      { status: 500 }
    );
  }
}

// PATCH - Kullanıcı rolünü güncelle (admin)
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, teamRole } = body as { userId?: string; teamRole?: 'LIDER' | 'TEKNIK_SORUMLU' | 'TASARIMCI' | null };

    if (!userId) {
      return NextResponse.json({ error: 'userId gereklidir' }, { status: 400 });
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { teamRole: teamRole ?? null },
      select: { id: true, fullName: true, email: true, teamRole: true }
    });

    return NextResponse.json({ user: updated });
  } catch (error) {
    console.error('Error updating user role:', error);
    return NextResponse.json({ error: 'Rol güncellenemedi' }, { status: 500 });
  }
}


