const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createAdminUser() {
  try {
    // Önce mevcut admin kullanıcısını kontrol et
    const existingAdmin = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    });

    if (existingAdmin) {
      console.log('Admin kullanıcısı zaten mevcut:', existingAdmin.email);
      return existingAdmin;
    }

    // Yeni admin kullanıcısı oluştur
    const adminUser = await prisma.user.create({
      data: {
        email: 'admin@hsd.com',
        password: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
        fullName: 'HSD Admin',
        phone: '+90 555 123 4567',
        university: 'Huawei Türkiye',
        department: 'Yönetim',
        role: 'ADMIN',
        isActive: true
      }
    });

    console.log('Admin kullanıcısı oluşturuldu:', adminUser);
    return adminUser;
  } catch (error) {
    console.error('Admin kullanıcısı oluşturulurken hata:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser();
