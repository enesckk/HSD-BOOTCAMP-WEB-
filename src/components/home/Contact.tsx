'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  MessageSquare,
  Globe,
  Linkedin,
  Twitter,
  Instagram,
  Facebook,
  Youtube,
  Navigation,
  Star,
  Calendar,
  Users,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

const Contact: React.FC = () => {

  const contactInfo = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: "E-posta",
      value: "info@huawei.com.tr",
      description: "Genel sorularınız için",
      color: "from-red-500 to-red-600"
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Telefon",
      value: "+90 (212) 318 18 00",
      description: "Pazartesi - Cuma, 09:00-18:00",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Adres",
      value: "Gaziantep Şehitkamil Kongre ve Sanat Merkezi",
      description: "Gaziantep, Türkiye",
      color: "from-green-500 to-green-600"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Çalışma Saatleri",
      value: "Pazartesi - Cuma",
      description: "09:00 - 18:00",
      color: "from-purple-500 to-purple-600"
    }
  ];

  const socialMedia = [
    {
      name: "LinkedIn",
      icon: <Linkedin className="w-5 h-5" />,
      url: "https://www.linkedin.com/company/huawei-turkey",
      color: "from-blue-600 to-blue-700"
    },
    {
      name: "Twitter",
      icon: <Twitter className="w-5 h-5" />,
      url: "https://twitter.com/HuaweiTurkey",
      color: "from-blue-400 to-blue-500"
    },
    {
      name: "Instagram",
      icon: <Instagram className="w-5 h-5" />,
      url: "https://www.instagram.com/huaweiturkey",
      color: "from-pink-500 to-pink-600"
    },
    {
      name: "Facebook",
      icon: <Facebook className="w-5 h-5" />,
      url: "https://www.facebook.com/HuaweiTurkey",
      color: "from-blue-600 to-blue-700"
    },
    {
      name: "YouTube",
      icon: <Youtube className="w-5 h-5" />,
      url: "https://www.youtube.com/c/HuaweiTurkey",
      color: "from-red-500 to-red-600"
    }
  ];


  return (
    <section id="contact" className="relative py-20 bg-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
              <MessageSquare className="w-4 h-4" />
              <span>İletişim</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Bizimle <span className="text-red-600">İletişime Geçin</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Sorularınız için bizimle iletişime geçebilir, sosyal medya hesaplarımızı takip edebilir 
              ve etkinlik hakkında güncel bilgiler alabilirsiniz
            </p>
          </motion.div>

          {/* Etkinlik Lokasyonu */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden relative">
              {/* Top Accent Line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-red-600"></div>
              <div className="p-8 lg:p-12">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                  {/* Location Info */}
                  <div>
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center shadow-lg">
                        <Navigation className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">Etkinlik Lokasyonu</h3>
                        <p className="text-gray-600">Maraton nerede düzenlenecek?</p>
                      </div>
                    </div>
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-xl font-bold text-gray-900 mb-2">
                          Gaziantep Şehitkamil Kongre ve Sanat Merkezi
                        </h4>
                        <p className="text-gray-600 leading-relaxed">
                          Maratonumuz Gaziantep'in prestijli kongre merkezinde düzenlenecek.
                          Modern tesisler ve teknolojik altyapı ile donatılmış bu merkez,
                          katılımcılarımıza en iyi deneyimi sunacak.
                        </p>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                          <MapPin className="w-5 h-5 text-red-500" />
                          <span className="text-gray-700">Şehitkamil, Gaziantep, Türkiye</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Clock className="w-5 h-5 text-red-500" />
                          <span className="text-gray-700">19-20 Şubat 2026</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Globe className="w-5 h-5 text-red-500" />
                          <span className="text-gray-700">Kolay ulaşım imkanları</span>
                        </div>
                      </div>
                      <div className="pt-4">
                        <a
                          href="https://maps.google.com/?q=Gaziantep+Şehitkamil+Kongre+ve+Sanat+Merkezi"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                        >
                          <Navigation className="w-4 h-4" />
                          <span>Haritada Aç</span>
                        </a>
                      </div>
                    </div>
                  </div>
                  {/* Map */}
                  <div className="relative">
                    <div className="bg-gray-100 rounded-2xl overflow-hidden shadow-lg h-80 lg:h-96">
                      <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3189.1234567890123!2d37.3789!3d37.0662!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzfCsDAzJzU4LjMiTiAzN8KwMjInNDQuMCJF!5e0!3m2!1str!2str!4v1234567890123"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Gaziantep Şehitkamil Kongre ve Sanat Merkezi"
                        className="w-full h-full"
                      ></iframe>
                    </div>
                    {/* Map Overlay Info */}
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span className="text-sm font-medium text-gray-800">Etkinlik Lokasyonu</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Content */}
          <div className="max-w-4xl mx-auto">
            
            {/* Contact Info & Social Media */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="space-y-12"
            >
              {/* Contact Info */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 relative overflow-hidden">
                {/* Top Accent Line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-red-600"></div>
                <div className="text-center mb-8">
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">İletişim Bilgileri</h3>
                  <p className="text-gray-600 text-lg">Bizimle iletişime geçin</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  {contactInfo.map((info, index) => (
                    <motion.div
                      key={info.title}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="text-center p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-300"
                    >
                      <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <div className="text-white">
                          {info.icon}
                        </div>
                      </div>
                      <h4 className="text-lg font-bold text-gray-900 mb-2">{info.title}</h4>
                      <p className="text-gray-900 font-medium mb-2">{info.value}</p>
                        <p className="text-gray-600 text-sm">{info.description}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Social Media */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 relative overflow-hidden">
                {/* Top Accent Line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-red-600"></div>
                <div className="text-center mb-8">
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">Sosyal Medya</h3>
                  <p className="text-gray-600 text-lg">Bizi takip edin</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {socialMedia.map((social, index) => (
                    <motion.a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="bg-gray-100 text-gray-700 p-4 rounded-xl flex flex-col items-center justify-center space-y-2 hover:bg-red-600 hover:text-white hover:shadow-lg transition-all duration-300 transform"
                    >
                      <div className="text-2xl">{social.icon}</div>
                      <span className="font-medium text-sm">{social.name}</span>
                    </motion.a>
                  ))}
                </div>
              </div>

              {/* Quick Info */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 relative overflow-hidden">
                {/* Top Accent Line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-red-600"></div>
                <div className="text-center mb-8">
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">Hızlı Bilgi</h3>
                  <p className="text-gray-600 text-lg">Önemli bilgiler</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="text-center p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-300">
                    <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="text-lg font-bold text-gray-900 mb-2">Son Başvuru</h4>
                    <p className="text-red-600 font-semibold text-xl">15 Şubat 2026</p>
                  </div>
                  <div className="text-center p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-300">
                    <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="text-lg font-bold text-gray-900 mb-2">Etkinlik Tarihi</h4>
                    <p className="text-gray-900 font-semibold text-xl">19-20 Şubat 2026</p>
                  </div>
                  <div className="text-center p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-300">
                    <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="text-lg font-bold text-gray-900 mb-2">Lokasyon</h4>
                    <p className="text-gray-900 font-semibold">Gaziantep Şehitkamil Kongre ve Sanat Merkezi</p>
                  </div>
                  <div className="text-center p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-300">
                    <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="text-lg font-bold text-gray-900 mb-2">Katılımcı Sayısı</h4>
                    <p className="text-gray-900 font-semibold text-xl">30 Kişi</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
          {/* Final Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-8 border border-red-200 shadow-lg relative overflow-hidden">
              {/* Top Accent Line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-red-600"></div>
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-5">
                <div 
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23dc2626' fill-opacity='0.1'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z'/%3E%3C/g%3E%3C/svg%3E")`,
                  }}
                />
              </div>
              
              <div className="relative z-10">
                <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Star className="w-8 h-8 text-white" />
                </div>
                
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Bu Heyecan Verici <span className="text-red-600">Yolculuğa Katılın</span>
                </h2>
                
                <p className="text-lg text-gray-700 mb-6 max-w-2xl mx-auto leading-relaxed">
                Afet yönetimi teknolojileri alanında yenilikçi fikirlerinizi paylaşın, 
                takım çalışması deneyimi kazanın ve değerli ödüller kazanın.
              </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
              <button                onClick={() => window.location.href = '/application'}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center space-x-2"
              >
                    <span>Hemen Başvurunuzu Yapın</span>
                    <ArrowRight className="w-4 h-4" />
              </button>
                  
                  <div className="flex items-center space-x-4 text-gray-600">
                    <div className="flex items-center space-x-1">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm font-medium">Ücretsiz</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4 text-blue-500" />
                      <span className="text-sm font-medium">2 Gün</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4 text-purple-500" />
                      <span className="text-sm font-medium">30 Kişi</span>
                    </div>
                  </div>
                </div>
                
                {/* Bottom Accent */}
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-8 h-px bg-gradient-to-r from-transparent to-red-300" />
                  <div className="w-2 h-2 bg-red-500 rounded-full" />
                  <div className="w-8 h-px bg-gradient-to-l from-transparent to-red-300" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
