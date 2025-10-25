import { NextRequest, NextResponse } from 'next/server';
import { startTaskScheduler } from '@/lib/task-scheduler';

// Next.js başlangıcında scheduler'ı otomatik başlat
export async function GET(request: NextRequest) {
  try {
    console.log('=== INITIALIZING TASK SCHEDULER ===');
    
    // Scheduler'ı başlat
    startTaskScheduler();
    
    return NextResponse.json({
      success: true,
      message: 'Görev scheduler otomatik başlatıldı'
    });
  } catch (error) {
    console.error('Error initializing scheduler:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Scheduler başlatılamadı'
      },
      { status: 500 }
    );
  }
}

