const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function cleanupAllNotifications() {
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

    // Her mesaj grubu için
    for (const [messageKey, notifications] of Object.entries(messageGroups)) {
      console.log(`\n🔍 Mesaj: "${messageKey.substring(0, 50)}..."`);
      console.log(`   📊 ${notifications.length} bildirim bulundu`);
      
      // Kullanıcı bazında grupla
      const userGroups = {};
      notifications.forEach(notification => {
        if (!userGroups[notification.userId]) {
          userGroups[notification.userId] = [];
        }
        userGroups[notification.userId].push(notification);
      });

      console.log(`   👥 ${Object.keys(userGroups).length} farklı kullanıcı`);

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

    // Kullanıcı başına bildirim sayısını kontrol et
    const userCounts = {};
    remainingAnnouncements.forEach(notification => {
      userCounts[notification.userId] = (userCounts[notification.userId] || 0) + 1;
    });

    console.log('\n👥 Kullanıcı başına bildirim sayısı:');
    Object.entries(userCounts).forEach(([userId, count]) => {
      console.log(`   ${userId}: ${count} bildirim`);
    });

    // Her kullanıcının sadece 1 bildirimi olmalı
    const usersWithMultipleNotifications = Object.entries(userCounts).filter(([userId, count]) => count > 1);
    
    if (usersWithMultipleNotifications.length === 0) {
      console.log('\n✅ Tüm kullanıcılar için sadece 1 bildirim kaldı!');
    } else {
      console.log(`\n⚠️ ${usersWithMultipleNotifications.length} kullanıcı hala birden fazla bildirime sahip`);
    }

  } catch (error) {
    console.error('❌ Hata:', error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanupAllNotifications();
