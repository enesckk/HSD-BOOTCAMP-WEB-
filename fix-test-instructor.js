const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function fixTestInstructor() {
  try {
    console.log('🔧 Test eğitmeni şifresi düzeltiliyor...\n');
    
    const hashedPassword = await bcrypt.hash('test123', 10);
    
    const instructor = await prisma.user.update({
      where: { email: 'instructor@test.com' },
      data: { password: hashedPassword }
    });
    
    console.log('✅ Test eğitmeni şifresi düzeltildi:');
    console.log(`📧 Email: ${instructor.email}`);
    console.log(`🔑 Şifre: test123`);
    console.log(`👤 Ad: ${instructor.fullName}`);
    
    // Test et
    const isValid = await bcrypt.compare('test123', instructor.password);
    console.log(`🔐 Şifre testi: ${isValid ? '✅ Başarılı' : '❌ Başarısız'}`);
    
  } catch (error) {
    console.error('Hata:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixTestInstructor();
