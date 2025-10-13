import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const presentation = await prisma.presentation.findUnique({
      where: { id },
    });

    if (!presentation) {
      return NextResponse.json({ error: 'Presentation not found' }, { status: 404 });
    }

    return NextResponse.json(presentation);
  } catch (error) {
    console.error('Error fetching presentation:', error);
    return NextResponse.json(
      { error: 'Failed to fetch presentation' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { status } = await request.json();
    
    console.log('Presentation update request:', { id, status });

    if (!status || !['pending', 'approved', 'rejected'].includes(status)) {
      console.log('Invalid status received:', status);
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    console.log('Updating presentation with status:', status);

    const updatedPresentation = await prisma.presentation.update({
      where: { id },
      data: { status },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            teamMembers: {
              include: {
                members: true
              }
            }
          }
        }
      }
    });

    // Sunum onaylandığında veya reddedildiğinde sunum sahibine ve takım üyelerine bildirim gönder
    try {
      if ((status === 'approved' || status === 'rejected') && updatedPresentation.user) {
        // Sunum sahibine bildirim gönder
        const title = status === 'approved' ? 'Sunum Onaylandı' : 'Sunum Reddedildi';
        const message = status === 'approved' 
          ? `"${updatedPresentation.title}" sunumunuz onaylandı`
          : `"${updatedPresentation.title}" sunumunuz reddedildi`;
        
        await prisma.notification.create({
          data: {
            type: 'PRESENTATION',
            title,
            message,
            actionUrl: '/dashboard/presentation',
            userId: updatedPresentation.userId, // Sunum sahibine özel bildirim
            read: false
          }
        });

        // Eğer sunum onaylandıysa, takım üyelerine de bildirim gönder
        if (status === 'approved' && updatedPresentation.user?.teamMembers) {
          const teamMembers = updatedPresentation.user.teamMembers.members;
          
          // Her takım üyesi için bildirim oluştur
          for (const member of teamMembers) {
            if (member.id !== updatedPresentation.userId) { // Sunum sahibi hariç
              await prisma.notification.create({
                data: {
                  type: 'PRESENTATION',
                  title: 'Sunum Onaylandı',
                  message: `${updatedPresentation.user.fullName} tarafından yüklenen "${updatedPresentation.title}" sunumu onaylandı`,
                  actionUrl: '/dashboard/presentation',
                  userId: member.id, // Kişiye özel bildirim
                  read: false
                }
              });
            }
          }
        }
      }
    } catch (notificationError) {
      console.error('Error creating notification:', notificationError);
      // Bildirim hatası sunum güncellemeyi engellemez
    }

    console.log('Presentation updated successfully:', updatedPresentation);
    return NextResponse.json(updatedPresentation);
  } catch (error) {
    console.error('Error updating presentation:', error);
    return NextResponse.json(
      { error: 'Failed to update presentation' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await prisma.presentation.delete({
      where: { id },
    });
    return NextResponse.json({ message: 'Presentation deleted successfully' });
  } catch (error) {
    console.error('Error deleting presentation:', error);
    return NextResponse.json(
      { error: 'Failed to delete presentation' },
      { status: 500 }
    );
  }
}