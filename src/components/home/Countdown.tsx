'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Calendar } from 'lucide-react';

const Countdown: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    // Başvuru son tarihi: 15 Şubat 2026
    const targetDate = new Date('2026-02-15T23:59:59').getTime();

    const updateTime = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      }
    };

    // İlk hesaplama
    updateTime();

    // Sadece saniye değiştiğinde güncelle
    const timer = setInterval(updateTime, 1000);

    return () => clearInterval(timer);
  }, []);

  const countdownItems = [
    { label: 'Gün', value: timeLeft.days },
    { label: 'Saat', value: timeLeft.hours },
    { label: 'Dakika', value: timeLeft.minutes },
    { label: 'Saniye', value: timeLeft.seconds }
  ];

  return (
    <section className="relative py-20 bg-white overflow-hidden">
      {/* Corporate Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="inline-flex items-center space-x-2 bg-red-600 text-white px-6 py-2 rounded-full text-sm font-semibold mb-8 shadow-sm"
            >
              <Clock className="w-4 h-4" />
              <span>Eğitim Platformu</span>
            </motion.div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              HSD Türkiye <span className="text-red-600">Bootcamp</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Teknoloji ve inovasyon alanında kapsamlı eğitim programları
            </p>
          </motion.div>

          {/* Countdown Timer - Apple/Google Style */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            {/* Modern Glassmorphism Container */}
            <div className="relative max-w-5xl mx-auto">
              {/* Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-red-500/10 to-red-500/10 rounded-3xl blur-3xl" />
              
              {/* Main Card - Apple Style */}
              <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8 sm:p-12">
                {/* Top Accent Line - Apple Style */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-red-500 to-orange-500 rounded-full" />
                
                {/* Countdown Grid - Google Material Style */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8">
                  {countdownItems.map((item, index) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, y: 30, scale: 0.8 }}
                      whileInView={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="relative group"
                    >
                      {/* Individual Card - 3 Layer Professional System */}
                      <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                        {/* Number Container - 3 Layer System */}
                        <div className="relative mb-4 h-20 sm:h-24 md:h-28 flex flex-col justify-center items-center">
                          {/* Previous Number - Top (Light Gray) */}
                          <div className="absolute top-1 text-xl sm:text-2xl md:text-3xl font-bold text-gray-300 font-mono leading-none">
                            {(item.value + 1).toString().padStart(2, '0')}
                          </div>
                          
                          {/* Current Number - Center (Main) */}
                          <motion.div
                            key={item.value}
                            initial={{ scale: 1.2, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                            className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 font-mono leading-none relative z-10"
                          >
                            {item.value.toString().padStart(2, '0')}
                          </motion.div>
                          
                          {/* Next Number - Bottom (Light Gray) */}
                          <div className="absolute bottom-1 text-xl sm:text-2xl md:text-3xl font-bold text-gray-300 font-mono leading-none">
                            {(item.value - 1).toString().padStart(2, '0')}
                          </div>
                        </div>
                        
                        {/* Label */}
                        <div className="text-gray-600 font-bold text-sm uppercase tracking-widest text-center">
                          {item.label}
                        </div>
                        
                        {/* Decorative Dot - Google Style */}
                        <div className="absolute top-3 right-3 w-2 h-2 bg-gradient-to-r from-red-400 to-orange-400 rounded-full opacity-60" />
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                {/* Bottom Separator - Apple Style */}
                <div className="mt-8 flex items-center justify-center space-x-2">
                  <div className="w-8 h-px bg-gradient-to-r from-transparent to-gray-300" />
                  <div className="w-2 h-2 bg-gradient-to-r from-red-500 to-orange-500 rounded-full" />
                  <div className="w-8 h-px bg-gradient-to-l from-transparent to-gray-300" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Deadline Section - Apple/Google Style */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="relative max-w-md mx-auto">
              {/* Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-red-600/30 to-red-700/30 rounded-2xl blur-xl" />
              
              {/* Main Badge - Red Style */}
              <div className="relative bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-4 rounded-2xl shadow-xl border border-red-500/50">
                <div className="flex items-center justify-center space-x-3">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Calendar className="w-6 h-6" />
                  </motion.div>
                  <span className="text-lg font-bold tracking-wide">Son Başvuru: 15 Şubat 2026  23:59</span>
                </div>
                
                {/* Subtle Pattern - Apple Style */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent rounded-2xl opacity-50" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Countdown;