'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Users, Sparkles, Target } from 'lucide-react';
import Image from 'next/image';
import { APP_NAME, ACTIVE_CITY_POINTS, getTotalsFromCities } from '@/utils/constants';
import TurkeyMap from './TurkeyMap';

const Hero: React.FC = () => {
  const handleLoginClick = () => {
    window.location.href = '/login';
  };

  const handleLearnMoreClick = () => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
  };

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const totals = useMemo(() => getTotalsFromCities(ACTIVE_CITY_POINTS), []);

  return (
    <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden pt-36 bg-[#F7F7F8]">
      {/* Açık arka plan (mavi tint) */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-[#F7F9FF] to-[#EEF2FF]" />

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-screen py-20">
            
            {/* Sol Taraf - İçerik */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="text-left"
            >
          
          {/* Main Title */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="mb-6"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
                  transition={{ duration: 1, delay: 0.7 }}
              className="inline-block"
            >
                  <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight text-[#0B0F19] mb-2 leading-[1.05]">
                    HSD Türkiye <span className="text-[#E31B23]">Bootcamp</span>
              </h1>
                  <div className="h-1 w-24 bg-[#2563EB] rounded-full mb-4" />
            </motion.div>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.9 }}
                className="text-lg sm:text-xl text-[#4B5563] mb-8 leading-relaxed max-w-2xl"
              >
                Türkiye genelinde teknoloji ve inovasyon eğitimleri. Cloud, AI, DevOps ve daha fazlası.
              </motion.p>

              {/* İstatistik rozetleri */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.0 }}
                className="flex flex-wrap items-center gap-3 mb-10"
              >
                <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-white text-[#0B0F19] text-sm shadow-sm border border-[#E5E7EB]">
                  <Users className="w-4 h-4 text-[#E31B23]" /> {totals.cityCount} şehir
                </div>
                <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-white text-[#0B0F19] text-sm shadow-sm border border-[#E5E7EB]">
                  <svg className="w-4 h-4 text-[#2563EB]" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3l9 5-9 5-9-5 9-5zm0 7l9 5-9 5-9-5 9-5z"/></svg> {totals.totalUniversities} üniversite
                </div>
                <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-white text-[#0B0F19] text-sm shadow-sm border border-[#E5E7EB]">
                  <Sparkles className="w-4 h-4 text-[#E31B23]" /> {totals.totalBootcamps} bootcamp
                </div>
              </motion.div>

          {/* Event Info Cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1.1 }}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-6"
              >
               
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1.2 }}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4"
          >
            <button
              onClick={handleLoginClick}
                  className="group relative bg-[#E31B23] hover:bg-[#C8161D] text-white font-semibold py-3.5 sm:py-4 px-7 sm:px-9 rounded-xl text-base sm:text-lg transition-colors flex items-center justify-center gap-2 shadow-md w-full sm:w-auto"
            >
                  <Sparkles className="w-5 h-5" />
              <span>Giriş Yap</span>
                  <ArrowRight className="w-5 h-5" />
            </button>
            
            <button
              onClick={handleLearnMoreClick}
                  className="group bg-[#2563EB] hover:bg-[#1E40AF] text-white font-semibold py-3.5 sm:py-4 px-7 sm:px-9 rounded-xl text-base sm:text-lg transition-colors flex items-center justify-center gap-2 w-full sm:w-auto shadow-md"
            >
                  <Target className="w-5 h-5" />
              <span>Daha Fazla Bilgi</span>
            </button>
          </motion.div>
            </motion.div>

            {/* Sağ Taraf - Görsel Alan (Türkiye Haritası ve Deprem Dalgaları) */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="relative h-80 sm:h-96 lg:h-full flex items-center justify-center order-first lg:order-last"
            >
              <TurkeyMap />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll indicator kaldırıldı */}
    </section>
  );
};

export default Hero;




