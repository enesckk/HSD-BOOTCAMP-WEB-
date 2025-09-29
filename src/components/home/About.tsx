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
      icon: <Shield className="w-6 h-6" />,
      title: "Afet Yönetimi",
      description: "6 Şubat 2023 depremlerinin ardından teknolojik çözümler geliştiriyoruz"
    },
    {
      icon: <Lightbulb className="w-6 h-6" />,
      title: "İnovasyon",
      description: "Yaratıcı fikirlerinizi hayata geçirerek geleceği şekillendiriyoruz"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "İş Birliği",
      description: "Farklı disiplinlerden öğrencilerle takım çalışması deneyimi"
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Ödüller",
      description: "Huawei ürünleri ve kariyer fırsatları kazanma şansı"
    }
  ];

  const stats = [
    { number: "300+", label: "Başvuru", icon: <Target className="w-5 h-5" /> },
    { number: "57+", label: "Katılımcı", icon: <Users className="w-5 h-5" /> },
    { number: "17", label: "Takım", icon: <Lightbulb className="w-5 h-5" /> },
    { number: "100K+", label: "TL Ödül", icon: <Award className="w-5 h-5" /> }
  ];

  const eventDetails = [
    {
      icon: <Calendar className="w-5 h-5" />,
      title: "Tarih",
      value: "19-20 Şubat 2026"
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      title: "Lokasyon",
      value: "Gaziantep Şehitkamil"
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: "Katılımcı",
      value: "Üniversite Öğrencileri"
    },
    {
      icon: <Target className="w-5 h-5" />,
      title: "Odak",
      value: "Afet Yönetimi & Cloud Teknolojileri"
    }
  ];

  const handleApplyClick = () => {
    window.location.href = '/register';
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
              <span className="text-red-600">Afet Yönetimi Teknolojileri</span><br />
              Fikir Maratonu
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Huawei Türkiye tarafından düzenlenen bu maraton, 6 Şubat 2023 Kahramanmaraş depremlerinin ardından 
              afet yönetimi alanında yenilikçi teknoloji çözümleri geliştirmeyi hedefliyor.
            </p>
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
                Temel Değerlerimiz
              </h3>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Maratonumuzun temelini oluşturan değerler ve hedeflerimiz
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
                Maraton İstatistikleri
              </h3>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Geçmiş etkinliklerimizden elde ettiğimiz başarılı sonuçlar
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