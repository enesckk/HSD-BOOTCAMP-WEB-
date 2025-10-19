const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedChannels() {
  try {
    console.log('Seeding channels...');

    const channels = [
      {
        name: 'genel',
        displayName: '#genel',
        description: 'Genel sohbet ve tanışma',
        type: 'chat'
      },
      {
        name: 'kubernetes',
        displayName: '#kubernetes',
        description: 'Kubernetes ve container teknolojileri',
        type: 'chat'
      },
      {
        name: 'linkedin',
        displayName: '#linkedin',
        description: 'LinkedIn hesaplarını paylaşın ve network kurun',
        type: 'network'
      },
      {
        name: 'github',
        displayName: '#github',
        description: 'GitHub profillerini paylaşın ve projelerinizi gösterin',
        type: 'network'
      },
      {
        name: 'yardim',
        displayName: '#yardim',
        description: 'Teknik destek ve soru-cevap',
        type: 'chat'
      },
      {
        name: 'duyurular',
        displayName: '#duyurular',
        description: 'Resmi duyurular ve güncellemeler',
        type: 'chat'
      }
    ];

    for (const channelData of channels) {
      await prisma.channel.upsert({
        where: { name: channelData.name },
        update: channelData,
        create: channelData
      });
    }

    console.log('Channels seeded successfully!');
  } catch (error) {
    console.error('Error seeding channels:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedChannels();
