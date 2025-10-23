'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
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
  ChevronRight,
  Play,
  Clock,
  BookOpen
} from 'lucide-react';

// Animasyonlu sayaç bileşeni
const AnimatedCounter: React.FC<{ 
  target: number; 
  suffix?: string; 
  duration?: number;
  prefix?: string;
}> = ({ target, suffix = '', duration = 1200, prefix = '' }) => {
  const ref = useRef<HTMLSpanElement | null>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    
    let startTime: number;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(target * easeOutQuart));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [isInView, target, duration]);

  return (
    <span ref={ref} className="font-bold text-3xl">
      {prefix}{count}{suffix}
    </span>
  );
};

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
      duration: "8 Hafta",
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
      duration: "6 Hafta",
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
      year: "2022",
      title: "HSD Türkiye Bootcamp",
      subtitle: "Deprem ve Doğal Afet Yönetimi",
      location: "İstanbul",
      participants: "25+",
      projects: "6+",
      duration: "2 Gün",
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
    <section className="relative py-20 bg-[#F8FAFC]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center space-x-2 bg-[var(--accent)]/10 border border-[var(--accent)]/20 text-[var(--accent)] px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Calendar className="w-4 h-4" />
              <span>Geçmiş Başarılar</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-[var(--text)] mb-6">
              Geçmiş <span className="text-[var(--primary)]">Bootcamp ve Maratonlar</span>
            </h2>
            <p className="text-lg text-[var(--text-muted)] max-w-4xl mx-auto leading-relaxed">
              Huawei Türkiye tarafından düzenlenen geçmiş bootcamp ve maratonların başarıları ve genç yeteneklerin geliştirdiği dijital çözümler.
            </p>
          </motion.div>

          {/* Event Cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-12 mb-16"
          >
            {previousEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl shadow-lg border border-[var(--border)] overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                {/* Top Accent Line */}
                <div className="h-1 bg-gradient-to-r from-[var(--accent)] to-[var(--primary)]"></div>
                
                <div className="p-8 lg:p-12">
                  <div className="grid lg:grid-cols-2 gap-8 items-center">
                    {/* Text Content */}
                    <div>
                      <div className="flex items-center gap-4 mb-6">
                        <div className="inline-flex items-center space-x-2 bg-[var(--primary)] text-white px-4 py-2 rounded-full text-sm font-semibold">
                          <Calendar className="w-4 h-4" />
                          <span>{event.year}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[var(--text-muted)] text-sm">
                          <MapPin className="w-4 h-4" />
                          <span>{event.location}</span>
                        </div>
                      </div>
                      
                      <h3 className="text-2xl lg:text-3xl font-bold text-[var(--text)] mb-3">
                        {event.title}
                      </h3>
                      <p className="text-lg text-[var(--primary)] mb-4 font-semibold">
                        {event.subtitle}
                      </p>
                      <p className="text-[var(--text-muted)] leading-relaxed mb-6">
                        {event.description}
                      </p>
                      
                      {/* Event Details */}
                      <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="bg-[var(--accent)]/10 rounded-xl p-4 text-center">
                          <div className="text-2xl font-bold text-[var(--accent)] mb-1">{event.participants}</div>
                          <div className="text-sm text-[var(--text-muted)] font-medium">Katılımcı</div>
                        </div>
                        <div className="bg-[var(--primary)]/10 rounded-xl p-4 text-center">
                          <div className="text-2xl font-bold text-[var(--primary)] mb-1">{event.projects}</div>
                          <div className="text-sm text-[var(--text-muted)] font-medium">Proje</div>
                        </div>
                        <div className="bg-[var(--accent)]/10 rounded-xl p-4 text-center">
                          <div className="text-2xl font-bold text-[var(--accent)] mb-1">{event.duration}</div>
                          <div className="text-sm text-[var(--text-muted)] font-medium">Süre</div>
                        </div>
                      </div>

                      {/* Achievements */}
                      <div className="space-y-2 mb-6">
                        {event.achievements.map((achievement, achievementIndex) => (
                          <div key={achievementIndex} className="flex items-center space-x-3">
                            <CheckCircle className="w-4 h-4 text-[var(--primary)] flex-shrink-0" />
                            <span className="text-[var(--text-muted)] text-sm">{achievement}</span>
                          </div>
                        ))}
                      </div>

                      {/* CTA Button */}
                      <a
                        href={event.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-2 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:shadow-lg"
                      >
                        <span>Detaylı Bilgi</span>
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>

                    {/* Image Carousel */}
                    <div className="relative">
                      <div className="relative h-64 lg:h-80 rounded-2xl overflow-hidden bg-gradient-to-br from-[var(--accent)]/10 to-[var(--primary)]/10">
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
                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                              <div className="text-center text-white">
                                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                                  <Trophy className="w-8 h-8 text-white" />
                                </div>
                                <p className="text-white font-bold text-lg">
                                  {event.title}
                                </p>
                                <p className="text-white/80 text-sm mt-1">
                                  {event.location} • {event.year}
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        </AnimatePresence>

                        {/* Navigation Arrows */}
                        <button
                          onClick={() => prevSlide(event.id)}
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-[var(--text)] hover:bg-white transition-all duration-300 z-20 shadow-lg"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => nextSlide(event.id)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-[var(--text)] hover:bg-white transition-all duration-300 z-20 shadow-lg"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>

                        {/* Dots Indicator */}
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
                          {event.images.map((_, imageIndex) => (
                            <div
                              key={imageIndex}
                              className={`w-2 h-2 rounded-full transition-all duration-300 ${
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

          {/* Overall Statistics - 2 Column Layout */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Left Column - Statistics Grid */}
              <div>
                <div className="grid grid-cols-2 gap-6">
                  {highlights.map((highlight, index) => (
                    <motion.div
                      key={highlight.title}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="bg-white border border-[var(--border)] rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 text-center group"
                    >
                      <div className="w-16 h-16 bg-[var(--primary)]/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                        <div className="text-[var(--primary)]">{highlight.icon}</div>
                      </div>
                      <div className="text-3xl font-bold text-[var(--text)] mb-2">
                        <AnimatedCounter target={parseInt(highlight.number.replace('+', '')) || 0} suffix={highlight.number.includes('+') ? '+' : ''} />
                      </div>
                      <div className="text-sm font-semibold text-[var(--text)] mb-1">{highlight.title}</div>
                      <div className="text-xs text-[var(--text-muted)] leading-relaxed">
                        {highlight.title === "Toplam Katılımcı" && "Teknoloji uzmanları eğitim aldı"}
                        {highlight.title === "Geliştirilen Proje" && "Pratik projeler tamamlandı"}
                        {highlight.title === "Huawei Desteği" && "Teknoloji ve mentorluk desteği"}
                        {highlight.title === "Sertifikasyon" && "Başarılı sertifikasyon programı"}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Right Column - Explanation */}
              <div>
                
                <h3 className="text-3xl md:text-4xl font-bold text-[var(--text)] mb-6">
                  Maraton <span className="text-[var(--primary)]">İstatistikleri</span>
                </h3>
                <p className="text-lg text-[var(--text-muted)] leading-relaxed mb-8">
                  Huawei Fikir Maratonlarının toplam başarıları ve etkileri. Geçmiş yıllarda düzenlenen bootcamp ve maratonlarımızın genel başarı metrikleri ve katılımcılarımızın elde ettiği sonuçlar.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-[var(--primary)] mr-3 mt-1 flex-shrink-0" />
                    <span className="text-[var(--text-muted)]">145+ teknoloji uzmanı eğitim aldı</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-[var(--primary)] mr-3 mt-1 flex-shrink-0" />
                    <span className="text-[var(--text-muted)]">41+ pratik proje tamamlandı</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-[var(--primary)] mr-3 mt-1 flex-shrink-0" />
                    <span className="text-[var(--text-muted)]">100% Huawei teknoloji ve mentorluk desteği</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-[var(--primary)] mr-3 mt-1 flex-shrink-0" />
                    <span className="text-[var(--text-muted)]">90+ başarılı sertifikasyon programı</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default PreviousMarathons;