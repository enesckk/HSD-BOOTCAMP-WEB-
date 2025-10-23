import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('=== TEST API CALLED ===');
    
    return NextResponse.json({
      success: true,
      message: 'Test API çalışıyor',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Test API Error:', error);
    return NextResponse.json({
      success: false,
      error: 'Test API hatası'
    }, { status: 500 });
  }
}
