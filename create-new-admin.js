const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createNewAdmin() {
  try {
    // Yeni admin kullanıcısı oluştur
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const adminUser = await prisma.user.create({
      data: {
        email: 'admin@hsd.com',
        password: hashedPassword,
        fullName: 'HSD Admin',
        phone: '+90 555 123 4567',
        university: 'Huawei Türkiye',
        department: 'Yönetim',
        role: 'ADMIN',
        isActive: true
      }
    });

    console.log('Yeni admin kullanıcısı oluşturuldu:', {
      email: adminUser.email,
      fullName: adminUser.fullName,
      role: adminUser.role,
      password: 'admin123'
    });
    
    return adminUser;
  } catch (error) {
    console.error('Admin kullanıcısı oluşturulurken hata:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createNewAdmin();
