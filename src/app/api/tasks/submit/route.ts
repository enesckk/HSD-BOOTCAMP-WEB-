import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

// POST - Görev teslimi yap
export async function POST(request: NextRequest) {
  console.log('=== SUBMIT TASK API CALLED ===');
  
  try {
    const formData = await request.formData();
    const taskId = formData.get('taskId') as string;
    const userId = formData.get('userId') as string;
    const uploadType = formData.get('uploadType') as string;
    const file = formData.get('file') as File;
    const linkUrl = formData.get('fileUrl') as string; // Frontend'de fileUrl olarak gönderiliyor
    const notes = formData.get('notes') as string;

    console.log('Form data received:', {
      taskId,
      userId,
      uploadType,
      fileName: file?.name,
      linkUrl,
      notes
    });

    // Tüm form data'yı logla
    console.log('All form data keys:');
    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    if (!taskId || !userId) {
      console.log('Validation failed: Missing taskId or userId');
      return NextResponse.json(
        { success: false, error: 'Görev ID ve kullanıcı ID gereklidir' },
        { status: 400 }
      );
    }

    // Dosya yükleme işlemi
    let fileUrl = null;
    let linkUrlValue = null;
    
    if ((uploadType === 'FILE' || uploadType === 'file') && file) {
      try {
        // Uploads klasörünü oluştur
        const uploadsDir = join(process.cwd(), 'public', 'uploads');
        await mkdir(uploadsDir, { recursive: true });
        
        // Dosya adını oluştur
        const fileName = `${Date.now()}-${file.name}`;
        const filePath = join(uploadsDir, fileName);
        
        // Dosyayı yaz
        const bytes = await file.arrayBuffer();
        await writeFile(filePath, Buffer.from(bytes));
        
        fileUrl = `/uploads/${fileName}`;
        console.log('File uploaded successfully:', fileUrl);
      } catch (fileError) {
        console.error('File upload error:', fileError);
        return NextResponse.json(
          { success: false, error: 'Dosya yüklenemedi' },
          { status: 500 }
        );
      }
    } else if ((uploadType === 'LINK' || uploadType === 'link') && linkUrl) {
      linkUrlValue = linkUrl;
    }

    // Orijinal görevi bul
    const originalTask = await prisma.task.findUnique({
      where: { id: taskId },
      select: { title: true, description: true }
    });

    if (!originalTask) {
      return NextResponse.json(
        { success: false, error: 'Görev bulunamadı' },
        { status: 404 }
      );
    }

    // Gerçek veritabanına görev oluştur
    console.log('Creating task in database...');
    const submittedTask = await prisma.task.create({
      data: {
        title: originalTask.title,
        description: originalTask.description,
        status: 'SUBMITTED', // Teslim edildi status'u - Prisma schema'da tanımlı
        uploadType: uploadType === 'file' ? 'FILE' : 'LINK',
        fileUrl: fileUrl,
        linkUrl: linkUrlValue,
        notes: notes || '',
        userId: userId,
        huaweiCloudAccount: formData.get('huaweiCloudAccount') as string || '',
        startDate: new Date(),
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 1 hafta sonra
      }
    });
    console.log('Task created in database:', submittedTask);

    console.log('Task submitted successfully:', submittedTask);

    return NextResponse.json({ 
      success: true, 
      task: submittedTask,
      message: 'Görev başarıyla teslim edildi'
    });
    
  } catch (error) {
    console.error('=== SUBMIT TASK ERROR ===');
    console.error('Error:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Görev teslim edilemedi',
        detail: error instanceof Error ? error.message : 'Bilinmeyen hata'
      },
      { status: 500 }
    );
  }
}
