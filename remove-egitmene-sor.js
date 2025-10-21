const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function removeEgitmeneSor() {
  try {
    console.log('🗑️ "Eğitmene Sor" kanalı kaldırılıyor...\n');

    // Önce kanaldaki mesajları sil
    await prisma.channelMessage.deleteMany({
      where: {
        channel: {
          name: 'egitmene-sor'
        }
      }
    });

    // Sonra kanalı sil
    const deletedChannel = await prisma.channel.delete({
      where: {
        name: 'egitmene-sor'
      }
    });

    console.log('✅ "Eğitmene Sor" kanalı başarıyla kaldırıldı');
    console.log(`   Kanal ID: ${deletedChannel.id}`);
    console.log(`   Kanal Adı: ${deletedChannel.displayName}`);

  } catch (error) {
    console.error('❌ Hata:', error);
  } finally {
    await prisma.$disconnect();
  }
}

removeEgitmeneSor();
