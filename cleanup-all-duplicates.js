const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function cleanupAllDuplicates() {
  try {
    console.log('🧹 Tüm duplicate bildirimler temizleniyor...');
    
    // Tüm ANNOUNCEMENT bildirimlerini al
    const announcements = await prisma.notification.findMany({
      where: {
        type: 'ANNOUNCEMENT',
        title: 'Yeni Duyuru'
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log(`📋 Toplam ${announcements.length} ANNOUNCEMENT bildirimi bulundu`);

    // Mesaj içeriğine göre grupla
    const messageGroups = {};
    
    announcements.forEach(notification => {
      const messageKey = notification.message;
      if (!messageGroups[messageKey]) {
        messageGroups[messageKey] = [];
      }
      messageGroups[messageKey].push(notification);
    });

    console.log(`📊 ${Object.keys(messageGroups).length} farklı mesaj grubu bulundu`);

    let totalDeleted = 0;

    // Her mesaj grubu için duplicate kontrolü yap
    for (const [messageKey, notifications] of Object.entries(messageGroups)) {
      if (notifications.length > 1) {
        console.log(`\n🔍 Mesaj: "${messageKey.substring(0, 50)}..."`);
        console.log(`   📊 ${notifications.length} duplicate bildirim bulundu`);
        
        // Kullanıcı bazında grupla
        const userGroups = {};
        notifications.forEach(notification => {
          if (!userGroups[notification.userId]) {
            userGroups[notification.userId] = [];
          }
          userGroups[notification.userId].push(notification);
        });

        // Her kullanıcı için en yeni bildirimi bırak, diğerlerini sil
        for (const [userId, userNotifications] of Object.entries(userGroups)) {
          if (userNotifications.length > 1) {
            // Tarihe göre sırala (en yeni önce)
            const sorted = userNotifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            const toKeep = sorted[0]; // En yeni
            const toDelete = sorted.slice(1); // Diğerleri

            console.log(`   👤 Kullanıcı ${userId}: ${toDelete.length} duplicate silinecek`);
            
            for (const notification of toDelete) {
              await prisma.notification.delete({
                where: { id: notification.id }
              });
              totalDeleted++;
            }
          }
        }
      }
    }

    console.log(`\n✅ Toplam ${totalDeleted} duplicate bildirim silindi`);

    // Son durumu kontrol et
    const remainingAnnouncements = await prisma.notification.findMany({
      where: {
        type: 'ANNOUNCEMENT',
        title: 'Yeni Duyuru'
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log(`📊 Kalan ANNOUNCEMENT bildirimi: ${remainingAnnouncements.length}`);

    // Son 5 bildirimi listele
    console.log('\n📋 Son 5 bildirim:');
    remainingAnnouncements.slice(0, 5).forEach((notification, index) => {
      console.log(`${index + 1}. ${notification.message.substring(0, 50)}... (${notification.createdAt})`);
    });

  } catch (error) {
    console.error('❌ Hata:', error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanupAllDuplicates();
