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
      title: 'Cloud Computing',
      description: 'Huawei Cloud altyapısı üzerinde modern bulut teknolojilerini öğrenin',
      icon: <Zap className="w-6 h-6" />,
    },
    {
      title: 'Yapay Zeka',
      description: 'AI/ML algoritmaları ve uygulamaları ile geleceğin teknolojisini keşfedin',
      icon: <Lightbulb className="w-6 h-6" />,
    },
    {
      title: 'DevOps',
      description: 'Sürekli entegrasyon ve dağıtım süreçlerini öğrenin',
      icon: <Target className="w-6 h-6" />,
    },
    {
      title: 'Proje Geliştirme',
      description: 'Gerçek dünya problemlerini çözen projeler üretin',
      icon: <Award className="w-6 h-6" />,
    },
  ];

  const stats = [
    {
      number: 40,
      label: 'Saat Eğitim',
      icon: <Calendar className="w-6 h-6" />,
    },
    {
      number: 100,
      label: 'Pratik',
      icon: <Target className="w-6 h-6" />,
    },
    {
      number: 1000,
      label: 'Katılımcı',
      icon: <Users className="w-6 h-6" />,
    },
    {
      number: 8,
      label: 'Hafta Program',
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
              <span className="text-[var(--primary)]">Afet Fikir Teknolojileri</span> Maratonu
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
            {/* Left Column - Statistics Grid */}
            <div>
              <div className="grid grid-cols-2 gap-6">
                {stats.map((stat, index) => (
                <motion.div
                    key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                    className="bg-white border border-[var(--border)] rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 text-center group"
                  >
                    <div className="w-16 h-16 bg-[var(--primary)]/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <div className="text-[var(--primary)]">{stat.icon}</div>
                    </div>
                    <div className="text-3xl font-bold text-[var(--text)] mb-2">
                      <AnimatedCounter target={stat.number} suffix={stat.number >= 1000 ? '+' : ''} />
                    </div>
                    <div className="text-sm font-semibold text-[var(--text)] mb-1">{stat.label}</div>
                    <div className="text-xs text-[var(--text-muted)] leading-relaxed">
                      {stat.number === 40 && "Saatlik eğitim programı ile kapsamlı öğrenme deneyimi"}
                      {stat.number === 100 && "Pratik odaklı projeler ile gerçek dünya deneyimi"}
                      {stat.number === 1000 && "Aktif katılımcı ile geniş topluluk"}
                      {stat.number === 8 && "Haftalık yoğun eğitim programı"}
                  </div>
                </motion.div>
              ))}
              </div>
            </div>

            {/* Right Column - Program Benefits */}
            <div>
            
             
              <p className="text-lg text-[var(--text-muted)] leading-relaxed mb-8">
                HSD Türkiye Bootcamp, teknoloji ve inovasyon alanında kendini geliştirmek isteyen katılımcılar için özel olarak tasarlanmış teknik ve kişisel gelişim odaklı bir eğitim platformudur. Bu platform, yeni nesil teknolojileri tanıtmak, katılımcıların pratik projelerle deneyim kazanmasını sağlamak ve sektörel farkındalıklarını artırmak amacıyla oluşturulmuştur.
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-[var(--primary)] mr-3 mt-1 flex-shrink-0" />
                  <span className="text-[var(--text-muted)]">Gerçek dünya problemlerini çözen projeler üretir</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-[var(--primary)] mr-3 mt-1 flex-shrink-0" />
                  <span className="text-[var(--text-muted)]">Huawei Cloud altyapısı üzerinde uygulamalı deneyim kazanır</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-[var(--primary)] mr-3 mt-1 flex-shrink-0" />
                  <span className="text-[var(--text-muted)]">Mentor desteği ile bireysel gelişimlerini destekler</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-[var(--primary)] mr-3 mt-1 flex-shrink-0" />
                  <span className="text-[var(--text-muted)]">Haftalık görevler, videolar ve kaynaklarla düzenli ilerleme sağlar</span>
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
              <h3 className="text-3xl font-bold text-[var(--text)] mb-4">Eğitim Programımız</h3>
              <p className="text-lg text-[var(--text-muted)] max-w-3xl mx-auto">Bootcamp'imizin temelini oluşturan eğitim modülleri ve hedeflerimiz</p>
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

          {/* YouTube Channel Info */}
                <motion.div
            initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
                  viewport={{ once: true }}
            className="bg-gradient-to-r from-[var(--primary)] to-[var(--primary)]/90 rounded-2xl p-8 mb-16 text-white"
          >
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 md:space-x-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Play className="w-6 h-6" />
                  </div>
                  <div>
                  <h3 className="text-xl font-bold">Huawei Developer Groups Türkiye</h3>
                  <p className="text-white/80">Bootcamp'lerimiz YouTube kanalımızda canlı olarak yayınlanmaktadır</p>
                </div>
                  </div>
              <a
                href="https://www.youtube.com/c/HuaweiDeveloperGroupsTürkiye"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-[var(--primary)] px-6 py-3 rounded-xl font-semibold hover:bg-white/90 transition-colors duration-200 flex items-center space-x-2"
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