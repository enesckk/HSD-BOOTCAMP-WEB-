const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function cleanupDuplicateNotifications() {
  try {
    console.log('🧹 Duplicate bildirimler temizleniyor...');
    
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

    // Aynı mesaj içeriğine sahip bildirimleri grupla
    const groupedNotifications = {};
    
    announcements.forEach(notification => {
      const key = `${notification.userId}-${notification.message}`;
      if (!groupedNotifications[key]) {
        groupedNotifications[key] = [];
      }
      groupedNotifications[key].push(notification);
    });

    // Her grupta birden fazla bildirim varsa, en eskilerini sil
    let deletedCount = 0;
    
    for (const [key, notifications] of Object.entries(groupedNotifications)) {
      if (notifications.length > 1) {
        // En yeni olanı bırak, diğerlerini sil
        const sortedNotifications = notifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        const toDelete = sortedNotifications.slice(1); // İlkini bırak, diğerlerini sil
        
        for (const notification of toDelete) {
          await prisma.notification.delete({
            where: { id: notification.id }
          });
          deletedCount++;
        }
        
        console.log(`🗑️ ${toDelete.length} duplicate bildirim silindi (${key})`);
      }
    }

    console.log(`✅ Toplam ${deletedCount} duplicate bildirim temizlendi`);

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

  } catch (error) {
    console.error('❌ Hata:', error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanupDuplicateNotifications();
