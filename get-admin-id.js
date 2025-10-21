const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function getAdminId() {
  try {
    const adminUser = await prisma.user.findFirst({
      where: { role: 'ADMIN' },
      select: { id: true, email: true, fullName: true, role: true }
    });

    if (adminUser) {
      console.log('Admin kullanıcısı:', adminUser);
      return adminUser;
    } else {
      console.log('Admin kullanıcısı bulunamadı');
    }
  } catch (error) {
    console.error('Hata:', error);
  } finally {
    await prisma.$disconnect();
  }
}

getAdminId();
