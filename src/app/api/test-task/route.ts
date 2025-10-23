import { NextResponse } from 'next/server';

export async function POST() {
  console.log('=== TEST TASK API CALLED ===');
  
  try {
    const testTask = {
      id: 'test-' + Date.now(),
      title: 'Test Görevi',
      description: 'Bu bir test görevidir',
      status: 'COMPLETED',
      uploadType: 'FILE',
      fileUrl: '/uploads/test-file.pdf',
      linkUrl: null,
      notes: 'Test notu',
      userId: 'test-user',
      huaweiCloudAccount: 'test_account',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    console.log('Test task created:', testTask);

    return NextResponse.json({
      success: true,
      task: testTask,
      message: 'Test görevi oluşturuldu'
    });
    
  } catch (error) {
    console.error('Test task error:', error);
    return NextResponse.json({
      success: false,
      error: 'Test görevi oluşturulamadı'
    }, { status: 500 });
  }
}
