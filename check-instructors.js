const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkInstructors() {
  try {
    console.log('🎓 Eğitmen hesapları kontrol ediliyor...');
    
    const instructors = await prisma.user.findMany({
      where: {
        role: 'INSTRUCTOR'
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log(`\n📋 Toplam ${instructors.length} eğitmen hesabı bulundu:`);
    console.log('='.repeat(60));

    instructors.forEach((instructor, index) => {
      console.log(`\n${index + 1}. ${instructor.fullName}`);
      console.log(`   📧 Email: ${instructor.email}`);
      console.log(`   🎭 Rol: ${instructor.role}`);
      console.log(`   ✅ Aktif: ${instructor.isActive ? 'Evet' : 'Hayır'}`);
      console.log(`   📅 Oluşturulma: ${instructor.createdAt.toLocaleString('tr-TR')}`);
    });

    if (instructors.length > 0) {
      console.log('\n🔑 EĞİTMEN GİRİŞ BİLGİLERİ:');
      console.log('='.repeat(40));
      console.log('📧 Email: ' + instructors[0].email);
      console.log('🔑 Şifre: instructor123');
      console.log('👤 Ad: ' + instructors[0].fullName);
      console.log('\n🌐 Giriş URL: http://localhost:3000/login');
    }

  } catch (error) {
    console.error('❌ Hata:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkInstructors();
