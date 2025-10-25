import { NextRequest, NextResponse } from 'next/server';
import { getTaskScheduler, startTaskScheduler, stopTaskScheduler } from '@/lib/task-scheduler';

// Scheduler'ı başlat
export async function POST(request: NextRequest) {
  try {
    console.log('=== STARTING TASK SCHEDULER ===');
    
    startTaskScheduler();
    
    return NextResponse.json({
      success: true,
      message: 'Görev scheduler başlatıldı'
    });
  } catch (error) {
    console.error('Error starting task scheduler:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Scheduler başlatılamadı'
      },
      { status: 500 }
    );
  }
}

// Scheduler'ı durdur
export async function DELETE(request: NextRequest) {
  try {
    console.log('=== STOPPING TASK SCHEDULER ===');
    
    stopTaskScheduler();
    
    return NextResponse.json({
      success: true,
      message: 'Görev scheduler durduruldu'
    });
  } catch (error) {
    console.error('Error stopping task scheduler:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Scheduler durdurulamadı'
      },
      { status: 500 }
    );
  }
}

// Scheduler durumunu al
export async function GET(request: NextRequest) {
  try {
    const scheduler = getTaskScheduler();
    const status = scheduler.getStatus();
    
    return NextResponse.json({
      success: true,
      status
    });
  } catch (error) {
    console.error('Error getting scheduler status:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Scheduler durumu alınamadı'
      },
      { status: 500 }
    );
  }
}
