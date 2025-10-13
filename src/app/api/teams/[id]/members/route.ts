import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// POST - Add member to team
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await request.json();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Check if team exists
    const team = await prisma.team.findUnique({
      where: { id: params.id },
      include: { members: true }
    });

    if (!team) {
      return NextResponse.json(
        { error: 'Team not found' },
        { status: 404 }
      );
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if user is already in a team
    if (user.teamId) {
      return NextResponse.json(
        { error: 'User is already in a team' },
        { status: 400 }
      );
    }

    // Check team capacity
    if (team.members.length >= (team.capacity || 3)) {
      return NextResponse.json(
        { error: 'Team is at full capacity' },
        { status: 400 }
      );
    }

    // Add user to team
    await prisma.user.update({
      where: { id: userId },
      data: { teamId: params.id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error adding member to team:', error);
    return NextResponse.json(
      { error: 'Failed to add member to team' },
      { status: 500 }
    );
  }
}

// DELETE - Remove member from team
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await request.json();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Check if team exists
    const team = await prisma.team.findUnique({
      where: { id: params.id }
    });

    if (!team) {
      return NextResponse.json(
        { error: 'Team not found' },
        { status: 404 }
      );
    }

    // Check if user exists and is in this team
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    if (user.teamId !== params.id) {
      return NextResponse.json(
        { error: 'User is not in this team' },
        { status: 400 }
      );
    }

    // Remove user from team
    await prisma.user.update({
      where: { id: userId },
      data: { teamId: null }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing member from team:', error);
    return NextResponse.json(
      { error: 'Failed to remove member from team' },
      { status: 500 }
    );
  }
}

