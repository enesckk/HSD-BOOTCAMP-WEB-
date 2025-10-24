'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Users, Sparkles, Target, GraduationCap, Linkedin, Instagram, Youtube, X } from 'lucide-react';
import Image from 'next/image';
import { APP_NAME, ACTIVE_CITY_POINTS, getTotalsFromCities } from '@/utils/constants';
import TurkeyMap from './TurkeyMap';
import FloatingTechIcons from './FloatingTechIcons';

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
    <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden pt-28 bg-[#F7F7F8]">
      {/* Arka plan tintleri (beyaz-lacivert) */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-[#F7F9FF] to-[#EEF2FF]" />
      <div className="pointer-events-none absolute -top-24 -right-24 w-[520px] h-[520px] rounded-full opacity-[0.08]" style={{background:"radial-gradient(50% 50% at 50% 50%, #E31B23 0%, rgba(227,27,35,0) 70%)"}} />
      <div className="pointer-events-none absolute -bottom-24 -left-24 w-[520px] h-[520px] rounded-full opacity-[0.07]" style={{background:"radial-gradient(50% 50% at 50% 50%, var(--accent) 0%, rgba(30,58,138,0) 70%)"}} />

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
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3 }}
            className="mb-5"
          >
            {/* Kategori/pill şerit (stile yakın) */}
            <div className="mb-4 flex flex-wrap items-center gap-2">
              {['Cloud','AI','DevOps'].map((cat) => (
                <span key={cat} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 backdrop-blur border border-[#E5E7EB] text-[13px] text-[#0B0F19] shadow-sm">
                  <span className="inline-block w-1.5 h-1.5 rounded-full" style={{background:'var(--accent)'}} />
                  {cat}
                </span>
              ))}
            </div>

            <motion.div
              initial={{ scale: 0.98 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="inline-block"
            >
              <h1
                className="font-black tracking-tight text-[#0B0F19] mb-2 leading-[1.05]"
                style={{ fontSize: 'clamp(40px, 7vw, 72px)' }}
              >
                HSD Türkiye <span className="text-[#E31B23]">Bootcamp</span>
              </h1>
              <div className="h-1 w-24 rounded-full mb-4" style={{background:'var(--accent)'}} />
            </motion.div>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.9 }}
                className="text-[#4B5563] mb-8 leading-relaxed max-w-2xl"
                style={{ fontSize: 'clamp(16px, 2.2vw, 20px)', lineHeight: 1.6 as unknown as string }}
              >
                Türkiye genelinde teknoloji ve inovasyon eğitimleri. Cloud, AI, DevOps ve daha fazlası.
              </motion.p>

              {/* Sosyal Medya İkonları */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.9 }}
                className="mb-10"
              >
                <div className="inline-flex items-center gap-3 px-4 py-3 rounded-xl bg-white/90 backdrop-blur border border-[#E5E7EB] text-[#0B0F19] shadow-sm">
                  <div className="flex items-center gap-4">
                    {[
                      { name: 'LinkedIn', icon: <Linkedin className="w-6 h-6" />, url: 'https://www.linkedin.com/company/hsdturkiye/posts/?feedView=all', color: 'hover:text-blue-600' },
                      { name: 'YouTube', icon: <Youtube className="w-6 h-6" />, url: 'https://www.youtube.com/c/HuaweiDeveloperGroupsTürkiye', color: 'hover:text-red-600' },
                      { name: 'Medium', icon: <span className="text-2xl font-bold text-gray-600">M</span>, url: 'https://medium.com/huawei-developers', color: 'hover:text-green-600' },
                      { name: 'X (Twitter)', icon: <X className="w-6 h-6" />, url: 'https://x.com/turkiye_hsd', color: 'hover:text-black' }
                    ].map((social, index) => (
                      <motion.a
                        key={social.name}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.2, rotate: 5 }}
                        whileTap={{ scale: 0.9 }}
                        className={`text-gray-600 transition-all duration-300 ${social.color} hover:drop-shadow-lg`}
                        title={social.name}
                      >
                        {social.icon}
                      </motion.a>
                    ))}
                  </div>
                  <span className="text-sm sm:text-base font-medium ml-2">
                    Bizi takip edin
                  </span>
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
                className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mt-8 sm:mt-10 lg:mt-14"
          >
            <button
              onClick={handleLoginClick}
              className="group relative bg-[#E31B23] hover:bg-[#C8161D] text-white font-semibold py-4 sm:py-4.5 px-8 sm:px-10 rounded-xl text-base sm:text-lg transition-colors flex items-center justify-center gap-2 shadow-md hover:shadow-lg hover:-translate-y-[1px] transform w-full sm:w-auto"
            >
                  <Sparkles className="w-5 h-5" />
              <span>Giriş Yap</span>
                  <ArrowRight className="w-5 h-5" />
            </button>
            
            <button
              onClick={handleLearnMoreClick}
              className="group text-white font-semibold py-4 sm:py-4.5 px-8 sm:px-10 rounded-xl text-base sm:text-lg transition-colors flex items-center justify-center gap-2 w-full sm:w-auto shadow-md hover:shadow-lg hover:-translate-y-[1px] transform"
              style={{background:'var(--accent)'}}
              onMouseEnter={(e)=>{(e.currentTarget as HTMLButtonElement).style.background = 'var(--accent-hover)'}}
              onMouseLeave={(e)=>{(e.currentTarget as HTMLButtonElement).style.background = 'var(--accent)'}}
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

      {/* Dağınık teknoloji ikonları (arka katman) */}
      <FloatingTechIcons density="medium" />

      {/* Wave divider to next section (About background #F8FAFC) */}
      {/* Dalga divider bağımsız bileşene taşındı */}
    </section>
  );
};

export default Hero;




