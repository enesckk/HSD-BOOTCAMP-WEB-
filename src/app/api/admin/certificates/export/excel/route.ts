import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { certificates, filters } = await request.json();

    // Excel için CSV formatında basit bir export
    const csvHeaders = [
      'Sıra',
      'Katılımcı Adı',
      'Email',
      'Program',
      'Durum',
      'Tamamlanma Tarihi',
      'Onaylanan Görev',
      'Notlar'
    ];

    const csvRows = certificates.map((cert: any, index: number) => [
      index + 1,
      cert.userName,
      cert.userEmail,
      cert.programName,
      getStatusText(cert.status),
      new Date(cert.completionDate).toLocaleDateString('tr-TR'),
      cert.approvedTasks || 0,
      cert.notes || ''
    ]);

    // CSV içeriğini oluştur
    const csvContent = [
      csvHeaders.join(','),
      ...csvRows.map(row => row.map(field => `"${field}"`).join(','))
    ].join('\n');

    // UTF-8 BOM ekleyerek Türkçe karakterleri destekle
    const csvWithBOM = '\uFEFF' + csvContent;

    const response = new Response(csvWithBOM, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="sertifikalar_${new Date().toISOString().split('T')[0]}.csv"`
      }
    });

    return response;

  } catch (error) {
    console.error('Excel export error:', error);
    return NextResponse.json(
      { error: 'Excel oluşturulurken bir hata oluştu' },
      { status: 500 }
    );
  }
}

function getStatusText(status: string): string {
  switch (status) {
    case 'APPROVED':
      return 'Onaylandı';
    case 'REJECTED':
      return 'Reddedildi';
    case 'PENDING':
      return 'Beklemede';
    case 'UPLOADED':
      return 'Yüklendi';
    default:
      return 'Bilinmiyor';
  }
}
