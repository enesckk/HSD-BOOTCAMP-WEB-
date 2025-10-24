const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createInstructorUser() {
  try {
    // Check if instructor user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: 'test@egitmen.com' }
    });

    if (existingUser) {
      console.log('Eğitmen kullanıcısı zaten mevcut:', existingUser.email);
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('123456', 10);

    // Create instructor user
    const instructorUser = await prisma.user.create({
      data: {
        email: 'test@egitmen.com',
        password: hashedPassword,
        fullName: 'Test Eğitmen',
        phone: '05551234567',
        university: 'Test Üniversitesi',
        department: 'Bilgisayar Mühendisliği',
        role: 'INSTRUCTOR',
        isActive: true
      }
    });

    console.log('Eğitmen kullanıcısı başarıyla oluşturuldu:');
    console.log('Email:', instructorUser.email);
    console.log('Şifre: 123456');
    console.log('Rol:', instructorUser.role);

  } catch (error) {
    console.error('Eğitmen kullanıcısı oluşturulurken hata:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createInstructorUser();
