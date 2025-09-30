import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');
    const teams = await prisma.team.findMany({
      where: userId ? { OR: [ { leaderId: userId }, { members: { some: { id: userId } } } ] } : undefined,
      include: {
        leader: true,
        members: true
      },
      orderBy: { createdAt: 'desc' }
    });
    
    return NextResponse.json({ items: teams });
  } catch (error) {
    console.error('Error fetching teams:', error);
    return NextResponse.json(
      { error: 'Failed to fetch teams' },
      { status: 500 }
    );
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
