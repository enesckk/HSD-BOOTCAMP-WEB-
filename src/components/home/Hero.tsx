'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Users, Sparkles, Target } from 'lucide-react';
import Image from 'next/image';
import { APP_NAME } from '@/utils/constants';

const Hero: React.FC = () => {
  const handleLoginClick = () => {
    window.location.href = '/login';
  };

  const handleLearnMoreClick = () => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
  };

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Parçacıklar: SSR-hydration hatalarını önlemek için sadece client'ta üret
  const particleConfig = useMemo(() => {
    if (!mounted) return [] as { left: string; top: string; duration: number; delay: number; color: 'white'|'yellow'|'blue' }[];
    return Array.from({ length: 15 }).map((_, i) => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      duration: Math.random() * 3 + 3,
      delay: Math.random() * 2,
      color: (i % 3 === 0 ? 'white' : (i % 3 === 1 ? 'yellow' : 'blue')) as 'white'|'yellow'|'blue',
    }));
  }, [mounted]);

  return (
    <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden pt-36">
             {/* Dynamic Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-900 via-red-800 to-blue-900">
        {/* Animated Grid */}
        <div className="absolute inset-0 opacity-20">
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='grid' width='20' height='20' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 20 0 L 0 0 0 20' fill='none' stroke='%23ffffff' stroke-width='0.5'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100' height='100' fill='url(%23grid)'/%3E%3C/svg%3E")`,
            }}
          />
        </div>
      </div>

      {/* Floating Particles (client-only to avoid hydration mismatch) */}
      {mounted && (
        <div className="absolute inset-0 overflow-hidden">
          {particleConfig.map((p, i) => (
            <motion.div
              key={i}
              className={`absolute w-1 h-1 rounded-full ${
                p.color === 'white' ? 'bg-white/40' : p.color === 'yellow' ? 'bg-yellow-400/30' : 'bg-blue-400/30'
              }`}
              style={{ left: p.left, top: p.top }}
              animate={{ y: [0, -200, 0], opacity: [0, 1, 0], scale: [0, 1, 0] }}
              transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: 'easeInOut' }}
            />
          ))}
        </div>
      )}

      {/* Türkiye Haritası ve Deprem Dalgaları - Sağ Taraf */}
      <div className="absolute top-1/2 right-1/12 transform -translate-y-1/2">
        {/* Türkiye Haritası - Gerçek Resim */}
        <div className="relative w-[600px] h-[600px]">
          <Image
            src="/tr.png"
            alt="Türkiye Haritası"
            width={600}
            height={600}
            className="w-full h-full object-contain opacity-65 filter brightness-0 invert"
            priority
          />
      </div>


        {/* Düzenli Deprem Dalgaları - Harita İçinde Belirli Noktalardan */}
        
        {/* Gaziantep Bölgesi - Güneydoğu */}
        <div className="absolute top-[60%] left-[55%] z-10">
          {/* Merkez Kırmızı Nokta - Dalga merkezinde */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-red-500 rounded-full shadow-lg z-20"></div>
          
        {[...Array(4)].map((_, i) => (
          <motion.div
              key={`seismic-gaziantep-${i}`}
              className="absolute border-2 border-red-500/50 rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            style={{
              width: '60px',
              height: '60px',
            }}
            animate={{
                scale: [1, 2, 3, 4, 5, 6],
                opacity: [1, 0.8, 0.6, 0.4, 0.2, 0],
            }}
            transition={{
                duration: 15,
              repeat: Infinity,
                delay: i * 2,
              ease: "easeOut",
            }}
          />
        ))}
      </div>

        {/* İstanbul Bölgesi - Kuzeybatı */}
        <div className="absolute top-[25%] left-[35%] z-10">
          {/* Merkez Kırmızı Nokta */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-red-500 rounded-full shadow-lg z-20"></div>
          
          {[...Array(3)].map((_, i) => (
          <motion.div
              key={`seismic-istanbul-${i}`}
              className="absolute border border-red-500/45 rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            style={{
                width: '50px',
                height: '50px',
            }}
            animate={{
                scale: [1, 2, 3, 4, 5],
                opacity: [0.9, 0.7, 0.5, 0.3, 0],
            }}
            transition={{
                duration: 12,
              repeat: Infinity,
              delay: i * 1.5,
              ease: "easeOut",
            }}
          />
        ))}
      </div>

        {/* Ankara Bölgesi - Orta */}
        <div className="absolute top-[40%] left-[45%] z-10">
          {/* Merkez Kırmızı Nokta */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-red-500 rounded-full shadow-lg z-20"></div>
          
        {[...Array(3)].map((_, i) => (
          <motion.div
              key={`seismic-ankara-${i}`}
              className="absolute border border-red-500/45 rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            style={{
                width: '50px',
                height: '50px',
            }}
            animate={{
                scale: [1, 2, 3, 4, 5],
                opacity: [0.9, 0.7, 0.5, 0.3, 0],
            }}
            transition={{
                duration: 12,
              repeat: Infinity,
              delay: i * 1.5,
              ease: "easeOut",
            }}
          />
        ))}
      </div>

        {/* İzmir Bölgesi - Batı */}
        <div className="absolute top-[45%] left-[25%] z-10">
          {/* Merkez Kırmızı Nokta */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-red-500 rounded-full shadow-lg z-20"></div>
          
        {[...Array(3)].map((_, i) => (
          <motion.div
              key={`seismic-izmir-${i}`}
              className="absolute border border-red-500/45 rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            style={{
                width: '50px',
                height: '50px',
            }}
            animate={{
                scale: [1, 2, 3, 4, 5],
                opacity: [0.9, 0.7, 0.5, 0.3, 0],
            }}
            transition={{
                duration: 12,
              repeat: Infinity,
                delay: i * 1.5,
              ease: "easeOut",
            }}
          />
        ))}
      </div>

        {/* Doğu Anadolu - Erzurum Bölgesi */}
        <div className="absolute top-[35%] left-[65%] z-10">
          {/* Merkez Kırmızı Nokta */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-red-500 rounded-full shadow-lg z-20"></div>
          
          {[...Array(2)].map((_, i) => (
          <motion.div
              key={`seismic-erzurum-${i}`}
              className="absolute border border-red-500/40 rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            style={{
                width: '45px',
                height: '45px',
            }}
            animate={{
                scale: [1, 2, 3, 4],
                opacity: [0.8, 0.6, 0.4, 0],
            }}
            transition={{
                duration: 10,
              repeat: Infinity,
              delay: i * 1.2,
              ease: "easeOut",
            }}
          />
        ))}
      </div>

        {/* Akdeniz - Antalya Bölgesi */}
        <div className="absolute top-[55%] left-[30%] z-10">
          {/* Merkez Kırmızı Nokta */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-red-500 rounded-full shadow-lg z-20"></div>
          
          {[...Array(2)].map((_, i) => (
          <motion.div
              key={`seismic-antalya-${i}`}
              className="absolute border border-red-500/40 rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            style={{
                width: '45px',
                height: '45px',
            }}
            animate={{
                scale: [1, 2, 3, 4],
                opacity: [0.8, 0.6, 0.4, 0],
            }}
            transition={{
                duration: 10,
              repeat: Infinity,
                delay: i * 1.2,
              ease: "easeOut",
            }}
          />
        ))}
      </div>
      </div>

      {/* Teknoloji Veri Akışı - Sağ Alt */}
      <div className="absolute bottom-1/4 right-1/8">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={`data-flow-${i}`}
            className="absolute w-2 h-2 bg-cyan-400/60 rounded-full"
            style={{
              left: i * 8,
              top: 0,
            }}
            animate={{
              y: [0, 60],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.4,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

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
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 leading-tight">
                    <span className="block text-red-300 font-bold drop-shadow-lg">
                      HSD Türkiye
                </span>
                    <span className="block text-white font-extrabold">Bootcamp</span>
              </h1>
            </motion.div>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.9 }}
                className="text-lg sm:text-xl md:text-2xl text-white/95 mb-4 leading-relaxed font-medium"
              >
                <span className="text-red-300 font-bold drop-shadow-md">Teknoloji</span> ve <span className="text-red-300 font-bold drop-shadow-md">İnovasyon</span> Eğitimleri
              </motion.p>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1.0 }}
                className="text-base sm:text-lg md:text-xl text-white/85 mb-6 leading-relaxed max-w-2xl"
              >
                Farklı teknoloji alanlarında kapsamlı eğitim programları. Cloud, AI, DevOps ve daha fazlası.
          </motion.p>

              {/* Social Media Links */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1.1 }}
                className="flex flex-wrap items-center justify-center gap-3 mb-6"
              >
                <a 
                  href="https://www.linkedin.com/company/huawei-turkey" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 bg-white/15 backdrop-blur-md rounded-full px-4 py-2.5 border border-white/25 hover:bg-white/25 transition-all duration-300 cursor-pointer"
                >
                  <svg className="w-5 h-5 text-red-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  <span className="text-white font-semibold text-sm sm:text-base">LinkedIn</span>
                </a>
                <a 
                  href="https://twitter.com/HuaweiTurkey" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 bg-white/15 backdrop-blur-md rounded-full px-4 py-2.5 border border-white/25 hover:bg-white/25 transition-all duration-300 cursor-pointer"
                >
                  <svg className="w-5 h-5 text-red-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                  <span className="text-white font-semibold text-sm sm:text-base">X</span>
                </a>
                <a 
                  href="https://www.instagram.com/huaweiturkey" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 bg-white/15 backdrop-blur-md rounded-full px-4 py-2.5 border border-white/25 hover:bg-white/25 transition-all duration-300 cursor-pointer"
                >
                  <svg className="w-5 h-5 text-red-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323c-.875.807-2.026 1.297-3.323 1.297zm7.83-9.406c-.49 0-.875-.385-.875-.875s.385-.875.875-.875.875.385.875.875-.385.875-.875.875zm-7.83 1.297c-1.297 0-2.448.49-3.323 1.297-.807.875-1.297 2.026-1.297 3.323s.49 2.448 1.297 3.323c.875.807 2.026 1.297 3.323 1.297s2.448-.49 3.323-1.297c.807-.875 1.297-2.026 1.297-3.323s-.49-2.448-1.297-3.323c-.875-.807-2.026-1.297-3.323-1.297z"/>
                  </svg>
                  <span className="text-white font-semibold text-sm sm:text-base">Instagram</span>
                </a>
                <a 
                  href="https://www.youtube.com/c/HuaweiDeveloperGroupsTürkiye" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 bg-white/15 backdrop-blur-md rounded-full px-4 py-2.5 border border-white/25 hover:bg-white/25 transition-all duration-300 cursor-pointer"
                >
                  <svg className="w-5 h-5 text-red-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                  <span className="text-white font-semibold text-sm sm:text-base">YouTube</span>
                </a>
                <a 
                  href="https://medium.com/@huaweiturkey" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 bg-white/15 backdrop-blur-md rounded-full px-4 py-2.5 border border-white/25 hover:bg-white/25 transition-all duration-300 cursor-pointer"
                >
                  <svg className="w-5 h-5 text-red-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M13.54 12a6.8 6.8 0 1 1-6.8-6.8 6.8 6.8 0 0 1 6.8 6.8zM20.96 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9zM2.5 12c0 4.97 4.03 9 9 9s9-4.03 9-9-4.03-9-9-9-9 4.03-9 9z"/>
                  </svg>
                  <span className="text-white font-semibold text-sm sm:text-base">Medium</span>
                </a>
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
                  className="group relative bg-red-600 hover:bg-red-700 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-xl text-base sm:text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center justify-center space-x-3 shadow-lg w-full sm:w-auto"
            >
                  <Sparkles className="w-5 h-5" />
              <span>Giriş Yap</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <button
              onClick={handleLearnMoreClick}
                  className="group bg-white/15 backdrop-blur-md hover:bg-white/25 text-white font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-xl text-base sm:text-lg transition-all duration-300 border-2 border-white/30 hover:border-white/50 flex items-center justify-center space-x-3 w-full sm:w-auto"
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
              {/* Bu alan Türkiye haritası ve deprem dalgaları için ayrıldı */}
              <div className="text-center text-white/60">
                <div className="mb-4">
                  {/* TR yazısı kaldırıldı - sadece temiz görünüm */}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 2 }}
        className="absolute bottom-6 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center space-y-2 cursor-pointer group"
          onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
        >
          <div className="w-8 h-12 border-2 border-white/60 rounded-full flex justify-center group-hover:border-white/80 transition-colors duration-300">
          <motion.div
              animate={{ y: [0, 16, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-1 h-4 bg-white/80 rounded-full mt-2 group-hover:bg-white transition-colors duration-300"
            />
          </div>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3 }}
            className="text-white/70 text-xs font-medium group-hover:text-white transition-colors duration-300"
          >
            Aşağı Kaydır
          </motion.span>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
