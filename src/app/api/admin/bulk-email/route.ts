import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendBulkEmail, emailTemplates } from '@/lib/email';

// POST - Toplu mail gönder
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const subject = formData.get('subject') as string;
    const content = formData.get('content') as string;
    const type = formData.get('type') as string;
    const participants = JSON.parse(formData.get('participants') as string);
    
    // Dosya eklerini işle
    const attachments: { name: string; data: Buffer; type: string }[] = [];
    for (const [key, value] of formData.entries()) {
      if (key.startsWith('attachment_') && value instanceof File) {
        const buffer = Buffer.from(await value.arrayBuffer());
        attachments.push({
          name: value.name,
          data: buffer,
          type: value.type,
        });
      }
    }

    // Gerekli alanları kontrol et
    if (!subject || !content || !participants || participants.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Gerekli alanlar eksik' },
        { status: 400 }
      );
    }

    // Katılımcıları getir
    const participantUsers = await prisma.user.findMany({
      where: {
        id: { in: participants },
        isActive: true,
      },
      select: {
        id: true,
        fullName: true,
        email: true,
      },
    });

    if (participantUsers.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Geçerli katılımcı bulunamadı' },
        { status: 400 }
      );
    }

    // E-posta gönderim kaydını oluştur
    const emailRecord = await prisma.emailCampaign.create({
      data: {
        subject,
        content,
        type: type as any,
        recipientCount: participantUsers.length,
        status: 'PENDING',
        attachments: attachments.map(att => ({
          name: att.name,
          type: att.type,
        })),
      },
    });

    // Her katılımcı için e-posta kaydı oluştur
    const emailRecipients = await Promise.all(
      participantUsers.map(user =>
        prisma.emailRecipient.create({
          data: {
            campaignId: emailRecord.id,
            userId: user.id,
            email: user.email,
            fullName: user.fullName,
            status: 'PENDING',
          },
        })
      )
    );

    // Gerçek e-posta gönderimi
    const emailResults = await sendBulkEmail({
      recipients: participantUsers,
      subject,
      html: content,
      attachments: attachments.map(att => ({
        filename: att.name,
        content: att.data,
        contentType: att.type,
      })),
    });

    // Başarılı gönderimleri say
    const successfulSends = emailResults.filter(result => result.success).length;
    const failedSends = emailResults.filter(result => !result.success).length;

    console.log(`E-posta kampanyası tamamlandı: ${emailRecord.id}`);
    console.log(`Başarılı: ${successfulSends}, Başarısız: ${failedSends}`);

    // E-posta durumunu güncelle
    const campaignStatus = failedSends === 0 ? 'SENT' : (successfulSends > 0 ? 'PARTIAL' : 'FAILED');
    
    await prisma.emailCampaign.update({
      where: { id: emailRecord.id },
      data: { 
        status: campaignStatus,
        sentAt: new Date(),
      },
    });

    // Her alıcı için durumu güncelle
    for (const result of emailResults) {
      await prisma.emailRecipient.updateMany({
        where: { 
          campaignId: emailRecord.id,
          email: result.email,
        },
        data: { 
          status: result.success ? 'SENT' : 'FAILED',
          sentAt: result.success ? new Date() : null,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: 'E-postalar başarıyla gönderildi',
      campaignId: emailRecord.id,
      recipientCount: participantUsers.length,
    });
  } catch (error) {
    console.error('Error sending bulk email:', error);
    return NextResponse.json(
      { success: false, error: 'E-posta gönderilirken hata oluştu' },
      { status: 500 }
    );
  }
}

// GET - E-posta geçmişi
export async function GET(request: NextRequest) {
  try {
    const campaigns = await prisma.emailCampaign.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
    });

    return NextResponse.json({
      success: true,
      campaigns: campaigns.map(campaign => ({
        id: campaign.id,
        subject: campaign.subject,
        type: campaign.type,
        recipientCount: campaign.recipientCount,
        status: campaign.status,
        sentAt: campaign.sentAt,
        createdAt: campaign.createdAt,
      })),
    });
  } catch (error) {
    console.error('Error fetching email history:', error);
    return NextResponse.json(
      { success: false, error: 'E-posta geçmişi getirilemedi' },
      { status: 500 }
    );
  }
}
