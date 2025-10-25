import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Sertifika almaya hak kazanan katılımcıları listele
export async function GET(request: NextRequest) {
  try {
    // Tüm katılımcıları ve görev durumlarını getir
    const participants = await prisma.user.findMany({
      where: {
        role: 'PARTICIPANT'
      },
      include: {
        tasks: {
          where: {
            status: 'APPROVED' // Onaylanmış görevler
          }
        }
      },
      orderBy: {
        fullName: 'asc'
      }
    });

    // Her katılımcı için istatistikleri hesapla
    const eligibleParticipants = participants.map(participant => {
      const approvedTasks = participant.tasks.length;
      const totalTasks = participant.tasks.length; // Burada toplam görev sayısını da hesaplayabiliriz
      
      return {
        id: participant.id,
        fullName: participant.fullName,
        email: participant.email,
        approvedTasks: approvedTasks,
        totalTasks: totalTasks, // Bu alanı daha sonra hesaplayabiliriz
        completionRate: totalTasks > 0 ? (approvedTasks / totalTasks) * 100 : 0,
        lastActivity: participant.updatedAt,
        isEligible: approvedTasks >= 1 // En az 1 onaylanmış görev
      };
    });

    // Sadece hak kazananları filtrele
    const eligible = eligibleParticipants.filter(p => p.isEligible);

    return NextResponse.json({
      success: true,
      participants: eligible,
      totalEligible: eligible.length,
      totalParticipants: participants.length
    });
  } catch (error) {
    console.error('Error fetching eligible participants:', error);
    return NextResponse.json(
      { error: 'Hak kazanan katılımcılar getirilemedi' },
      { status: 500 }
    );
  }
}

// POST - Toplu sertifika oluştur
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { participantIds, programName, criteria } = body;

    if (!participantIds || !Array.isArray(participantIds) || participantIds.length === 0) {
      return NextResponse.json(
        { error: 'Katılımcı seçimi gerekli' },
        { status: 400 }
      );
    }

    if (!programName) {
      return NextResponse.json(
        { error: 'Program adı gerekli' },
        { status: 400 }
      );
    }

    const certificates = [];
    const completionDate = new Date();

    for (const participantId of participantIds) {
      // Katılımcı bilgilerini al
      const participant = await prisma.user.findUnique({
        where: { id: participantId },
        include: {
          tasks: {
            where: { status: 'APPROVED' }
          }
        }
      });

      if (participant) {
        const certificate = await prisma.certificate.create({
          data: {
            userId: participantId,
            programName: programName,
            completionDate: completionDate,
            status: 'PENDING',
            notes: `Kriterler: ${criteria || 'En az 1 onaylanmış görev'}`
          }
        });

        certificates.push({
          id: certificate.id,
          userId: participantId,
          userName: participant.fullName,
          userEmail: participant.email,
          programName: programName,
          completionDate: completionDate.toISOString(),
          status: 'PENDING',
          approvedTasks: participant.tasks.length
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: `${certificates.length} sertifika oluşturuldu`,
      certificates: certificates
    });
  } catch (error) {
    console.error('Error creating bulk certificates:', error);
    return NextResponse.json(
      { error: 'Sertifikalar oluşturulamadı' },
      { status: 500 }
    );
  }
}

