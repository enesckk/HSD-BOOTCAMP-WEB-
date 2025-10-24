import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

// PUT - Görev güncelleme
export async function PUT(request: NextRequest) {
  console.log('=== UPDATE TASK API CALLED ===');
  
  try {
    const formData = await request.formData();
    const editingTaskId = formData.get('editingTaskId') as string; // Güncellenecek görev ID'si
    const userId = formData.get('userId') as string;
    const uploadType = formData.get('uploadType') as string;
    const file = formData.get('file') as File;
    const linkUrl = formData.get('fileUrl') as string;
    const notes = formData.get('notes') as string;

    console.log('Form data received:', {
      editingTaskId,
      userId,
      uploadType,
      fileName: file?.name,
      linkUrl,
      notes
    });

    if (!editingTaskId || !userId) {
      console.log('Validation failed: Missing editingTaskId or userId');
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

    // Görevi güncelle
    console.log('Updating task in database...');
    const updatedTask = await prisma.task.update({
      where: { id: editingTaskId },
      data: {
        uploadType: uploadType === 'file' ? 'FILE' : 'LINK',
        fileUrl: fileUrl,
        linkUrl: linkUrlValue,
        notes: notes || '',
        huaweiCloudAccount: formData.get('huaweiCloudAccount') as string || '',
        updatedAt: new Date()
      }
    });
    
    console.log('Task updated in database:', updatedTask);

    return NextResponse.json({ 
      success: true, 
      task: updatedTask,
      message: 'Görev başarıyla güncellendi'
    });
    
  } catch (error) {
    console.error('=== UPDATE TASK ERROR ===');
    console.error('Error:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Görev güncellenemedi', 
        detail: error instanceof Error ? error.message : 'Bilinmeyen hata'
      },
      { status: 500 }
    );
  }
}
