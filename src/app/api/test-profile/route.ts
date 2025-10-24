import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('=== TEST API CALLED ===');
    
    const body = await request.json();
    console.log('Request body:', body);
    
    return NextResponse.json({ 
      message: 'Test API çalışıyor',
      receivedData: body 
    });
    
  } catch (error) {
    console.error('Test API error:', error);
    return NextResponse.json({ 
      message: 'Test API hatası',
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
