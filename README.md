# Afet Yönetimi Teknolojileri Fikir Maratonu

Bu proje, Afet Yönetimi Teknolojileri Fikir Maratonu için geliştirilmiş modern bir web uygulamasıdır.

## 🚀 Özellikler

### Ana Sayfa
- **Hero Section**: Modern tasarım ve countdown timer
- **About Section**: Maraton hakkında detaylı bilgiler
- **Timeline**: Maraton süreci ve aşamaları
- **Requirements**: Katılım kriterleri ve şartlar
- **Prizes**: Ödül sistemi ve platform görünümü
- **Previous Marathons**: Geçmiş maratonlar ve başarılar
- **Contact**: İletişim bilgileri ve harita entegrasyonu
- **FAQ**: Sık sorulan sorular ve cevaplar

### Kullanıcı Sistemi
- **Login/Register**: Güvenli kimlik doğrulama
- **Application Form**: Maraton başvuru formu
- **Marathon ID**: 100 benzersiz ID sistemi
- **Authentication**: JWT tabanlı güvenlik

### Katılımcı Paneli
- **Dashboard**: İstatistikler, aktiviteler ve hızlı işlemler
- **Profile**: Kişisel bilgi yönetimi
- **Team**: Takım bilgileri ve üye yönetimi
- **Tasks**: Görev yükleme, düzenleme ve silme
- **Presentation**: Sunum yükleme ve takım entegrasyonu

### Admin Paneli
- **Application Management**: Başvuru yönetimi
- **Statistics**: İstatistikler ve raporlar
- **User Management**: Kullanıcı yönetimi

## 🛠️ Teknolojiler

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Database**: Prisma ORM, SQLite
- **Authentication**: JWT
- **Icons**: Lucide React

## 📦 Kurulum

1. Projeyi klonlayın:
```bash
git clone https://github.com/enesckk/Afet_Teknolojileri_Maratonu-.git
cd Afet_Teknolojileri_Maratonu-
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. Veritabanını kurun:
```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```

4. Geliştirme sunucusunu başlatın:
```bash
npm run dev
```

5. [http://localhost:3000](http://localhost:3000) adresini açın.

## 🎨 Tasarım

- **Modern UI**: Tailwind CSS ile responsive tasarım
- **Kırmızı-Beyaz Tema**: Kurumsal kimlik
- **Animasyonlar**: Framer Motion ile smooth geçişler
- **Mobile-First**: Responsive tasarım

## 📱 Responsive

Uygulama tüm cihazlarda mükemmel çalışır:
- 📱 Mobile (320px+)
- 📱 Tablet (768px+)
- 💻 Desktop (1024px+)
- 🖥️ Large Desktop (1280px+)

## 🔧 Geliştirme

```bash
# Geliştirme sunucusu
npm run dev

# Production build
npm run build

# Production sunucusu
npm start

# Linting
npm run lint
```

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/AmazingFeature`)
3. Commit yapın (`git commit -m 'Add some AmazingFeature'`)
4. Push yapın (`git push origin feature/AmazingFeature`)
5. Pull Request oluşturun

## 📞 İletişim

Proje hakkında sorularınız için:
- GitHub Issues kullanın
- E-posta: [proje sahibi e-postası]

---

**Afet Yönetimi Teknolojileri Fikir Maratonu** - Modern, güvenli ve kullanıcı dostu web uygulaması.