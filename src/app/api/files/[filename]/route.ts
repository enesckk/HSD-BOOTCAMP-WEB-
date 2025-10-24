import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;
    const filePath = join(process.cwd(), 'public', 'uploads', filename);
    
    console.log('Requested filename:', filename);
    console.log('File path:', filePath);
    console.log('File exists:', existsSync(filePath));
    
    // Check if file exists
    if (!existsSync(filePath)) {
      console.log('File not found at path:', filePath);
      return NextResponse.json(
        { error: 'Dosya bulunamadı', path: filePath },
        { status: 404 }
      );
    }
    
    // Read file
    const fileBuffer = await readFile(filePath);
    
    // Get file extension to determine MIME type
    const extension = filename.split('.').pop()?.toLowerCase();
    let contentType = 'application/octet-stream'; // Default
    
    switch (extension) {
      case 'pdf':
        contentType = 'application/pdf';
        break;
      case 'doc':
        contentType = 'application/msword';
        break;
      case 'docx':
        contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        break;
      case 'zip':
        contentType = 'application/zip';
        break;
      case 'rar':
        contentType = 'application/x-rar-compressed';
        break;
      case 'txt':
        contentType = 'text/plain';
        break;
      case 'jpg':
      case 'jpeg':
        contentType = 'image/jpeg';
        break;
      case 'png':
        contentType = 'image/png';
        break;
      case 'gif':
        contentType = 'image/gif';
        break;
    }
    
    // Return file with proper headers
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`,
        'Content-Length': fileBuffer.length.toString(),
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error) {
    console.error('File download error:', error);
    return NextResponse.json(
      { error: 'Dosya indirilemedi' },
      { status: 500 }
    );
  }
}
