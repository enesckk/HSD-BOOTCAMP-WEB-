import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');
    const includeTeam = request.nextUrl.searchParams.get('includeTeam') === 'true';
    
    let presentations;
    
    if (includeTeam && userId) {
      // Kullanıcının takımını bul
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { team: { include: { members: true } } }
      });
      
      if (user?.team) {
        // Takım üyelerinin ID'lerini al
        const teamMemberIds = user.team.members.map(member => member.id);
        
        // Takım üyelerinin sunumlarını getir
        presentations = await prisma.presentation.findMany({
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
        // Takımı yoksa sadece kendi sunumlarını getir
        presentations = await prisma.presentation.findMany({
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
      // Normal kullanıcı sunumları
      presentations = await prisma.presentation.findMany({
        where: userId ? { userId } : undefined,
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
    const formData = await request.formData();
    
    const userId = formData.get('userId') as string;
    const teamName = formData.get('teamName') as string;
    const memberNames = formData.get('memberNames') as string;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const uploadType = formData.get('uploadType') as string;
    const fileUrl = formData.get('fileUrl') as string;
    const file = formData.get('file') as File | null;
    
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
        console.log('Presentation file upload started:', file.name, file.size, file.type);
        
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
        
        console.log('Presentation upload path:', uploadPath);
        
        // Ensure uploads directory exists
        await mkdir(join(process.cwd(), 'public', 'uploads'), { recursive: true });
        
        // Write file to disk
        await writeFile(uploadPath, buffer);
        
        console.log('Presentation file written successfully:', fileName);
        
        // Set the file URL
        finalFileUrl = `/uploads/${fileName}`;
      } catch (fileError) {
        console.error('Presentation file upload error:', fileError);
        return NextResponse.json(
          { error: 'Dosya yüklenemedi', details: fileError.message },
          { status: 500 }
        );
      }
    }

    const presentation = await prisma.presentation.create({
      data: {
        userId,
        teamName,
        memberNames,
        title,
        description,
        uploadType: uploadType.toUpperCase(),
        fileUrl: finalFileUrl,
        status: 'PENDING'
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

    // Sunum yüklendiğinde admin paneli için bildirim oluştur
    try {
      await prisma.notification.create({
        data: {
          type: 'ADMIN_PRESENTATION',
          title: 'Yeni Sunum Yüklendi',
          message: `${presentation.user?.fullName || 'Bir kullanıcı'} tarafından "${title}" sunumu yüklendi`,
          actionUrl: '/admin/presentations',
          read: false
        }
      });
    } catch (notificationError) {
      console.error('Error creating admin notification:', notificationError);
      // Bildirim hatası sunum oluşturmayı engellemez
    }

    // Sunum yüklendiğinde takım üyelerine bildirim gönder
    try {
      // Kullanıcının takımını bul
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { 
          teamMembers: {
            include: {
              members: true
            }
          }
        }
      });

      if (user?.teamMembers) {
        const teamMembers = user.teamMembers.members;
        
        // Her takım üyesi için bildirim oluştur
        for (const member of teamMembers) {
          if (member.id !== userId) { // Sunum sahibi hariç
            await prisma.notification.create({
              data: {
                type: 'PRESENTATION',
                title: 'Yeni Sunum Yüklendi',
                message: `${user.fullName} tarafından "${title}" sunumu yüklendi`,
                actionUrl: '/dashboard/presentation',
                read: false
              }
            });
          }
        }
      }
    } catch (notificationError) {
      console.error('Error creating team notifications:', notificationError);
      // Bildirim hatası sunum oluşturmayı engellemez
    }

    return NextResponse.json(presentation, { status: 201 });
  } catch (error) {
    console.error('Error creating presentation:', error);
    return NextResponse.json(
      { error: 'Failed to create presentation' },
      { status: 500 }
    );
  }
}
