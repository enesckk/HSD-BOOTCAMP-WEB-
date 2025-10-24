const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function createUsers() {
  try {
    // 5 gerçek isimli kullanıcı
    const users = [
      {
        fullName: 'Ahmet Yılmaz',
        email: 'ahmet.yilmaz@hsd.com',
        password: 'ahmet123',
        role: 'PARTICIPANT'
      },
      {
        fullName: 'Fatma Demir',
        email: 'fatma.demir@hsd.com',
        password: 'fatma123',
        role: 'PARTICIPANT'
      },
      {
        fullName: 'Mehmet Kaya',
        email: 'mehmet.kaya@hsd.com',
        password: 'mehmet123',
        role: 'PARTICIPANT'
      },
      {
        fullName: 'Ayşe Özkan',
        email: 'ayse.ozkan@hsd.com',
        password: 'ayse123',
        role: 'PARTICIPANT'
      },
      {
        fullName: 'Ali Çelik',
        email: 'ali.celik@hsd.com',
        password: 'ali123',
        role: 'PARTICIPANT'
      }
    ];

    // 4 eğitmen
    const instructors = [
      {
        fullName: 'Burak Bakır',
        email: 'burak.bakir@hsd.com',
        password: 'burak123',
        role: 'INSTRUCTOR'
      },
      {
        fullName: 'Berk Buğur',
        email: 'berk.bugur@hsd.com',
        password: 'berk123',
        role: 'INSTRUCTOR'
      },
      {
        fullName: 'Berk Yavuz',
        email: 'berk.yavuz@hsd.com',
        password: 'berkyavuz123',
        role: 'INSTRUCTOR'
      },
      {
        fullName: 'Deniz Gaygısız',
        email: 'deniz.gaygisiz@hsd.com',
        password: 'deniz123',
        role: 'INSTRUCTOR'
      }
    ];

    console.log('Kullanıcılar oluşturuluyor...');
    
    // Kullanıcıları oluştur
    for (const user of users) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      const createdUser = await prisma.user.create({
        data: {
          fullName: user.fullName,
          email: user.email,
          password: hashedPassword,
          role: user.role,
          phone: '+905551234567',
          university: 'Test University',
          department: 'Computer Science'
        }
      });
      console.log(`✅ Kullanıcı oluşturuldu: ${user.fullName} (${user.email}) - Şifre: ${user.password}`);
    }

    console.log('\nEğitmenler oluşturuluyor...');
    
    // Eğitmenleri oluştur
    for (const instructor of instructors) {
      const hashedPassword = await bcrypt.hash(instructor.password, 10);
      const createdInstructor = await prisma.user.create({
        data: {
          fullName: instructor.fullName,
          email: instructor.email,
          password: hashedPassword,
          role: instructor.role,
          phone: '+905551234567',
          university: 'HSD University',
          department: 'Instructor'
        }
      });
      console.log(`✅ Eğitmen oluşturuldu: ${instructor.fullName} (${instructor.email}) - Şifre: ${instructor.password}`);
    }

    console.log('\n🎉 Tüm kullanıcılar ve eğitmenler başarıyla oluşturuldu!');
    
    console.log('\n📋 KULLANICI BİLGİLERİ:');
    console.log('==================');
    users.forEach(user => {
      console.log(`👤 ${user.fullName}`);
      console.log(`   📧 Email: ${user.email}`);
      console.log(`   🔑 Şifre: ${user.password}`);
      console.log('');
    });

    console.log('📋 EĞİTMEN BİLGİLERİ:');
    console.log('==================');
    instructors.forEach(instructor => {
      console.log(`👨‍🏫 ${instructor.fullName}`);
      console.log(`   📧 Email: ${instructor.email}`);
      console.log(`   🔑 Şifre: ${instructor.password}`);
      console.log('');
    });

  } catch (error) {
    console.error('Hata:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createUsers();
