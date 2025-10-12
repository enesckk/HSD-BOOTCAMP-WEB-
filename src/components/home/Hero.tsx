'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, MapPin, Users, Sparkles, Target } from 'lucide-react';
import Image from 'next/image';
import { APP_NAME, EVENT_DATE, EVENT_LOCATION } from '@/utils/constants';

const Hero: React.FC = () => {
  const handleApplyClick = () => {
    window.location.href = '/register';
  };

  const handleLearnMoreClick = () => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
  };

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

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-1 h-1 rounded-full ${
              i % 3 === 0 ? 'bg-white/40' : 
              i % 3 === 1 ? 'bg-yellow-400/30' : 
              'bg-blue-400/30'
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -200, 0],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 3,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

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
                      Afet Yönetimi Teknolojileri
                </span>
                    <span className="block text-white font-extrabold">Fikir Maratonu</span>
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
                Gaziantep Şehitkamil'de <span className="text-red-300 font-bold drop-shadow-md">Teknoloji</span> ve <span className="text-red-300 font-bold drop-shadow-md">İnovasyon</span> Buluşuyor
              </motion.p>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1.0 }}
                className="text-base sm:text-lg md:text-xl text-white/85 mb-6 leading-relaxed max-w-2xl"
              >
                Afet yönetiminde teknoloji kullanımını geliştirmek için üniversite öğrencilerinin katılımıyla düzenlenen yaratıcı fikir maratonu
          </motion.p>

          {/* Event Info Cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1.1 }}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-6"
              >
                <div className="flex items-center space-x-2 bg-white/15 backdrop-blur-md rounded-full px-4 py-2.5 border border-white/25">
                  <Calendar className="w-4 h-4 text-red-300 drop-shadow-md" />
                  <span className="text-white font-semibold text-sm sm:text-base">{EVENT_DATE}</span>
            </div>
                <div className="flex items-center space-x-2 bg-white/15 backdrop-blur-md rounded-full px-4 py-2.5 border border-white/25">
                  <MapPin className="w-4 h-4 text-red-300 drop-shadow-md" />
                  <span className="text-white font-semibold text-sm sm:text-base">{EVENT_LOCATION}</span>
            </div>
               
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1.2 }}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4"
          >
            <button
              onClick={handleApplyClick}
                  className="group relative bg-red-600 hover:bg-red-700 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-xl text-base sm:text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center justify-center space-x-3 shadow-lg w-full sm:w-auto"
            >
                  <Sparkles className="w-5 h-5" />
              <span>Maratona Başvur</span>
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
