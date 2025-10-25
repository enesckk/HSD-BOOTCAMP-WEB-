import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Otomatik görev başlatma/bitirme kontrolü
export async function POST(request: NextRequest) {
  try {
    console.log('=== AUTO TASK SCHEDULER START ===');
    
    const now = new Date();
    console.log('Current time:', now.toISOString());
    
    // Başlama zamanı gelmiş görevleri bul ve başlat
    const tasksToStart = await prisma.task.findMany({
      where: {
        status: 'PENDING',
        startDate: {
          lte: now
        },
        startTime: {
          not: null
        }
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true
          }
        }
      }
    });

    console.log('Tasks to start:', tasksToStart.length);
    console.log('Current time:', now.toISOString());

    // Başlama zamanı gelmiş görevleri başlat
    for (const task of tasksToStart) {
      if (task.startDate && task.startTime) {
        const startDateTime = new Date(`${task.startDate.toISOString().split('T')[0]}T${task.startTime}`);
        
        console.log(`Checking task: ${task.id} - ${task.title}`);
        console.log(`Start date: ${task.startDate.toISOString()}`);
        console.log(`Start time: ${task.startTime}`);
        console.log(`Calculated startDateTime: ${startDateTime.toISOString()}`);
        console.log(`Current time: ${now.toISOString()}`);
        console.log(`Should start: ${startDateTime <= now}`);
        
        if (startDateTime <= now) {
          console.log(`Starting task: ${task.id} - ${task.title}`);
          
          await prisma.task.update({
            where: { id: task.id },
            data: { 
              status: 'IN_PROGRESS',
              updatedAt: new Date()
            }
          });

          // Başlama bildirimi oluştur
          if (task.user) {
            await prisma.notification.create({
              data: {
                type: 'TASK_STARTED',
                title: 'Görev Başladı',
                message: `"${task.title}" görevi otomatik olarak başlatıldı.`,
                userId: task.user.id,
                actionUrl: '/dashboard/tasks'
              }
            });
          }
        }
      }
    }

    // Bitiş zamanı gelmiş görevleri bul ve bitir
    const tasksToEnd = await prisma.task.findMany({
      where: {
        status: 'IN_PROGRESS',
        endDate: {
          lte: now
        },
        endTime: {
          not: null
        }
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true
          }
        }
      }
    });

    console.log('Tasks to end:', tasksToEnd.length);

    // Bitiş zamanı gelmiş görevleri bitir
    for (const task of tasksToEnd) {
      if (task.endDate && task.endTime) {
        const endDateTime = new Date(`${task.endDate.toISOString().split('T')[0]}T${task.endTime}`);
        
        if (endDateTime <= now) {
          console.log(`Ending task: ${task.id} - ${task.title}`);
          
          await prisma.task.update({
            where: { id: task.id },
            data: { 
              status: 'COMPLETED',
              updatedAt: new Date()
            }
          });

          // Bitiş bildirimi oluştur
          if (task.user) {
            await prisma.notification.create({
              data: {
                type: 'TASK_COMPLETED',
                title: 'Görev Bitti',
                message: `"${task.title}" görevi otomatik olarak tamamlandı.`,
                userId: task.user.id,
                actionUrl: '/dashboard/tasks'
              }
            });
          }
        }
      }
    }

    // Yaklaşan görevler için uyarı bildirimleri
    const upcomingTasks = await prisma.task.findMany({
      where: {
        status: 'PENDING',
        startDate: {
          gte: now,
          lte: new Date(now.getTime() + 24 * 60 * 60 * 1000) // 24 saat içinde
        }
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true
          }
        }
      }
    });

    console.log('Upcoming tasks:', upcomingTasks.length);

    // Yaklaşan görevler için uyarı bildirimleri oluştur
    for (const task of upcomingTasks) {
      if (task.startDate && task.startTime) {
        const startDateTime = new Date(`${task.startDate.toISOString().split('T')[0]}T${task.startTime}`);
        const timeUntilStart = startDateTime.getTime() - now.getTime();
        
        // 1 saat kala uyarı
        if (timeUntilStart <= 60 * 60 * 1000 && timeUntilStart > 0) {
          const existingNotification = await prisma.notification.findFirst({
            where: {
              userId: task.user?.id,
              title: 'Görev Başlayacak',
              message: {
                contains: task.title
              },
              createdAt: {
                gte: new Date(now.getTime() - 60 * 60 * 1000) // Son 1 saat içinde
              }
            }
          });

          if (!existingNotification && task.user) {
            await prisma.notification.create({
              data: {
                type: 'TASK_REMINDER',
                title: 'Görev Başlayacak',
                message: `"${task.title}" görevi 1 saat içinde başlayacak.`,
                userId: task.user.id,
                actionUrl: '/dashboard/tasks'
              }
            });
          }
        }
      }
    }

    console.log('=== AUTO TASK SCHEDULER COMPLETED ===');

    return NextResponse.json({
      success: true,
      message: 'Otomatik görev kontrolü tamamlandı',
      stats: {
        started: tasksToStart.length,
        ended: tasksToEnd.length,
        upcoming: upcomingTasks.length
      }
    });

  } catch (error) {
    console.error('=== AUTO TASK SCHEDULER ERROR ===');
    console.error('Error:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Otomatik görev kontrolü başarısız',
        detail: error instanceof Error ? error.message : 'Bilinmeyen hata'
      },
      { status: 500 }
    );
  }
}

// Manuel görev kontrolü (test için)
export async function GET(request: NextRequest) {
  try {
    const now = new Date();
    
    const pendingTasks = await prisma.task.findMany({
      where: {
        status: 'PENDING',
        startDate: {
          lte: now
        }
      },
      select: {
        id: true,
        title: true,
        startDate: true,
        startTime: true,
        status: true
      }
    });

    const inProgressTasks = await prisma.task.findMany({
      where: {
        status: 'IN_PROGRESS',
        endDate: {
          lte: now
        }
      },
      select: {
        id: true,
        title: true,
        endDate: true,
        endTime: true,
        status: true
      }
    });

    return NextResponse.json({
      success: true,
      currentTime: now.toISOString(),
      pendingTasks,
      inProgressTasks
    });

  } catch (error) {
    console.error('Error getting task status:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Görev durumu alınamadı'
      },
      { status: 500 }
    );
  }
}
