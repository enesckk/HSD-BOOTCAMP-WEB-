import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');
    const presentations = await prisma.presentation.findMany({
      where: userId ? { userId } : undefined,
      orderBy: { createdAt: 'desc' }
    });
    
    return NextResponse.json({ items: presentations });
  } catch (error) {
    console.error('Error fetching presentations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch presentations' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      userId, 
      teamName, 
      memberNames, 
      title, 
      description, 
      uploadType, 
      fileUrl, 
      linkUrl 
    } = body;

    const presentation = await prisma.presentation.create({
      data: {
        userId,
        teamName,
        memberNames,
        title,
        description,
        uploadType,
        fileUrl,
        linkUrl,
        status: 'pending'
      }
    });

    return NextResponse.json(presentation, { status: 201 });
  } catch (error) {
    console.error('Error creating presentation:', error);
    return NextResponse.json(
      { error: 'Failed to create presentation' },
      { status: 500 }
    );
  }
}
