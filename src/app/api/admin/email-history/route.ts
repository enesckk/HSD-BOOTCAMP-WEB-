import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - E-posta geçmişini listele
export async function GET(request: NextRequest) {
  try {
    const campaigns = await (prisma as any).emailCampaign.findMany({
      include: {
        recipients: {
          select: {
            id: true,
            status: true,
            sentAt: true,
            user: {
              select: {
                fullName: true,
                email: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10
    });

    const history = campaigns.map((campaign: any) => ({
      id: campaign.id,
      subject: campaign.subject,
      recipientCount: campaign.recipients.length,
      sentAt: campaign.createdAt,
      status: campaign.status,
      recipients: campaign.recipients
    }));

    return NextResponse.json({
      success: true,
      history: history,
    });
  } catch (error) {
    console.error('Error fetching email history:', error);
    return NextResponse.json(
      { error: 'E-posta geçmişi getirilemedi' },
      { status: 500 }
    );
  }
}