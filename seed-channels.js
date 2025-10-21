const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedChannels() {
  try {
    console.log('📢 Kanallar oluşturuluyor...\n');

    // Mevcut kanalları temizle
    await prisma.channelMessage.deleteMany();
    await prisma.channel.deleteMany();

    const channels = [
      // Genel Kategorisi
      {
        name: 'genel',
        displayName: 'Genel Sohbet',
        description: 'Genel konular ve sohbetler',
        category: 'GENEL',
        type: 'chat',
        isActive: true,
        isPrivate: false
      },
      {
        name: 'duyurular',
        displayName: 'Duyurular',
        description: 'Önemli duyurular ve haberler',
        category: 'GENEL',
        type: 'chat',
        isActive: true,
        isPrivate: false
      },

      // Bootcamp Kategorisi
      {
        name: 'kubernetes',
        displayName: 'Kubernetes',
        description: 'Kubernetes ile ilgili sorular ve tartışmalar',
        category: 'BOOTCAMP',
        type: 'chat',
        isActive: true,
        isPrivate: false
      },
      {
        name: 'egitmene-sor',
        displayName: 'Eğitmene Sor',
        description: 'Eğitmenlere soru sorma kanalı',
        category: 'BOOTCAMP',
        type: 'chat',
        isActive: true,
        isPrivate: false
      },
      {
        name: 'yardim',
        displayName: 'Yardım',
        description: 'Teknik yardım ve destek',
        category: 'BOOTCAMP',
        type: 'chat',
        isActive: true,
        isPrivate: false
      },

      // Paylaşımlar Kategorisi
      {
        name: 'linkedin-paylasimlari',
        displayName: 'LinkedIn Paylaşımları',
        description: 'LinkedIn profil ve içerik paylaşımları',
        category: 'PAYLASIMLAR',
        type: 'chat',
        isActive: true,
        isPrivate: false
      },
      {
        name: 'github-projeleri',
        displayName: 'GitHub Projeleri',
        description: 'GitHub repo ve proje paylaşımları',
        category: 'PAYLASIMLAR',
        type: 'chat',
        isActive: true,
        isPrivate: false
      },
      {
        name: 'medium-yazilari',
        displayName: 'Medium Yazıları',
        description: 'Medium yazı ve makale paylaşımları',
        category: 'PAYLASIMLAR',
        type: 'chat',
        isActive: true,
        isPrivate: false
      },

      // Yönetim Kategorisi (Sadece yönetici/eğitmen)
      {
        name: 'yonetim-kanali',
        displayName: 'Yönetim Kanalı',
        description: 'Yönetici ve eğitmenler için özel kanal',
        category: 'YONETIM',
        type: 'chat',
        isActive: true,
        isPrivate: true
      }
    ];

    for (const channel of channels) {
      await prisma.channel.create({
        data: channel
      });
      console.log(`✅ ${channel.displayName} kanalı oluşturuldu`);
    }

    console.log('\n🎉 Tüm kanallar başarıyla oluşturuldu!');
    console.log('\n📋 Kanal Kategorileri:');
    console.log('   🏠 GENEL: Genel Sohbet, Duyurular');
    console.log('   🎓 BOOTCAMP: Kubernetes, Eğitmene Sor, Yardım');
    console.log('   📤 PAYLAŞIMLAR: LinkedIn, GitHub, Medium');
    console.log('   🔒 YÖNETİM: Yönetim Kanalı (Özel)');

  } catch (error) {
    console.error('❌ Hata:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedChannels();
