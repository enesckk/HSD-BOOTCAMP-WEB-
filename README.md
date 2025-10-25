HSD Türkiye Bootcamp  Web Sitesi 


[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?style=for-the-badge&logo=prisma)](https://prisma.io/)

## 📋 İçindekiler

- [🎯 Proje Hakkında](#-proje-hakkında)
- [✨ Özellikler](#-özellikler)
- [🛠️ Teknolojiler](#️-teknolojiler)
- [🚀 Kurulum](#-kurulum)
- [📱 Ekran Görüntüleri](#-ekran-görüntüleri)
- [🏗️ Proje Yapısı](#️-proje-yapısı)
- [👥 Katkıda Bulunma](#-katkıda-bulunma)
- [📄 Lisans](#-lisans)

## 🎯 Proje Hakkında

Afet Fikir Teknolojileri Maratonu Platform, deprem ve doğal afet yönetimi için teknoloji çözümleri geliştirmek amacıyla oluşturulmuş modern bir web platformudur. Platform, katılımcıların afet yönetimi süreçlerini takip etmelerini, kaynaklara erişmelerini ve toplulukla etkileşim kurmalarını sağlar.

### 🎓 Eğitim Programları
- **Kubernetes Bootcamp** - Container orkestrasyonu ve cloud native teknolojiler
- **AI Bootcamp** - Yapay zeka ve makine öğrenmesi
- **DevOps Bootcamp** - Sürekli entegrasyon ve dağıtım

## ✨ Özellikler

### 🏠 Ana Sayfa
- **Aktif Bootcamp** - Güncel eğitim programları
- **Geçmiş Bootcamp ve Maratonlar** - Önceki etkinlikler
- **Hakkımızda** - Platform hakkında bilgiler
- **İletişim** - Sosyal medya ve iletişim bilgileri

### 👤 Katılımcı Paneli
- **Dashboard** - Genel bakış ve istatistikler
- **Profil Yönetimi** - Kişisel bilgiler
- **Duyurular** - Önemli bildirimler
- **Eğitim Programı** - Haftalık program detayları
- **Eğitmenler** - Uzman eğitmen kadrosu
- **Eğitim Kaynağı** - Materyaller ve dokümantasyon
- **Kanallar** - LinkedIn, Medium, sohbet kanalları
- **Haftalık Görevler** - Görev takibi
- **Sertifika** - Sertifikasyon süreci
- **Huawei Cloud Hesabı** - Bulut servisleri

### 🎨 Modern UI/UX
- **Responsive Tasarım** - Tüm cihazlarda uyumlu
- **Dark/Light Mode** - Kullanıcı tercihi
- **Animasyonlar** - Framer Motion ile akıcı geçişler
- **Modern İkonlar** - Lucide React icon seti

## 🛠️ Teknolojiler

### Frontend
- **Next.js 14** - React framework
- **TypeScript** - Tip güvenliği
- **Tailwind CSS** - Utility-first CSS
- **Framer Motion** - Animasyonlar
- **Lucide React** - İkonlar

### Backend
- **Next.js API Routes** - Serverless API
- **Prisma** - ORM ve veritabanı yönetimi
- **SQLite** - Geliştirme veritabanı
- **NextAuth.js** - Kimlik doğrulama

### Veritabanı
- **SQLite** - Geliştirme ortamı
- **PostgreSQL** - Production ortamı
- **Prisma Migrate** - Veritabanı migrasyonları

## 🚀 Kurulum

### Gereksinimler
- Node.js 18+ 
- npm veya yarn
- Git

### Adımlar

1. **Repository'yi klonlayın**
```bash
git clone https://github.com/enesckk/HSD-BOOTCAMP-WEB-.git
cd HSD-BOOTCAMP-WEB-
```

2. **Bağımlılıkları yükleyin**
```bash
npm install
# veya
yarn install
```

3. **Environment değişkenlerini ayarlayın**
```bash
cp .env.example .env
```

`.env` dosyasını düzenleyin:
```env
DATABASE_URL="file:./prisma/dev.db"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

4. **Veritabanını hazırlayın**
```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```

5. **Geliştirme sunucusunu başlatın**
```bash
npm run dev
# veya
yarn dev
```

6. **Tarayıcıda açın**
```
http://localhost:3000
```

## 📱 Ekran Görüntüleri

### Ana Sayfa
![Ana Sayfa](https://via.placeholder.com/800x400/ef4444/ffffff?text=Ana+Sayfa)

### Katılımcı Paneli
![Dashboard](https://via.placeholder.com/800x400/3b82f6/ffffff?text=Dashboard)

### Eğitim Programı
![Program](https://via.placeholder.com/800x400/10b981/ffffff?text=Eğitim+Programı)

## 🏗️ Proje Yapısı

```
src/
├── app/                    # Next.js 14 App Router
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard sayfaları
│   ├── admin/            # Admin paneli
│   └── page.tsx          # Ana sayfa
├── components/            # React bileşenleri
│   ├── auth/             # Kimlik doğrulama
│   ├── dashboard/        # Dashboard bileşenleri
│   ├── home/             # Ana sayfa bileşenleri
│   └── layout/           # Layout bileşenleri
├── context/              # React Context
├── lib/                  # Yardımcı fonksiyonlar
├── types/                # TypeScript tipleri
└── utils/                # Utility fonksiyonlar
```

## 🎯 Özellik Detayları

### 🏠 Ana Sayfa Bileşenleri
- **Hero Section** - Etkileyici giriş bölümü
- **Active Bootcamp** - Güncel eğitim programı
- **Previous Marathons** - Geçmiş etkinlikler
- **About** - Platform hakkında
- **Requirements** - Katılım gereksinimleri
- **FAQ** - Sık sorulan sorular
- **Contact** - İletişim bilgileri

### 👤 Dashboard Özellikleri
- **Real-time Notifications** - Anlık bildirimler
- **Progress Tracking** - İlerleme takibi
- **Resource Management** - Kaynak yönetimi
- **Community Channels** - Topluluk kanalları
- **Certificate System** - Sertifikasyon sistemi

## 🔧 Geliştirme

### Veritabanı İşlemleri
```bash
# Migration oluştur
npx prisma migrate dev --name migration_name

# Veritabanını sıfırla
npx prisma migrate reset

# Prisma Studio'yu aç
npx prisma studio
```

### Build ve Deploy
```bash
# Production build
npm run build

# Production başlat
npm start

# Lint kontrolü
npm run lint

# Type kontrolü
npm run type-check
```

## 🌟 Öne Çıkan Özellikler

### 🎨 Modern Tasarım
- **Responsive Layout** - Mobil-first yaklaşım
- **Smooth Animations** - Framer Motion ile akıcı animasyonlar
- **Consistent UI** - Tutarlı tasarım sistemi
- **Accessibility** - Erişilebilirlik standartları

### ⚡ Performans
- **Server-Side Rendering** - Hızlı yükleme
- **Image Optimization** - Otomatik görsel optimizasyonu
- **Code Splitting** - Lazy loading
- **Caching** - Akıllı önbellekleme

### 🔒 Güvenlik
- **Authentication** - Güvenli giriş sistemi
- **Authorization** - Rol tabanlı erişim
- **Data Validation** - Veri doğrulama
- **CSRF Protection** - CSRF koruması

## 📊 İstatistikler

- **⭐ Stars**: 0
- **🍴 Forks**: 0
- **🐛 Issues**: 0
- **📝 Pull Requests**: 0
- **👥 Contributors**: 1

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.

## 📞 İletişim

- **Proje Sahibi**: [@enesckk](https://github.com/enesckk)
- **Email**: info@huawei.com.tr
- **Website**: [HSD Türkiye](https://hsd-turkiye.com)

## 🙏 Teşekkürler

- **Huawei Türkiye** - Platform desteği
- **Habitat Derneği** - Eğitim ortaklığı
- **Next.js Team** - Harika framework
- **Tailwind CSS** - Utility-first CSS
- **Framer Motion** - Animasyon kütüphanesi

---

<div align="center">

**⭐ Bu projeyi beğendiyseniz yıldız vermeyi unutmayın!**

Made with ❤️ by [Enes Cıkcık](https://github.com/enesckk)

</div>
