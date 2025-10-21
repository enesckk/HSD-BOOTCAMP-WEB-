import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');
    const includeTeam = request.nextUrl.searchParams.get('includeTeam') === 'true';
    
    console.log('Tasks API - userId:', userId, 'includeTeam:', includeTeam);
    
    let tasks;
    
    if (includeTeam && userId) {
      // Kullanıcının takımını bul
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { teamMembers: { include: { members: true } } }
      });
      
      if (user?.teamMembers) {
        // Takım üyelerinin ID'lerini al
        const teamMemberIds = user.teamMembers.members.map(member => member.id);
        
        // Takım üyelerinin görevlerini getir
        tasks = await prisma.task.findMany({
          where: { userId: { in: teamMemberIds } },
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                teamRole: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        });
      } else {
        // Takımı yoksa sadece kendi görevlerini getir
        tasks = await prisma.task.findMany({
          where: { userId },
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                teamRole: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        });
      }
    } else {
      // Normal kullanıcı görevleri - tüm görevleri getir ama tarih kontrolü yap
      console.log('Fetching tasks for userId:', userId);
      const allTasks = await prisma.task.findMany({
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              email: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });
      
      // Tarih kontrolü yap - sadece başlama tarihi gelmiş olanlar aktif
      const now = new Date();
      tasks = allTasks.map(task => ({
        ...task,
        isActive: !task.startDate || new Date(task.startDate) <= now,
        canSubmit: !task.startDate || new Date(task.startDate) <= now
      }));
      
      console.log('Found tasks:', tasks.length);
    }
    
    return NextResponse.json({ items: tasks });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const huaweiCloudAccount = formData.get('huaweiCloudAccount') as string;
    const uploadType = formData.get('uploadType') as string;
    const fileUrl = formData.get('fileUrl') as string;
    const file = formData.get('file') as File | null;
    const startDate = formData.get('startDate') as string;
    const dueDate = formData.get('dueDate') as string;
    const priority = formData.get('priority') as string;
    
    // Get user ID from headers or session (you might need to implement proper auth)
    const userId = formData.get('userId') as string;
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    let finalFileUrl = fileUrl;
    
    // If file is uploaded, handle file storage
    if (file && uploadType === 'file') {
      try {
        console.log('File upload started:', file.name, file.size, file.type);
        
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        
        // Create unique filename with timestamp while preserving extension
        const timestamp = Date.now();
        const fileExtension = file.name.split('.').pop();
        const baseName = file.name.replace(/\.[^/.]+$/, ""); // Remove extension
        // Replace spaces and special characters with underscores
        const cleanBaseName = baseName.replace(/[^a-zA-Z0-9]/g, '_');
        const fileName = `${timestamp}_${cleanBaseName}.${fileExtension}`;
        const uploadPath = join(process.cwd(), 'public', 'uploads', fileName);
        
        console.log('Upload path:', uploadPath);
        
        // Ensure uploads directory exists
        await mkdir(join(process.cwd(), 'public', 'uploads'), { recursive: true });
        
        // Write file to disk
        await writeFile(uploadPath, buffer);
        
        console.log('File written successfully:', fileName);
        
        // Set the file URL
        finalFileUrl = `/uploads/${fileName}`;
      } catch (fileError) {
        console.error('File upload error:', fileError);
        return NextResponse.json(
          { error: 'Dosya yüklenemedi', details: fileError.message },
          { status: 500 }
        );
      }
    }

    // Tarih kontrolü ve durum belirleme
    const now = new Date();
    const startDateObj = startDate ? new Date(startDate) : null;
    const dueDateObj = dueDate ? new Date(dueDate) : null;
    
    // Başlama tarihi geçmişse veya bugünse aktif, gelecekteyse beklemede
    let taskStatus = 'PENDING';
    if (startDateObj && startDateObj <= now) {
      taskStatus = 'ACTIVE';
    } else if (!startDateObj) {
      taskStatus = 'ACTIVE'; // Başlama tarihi yoksa hemen aktif
    }

    const task = await prisma.task.create({
      data: {
        userId,
        title,
        description,
        huaweiCloudAccount,
        uploadType: uploadType.toUpperCase(),
        fileUrl: finalFileUrl,
        status: taskStatus,
        startDate: startDateObj,
        dueDate: dueDateObj,
        priority: priority || 'MEDIUM'
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true
          }
        }
      }
    });

    // Görev yüklendiğinde admin paneli için bildirim oluştur
    try {
      await prisma.notification.create({
        data: {
          type: 'ADMIN_TASK',
          title: 'Yeni Görev Yüklendi',
          message: `${task.user?.fullName || 'Bir kullanıcı'} tarafından "${title}" görevi yüklendi`,
          actionUrl: '/admin/tasks',
          read: false
        }
      });
    } catch (notificationError) {
      console.error('Error creating admin notification:', notificationError);
      // Bildirim hatası görev oluşturmayı engellemez
    }

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    );
  }
}
