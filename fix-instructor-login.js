const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function fixInstructorLogin() {
  try {
    console.log('🔧 Eğitmen giriş sorunu düzeltiliyor...');
    
    // Tüm eğitmenleri al
    const instructors = await prisma.user.findMany({
      where: {
        role: 'INSTRUCTOR'
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        password: true
      }
    });

    console.log(`📋 ${instructors.length} eğitmen hesabı bulundu`);

    // Her eğitmen için şifreyi düzelt
    const newPassword = 'instructor123';
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    for (const instructor of instructors) {
      await prisma.user.update({
        where: { id: instructor.id },
        data: { password: hashedPassword }
      });
      console.log(`✅ ${instructor.fullName} (${instructor.email}) - Şifre: ${newPassword}`);
    }

    console.log('\n🎉 Tüm eğitmen şifreleri düzeltildi!');
    console.log('\n🔑 EĞİTMEN GİRİŞ BİLGİLERİ:');
    console.log('='.repeat(40));
    console.log(`🔑 Şifre: ${newPassword} (tüm eğitmenler için)`);
    console.log('\n📧 Eğitmen Emailleri:');
    instructors.forEach((instructor, index) => {
      console.log(`${index + 1}. ${instructor.email} (${instructor.fullName})`);
    });

    console.log('\n🌐 Giriş URL: http://localhost:3000/login');

  } catch (error) {
    console.error('❌ Hata:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixInstructorLogin();
