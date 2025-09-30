import { PrismaClient, TeamRole, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // 100 adet Marathon ID oluştur (eğer yoksa)
  const existingIds = await prisma.marathonId.count();
  if (existingIds === 0) {
    const marathonIds = [];
    for (let i = 1; i <= 100; i++) {
      const marathonId = `MAR${i.toString().padStart(3, '0')}`;
      marathonIds.push({
        marathonId,
        isUsed: false,
      });
    }

    await prisma.marathonId.createMany({
      data: marathonIds,
    });

    console.log('✅ Created 100 Marathon IDs');
  } else {
    console.log(`✅ Marathon IDs already exist (${existingIds} found)`);
  }

  // Admin kullanıcı oluştur
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.admin.upsert({
    where: { email: 'admin@huawei.com' },
    update: {},
    create: {
      email: 'admin@huawei.com',
      fullName: 'Huawei Admin',
      phone: '+905551234567',
      role: UserRole.ADMIN,
      isActive: true,
    },
  });

  console.log('✅ Created admin user');

  // Test katılımcı oluştur
  const testPassword = await bcrypt.hash('admin123', 10);
  const testUser = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      marathonId: 'MAR001',
      email: 'test@example.com',
      fullName: 'Test User',
      phone: '+905551234567',
      university: 'Test University',
      department: 'Computer Science',
      teamRole: TeamRole.LIDER,
      role: UserRole.PARTICIPANT,
      isActive: true,
    },
  });

  // MAR001'i kullanılmış olarak işaretle
  await prisma.marathonId.update({
    where: { marathonId: 'MAR001' },
    data: {
      isUsed: true,
      usedAt: new Date(),
      usedBy: testUser.id,
    },
  });

  console.log('✅ Created test participant user');

  // Örnek duyurular oluştur
  const announcements = [
    {
      title: 'Final Sunumu Tarihi Güncellendi',
      summary: 'Final sunum tarihimiz 20 Şubat 2026 saat 14:00 olarak güncellendi.',
      content: 'Değerli katılımcılar, final sunum tarihimiz 20 Şubat 2026 saat 14:00 olarak güncellenmiştir. Sunum dosyalarınızı en geç 19 Şubat 23:59\'a kadar yükleyin.',
      category: 'Takvim',
      date: '2026-02-20',
      time: '14:00',
      pinned: true
    },
    {
      title: 'Sunum Formatı Hakkında',
      summary: 'Sunum formatı: 10-12 slayt, maksimum 8 dakika.',
      content: 'Sunumlar 10-12 slaytı geçmemeli ve maksimum 8 dakika olmalıdır. Dosya formatı PPTX/PDF, link paylaşımı kabul edilebilir.',
      category: 'Kural',
      date: '2026-02-15',
      time: '10:00',
      pinned: false
    },
    {
      title: 'Mentorluk Oturumları',
      summary: 'Mentorlarla birebir görüşmeler 19 Şubat boyunca yapılacaktır.',
      content: 'Mentorluk oturumları 19 Şubat günü planlanmıştır. Randevu takviminden uygun saatleri seçebilirsiniz.',
      category: 'Genel',
      date: '2026-02-19',
      time: '10:00',
      pinned: false
    }
  ];

  for (const announcement of announcements) {
    await prisma.announcement.create({
      data: announcement
    });
  }

  console.log('✅ Created sample announcements');

  // Örnek mesajlar oluştur
  const messages = [
    {
      fromUserId: 'admin-user-id',
      toRole: 'participant',
      subject: 'Mentorluk Oturumu',
      body: 'Merhaba, mentorluk için uygun saatlerinizi iletir misiniz?',
      unread: true
    },
    {
      fromUserId: 'admin-user-id',
      toRole: 'participant',
      subject: 'Sunum Şablonu',
      body: 'Final sunumu için şablon ekte.',
      unread: false
    }
  ];

  for (const message of messages) {
    await prisma.message.create({
      data: message
    });
  }

  console.log('✅ Created sample messages');

  // Test takımı oluştur
  const testTeam = await prisma.team.upsert({
    where: { leaderId: testUser.id },
    update: {},
    create: {
      name: 'Test Takımı',
      leaderId: testUser.id
    }
  });

  // Test kullanıcısını takıma ekle
  await prisma.user.update({
    where: { id: testUser.id },
    data: { teamId: testTeam.id }
  });

  console.log('✅ Created test team');

  // Örnek görev oluştur
  await prisma.task.create({
    data: {
      userId: testUser.id,
      title: 'Proje Planı Hazırlama',
      description: 'Maraton için proje planınızı hazırlayın ve yükleyin.',
      huaweiCloudAccount: 'test_user',
      uploadType: 'file',
      fileUrl: 'https://example.com/project-plan.pdf',
      status: 'pending'
    }
  });

  console.log('✅ Created sample task');

  // Örnek sunum oluştur
  await prisma.presentation.create({
    data: {
      userId: testUser.id,
      teamName: 'Test Takımı',
      memberNames: 'Test User, John Doe, Jane Smith',
      title: 'Afet Yönetimi Projesi',
      description: 'Maraton için hazırladığımız afet yönetimi projesi.',
      uploadType: 'link',
      linkUrl: 'https://example.com/presentation',
      status: 'pending'
    }
  });

  console.log('✅ Created sample presentation');

  console.log('🎉 Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
