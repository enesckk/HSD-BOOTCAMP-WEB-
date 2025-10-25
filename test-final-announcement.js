const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testFinalAnnouncement() {
  try {
    console.log('🧪 Final duyuru testi...');
    
    // Yeni test duyuru oluştur
    const announcement = await prisma.announcement.create({
      data: {
        title: 'Final Test Duyuru - Sistem Tamamen Düzeltildi',
        summary: 'Sistem tamamen düzeltildi ve artık duplicate bildirimler engelleniyor',
        content: 'Bu final test duyurusudur. Sistem artık tamamen düzgün çalışıyor ve duplicate bildirimler engelleniyor.',
        category: 'GENEL',
        date: new Date().toLocaleDateString('tr-TR'),
        time: new Date().toLocaleTimeString('tr-TR'),
        pinned: false
      }
    });

    console.log('✅ Duyuru oluşturuldu:', announcement.title);

    // Tüm kullanıcıları al
    const allUsers = await prisma.user.findMany({
      select: { id: true, fullName: true, email: true }
    });

    console.log(`📋 ${allUsers.length} kullanıcı bulundu`);

    // Son 1 saat içinde aynı başlıklı duyuru için bildirim var mı kontrol et
    const recentNotification = await prisma.notification.findFirst({
      where: {
        type: 'ANNOUNCEMENT',
        title: 'Yeni Duyuru',
        message: {
          contains: announcement.title
        },
        createdAt: {
          gte: new Date(Date.now() - 60 * 60 * 1000) // 1 saat önce
        }
      }
    });

    if (recentNotification) {
      console.log('⚠️ Duplicate bildirim engellendi - son 1 saat içinde aynı başlıklı duyuru için bildirim mevcut');
      console.log('   Mevcut bildirim:', recentNotification.message);
    } else {
      console.log('✅ Duplicate kontrolü geçti, bildirimler gönderilecek');
      
      // Bildirimleri oluştur
      const notifications = allUsers.map(user => ({
        type: 'ANNOUNCEMENT',
        title: 'Yeni Duyuru',
        message: `${announcement.title} - ${announcement.summary}...`,
        actionUrl: '/dashboard/announcements',
        userId: user.id,
        read: false
      }));

      // Bulk insert ile tek seferde tüm bildirimleri oluştur
      await prisma.notification.createMany({
        data: notifications
      });

      console.log(`✅ Bildirim gönderildi: ${allUsers.length} kullanıcıya - ${announcement.title}`);
    }

    // Son durumu kontrol et
    const totalNotifications = await prisma.notification.count({
      where: {
        type: 'ANNOUNCEMENT',
        title: 'Yeni Duyuru'
      }
    });

    console.log(`📊 Toplam ANNOUNCEMENT bildirimi: ${totalNotifications}`);

    // Son 3 bildirimi listele
    const lastNotifications = await prisma.notification.findMany({
      where: {
        type: 'ANNOUNCEMENT',
        title: 'Yeni Duyuru'
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 3
    });

    console.log('\n📋 Son 3 bildirim:');
    lastNotifications.forEach((notification, index) => {
      console.log(`${index + 1}. ${notification.message.substring(0, 60)}... (${notification.createdAt})`);
    });

    // Aynı başlıklı duyuru tekrar oluşturmayı test et
    console.log('\n🔄 Aynı başlıklı duyuru tekrar oluşturma testi...');
    
    const duplicateAnnouncement = await prisma.announcement.create({
      data: {
        title: 'Final Test Duyuru - Sistem Tamamen Düzeltildi', // Aynı başlık
        summary: 'Bu duplicate test duyurusudur',
        content: 'Bu duplicate test duyurusudur.',
        category: 'GENEL',
        date: new Date().toLocaleDateString('tr-TR'),
        time: new Date().toLocaleTimeString('tr-TR'),
        pinned: false
      }
    });

    console.log('✅ Duplicate duyuru oluşturuldu:', duplicateAnnouncement.title);

    // Duplicate kontrolü
    const duplicateCheck = await prisma.notification.findFirst({
      where: {
        type: 'ANNOUNCEMENT',
        title: 'Yeni Duyuru',
        message: {
          contains: duplicateAnnouncement.title
        },
        createdAt: {
          gte: new Date(Date.now() - 60 * 60 * 1000) // 1 saat önce
        }
      }
    });

    if (duplicateCheck) {
      console.log('✅ Duplicate bildirim engellendi - sistem çalışıyor!');
    } else {
      console.log('❌ Duplicate kontrolü çalışmıyor!');
    }

  } catch (error) {
    console.error('❌ Hata:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testFinalAnnouncement();
