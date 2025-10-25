const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testAnnouncement() {
  try {
    console.log('🧪 Test duyuru oluşturuluyor...');
    
    // Test duyuru oluştur
    const announcement = await prisma.announcement.create({
      data: {
        title: 'Test Duyuru - API Düzeltmesi',
        summary: 'API hataları düzeltildi ve sistem test ediliyor',
        content: 'Bu bir test duyurusudur. API hataları düzeltildi ve sistem çalışıyor.',
        category: 'GENEL',
        date: new Date().toLocaleDateString('tr-TR'),
        time: new Date().toLocaleTimeString('tr-TR'),
        pinned: false
      }
    });

    console.log('✅ Duyuru oluşturuldu:', announcement);

    // Tüm kullanıcıları al
    const allUsers = await prisma.user.findMany({
      select: { id: true, fullName: true, email: true }
    });

    console.log(`📋 ${allUsers.length} kullanıcı bulundu`);

    // Her kullanıcıya bildirim oluştur
    const notificationPromises = allUsers.map(user => 
      prisma.notification.create({
        data: {
          type: 'ANNOUNCEMENT',
          title: 'Yeni Duyuru',
          message: `Test Duyuru - API Düzeltmesi - API hataları düzeltildi ve sistem test ediliyor...`,
          actionUrl: '/dashboard/announcements',
          userId: user.id,
          read: false
        }
      })
    );

    await Promise.all(notificationPromises);
    console.log(`✅ Bildirim gönderildi: ${allUsers.length} kullanıcıya`);

    // Son duyuruları listele
    const recentAnnouncements = await prisma.announcement.findMany({
      orderBy: { createdAt: 'desc' },
      take: 3
    });

    console.log('\n📢 Son Duyurular:');
    recentAnnouncements.forEach((ann, index) => {
      console.log(`${index + 1}. ${ann.title} (${ann.createdAt})`);
    });

  } catch (error) {
    console.error('❌ Hata:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testAnnouncement();
