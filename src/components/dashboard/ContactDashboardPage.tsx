'use client';

import { MapPin, Mail, Phone, Clock, Globe, MessageSquare, Calendar } from 'lucide-react';

const ContactDashboardPage = () => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="sr-only">İletişim</h1>
          <p className="text-gray-600 mt-2">Organizasyon ekibiyle hızlıca iletişime geçin</p>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center mb-4">
            <Phone className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-gray-900">Telefon</h3>
          <p className="text-gray-600 text-sm mt-1">Hafta içi 09:00 - 18:00</p>
          <a href="tel:+905551112233" className="text-red-600 hover:text-red-700 font-medium mt-3 inline-block">+90 555 111 22 33</a>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center mb-4">
            <Mail className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-gray-900">E-posta</h3>
          <p className="text-gray-600 text-sm mt-1">24 saat içinde dönüş</p>
          <a href="mailto:iletisim@afetmaratonu.org" className="text-red-600 hover:text-red-700 font-medium mt-3 inline-block">iletisim@afetmaratonu.org</a>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center mb-4">
            <MapPin className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-gray-900">Adres</h3>
          <p className="text-gray-600 text-sm mt-1">Şehitkamil Kongre ve Kültür Merkezi</p>
          <p className="text-gray-600 text-sm">Gaziantep, Türkiye</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center mb-4">
            <Clock className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-gray-900">Çalışma Saatleri</h3>
          <p className="text-gray-600 text-sm mt-1">Pzt - Cum: 09:00 - 18:00</p>
          <p className="text-gray-600 text-sm">Cumartesi: 10:00 - 14:00</p>
        </div>
      </div>

      {/* Map + Quick links */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="h-[320px] w-full">
            <iframe
              title="Etkinlik Lokasyonu"
              src="https://www.google.com/maps?q=%C5%9Eehitkamil+Kongre+ve+K%C3%BClt%C3%BCr+Merkezi+Gaziantep&output=embed"
              width="100%"
              height="100%"
              loading="lazy"
              className="border-0"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
          <h3 className="font-semibold text-gray-900">Hızlı Bağlantılar</h3>
          <a className="flex items-center gap-2 text-red-600 hover:text-red-700" href="/dashboard/announcements">
            <MessageSquare className="w-4 h-4" /> Duyurular
          </a>
          <a className="flex items-center gap-2 text-red-600 hover:text-red-700" href="/dashboard/calendar">
            <Calendar className="w-4 h-4" /> Program Akışı
          </a>
          <a className="flex items-center gap-2 text-red-600 hover:text-red-700" href="https://huawei.com" target="_blank" rel="noreferrer">
            <Globe className="w-4 h-4" /> Web Sitesi
          </a>
        </div>
      </div>
    </div>
  );
};

export default ContactDashboardPage;


