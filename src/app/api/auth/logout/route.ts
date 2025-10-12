import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Gerçek projede burada token'ı blacklist'e ekleyebiliriz
    // Şimdilik sadece başarılı response döndürüyoruz
    
    return NextResponse.json({
      message: 'Başarıyla çıkış yapıldı'
    });

  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { message: 'Sunucu hatası' },
      { status: 500 }
    );
  }
}






