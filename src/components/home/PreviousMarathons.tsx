'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Users,
  Award,
  Star,
  Trophy,
  Target,
  ArrowRight,
  MapPin,
  CheckCircle,
  ExternalLink,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const PreviousMarathons: React.FC = () => {
  const [currentSlide1, setCurrentSlide1] = useState(0);
  const [currentSlide2, setCurrentSlide2] = useState(0);

  const previousEvents = [
    {
      id: 1,
      year: "2024",
      title: "Huawei Cloud AI Bootcamp",
      subtitle: "Yapay Zeka ve Makine Öğrenmesi",
      location: "Online",
      participants: "50+",
      projects: "15+",
      description: "Huawei Cloud AI teknolojileri üzerine kapsamlı eğitim programı. Katılımcılar AI/ML servisleri ile pratik deneyim kazandı.",
      achievements: [
        "50+ katılımcı eğitim aldı",
        "15+ AI projesi geliştirildi",
        "Huawei Cloud AI servisleri kullanıldı",
        "Sertifikasyon programı tamamlandı"
      ],
      images: [
        "/images/bootcamp-ai-2024-1.jpg",
        "/images/bootcamp-ai-2024-2.jpg",
        "/images/bootcamp-ai-2024-3.jpg"
      ],
      link: "https://developer.huawei.com/tr/activity/ai-bootcamp-2024"
    },
    {
      id: 2,
      year: "2023",
      title: "Huawei Cloud DevOps Bootcamp",
      subtitle: "DevOps ve CI/CD",
      location: "Online",
      participants: "40+",
      projects: "12+",
      description: "DevOps metodolojileri ve sürekli entegrasyon süreçleri üzerine yoğun eğitim programı. Huawei Cloud DevOps araçları ile pratik deneyim.",
      achievements: [
        "40+ DevOps uzmanı yetiştirildi",
        "12+ CI/CD pipeline geliştirildi",
        "Huawei Cloud DevOps araçları kullanıldı",
        "Sertifikasyon programı tamamlandı"
      ],
      images: [
        "/images/bootcamp-devops-2023-1.jpg",
        "/images/bootcamp-devops-2023-2.jpg",
        "/images/bootcamp-devops-2023-3.jpg"
      ],
      link: "https://developer.huawei.com/tr/activity/devops-bootcamp-2023"
    },
    {
      id: 3,
      year: "2023",
      title: "Afet Yönetimi Teknolojileri Fikir Maratonu",
      subtitle: "Afet Yönetimi ve Dijital Çözümler",
      location: "Gaziantep",
      participants: "30+",
      projects: "8+",
      description: "Afet yönetimi alanında yenilikçi teknoloji çözümleri geliştirmek için düzenlenen 48 saatlik yoğun maraton. Genç yetenekler afet öncesi, sırası ve sonrası süreçlerde teknoloji destekli çözümler üretti.",
      achievements: [
        "30+ genç yetenek katıldı",
        "8+ afet yönetimi projesi geliştirildi",
        "IoT ve AI teknolojileri kullanıldı",
        "Gaziantep'te yerel çözümler üretildi"
      ],
      images: [
        "/images/marathon-disaster-2023-1.jpg",
        "/images/marathon-disaster-2023-2.jpg",
        "/images/marathon-disaster-2023-3.jpg"
      ],
      link: "https://developer.huawei.com/tr/activity/disaster-management-marathon-2023"
    },
    {
      id: 4,
      year: "2022",
      title: "Afet Yönetimi Teknolojileri Fikir Maratonu",
      subtitle: "Deprem ve Doğal Afet Yönetimi",
      location: "İstanbul",
      participants: "25+",
      projects: "6+",
      description: "Deprem ve doğal afetlerin teknoloji ile yönetimi konusunda fikir maratonu. Katılımcılar erken uyarı sistemleri, hasar tespiti ve koordinasyon çözümleri geliştirdi.",
      achievements: [
        "25+ katılımcı ile başarılı maraton",
        "6+ afet yönetimi projesi",
        "Deprem erken uyarı sistemleri geliştirildi",
        "Huawei Cloud teknolojileri kullanıldı"
      ],
      images: [
        "/images/marathon-disaster-2022-1.jpg",
        "/images/marathon-disaster-2022-2.jpg",
        "/images/marathon-disaster-2022-3.jpg"
      ],
      link: "https://developer.huawei.com/tr/activity/disaster-management-marathon-2022"
    }
  ];

  const highlights = [
    {
      icon: <Users className="w-6 h-6" />,
      title: "Toplam Katılımcı",
      number: "145+",
      description: "Teknoloji uzmanları eğitim aldı"
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Geliştirilen Proje",
      number: "41+",
      description: "Pratik projeler tamamlandı"
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: "Huawei Desteği",
      number: "100%",
      description: "Teknoloji ve mentorluk desteği"
    },
    {
      icon: <Trophy className="w-6 h-6" />,
      title: "Sertifikasyon",
      number: "90+",
      description: "Başarılı sertifikasyon programı"
    }
  ];

  // Auto-play functionality for each carousel
  useEffect(() => {
    const timer1 = setInterval(() => {
      setCurrentSlide1((prev) => (prev + 1) % previousEvents[0].images.length);
    }, 4000);
    return () => clearInterval(timer1);
  }, []);

  useEffect(() => {
    const timer2 = setInterval(() => {
      setCurrentSlide2((prev) => (prev + 1) % previousEvents[1].images.length);
    }, 4000);
    return () => clearInterval(timer2);
  }, []);

  const nextSlide = (eventId: number) => {
    if (eventId === 1) {
      setCurrentSlide1((prev) => (prev + 1) % previousEvents[0].images.length);
    } else {
      setCurrentSlide2((prev) => (prev + 1) % previousEvents[1].images.length);
    }
  };

  const prevSlide = (eventId: number) => {
    if (eventId === 1) {
      setCurrentSlide1((prev) => (prev - 1 + previousEvents[0].images.length) % previousEvents[0].images.length);
    } else {
      setCurrentSlide2((prev) => (prev - 1 + previousEvents[1].images.length) % previousEvents[1].images.length);
    }
  };

  return (
    <section className="relative py-20 bg-white">
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
              <Calendar className="w-4 h-4" />
              <span>Geçmiş Başarılar</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Geçmiş <span className="text-red-600">Bootcamp ve Maratonlar</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Huawei Türkiye tarafından düzenlenen geçmiş bootcamp ve maratonların başarıları ve 
              genç yeteneklerin geliştirdiği dijital çözümler.
            </p>
          </motion.div>

          {/* Event Cards */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="mb-20 space-y-16"
          >
            {previousEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 relative"
              >
                {/* Top Accent Line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-red-600"></div>
                <div className="p-8 lg:p-12">
                  <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Text Content */}
                    <div>
                      <div className="inline-flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
                        <Calendar className="w-4 h-4" />
                        <span>{event.year}</span>
                      </div>
                      <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                        {event.title}
                      </h3>
                      <p className="text-xl text-red-600 mb-6 font-medium">
                        {event.subtitle}
                      </p>
                      <p className="text-gray-700 leading-relaxed mb-8 text-lg">
                        {event.description}
                      </p>
                      
                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-6 mb-8">
                        <div className="text-center bg-gray-50 rounded-xl p-6">
                          <div className="text-3xl font-bold text-red-600 mb-2">
                            {event.participants}
                          </div>
                          <div className="text-sm text-gray-600 font-medium">Katılımcı</div>
                        </div>
                        <div className="text-center bg-gray-50 rounded-xl p-6">
                          <div className="text-3xl font-bold text-red-600 mb-2">
                            {event.projects}
                          </div>
                          <div className="text-sm text-gray-600 font-medium">Proje</div>
                        </div>
                      </div>

                      {/* Achievements */}
                      <div className="grid grid-cols-1 gap-3 mb-8">
                        {event.achievements.map((achievement, achievementIndex) => (
                          <div key={achievementIndex} className="flex items-center space-x-3">
                            <CheckCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                            <span className="text-gray-700 font-medium">{achievement}</span>
                          </div>
                        ))}
                      </div>

                      {/* CTA Button */}
                      <a
                        href={event.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                      >
                        <span>Detaylı Bilgi</span>
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>

                    {/* Image Carousel */}
                    <div className="relative">
                      <div className="relative h-80 lg:h-96 rounded-2xl overflow-hidden bg-gradient-to-br from-red-50 to-red-100">
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={event.id === 1 ? currentSlide1 : currentSlide2}
                            initial={{ opacity: 0, scale: 1.1 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.5 }}
                            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                            style={{
                              backgroundImage: `url(${event.images[event.id === 1 ? currentSlide1 : currentSlide2]})`
                            }}
                          >
                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                              <div className="text-center text-white">
                                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                                  <Trophy className="w-10 h-10 text-white" />
                                </div>
                                <p className="text-white font-bold text-lg">
                                  {event.title}
                                </p>
                                <p className="text-white/80 text-sm mt-2">
                                  {event.location} • {event.year}
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        </AnimatePresence>

                        {/* Navigation Arrows */}
                        <button
                          onClick={() => prevSlide(event.id)}
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-700 hover:bg-white transition-all duration-300 z-20 shadow-lg"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => nextSlide(event.id)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-700 hover:bg-white transition-all duration-300 z-20 shadow-lg"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>

                        {/* Dots Indicator */}
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
                          {event.images.map((_, imageIndex) => (
                            <div
                              key={imageIndex}
                              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                (event.id === 1 ? currentSlide1 : currentSlide2) === imageIndex
                                  ? 'bg-white shadow-lg'
                                  : 'bg-white/50'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Overall Statistics */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                Maraton <span className="text-red-600">İstatistikleri</span>
              </h3>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Huawei Fikir Maratonlarının toplam başarıları ve etkileri
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {highlights.map((highlight, index) => (
                <motion.div
                  key={highlight.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05 }}
                  className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 text-center"
                >
                  <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <div className="text-white">
                      {highlight.icon}
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{highlight.number}</div>
                  <h4 className="text-lg font-bold text-gray-900 mb-3">{highlight.title}</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">{highlight.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default PreviousMarathons;