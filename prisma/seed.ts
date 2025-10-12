import { PrismaClient, TeamRole, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Admin kullanıcı oluştur (admins tablosu)
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

  console.log('✅ Created admin record (admins table)');

  // Admin kullanıcı oluştur (users tablosu - giriş için gereklidir)
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@huawei.com' },
    update: {
      role: UserRole.ADMIN,
      isActive: true,
    },
    create: {
      email: 'admin@huawei.com',
      password: adminPassword,
      fullName: 'Huawei Admin',
      phone: '+905551234567',
      university: 'Admin University',
      department: 'Administration',
      role: UserRole.ADMIN,
      isActive: true,
    },
  });

  console.log('✅ Created admin user (users table) - email: admin@huawei.com, password: admin123');

  // Test katılımcı oluştur
  const testPassword = await bcrypt.hash('test123', 10);
  const testUser = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      password: testPassword,
      fullName: 'Test User',
      phone: '+905551234567',
      university: 'Test University',
      department: 'Computer Science',
      teamRole: TeamRole.LIDER,
      role: UserRole.PARTICIPANT,
      isActive: true,
    },
  });

  console.log('✅ Created test participant user (email: test@example.com, password: test123)');

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
      fromUserId: adminUser.id,
      toRole: 'participant',
      subject: 'Mentorluk Oturumu',
      body: 'Merhaba, mentorluk için uygun saatlerinizi iletir misiniz?',
      unread: true
    },
    {
      fromUserId: adminUser.id,
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
    update: {
      capacity: 3,
    },
    create: {
      name: 'Test Takımı',
      leaderId: testUser.id,
      capacity: 3
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
      status: 'PENDING'
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

  // Örnek bildirimler oluştur
  await prisma.notification.createMany({
    data: [
      {
        type: 'APPLICATION',
        title: 'Yeni Başvuru',
        message: 'Ahmet Yılmaz adlı kullanıcı başvuru yaptı',
        read: false,
        actionUrl: '/admin/applications'
      },
      {
        type: 'MESSAGE',
        title: 'Yeni Mesaj',
        message: 'Test Takımı size mesaj gönderdi',
        read: false,
        actionUrl: '/admin/messages'
      },
      {
        type: 'TEAM',
        title: 'Takım Oluşturuldu',
        message: 'Yeni takım "Maraton Takımı" oluşturuldu',
        read: true,
        actionUrl: '/admin/teams'
      }
    ]
  });

  console.log('✅ Created sample notifications');

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
