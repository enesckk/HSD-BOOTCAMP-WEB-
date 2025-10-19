'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Target, 
  Award, 
  Lightbulb, 
  Shield, 
  Globe,
  Heart,
  Zap,
  TrendingUp,
  Star,
  CheckCircle,
  ArrowRight,
  Calendar,
  MapPin
} from 'lucide-react';

const About: React.FC = () => {
  const coreValues = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Cloud Teknolojileri",
      description: "Huawei Cloud platformları ile modern bulut çözümleri geliştiriyoruz"
    },
    {
      icon: <Lightbulb className="w-6 h-6" />,
      title: "Yapay Zeka",
      description: "AI/ML teknolojileri ile akıllı uygulamalar oluşturuyoruz"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Pratik Eğitim",
      description: "Gerçek projeler üzerinde hands-on deneyim kazanıyorsunuz"
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Sertifikasyon",
      description: "Huawei Cloud sertifikaları ve kariyer fırsatları"
    }
  ];

  const stats = [
    { number: "50+", label: "Katılımcı", icon: <Users className="w-5 h-5" /> },
    { number: "40+", label: "Saat Eğitim", icon: <Target className="w-5 h-5" /> },
    { number: "5", label: "Modül", icon: <Lightbulb className="w-5 h-5" /> },
    { number: "100%", label: "Pratik", icon: <Award className="w-5 h-5" /> }
  ];

  const eventDetails = [
    {
      icon: <Calendar className="w-5 h-5" />,
      title: "Süre",
      value: "Değişken Program Süreleri"
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      title: "Format",
      value: "Online & Hibrit Eğitim"
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: "Katılımcı",
      value: "Kendini Geliştirmek İsteyen Teknoloji Tutkunları"
    },
    {
      icon: <Target className="w-5 h-5" />,
      title: "Odak",
      value: "Modern Teknoloji & İnovasyon"
    }
  ];

  const handleApplyClick = () => {
    window.location.href = '/application';
  };

  return (
    <section id="about" className="relative py-24 bg-white">
      {/* Subtle Background Pattern - Apple Style */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='20' cy='20' r='1'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Section Header - Professional Style */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center space-x-2 bg-red-600 text-white px-6 py-2 rounded-full text-sm font-semibold mb-8">
              <Heart className="w-4 h-4" />
              <span>Hakkımızda</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-8 leading-tight">
              <span className="text-red-600">HSD Türkiye</span><br />
              Bootcamp Platformu
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-8">
              HSD Türkiye Bootcamp, teknoloji ve inovasyon alanında kendini geliştirmek isteyen katılımcılar için özel olarak tasarlanmış teknik ve kişisel gelişim odaklı bir eğitim platformudur. Bu platform, yeni nesil teknolojileri tanıtmak, katılımcıların pratik projelerle deneyim kazanmasını sağlamak ve sektörel farkındalıklarını artırmak amacıyla oluşturulmuştur.
            </p>
            
            {/* YouTube Channel Info */}
            <div className="bg-gradient-to-r from-red-50 to-blue-50 rounded-2xl p-6 max-w-4xl mx-auto mb-8 border border-red-200">
              <div className="flex items-center justify-center space-x-4">
                <div className="flex items-center space-x-3">
                  <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Huawei Developer Groups Türkiye</h3>
                    <p className="text-gray-600 text-sm">Bootcamp'lerimiz YouTube kanalımızda canlı olarak yayınlanmaktadır</p>
                  </div>
                </div>
                <a 
                  href="https://www.youtube.com/c/HuaweiDeveloperGroupsTürkiye" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors duration-300 flex items-center space-x-2"
                >
                  <span>Kanalı Ziyaret Et</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
            <div className="bg-gradient-to-r from-red-50 to-blue-50 rounded-2xl p-8 max-w-5xl mx-auto">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <Target className="w-5 h-5 text-red-600 mr-2" />
                    Program Süresince Katılımcılar:
                  </h4>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                      <span>Gerçek dünya problemlerini çözen projeler üretir</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                      <span>Huawei Cloud altyapısı üzerinde uygulamalı deneyim kazanır</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                      <span>Mentor desteği ile bireysel gelişimlerini destekler</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                      <span>Haftalık görevler, videolar ve kaynaklarla düzenli ilerleme sağlar</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <Award className="w-5 h-5 text-red-600 mr-2" />
                    Vizyon & Misyon:
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <h5 className="font-semibold text-gray-900 mb-2">🎯 Vizyonumuz</h5>
                      <p className="text-gray-700 text-sm">Geleceğin teknoloji liderlerini bulut ve yapay zekâ alanında yetkin bireyler olarak yetiştirmek.</p>
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-900 mb-2">🚀 Misyonumuz</h5>
                      <p className="text-gray-700 text-sm">Erişilebilir, kaliteli ve uygulamalı bir eğitim ortamı sunarak, bilgiye dayalı üretkenliği ve ekip çalışmasını teşvik etmek.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6 text-center">
                <p className="text-gray-600 italic">
                  Bu platform, sadece bir eğitim alanı değil; aynı zamanda bir topluluk, bir üretim ortamı ve yeni yeteneklerin keşfedildiği bir yolculuktur.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Event Details - Professional Cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {eventDetails.map((detail, index) => (
            <motion.div
                  key={detail.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
                  className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center mb-4">
                    <div className="text-white">
                      {detail.icon}
                  </div>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">{detail.title}</h4>
                  <p className="text-gray-600 text-sm">{detail.value}</p>
                </motion.div>
              ))}
              </div>
            </motion.div>

          {/* Core Values - Professional Layout */}
            <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            className="mb-20"
          >
            <div className="text-center mb-12">
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Eğitim Programımız
              </h3>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Bootcamp'imizin temelini oluşturan eğitim modülleri ve hedeflerimiz
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {coreValues.map((value, index) => (
                    <motion.div
                  key={value.title}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      viewport={{ once: true }}
                  className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 text-center group relative overflow-hidden"
                    >
                  {/* Top Accent Line */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-red-600"></div>
                  
                  <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                        <div className="text-white">
                      {value.icon}
                        </div>
                      </div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h4>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                    </motion.div>
                  ))}
              </div>
            </motion.div>

          {/* Stats Section - Professional Style */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <div className="text-center mb-12">
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Bootcamp İstatistikleri
              </h3>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Eğitim programımızın kapsamı ve başarı metrikleri
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 text-center group relative overflow-hidden"
                >
                  {/* Top Accent Line */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-red-600"></div>
                  
                  <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <div className="text-white">
                      {stat.icon}
                    </div>
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{stat.number}</div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Call to Action - Professional Style */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;