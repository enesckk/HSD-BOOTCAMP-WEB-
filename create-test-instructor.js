const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function createTestInstructor() {
  try {
    // Test eğitmeni oluştur
    const hashedPassword = await bcrypt.hash('test123', 10);
    
    const instructor = await prisma.user.upsert({
      where: { email: 'instructor@test.com' },
      update: {
        password: hashedPassword,
        isActive: true
      },
      create: {
        email: 'instructor@test.com',
        password: hashedPassword,
        fullName: 'Test Eğitmen',
        phone: '+905551234567',
        university: 'Test University',
        department: 'Computer Science',
        role: 'INSTRUCTOR',
        isActive: true
      }
    });

    console.log('✅ Test eğitmeni oluşturuldu/güncellendi:');
    console.log(`📧 Email: ${instructor.email}`);
    console.log(`🔑 Şifre: test123`);
    console.log(`👤 Ad: ${instructor.fullName}`);
    console.log(`🎭 Rol: ${instructor.role}`);
    
  } catch (error) {
    console.error('Hata:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestInstructor();
