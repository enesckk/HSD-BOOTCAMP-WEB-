const bcrypt = require('bcrypt');

async function testLogin() {
  try {
    console.log('🔐 Giriş testi yapılıyor...\n');
    
    // Test şifreleri
    const testPasswords = [
      'instructor123',
      'test123',
      'admin123'
    ];
    
    // Hash'lenmiş şifreler (örnek)
    const hashedPasswords = [
      '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
      '$2b$10$FmXdvYHgbxZ8PeeJ0kefJOreyREXOupqqrO.OEVSlhV2kMSdpB8ea', // test123
      '$2b$10$7e.4uEVQx7wqhORWyDw.YOB1qnf.7.ox/g4.BJCoHBXsO5weDhfKu'  // instructor123
    ];
    
    console.log('Test şifreleri:');
    for (let i = 0; i < testPasswords.length; i++) {
      const isValid = await bcrypt.compare(testPasswords[i], hashedPasswords[i]);
      console.log(`${testPasswords[i]}: ${isValid ? '✅ Geçerli' : '❌ Geçersiz'}`);
    }
    
    // Yeni hash oluştur
    const newHash = await bcrypt.hash('instructor123', 10);
    console.log(`\nYeni hash (instructor123): ${newHash}`);
    
    // Test et
    const testResult = await bcrypt.compare('instructor123', newHash);
    console.log(`Test sonucu: ${testResult ? '✅ Başarılı' : '❌ Başarısız'}`);
    
  } catch (error) {
    console.error('Hata:', error);
  }
}

testLogin();
