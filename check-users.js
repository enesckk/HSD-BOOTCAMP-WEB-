const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkUsers() {
  try {
    console.log('🔍 Mevcut kullanıcılar kontrol ediliyor...\n');
    
    // Tüm kullanıcıları listele
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        isActive: true
      }
    });

    console.log('📋 MEVCUT KULLANICILAR:');
    console.log('====================');
    
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.fullName}`);
      console.log(`   📧 Email: ${user.email}`);
      console.log(`   🎭 Rol: ${user.role}`);
      console.log(`   ✅ Aktif: ${user.isActive ? 'Evet' : 'Hayır'}`);
      console.log('');
    });

    // Eğitmenleri filtrele
    const instructors = users.filter(user => user.role === 'INSTRUCTOR');
    
    console.log('🎓 EĞİTMENLER:');
    console.log('============');
    instructors.forEach((instructor, index) => {
      console.log(`${index + 1}. ${instructor.fullName} (${instructor.email})`);
    });

  } catch (error) {
    console.error('Hata:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUsers();
