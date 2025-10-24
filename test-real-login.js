const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function testRealLogin() {
  try {
    console.log('🔐 Gerçek giriş testi yapılıyor...\n');
    
    // Test eğitmeni
    const testEmail = 'instructor@test.com';
    const testPassword = 'test123';
    
    console.log(`📧 Email: ${testEmail}`);
    console.log(`🔑 Şifre: ${testPassword}\n`);
    
    // Kullanıcıyı bul
    const user = await prisma.user.findUnique({
      where: { email: testEmail },
      select: {
        id: true,
        email: true,
        fullName: true,
        password: true,
        role: true,
        isActive: true
      }
    });
    
    if (!user) {
      console.log('❌ Kullanıcı bulunamadı');
      return;
    }
    
    console.log('✅ Kullanıcı bulundu:');
    console.log(`   👤 Ad: ${user.fullName}`);
    console.log(`   🎭 Rol: ${user.role}`);
    console.log(`   ✅ Aktif: ${user.isActive}`);
    console.log(`   🔐 Şifre var: ${user.password ? 'Evet' : 'Hayır'}`);
    
    if (user.password) {
      const isValid = await bcrypt.compare(testPassword, user.password);
      console.log(`   🔑 Şifre doğru: ${isValid ? 'Evet' : 'Hayır'}`);
      
      if (isValid) {
        console.log('\n🎉 Giriş başarılı!');
      } else {
        console.log('\n❌ Şifre yanlış');
      }
    } else {
      console.log('\n❌ Kullanıcının şifresi yok');
    }
    
  } catch (error) {
    console.error('Hata:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testRealLogin();
