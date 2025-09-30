'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    // Maraton bitiş tarihi: 20 Şubat 2026, 23:59
    const targetDate = new Date('2026-02-20T23:59:59').getTime();

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setIsExpired(true);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (isExpired) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-r from-red-600 to-red-700 rounded-xl p-6 text-white"
      >
        <div className="flex items-center justify-center space-x-3">
          <Clock className="w-8 h-8" />
          <div className="text-center">
            <h3 className="text-2xl font-bold">Maraton Tamamlandı!</h3>
            <p className="text-red-100">Tüm katılımcılara teşekkürler</p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-xl p-6 border border-red-200 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center">
            <Clock className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Kalan Süre</h3>
            <p className="text-gray-500 text-sm">20 Şubat 2026, 23:59</p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-4 gap-3">
        <div className="text-center">
          <div className="bg-red-50 rounded-lg p-3 mb-2 flex items-center justify-center">
            <div className="text-xl font-bold text-red-600 text-center">{timeLeft.days}</div>
          </div>
          <div className="text-xs text-gray-600 text-center">Gün</div>
        </div>
        
        <div className="text-center">
          <div className="bg-red-50 rounded-lg p-3 mb-2 flex items-center justify-center">
            <div className="text-xl font-bold text-red-600 text-center">{timeLeft.hours}</div>
          </div>
          <div className="text-xs text-gray-600 text-center">Saat</div>
        </div>
        
        <div className="text-center">
          <div className="bg-red-50 rounded-lg p-3 mb-2 flex items-center justify-center">
            <div className="text-xl font-bold text-red-600 text-center">{timeLeft.minutes}</div>
          </div>
          <div className="text-xs text-gray-600 text-center">Dakika</div>
        </div>
        
        <div className="text-center">
          <div className="bg-red-50 rounded-lg p-3 mb-2 flex items-center justify-center">
            <div className="text-xl font-bold text-red-600 text-center">{timeLeft.seconds}</div>
          </div>
          <div className="text-xs text-gray-600 text-center">Saniye</div>
        </div>
      </div>
    </motion.div>
  );
};

export default CountdownTimer;
