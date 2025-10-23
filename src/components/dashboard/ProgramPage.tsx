'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, BookOpen, Target, Award, Users, Zap, Play, Flag } from 'lucide-react';

const ProgramPage = () => {
  const programWeeks = [
    {
      week: 'Hafta 1',
      title: 'Kubernetes Temelleri',
      description: 'Deployment, Pod, Service, Namespace gibi temel Kubernetes kaynakları ve CCE platformu tanıtımı.',
      icon: <Zap className="w-6 h-6" />,
      topics: ['Kubernetes mimarisi', 'Pod ve Container kavramları', 'Service ve Ingress', 'Namespace yönetimi'],
      duration: '4 saat',
      date: '27 Ekim 2025'
    },
    {
      week: 'Hafta 2',
      title: 'Konfigürasyon & Veri Yönetimi',
      description: 'ConfigMap, Secret, Persistent Volume ve Huawei OBS entegrasyonu ile veri yönetimi.',
      icon: <Target className="w-6 h-6" />,
      topics: ['ConfigMap ve Secret', 'Persistent Volume', 'Huawei OBS entegrasyonu', 'Veri yedekleme stratejileri'],
      duration: '4 saat',
      date: '3 Kasım 2025'
    },
    {
      week: 'Hafta 3',
      title: 'İzleme & Container Yönetimi',
      description: 'AOM servisi ile monitoring, SWR ile container imaj yönetimi ve CCE deployment.',
      icon: <Play className="w-6 h-6" />,
      topics: ['AOM ile monitoring', 'SWR container registry', 'Image optimization', 'Deployment stratejileri'],
      duration: '4 saat',
      date: '10 Kasım 2025'
    },
    {
      week: 'Hafta 4',
      title: 'Ağ Yönetimi & Sertifikasyon',
      description: 'Ingress ile ağ yönetimi, proje geliştirme ve HCCDA-Cloud Native sertifikasyon hazırlığı.',
      icon: <Flag className="w-6 h-6" />,
      topics: ['Ingress Controller', 'Load Balancing', 'Network Policies', 'Sertifikasyon hazırlığı'],
      duration: '4 saat',
      date: '17 Kasım 2025'
    }
  ];

  const programDetails = [
    {
      title: 'Program Süresi',
      value: '4 Hafta',
      description: '16 saat toplam eğitim',
      icon: <Clock className="w-6 h-6" />
    },
    {
      title: 'Eğitim Formatı',
      value: 'Online',
      description: 'Canlı eğitim + kayıt',
      icon: <BookOpen className="w-6 h-6" />
    },
    {
      title: 'Hedef Kitle',
      value: 'Yeni Başlayanlar',
      description: 'Temel bilgi yeterli',
      icon: <Users className="w-6 h-6" />
    },
    {
      title: 'Sertifika',
      value: 'HCCDA-Cloud Native',
      description: 'Huawei sertifikası',
      icon: <Award className="w-6 h-6" />
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
            <Calendar className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Eğitim Programı</h1>
            <p className="text-red-100">Kubernetes Bootcamp Program Detayları</p>
          </div>
        </div>
        <p className="text-lg text-red-100 leading-relaxed">
          4 haftalık yoğun Kubernetes eğitimi ile container orkestrasyonu konusunda uzmanlaşın.
        </p>
      </motion.div>

      {/* Program Details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Program Bilgileri</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {programDetails.map((detail, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="text-center p-6 bg-gray-50 rounded-xl hover:bg-red-50 transition-colors duration-300"
            >
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-4 text-red-600">
                {detail.icon}
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{detail.title}</h3>
              <p className="text-xl font-semibold text-red-600 mb-1">{detail.value}</p>
              <p className="text-gray-600 text-sm">{detail.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Weekly Program */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Haftalık Program</h2>
        <div className="space-y-6">
          {programWeeks.map((week, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0 text-red-600">
                  {week.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {week.week}
                    </span>
                    <span className="text-gray-500 text-sm">{week.date}</span>
                    <span className="text-gray-500 text-sm">{week.duration}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{week.title}</h3>
                  <p className="text-gray-600 mb-4">{week.description}</p>
                  <div className="grid md:grid-cols-2 gap-2">
                    {week.topics.map((topic, topicIndex) => (
                      <div key={topicIndex} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span className="text-gray-700 text-sm">{topic}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Important Dates */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-8 border border-red-200"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Önemli Tarihler</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-gray-700"><strong>Son Başvuru:</strong> 23 Ekim 2025, 23:59</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-gray-700"><strong>Program Başlangıcı:</strong> 27 Ekim 2025, 20:00</span>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-700"><strong>Program Bitişi:</strong> 17 Kasım 2025</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span className="text-gray-700"><strong>Sertifikasyon Sınavı:</strong> 24 Kasım 2025</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProgramPage;
