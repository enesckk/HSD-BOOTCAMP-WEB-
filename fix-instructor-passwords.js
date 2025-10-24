const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function fixInstructorPasswords() {
  try {
    console.log('🔧 Eğitmen şifreleri düzeltiliyor...\n');
    
    // Eğitmen hesaplarını bul
    const instructors = await prisma.user.findMany({
      where: { role: 'INSTRUCTOR' },
      select: { id: true, email: true, fullName: true }
    });

    console.log(`📋 ${instructors.length} eğitmen hesabı bulundu\n`);

    // Her eğitmen için şifre düzelt
    for (const instructor of instructors) {
      const hashedPassword = await bcrypt.hash('instructor123', 10);
      
      await prisma.user.update({
        where: { id: instructor.id },
        data: { password: hashedPassword }
      });

      console.log(`✅ ${instructor.fullName} (${instructor.email}) - Şifre: instructor123`);
    }

    console.log('\n🎉 Tüm eğitmen şifreleri düzeltildi!');
    console.log('\n📋 EĞİTMEN GİRİŞ BİLGİLERİ:');
    console.log('============================');
    console.log('🔑 Şifre: instructor123 (tüm eğitmenler için)');
    console.log('\n📧 Eğitmen Emailleri:');
    instructors.forEach((instructor, index) => {
      console.log(`${index + 1}. ${instructor.email} (${instructor.fullName})`);
    });

  } catch (error) {
    console.error('Hata:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixInstructorPasswords();
