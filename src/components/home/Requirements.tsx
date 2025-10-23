'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  UserCheck,
  Calendar,
  MapPin,
  Users,
  Award,
  CheckCircle,
  AlertCircle,
  Target,
  ArrowRight,
  Video,
  Youtube,
  Star,
  User,
  Code,
  Palette,
  Zap,
  Clock,
  BookOpen,
  Shield
} from 'lucide-react';

const Requirements: React.FC = () => {
  const requirements = [
    {
      icon: <User className="w-6 h-6" />,
      title: "Yeni Başlayanlar",
      description: "Kubernetes konusunda yeni başlayanlar için tasarlanmış eğitim programı",
      details: "Önceden Kubernetes bilgisi gerektirmez"
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Online Katılım",
      description: "Salı ve Perşembe günleri 15:00'te online eğitimlere katılım zorunludur",
      details: "Toplam 16 saat eğitim"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Ödev Tamamlama",
      description: "Katılım belgesi için en az 2 ödev tamamlanması gereklidir",
      details: "Pratik projeler ile öğrenme"
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Sertifikasyon",
      description: "3 yıl geçerliliği olan HCCDA-Cloud Native sertifikası alabilirsiniz",
      details: "Uluslararası geçerlilik"
    }
  ];

  const keyPoints = [
    "Huawei Cloud CCE platformunda hands-on deneyim kazanacaksınız",
    "Kubernetes temel kavramlarını öğrenerek container yönetimi yapabileceksiniz",
    "SWR ile container imajları build edip CCE üzerinde deploy edeceksiniz",
    "AOM servisi ile monitoring ve logging çözümlerini öğreneceksiniz",
    "Eğitim sonunda HCCDA-Cloud Native sertifikası alacaksınız"
  ];

  const processSteps = [
    {
      step: "1",
      title: "Başvuru",
      description: "Online başvuru formunu doldurun",
      icon: <UserCheck className="w-5 h-5" />
    },
    {
      step: "2", 
      title: "Onay",
      description: "Başvurunuz değerlendirilir",
      icon: <CheckCircle className="w-5 h-5" />
    },
    {
      step: "3",
      title: "Eğitim",
      description: "4 haftalık online eğitim programı",
      icon: <BookOpen className="w-5 h-5" />
    },
    {
      step: "4",
      title: "Sertifika",
      description: "HCCDA sertifikası alın",
      icon: <Award className="w-5 h-5" />
    }
  ];

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
            <div className="inline-flex items-center space-x-2 bg-[var(--accent)]/10 border border-[var(--accent)]/20 text-[var(--accent)] px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <UserCheck className="w-4 h-4" />
              <span>Katılım Kriterleri</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-[var(--text)] mb-6">
              Eğitim <span className="text-[var(--primary)]">Kriterleri</span>
            </h2>
            <p className="text-lg text-[var(--text-muted)] max-w-4xl mx-auto leading-relaxed">
              Bootcamp'e katılmak için sağlamanız gereken kriterler ve eğitim süreci hakkında detaylar. 
              Tüm kriterleri karşıladığınızdan emin olun.
            </p>
          </motion.div>

          {/* Requirements Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-8 mb-16"
          >
            {requirements.map((req, index) => (
              <motion.div
                key={req.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white border border-[var(--border)] rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 group"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-[var(--primary)] rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <div className="text-white">{req.icon}</div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-[var(--text)] mb-2">{req.title}</h3>
                    <p className="text-[var(--text-muted)] leading-relaxed mb-3">{req.description}</p>
                    <div className="text-sm text-[var(--accent)] font-medium">{req.details}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Process Steps */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <div className="mb-12">
              <h3 className="text-3xl font-bold text-[var(--text)] mb-4">
                Başvuru <span className="text-[var(--accent)]">Süreci</span>
              </h3>
              <p className="text-lg text-[var(--text-muted)] max-w-3xl">
                Bootcamp'e katılmak için takip etmeniz gereken adımlar
              </p>
            </div>
            
            <div className="grid md:grid-cols-4 gap-6">
              {processSteps.map((step, index) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="relative mb-6">
                    <div className="w-16 h-16 bg-[var(--primary)] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <div className="text-white text-xl font-bold">{step.step}</div>
                    </div>
                    {index < processSteps.length - 1 && (
                      <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-[var(--border)] transform translate-x-3"></div>
                    )}
                  </div>
                  <h4 className="text-lg font-bold text-[var(--text)] mb-2">{step.title}</h4>
                  <p className="text-[var(--text-muted)] text-sm leading-relaxed">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Key Points */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="mb-12">
              <h3 className="text-3xl font-bold text-[var(--text)] mb-4">
                Eğitim <span className="text-[var(--accent)]">Kazanımları</span>
              </h3>
              <p className="text-lg text-[var(--text-muted)] max-w-3xl">
                Bootcamp sürecinde neler öğreneceğiniz ve hangi becerileri kazanacağınız
              </p>
            </div>
            
            <div className="bg-[var(--accent)]/5 border border-[var(--accent)]/20 rounded-2xl p-8">
              <div className="space-y-4">
                {keyPoints.map((point, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-start space-x-4 p-4 bg-white rounded-xl hover:shadow-md transition-all duration-300"
                  >
                    <div className="w-8 h-8 bg-[var(--accent)] rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <span className="text-[var(--text)] leading-relaxed font-medium">{point}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Requirements;