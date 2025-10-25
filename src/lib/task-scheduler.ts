import { prisma } from './prisma';

export interface TaskSchedulerConfig {
  checkInterval: number; // dakika cinsinden
  enableNotifications: boolean;
  enableAutoStart: boolean;
  enableAutoEnd: boolean;
}

export class TaskScheduler {
  private config: TaskSchedulerConfig;
  private intervalId: NodeJS.Timeout | null = null;
  private isRunning: boolean = false;

  constructor(config: TaskSchedulerConfig) {
    this.config = config;
  }

  /**
   * Scheduler'ı başlat
   */
  public start(): void {
    if (this.isRunning) {
      console.log('Task scheduler is already running');
      return;
    }

    console.log(`Starting task scheduler with ${this.config.checkInterval} minute intervals`);
    
    this.isRunning = true;
    this.intervalId = setInterval(async () => {
      await this.checkAndUpdateTasks();
    }, this.config.checkInterval * 60 * 1000); // dakikayı milisaniyeye çevir

    // İlk kontrolü hemen yap
    this.checkAndUpdateTasks();
  }

  /**
   * Scheduler'ı durdur
   */
  public stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning = false;
    console.log('Task scheduler stopped');
  }

  /**
   * Görevleri kontrol et ve güncelle
   */
  private async checkAndUpdateTasks(): Promise<void> {
    try {
      console.log('=== TASK SCHEDULER CHECK ===');
      const now = new Date();
      console.log('Current time:', now.toISOString());

      if (this.config.enableAutoStart) {
        await this.startPendingTasks(now);
      }

      if (this.config.enableAutoEnd) {
        await this.endInProgressTasks(now);
      }

      if (this.config.enableNotifications) {
        await this.sendUpcomingTaskNotifications(now);
      }

      console.log('=== TASK SCHEDULER CHECK COMPLETED ===');
    } catch (error) {
      console.error('Task scheduler error:', error);
    }
  }

  /**
   * Başlama zamanı gelmiş görevleri başlat
   */
  private async startPendingTasks(now: Date): Promise<void> {
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

    console.log(`Found ${tasksToStart.length} tasks to start`);

    for (const task of tasksToStart) {
      if (task.startDate && task.startTime) {
        const startDateTime = new Date(`${task.startDate.toISOString().split('T')[0]}T${task.startTime}`);
        
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
          if (task.user && this.config.enableNotifications) {
            await this.createNotification(
              task.user.id,
              'TASK_STARTED',
              'Görev Başladı',
              `"${task.title}" görevi otomatik olarak başlatıldı.`,
              '/dashboard/tasks'
            );
          }
        }
      }
    }
  }

  /**
   * Bitiş zamanı gelmiş görevleri bitir
   */
  private async endInProgressTasks(now: Date): Promise<void> {
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

    console.log(`Found ${tasksToEnd.length} tasks to end`);

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
          if (task.user && this.config.enableNotifications) {
            await this.createNotification(
              task.user.id,
              'TASK_COMPLETED',
              'Görev Bitti',
              `"${task.title}" görevi otomatik olarak tamamlandı.`,
              '/dashboard/tasks'
            );
          }
        }
      }
    }
  }

  /**
   * Yaklaşan görevler için bildirim gönder
   */
  private async sendUpcomingTaskNotifications(now: Date): Promise<void> {
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

    console.log(`Found ${upcomingTasks.length} upcoming tasks`);

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
            await this.createNotification(
              task.user.id,
              'TASK_REMINDER',
              'Görev Başlayacak',
              `"${task.title}" görevi 1 saat içinde başlayacak.`,
              '/dashboard/tasks'
            );
          }
        }
      }
    }
  }

  /**
   * Bildirim oluştur
   */
  private async createNotification(
    userId: string,
    type: string,
    title: string,
    message: string,
    actionUrl: string
  ): Promise<void> {
    try {
      await prisma.notification.create({
        data: {
          type: type as any,
          title,
          message,
          userId,
          actionUrl
        }
      });
      console.log(`Notification created for user ${userId}: ${title}`);
    } catch (error) {
      console.error('Error creating notification:', error);
    }
  }

  /**
   * Scheduler durumunu al
   */
  public getStatus(): { isRunning: boolean; config: TaskSchedulerConfig } {
    return {
      isRunning: this.isRunning,
      config: this.config
    };
  }
}

// Singleton instance
let taskScheduler: TaskScheduler | null = null;

export function getTaskScheduler(): TaskScheduler {
  if (!taskScheduler) {
    taskScheduler = new TaskScheduler({
      checkInterval: 5, // 5 dakikada bir kontrol et
      enableNotifications: true,
      enableAutoStart: true,
      enableAutoEnd: true
    });
  }
  return taskScheduler;
}

export function startTaskScheduler(): void {
  const scheduler = getTaskScheduler();
  scheduler.start();
}

export function stopTaskScheduler(): void {
  if (taskScheduler) {
    taskScheduler.stop();
  }
}

