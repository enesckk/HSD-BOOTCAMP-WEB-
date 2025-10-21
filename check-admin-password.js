const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function checkAdminPassword() {
  try {
    const adminUser = await prisma.user.findFirst({
      where: { role: 'ADMIN' },
      select: { id: true, email: true, fullName: true, role: true, password: true }
    });

    if (adminUser) {
      console.log('Admin kullanıcısı:', {
        id: adminUser.id,
        email: adminUser.email,
        fullName: adminUser.fullName,
        role: adminUser.role,
        hasPassword: !!adminUser.password
      });
      
      // Şifreyi test et
      const testPassword = 'password';
      const isValid = await bcrypt.compare(testPassword, adminUser.password);
      console.log('Şifre testi (password):', isValid);
      
      // Eğer şifre yanlışsa, yeni şifre oluştur
      if (!isValid) {
        const hashedPassword = await bcrypt.hash('password', 10);
        await prisma.user.update({
          where: { id: adminUser.id },
          data: { password: hashedPassword }
        });
        console.log('Admin şifresi güncellendi: password');
      }
    } else {
      console.log('Admin kullanıcısı bulunamadı');
    }
  } catch (error) {
    console.error('Hata:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAdminPassword();
