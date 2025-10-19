'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  Users, 
  Award, 
  CheckCircle,
  ArrowRight,
  Zap,
  Target,
  Play,
  Flag,
} from 'lucide-react';

const ActiveBootcamp: React.FC = () => {
  const bootcampDetails = {
    title: "Huawei Cloud CCE Kubernetes Bootcamp",
    description: "16 saatlik Kubernetes ve container yönetimi eğitimi. Huawei Cloud'un yönetilen Kubernetes servisi CCE ile pratik deneyim kazanın.",
    duration: "4 Hafta, 16 Saat",
    format: "Online Eğitim",
    schedule: "Salı ve Perşembe 15:00",
    participants: "Yeni Başlayanlar",
    certification: "HCCDA-Cloud Native Sertifikası",
    status: "Başvuruya Açık",
    deadline: "23 Ekim 2025, 23:59",
    startDate: "27 Ekim 2025, 20:00"
  };

  const curriculum = [
    {
      week: "Hafta 1",
      title: "Kubernetes Temelleri",
      description: "Deployment, Pod, Service, Namespace gibi temel Kubernetes kaynakları ve CCE platformu tanıtımı.",
      icon: <Zap className="w-5 h-5" />
    },
    {
      week: "Hafta 2", 
      title: "Konfigürasyon & Veri Yönetimi",
      description: "ConfigMap, Secret, Persistent Volume ve Huawei OBS entegrasyonu ile veri yönetimi.",
      icon: <Target className="w-5 h-5" />
    },
    {
      week: "Hafta 3",
      title: "İzleme & Container Yönetimi", 
      description: "AOM servisi ile monitoring, SWR ile container imaj yönetimi ve CCE deployment.",
      icon: <Play className="w-5 h-5" />
    },
    {
      week: "Hafta 4",
      title: "Ağ Yönetimi & Sertifikasyon",
      description: "Ingress ile ağ yönetimi, proje geliştirme ve HCCDA-Cloud Native sertifikasyon hazırlığı.",
      icon: <Flag className="w-5 h-5" />
    }
  ];

  const handleApplyClick = () => {
    window.open('https://developer.huaweicloud.com/intl/en-us/activity/60746bd4268644469a5751f369d6431a', '_blank');
  };

  return (
    <section className="relative py-24 bg-gradient-to-br from-red-50 to-blue-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='20' cy='20' r='1'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center space-x-2 bg-red-600 text-white px-6 py-2 rounded-full text-sm font-semibold mb-8">
              <CheckCircle className="w-4 h-4" />
              <span>Aktif Bootcamp</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-8 leading-tight">
              Şu Anda <span className="text-red-600">Başvuruya Açık</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Şu anda başvuruya açık olan bootcamp programımız. Hemen başvurun ve teknoloji dünyasında uzmanlaşın.
            </p>
          </motion.div>

          {/* Active Bootcamp Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl border border-gray-100 relative overflow-hidden hover:shadow-3xl transition-all duration-300"
          >
            {/* Status Badge */}
            <div className="absolute top-6 right-6">
              <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>{bootcampDetails.status}</span>
              </div>
            </div>

            {/* Bootcamp Header */}
            <div className="mb-8">
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {bootcampDetails.title}
              </h3>
              <p className="text-xl text-gray-600 leading-relaxed mb-6">
                {bootcampDetails.description}
              </p>
            </div>

            {/* Bootcamp Details Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center space-x-3 mb-2">
                  <Calendar className="w-5 h-5 text-red-600" />
                  <span className="font-semibold text-gray-900">Süre</span>
                </div>
                <p className="text-gray-600">{bootcampDetails.duration}</p>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center space-x-3 mb-2">
                  <Clock className="w-5 h-5 text-red-600" />
                  <span className="font-semibold text-gray-900">Program</span>
                </div>
                <p className="text-gray-600">{bootcampDetails.schedule}</p>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center space-x-3 mb-2">
                  <Users className="w-5 h-5 text-red-600" />
                  <span className="font-semibold text-gray-900">Hedef Kitle</span>
                </div>
                <p className="text-gray-600">{bootcampDetails.participants}</p>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center space-x-3 mb-2">
                  <Award className="w-5 h-5 text-red-600" />
                  <span className="font-semibold text-gray-900">Sertifika</span>
                </div>
                <p className="text-gray-600">{bootcampDetails.certification}</p>
              </div>
            </div>

            {/* Important Dates */}
            <div className="bg-red-50 rounded-xl p-6 mb-8">
              <h4 className="text-lg font-bold text-gray-900 mb-4">Önemli Tarihler</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-gray-700"><strong>Son Başvuru:</strong> {bootcampDetails.deadline}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-700"><strong>Başlangıç:</strong> {bootcampDetails.startDate}</span>
                </div>
              </div>
            </div>

            {/* Curriculum Preview */}
            <div className="border-t border-gray-200 pt-8 mt-8 mb-8">
              <div className="text-center mb-8">
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  Eğitim <span className="text-red-600">Programı</span>
                </h3>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                  4 haftalık yoğun eğitim programında neler öğreneceğiniz
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {curriculum.map((week, index) => (
                  <motion.div
                    key={week.week}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
                  >
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                        <div className="text-white">
                          {week.icon}
                        </div>
                      </div>
                      <span className="font-bold text-gray-900">{week.week}</span>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">{week.title}</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">{week.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Apply Button */}
            <div className="text-center">
              <button
                onClick={handleApplyClick}
                className="group relative bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center justify-center space-x-3 shadow-lg mx-auto"
              >
                <span>Hemen Başvur</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default ActiveBootcamp;
