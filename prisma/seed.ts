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
