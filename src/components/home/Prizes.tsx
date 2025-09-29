'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Trophy,
  Award,
  Medal,
  Star,
  Gift,
  Zap,
  Target,
  ArrowRight,
  Crown,
  Sparkles
} from 'lucide-react';

const Prizes: React.FC = () => {
  const prizes = [
    {
      position: 1,
      title: "Birinci Ödül",
      prize: "Huawei MatePad 11.5",
      description: "En yenilikçi proje fikri için Huawei'nin premium tablet'i",
      icon: <Crown className="w-8 h-8" />,
      color: "from-yellow-400 to-yellow-600",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
      height: "h-96",
      delay: 0.1
    },
    {
      position: 2,
      title: "İkinci Ödül",
      prize: "Huawei Watch GT4",
      description: "İkinci en iyi proje için akıllı saat",
      icon: <Medal className="w-7 h-7" />,
      color: "from-gray-400 to-gray-600",
      bgColor: "bg-gray-50",
      borderColor: "border-gray-200",
      height: "h-80",
      delay: 0.3
    },
    {
      position: 3,
      title: "Üçüncü Ödül",
      prize: "Huawei Watch Fit 3",
      description: "Üçüncü en iyi proje için akıllı bileklik",
      icon: <Award className="w-7 h-7" />,
      color: "from-orange-400 to-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      height: "h-72",
      delay: 0.5
    }
  ];

  const additionalPrizes = [
    {
      icon: <Gift className="w-6 h-6" />,
      title: "Diğer Takımlar",
      description: "Huawei Band 9"
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: "Deneyim",
      description: "Gerçek proje deneyimi ve portföy geliştirme"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Kariyer Fırsatı",
      description: "Huawei ile kariyer fırsatları ve staj imkanları"
    }
  ];

  return (
    <section className="relative py-20 bg-white overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
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
            className="text-center mb-16"
          >
            <div className="inline-flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Trophy className="w-4 h-4" />
              <span>Ödüller</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-8 leading-tight">
              Kazanan <span className="text-red-600">Ödülleri</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              En yenilikçi proje fikirleri için hazırlanan değerli ödüller. 
              Huawei ürünleri sizleri bekliyor.
            </p>
          </motion.div>

          {/* Main Prizes Grid */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8 mb-16"
          >
            {prizes.map((prize, index) => (
              <motion.div
                key={prize.position}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
              >
                {/* Top Accent Line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-red-600"></div>
                
                {/* Position Badge */}
                <div className="absolute top-4 right-4">
                  <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-lg">{prize.position}</span>
                  </div>
                </div>
                
                <div className="text-center">
                  {/* Icon */}
                  <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <div className="text-white">
                      {prize.icon}
                    </div>
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{prize.title}</h3>
                  
                  {/* Prize */}
                  <h4 className="text-2xl font-bold text-red-600 mb-4">{prize.prize}</h4>
                  
                  {/* Description */}
                  <p className="text-gray-600 leading-relaxed">{prize.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Additional Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                Diğer <span className="text-red-600">Fırsatlar</span>
              </h3>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Kazananlar dışında tüm katılımcılar da değerli fırsatlar elde edecek
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {additionalPrizes.map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 text-center relative overflow-hidden group"
                >
                  {/* Top Accent Line */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-red-600"></div>
                  
                  <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <div className="text-white">
                      {benefit.icon}
                    </div>
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-3">{benefit.title}</h4>
                  <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Prizes;