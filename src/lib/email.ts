import nodemailer from 'nodemailer';

// E-posta konfigürasyonu
const emailConfig = {
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
};

// E-posta transporter oluştur
const createTransporter = () => {
  return nodemailer.createTransport(emailConfig);
};

// E-posta gönder
export const sendEmail = async ({
  to,
  subject,
  html,
  attachments = [],
}: {
  to: string | string[];
  subject: string;
  html: string;
  attachments?: Array<{
    filename: string;
    content: Buffer;
    contentType?: string;
  }>;
}) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"HSD Türkiye Bootcamp" <${process.env.SMTP_USER}>`,
      to: Array.isArray(to) ? to.join(', ') : to,
      subject,
      html,
      attachments,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('E-posta gönderildi:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('E-posta gönderme hatası:', error);
    return { success: false, error: error.message };
  }
};

// Toplu e-posta gönder
export const sendBulkEmail = async ({
  recipients,
  subject,
  html,
  attachments = [],
}: {
  recipients: Array<{ email: string; fullName: string }>;
  subject: string;
  html: string;
  attachments?: Array<{
    filename: string;
    content: Buffer;
    contentType?: string;
  }>;
}) => {
  const results = [];
  
  for (const recipient of recipients) {
    try {
      // Her alıcı için kişiselleştirilmiş HTML
      const personalizedHtml = html
        .replace(/{{fullName}}/g, recipient.fullName)
        .replace(/{{email}}/g, recipient.email);

      const result = await sendEmail({
        to: recipient.email,
        subject,
        html: personalizedHtml,
        attachments,
      });

      results.push({
        email: recipient.email,
        fullName: recipient.fullName,
        success: result.success,
        messageId: result.messageId,
        error: result.error,
      });

      // E-posta gönderim hızını kontrol et (spam koruması)
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      results.push({
        email: recipient.email,
        fullName: recipient.fullName,
        success: false,
        error: error.message,
      });
    }
  }

  return results;
};

// E-posta şablonları
export const emailTemplates = {
  welcome: {
    subject: 'HSD Türkiye Bootcamp - Hoş Geldiniz!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #dc2626, #b91c1c); color: white; padding: 30px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px;">HSD Türkiye Bootcamp</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px;">Teknoloji ve İnovasyon Eğitimleri</p>
        </div>
        
        <div style="padding: 30px; background: #f9fafb;">
          <h2 style="color: #1f2937; margin-bottom: 20px;">Merhaba {{fullName}}!</h2>
          
          <p style="color: #374151; line-height: 1.6; margin-bottom: 20px;">
            HSD Türkiye Bootcamp programına katıldığınız için teşekkürler! 
            Bu heyecan verici yolculukta sizinle birlikte olmaktan mutluluk duyuyoruz.
          </p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #dc2626; margin-bottom: 15px;">Program Detayları</h3>
            <ul style="color: #374151; line-height: 1.8;">
              <li>Program Süresi: 4 Hafta</li>
              <li>Format: Online & Hibrit Eğitim</li>
              <li>Teknoloji: Kubernetes & Cloud Computing</li>
              <li>Eğitmenler: Uzman eğitmen kadrosu</li>
            </ul>
          </div>
          
          <p style="color: #374151; line-height: 1.6;">
            Program boyunca size özel hazırlanan eğitim materyalleri, canlı dersler ve 
            proje çalışmaları ile kendinizi geliştirme fırsatı bulacaksınız.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXTAUTH_URL}/dashboard" 
               style="background: #dc2626; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Dashboard'a Git
            </a>
          </div>
        </div>
        
        <div style="background: #1f2937; color: white; padding: 20px; text-align: center;">
          <p style="margin: 0; font-size: 14px;">
            © 2024 HSD Türkiye Bootcamp. Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    `,
  },
  
  certificate: {
    subject: 'HSD Türkiye Bootcamp - Katılım Sertifikanız Hazır!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #dc2626, #b91c1c); color: white; padding: 30px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px;">🎓 Tebrikler {{fullName}}!</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px;">Katılım Sertifikanız Hazır</p>
        </div>
        
        <div style="padding: 30px; background: #f9fafb;">
          <p style="color: #374151; line-height: 1.6; margin-bottom: 20px;">
            HSD Türkiye Bootcamp programını başarıyla tamamladığınız için sizi tebrik ederiz! 
            Katılım sertifikanız hazır ve indirilmeye hazır.
          </p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
            <h3 style="color: #dc2626; margin-bottom: 15px;">Sertifika Detayları</h3>
            <p style="color: #374151; margin-bottom: 10px;"><strong>Program:</strong> Kubernetes Bootcamp</p>
            <p style="color: #374151; margin-bottom: 10px;"><strong>Tarih:</strong> ${new Date().toLocaleDateString('tr-TR')}</p>
            <p style="color: #374151; margin-bottom: 20px;"><strong>Durum:</strong> Onaylandı</p>
            
            <a href="${process.env.NEXTAUTH_URL}/dashboard/certificate" 
               style="background: #dc2626; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Sertifikayı İndir
            </a>
          </div>
          
          <p style="color: #374151; line-height: 1.6;">
            Bu sertifika, program boyunca gösterdiğiniz başarılı performansı ve 
            öğrenme azminizi belgelemektedir.
          </p>
        </div>
        
        <div style="background: #1f2937; color: white; padding: 20px; text-align: center;">
          <p style="margin: 0; font-size: 14px;">
            © 2024 HSD Türkiye Bootcamp. Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    `,
  },
  
  reminder: {
    subject: 'HSD Türkiye Bootcamp - Hatırlatma',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #dc2626, #b91c1c); color: white; padding: 30px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px;">⏰ Hatırlatma</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px;">HSD Türkiye Bootcamp</p>
        </div>
        
        <div style="padding: 30px; background: #f9fafb;">
          <h2 style="color: #1f2937; margin-bottom: 20px;">Merhaba {{fullName}}!</h2>
          
          <p style="color: #374151; line-height: 1.6; margin-bottom: 20px;">
            Bu hafta için planlanan etkinlikler ve görevler hakkında sizi bilgilendirmek istiyoruz.
          </p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #dc2626; margin-bottom: 15px;">Bu Hafta Yapılacaklar</h3>
            <ul style="color: #374151; line-height: 1.8;">
              <li>Canlı ders katılımı</li>
              <li>Haftalık görevlerin tamamlanması</li>
              <li>Proje çalışmaları</li>
              <li>Eğitmenlerle birebir görüşmeler</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXTAUTH_URL}/dashboard" 
               style="background: #dc2626; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Programı Görüntüle
            </a>
          </div>
        </div>
        
        <div style="background: #1f2937; color: white; padding: 20px; text-align: center;">
          <p style="margin: 0; font-size: 14px;">
            © 2024 HSD Türkiye Bootcamp. Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    `,
  },
};
