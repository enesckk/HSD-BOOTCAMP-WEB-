import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Kullanıcının görevlerini getir
export async function GET(request: NextRequest) {
  console.log('=== GET USER TASKS API CALLED ===');
  
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    console.log('User ID:', userId);
    
    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'Kullanıcı ID gereklidir'
      }, { status: 400 });
    }
    
    // Kullanıcının görevlerini getir
    const tasks = await prisma.task.findMany({
      where: {
        userId: userId
      },
      orderBy: { createdAt: 'desc' }
    });
    
    console.log('User tasks found:', tasks.length);
    
    return NextResponse.json({
      success: true,
      tasks,
      count: tasks.length
    });
    
  } catch (error) {
    console.error('=== GET USER TASKS ERROR ===');
    console.error('Error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Görevler getirilemedi',
      detail: error instanceof Error ? error.message : 'Bilinmeyen hata'
    }, { status: 500 });
  }
}