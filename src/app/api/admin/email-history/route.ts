import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - E-posta geçmişi
export async function GET(request: NextRequest) {
  try {
    const campaigns = await prisma.emailCampaign.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: 50,
      include: {
        recipients: {
          select: {
            id: true,
            email: true,
            fullName: true,
            status: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      history: campaigns.map(campaign => ({
        id: campaign.id,
        subject: campaign.subject,
        type: campaign.type,
        recipientCount: campaign.recipientCount,
        status: campaign.status,
        sentAt: campaign.sentAt,
        createdAt: campaign.createdAt,
        recipients: campaign.recipients,
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
