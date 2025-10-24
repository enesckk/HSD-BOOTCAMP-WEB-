'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Users, Target, Award, Lightbulb, Zap, CheckCircle, ArrowRight, Calendar, MapPin, Play,
} from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';

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
    <span ref={ref} className="font-bold text-3xl md:text-4xl text-[var(--text)]">
      {prefix}{count}{suffix}
    </span>
  );
};

const About: React.FC = () => {

  const coreValues = [
    {
      title: 'Teknoloji Eğitimleri',
      description: 'En güncel teknoloji trendleri ve yazılım geliştirme konularında eğitimler',
      icon: <Zap className="w-6 h-6" />,
    },
    {
      title: 'Liderlik Gelişimi',
      description: 'Topluluk önünde konuşma, organizasyon düzenleme ve liderlik becerileri',
      icon: <Lightbulb className="w-6 h-6" />,
    },
    {
      title: 'Kariyer Rehberliği',
      description: 'Kariyer planlama, network kurma ve profesyonel gelişim desteği',
      icon: <Target className="w-6 h-6" />,
    },
    {
      title: 'Topluluk Kurma',
      description: 'Kendi üniversitelerinde topluluk kurma ve geliştirme deneyimi',
      icon: <Award className="w-6 h-6" />,
    },
  ];


  return (
    <section id="about" className="relative py-20 bg-white">
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
              <span>Hakkımızda</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-[var(--text)] mb-6">
              <span className="text-[var(--primary)]">Huawei Student Developers</span> (HSD)
            </h2>
            
          </motion.div>


          {/* Program Highlights - 2 Column Layout with Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="grid lg:grid-cols-2 gap-12 mb-16"
          >
            {/* Left Column - Social Media Icons */}
            <div>
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-[var(--text)] mb-2">Bizi Takip Edin</h3>
                <p className="text-[var(--text-muted)]">HSD topluluğu ile bağlantıda kalın</p>
              </div>
              <div className="flex justify-center space-x-6">
                {[
                  { name: 'LinkedIn', icon: '💼', url: 'https://www.linkedin.com/company/huawei-turkey', color: 'hover:text-blue-600' },
                  { name: 'Medium', icon: '📝', url: 'https://medium.com/@huaweiturkey', color: 'hover:text-green-600' },
                  { name: 'Instagram', icon: '📸', url: 'https://www.instagram.com/huaweiturkey', color: 'hover:text-pink-600' },
                  { name: 'X (Twitter)', icon: '🐦', url: 'https://twitter.com/HuaweiTurkey', color: 'hover:text-black' },
                  { name: 'YouTube', icon: '📺', url: 'https://www.youtube.com/c/HuaweiDeveloperGroupsTürkiye', color: 'hover:text-red-600' }
                ].map((social, index) => (
                  <motion.a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                    className={`text-4xl transition-all duration-300 ${social.color} hover:drop-shadow-lg`}
                    title={social.name}
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Right Column - Program Benefits */}
            <div>
            
             
              <p className="text-lg text-[var(--text-muted)] leading-relaxed mb-8">
                Teknoloji tutkusunu paylaşan üniversite öğrencilerine yönelik Huawei tarafından desteklenen küresel bir programdır. Türkiye genelinde teknoloji ve inovasyon eğitimleri. Cloud, AI, DevOps ve daha fazlası.
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-[var(--primary)] mr-3 mt-1 flex-shrink-0" />
                  <span className="text-[var(--text-muted)]">Teknoloji, yazılım, liderlik ve kariyer konularında eğitimler</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-[var(--primary)] mr-3 mt-1 flex-shrink-0" />
                  <span className="text-[var(--text-muted)]">Kendi üniversitelerinde topluluk kurma ve geliştirme fırsatı</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-[var(--primary)] mr-3 mt-1 flex-shrink-0" />
                  <span className="text-[var(--text-muted)]">Liderlik, topluluk önünde konuşma ve organizasyon deneyimi</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-[var(--primary)] mr-3 mt-1 flex-shrink-0" />
                  <span className="text-[var(--text-muted)]">Yazılım alanında uygulamalı bilgi ve deneyim kazanma</span>
                </div>
              </div>
            </div>
          </motion.div>


          {/* Core Values - 4 Column Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-[var(--text)] mb-4">HSD Nasıl Çalışır?</h3>
              <p className="text-lg text-[var(--text-muted)] max-w-3xl mx-auto">Huawei Student Developers Programı; teknoloji, yazılım, liderlik, kariyer gibi konularda ekosistemindeki üyelere eğitimler verir ve etkinlikler düzenler.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {coreValues.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white border border-[var(--border)] rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group"
                >
                  <div className="w-14 h-14 bg-[var(--accent)] rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <div className="text-white">{value.icon}</div>
                  </div>
                  <h4 className="text-lg font-semibold text-[var(--text)] mb-3">{value.title}</h4>
                  <p className="text-[var(--text-muted)] text-sm leading-relaxed">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* HSD Elçisi Olma Bölümü */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-[var(--primary)] to-[var(--primary)]/90 rounded-2xl p-8 mb-16 text-white"
          >
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold mb-4">HSD Elçisi Olmak İster misiniz?</h3>
              <p className="text-lg text-white/90 max-w-3xl mx-auto">
                Huawei Student Developers (HSD) elçisi olmak için gerekenler:
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="space-y-4">
                <h4 className="text-xl font-semibold mb-4">Gereksinimler:</h4>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-white mr-3 mt-1 flex-shrink-0" />
                    <span className="text-white/90">Gelişime ve öğrenmeye açık, teknolojiye meraklı</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-white mr-3 mt-1 flex-shrink-0" />
                    <span className="text-white/90">Takımını yönlendirerek, deneyim sahibi olmak isteyen</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-white mr-3 mt-1 flex-shrink-0" />
                    <span className="text-white/90">En az 1 yıl üniversitesinde aktif olabilecek</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-white mr-3 mt-1 flex-shrink-0" />
                    <span className="text-white/90">Lisans ya da lisansüstü öğrencisi olmak</span>
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <div className="bg-white/20 rounded-xl p-6 mb-6">
                  <h4 className="text-xl font-semibold mb-2">Başvuru Yapın</h4>
                  <p className="text-white/90 mb-4">
                    HSD elçisi olmak için başvurunuzu aşağıdaki linkten yapabilirsiniz
                  </p>
                  <a
                    href="https://developer.huawei.com/consumer/en/programs/hsd/ambassador"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white text-[var(--primary)] px-6 py-3 rounded-xl font-semibold hover:bg-white/90 transition-colors duration-200 inline-flex items-center space-x-2"
                  >
                    <span>Başvuru Yap</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* YouTube Channel Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-8 text-white"
          >
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 md:space-x-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Play className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Huawei Developer Groups Türkiye</h3>
                  <p className="text-white/80">HSD etkinlikleri ve eğitimleri YouTube kanalımızda canlı olarak yayınlanmaktadır</p>
                </div>
              </div>
              <a
                href="https://www.youtube.com/c/HuaweiDeveloperGroupsTürkiye"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-gray-900 px-6 py-3 rounded-xl font-semibold hover:bg-white/90 transition-colors duration-200 flex items-center space-x-2"
              >
                <span>Kanalı Ziyaret Et</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;