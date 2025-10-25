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
  Star,
  BookOpen,
  Trophy
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
      icon: <Zap className="w-6 h-6" />
    },
    {
      week: "Hafta 2", 
      title: "Konfigürasyon & Veri Yönetimi",
      description: "ConfigMap, Secret, Persistent Volume ve Huawei OBS entegrasyonu ile veri yönetimi.",
      icon: <Target className="w-6 h-6" />
    },
    {
      week: "Hafta 3",
      title: "İzleme & Container Yönetimi", 
      description: "AOM servisi ile monitoring, SWR ile container imaj yönetimi ve CCE deployment.",
      icon: <Play className="w-6 h-6" />
    },
    {
      week: "Hafta 4",
      title: "Ağ Yönetimi & Sertifikasyon",
      description: "Ingress ile ağ yönetimi, proje geliştirme ve HCCDA-Cloud Native sertifikasyon hazırlığı.",
      icon: <Flag className="w-6 h-6" />
    }
  ];

  const highlights = [
    {
      icon: <Users className="w-6 h-6" />,
      title: "Sınırlı Kontenjan",
      number: "50",
      description: "Kişisel mentorluk için sınırlı katılımcı"
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Sertifikasyon",
      number: "100%",
      description: "Başarılı tamamlama sertifikası"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Eğitim Süresi",
      number: "16",
      description: "Saatlik yoğun eğitim programı"
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: "Uzman Eğitmen",
      number: "5+",
      description: "Yılların deneyimli eğitmenleri"
    }
  ];

  const handleApplyClick = () => {
    window.open('https://developer.huaweicloud.com/intl/en-us/activity/60746bd4268644469a5751f369d6431a', '_blank');
  };

  return (
    <section className="relative py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center space-x-2 bg-[var(--primary)] text-white px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <CheckCircle className="w-4 h-4" />
              <span>Aktif Bootcamp</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-[var(--text)] mb-6">
              Bu Eğitim <span className="text-[var(--primary)]">Başladı</span>
            </h2>
          </motion.div>

          {/* Main Bootcamp Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-white border border-[var(--border)] rounded-2xl p-8 md:p-12 shadow-lg mb-16"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-[var(--primary)] rounded-2xl flex items-center justify-center">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold text-[var(--text)] mb-2">{bootcampDetails.title}</h3>
                  <p className="text-[var(--text-muted)]">Huawei Cloud CCE</p>
                </div>
              </div>
              <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold">
                {bootcampDetails.status}
              </div>
            </div>
            
            <p className="text-[var(--text-muted)] text-lg leading-relaxed mb-8">
              {bootcampDetails.description}
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-[var(--primary)] mb-2">{bootcampDetails.duration}</div>
                <div className="text-[var(--text-muted)] text-sm">Eğitim Süresi</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[var(--primary)] mb-2">50</div>
                <div className="text-[var(--text-muted)] text-sm">Sınırlı Kontenjan</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[var(--primary)] mb-2">100%</div>
                <div className="text-[var(--text-muted)] text-sm">Sertifikasyon</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[var(--primary)] mb-2">5+</div>
                <div className="text-[var(--text-muted)] text-sm">Uzman Eğitmen</div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between bg-[var(--accent)]/5 rounded-xl p-6 mb-8">
              <div className="flex items-center space-x-4 mb-4 md:mb-0">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-[var(--primary)]" />
                  <span className="text-[var(--text-muted)]"><strong>Son Başvuru:</strong> {bootcampDetails.deadline}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Flag className="w-5 h-5 text-[var(--accent)]" />
                <span className="text-[var(--text-muted)]"><strong>Başlangıç:</strong> {bootcampDetails.startDate}</span>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={handleApplyClick}
                className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-semibold py-4 px-8 rounded-xl text-lg transition-all duration-300 hover:shadow-lg flex items-center space-x-3 mx-auto"
              >
                <span>Hemen Başvur</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>


          {/* Curriculum Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-[var(--text)] mb-4">
                Eğitim <span className="text-[var(--primary)]">Programı</span>
              </h3>
              <p className="text-lg text-[var(--text-muted)] max-w-3xl mx-auto">
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
                  className="bg-white border border-[var(--border)] rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 group"
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-[var(--primary)] rounded-xl flex items-center justify-center">
                      <div className="text-white">{week.icon}</div>
                    </div>
                    <span className="font-bold text-[var(--text)]">{week.week}</span>
                  </div>
                  <h4 className="text-lg font-semibold text-[var(--text)] mb-3">{week.title}</h4>
                  <p className="text-[var(--text-muted)] text-sm leading-relaxed">{week.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default ActiveBootcamp;