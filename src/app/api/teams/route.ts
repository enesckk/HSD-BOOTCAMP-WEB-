import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const all = searchParams.get('all');

    // Admin listesi: tüm takımlar
    if (all === 'true') {
      const teams = await prisma.team.findMany({
        include: { leader: true, members: true },
        orderBy: { createdAt: 'desc' },
      });
      return NextResponse.json({ items: teams }, { status: 200 });
    }

    if (!userId) {
      return NextResponse.json({ error: 'userId gereklidir' }, { status: 400 });
    }

    // Lider olduğu veya üye olduğu takımı getir
    const teamByLeader = await prisma.team.findFirst({
      where: { leaderId: userId },
      include: {
        leader: true,
        members: {
          include: {
            tasks: {
              orderBy: { createdAt: 'desc' }
            },
            presentations: {
              orderBy: { createdAt: 'desc' }
            }
          }
        },
      },
    });

    if (teamByLeader) {
      return NextResponse.json({ items: [teamByLeader] }, { status: 200 });
    }

    // Üye olduğu takım (TeamMembers relation üzerinden)
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user?.teamId) {
      const teamByMember = await prisma.team.findUnique({
        where: { id: user.teamId },
        include: {
          leader: true,
          members: {
            include: {
              tasks: {
                orderBy: { createdAt: 'desc' }
              },
              presentations: {
                orderBy: { createdAt: 'desc' }
              }
            }
          },
        },
      });
      if (teamByMember) {
        return NextResponse.json({ items: [teamByMember] }, { status: 200 });
      }
    }

    return NextResponse.json({ items: [] }, { status: 200 });
  } catch (error) {
    console.error('Teams GET error:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, leaderId } = body;

    const team = await prisma.team.create({
      data: {
        name,
        leaderId
      },
      include: {
        leader: true,
        members: true
      }
    });

    return NextResponse.json(team, { status: 201 });
  } catch (error) {
    console.error('Error creating team:', error);
    return NextResponse.json(
      { error: 'Failed to create team' },
      { status: 500 }
    );
  }
}
