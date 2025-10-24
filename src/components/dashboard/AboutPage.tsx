'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Info, Users, Target, Award, BookOpen, Globe } from 'lucide-react';

const AboutPage = () => {
  const features = [
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Uzman Eğitmenler',
      description: 'Alanında uzman eğitmenlerden eğitim alın'
    },
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: 'Pratik Eğitim',
      description: 'Gerçek projelerle pratik deneyim kazanın'
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: 'Sertifikasyon',
      description: 'Huawei sertifikaları ile kariyerinizi geliştirin'
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: 'Global Ağ',
      description: 'Dünya çapında profesyonel ağa katılın'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-8 text-white"
      >
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
            <Info className="w-8 h-8 text-white" />
          </div>
        <div>
          <p className="text-red-100">HSD Türkiye Bootcamp Programı</p>
        </div>
        </div>
        <p className="text-lg text-red-100 leading-relaxed">
          Huawei Türkiye ve Habitat Derneği iş birliğiyle düzenlenen teknoloji eğitimleri platformu. 
          Geleceğin teknoloji liderlerini yetiştiriyoruz.
        </p>
      </motion.div>

      {/* Mission & Vision */}
      <div className="grid md:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Misyonumuz</h2>
          </div>
          <p className="text-gray-600 leading-relaxed">
            Erişilebilir, kaliteli ve uygulamalı bir eğitim ortamı sunarak, bilgiye dayalı üretkenliği 
            ve ekip çalışmasını teşvik etmek. Teknoloji alanında kendini geliştirmek isteyen bireylere 
            modern araçlar ve metodlar sunarak, onları geleceğin teknoloji liderleri olarak yetiştirmek.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <Award className="w-6 h-6 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Vizyonumuz</h2>
          </div>
          <p className="text-gray-600 leading-relaxed">
            Geleceğin teknoloji liderlerini bulut, yapay zeka, DevOps ve modern yazılım geliştirme 
            alanlarında yetkin bireyler olarak yetiştirmek. Türkiye'de teknoloji eğitiminde öncü 
            platform olmak ve katılımcılarımızın kariyerlerinde başarılı olmalarını sağlamak.
          </p>
        </motion.div>
      </div>

      {/* Features */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Neden HSD Türkiye?</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="text-center p-6 bg-gray-50 rounded-xl hover:bg-red-50 transition-colors duration-300"
            >
              <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-red-600">
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Program Benefits */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-8 border border-red-200"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Program Avantajları</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <p className="text-gray-700">Ücretsiz eğitim programları</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <p className="text-gray-700">Huawei Cloud hesabı ve kredileri</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <p className="text-gray-700">Sertifikasyon fırsatları</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <p className="text-gray-700">Mentorluk desteği</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <p className="text-gray-700">Proje portföyü geliştirme</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <p className="text-gray-700">Kariyer danışmanlığı</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AboutPage;
