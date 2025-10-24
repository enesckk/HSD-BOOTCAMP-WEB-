import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Kullanıcılar için mevcut görevleri getir
export async function GET() {
  console.log('=== GET AVAILABLE TASKS API CALLED ===');
  
  try {
    // Admin tarafından oluşturulan görevleri getir (userId null olanlar)
    const availableTasks = await prisma.task.findMany({
      where: {
        userId: null, // Admin görevleri
        status: 'PENDING' // Sadece bekleyen görevler
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    console.log('Available tasks found:', availableTasks.length);
    
    return NextResponse.json({
      success: true,
      tasks: availableTasks,
      count: availableTasks.length,
      message: 'Mevcut görevler başarıyla getirildi'
    });
    
  } catch (error) {
    console.error('=== GET AVAILABLE TASKS ERROR ===');
    console.error('Error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Görevler getirilemedi',
      detail: error instanceof Error ? error.message : 'Bilinmeyen hata'
    }, { status: 500 });
  }
}











