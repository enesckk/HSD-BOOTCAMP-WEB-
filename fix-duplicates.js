const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function fixDuplicates() {
  try {
    console.log('🔧 Duplicate bildirimler düzeltiliyor...');
    
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

    // Kullanıcı ve mesaj kombinasyonuna göre grupla
    const userMessageGroups = {};
    
    announcements.forEach(notification => {
      const key = `${notification.userId}-${notification.message}`;
      if (!userMessageGroups[key]) {
        userMessageGroups[key] = [];
      }
      userMessageGroups[key].push(notification);
    });

    console.log(`📊 ${Object.keys(userMessageGroups).length} farklı kullanıcı-mesaj kombinasyonu bulundu`);

    let totalDeleted = 0;

    // Her kombinasyon için duplicate kontrolü yap
    for (const [key, notifications] of Object.entries(userMessageGroups)) {
      if (notifications.length > 1) {
        const [userId, message] = key.split('-', 2);
        console.log(`\n🔍 Kullanıcı ${userId}: ${notifications.length} duplicate bildirim`);
        console.log(`   📝 Mesaj: "${message.substring(0, 50)}..."`);
        
        // En yeni olanı bırak, diğerlerini sil
        const sorted = notifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        const toKeep = sorted[0];
        const toDelete = sorted.slice(1);

        console.log(`   ✅ En yeni bildirim korunuyor: ${toKeep.id}`);
        console.log(`   🗑️ ${toDelete.length} duplicate silinecek`);
        
        for (const notification of toDelete) {
          await prisma.notification.delete({
            where: { id: notification.id }
          });
          totalDeleted++;
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

  } catch (error) {
    console.error('❌ Hata:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixDuplicates();
