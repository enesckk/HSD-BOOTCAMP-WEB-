'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Award, 
  CheckCircle,
  Star,
  Zap,
  Target,
  Play,
  Flag,
  ArrowRight,
  BookOpen
} from 'lucide-react';

const Timeline: React.FC = () => {
  const timelineEvents = [
    {
      week: "Hafta 1",
      title: "Kubernetes Temelleri",
      description: "Deployment, Pod, Service, Namespace gibi temel Kubernetes kaynakları ve CCE platformu tanıtımı.",
      icon: <Zap className="w-6 h-6" />,
      duration: "4 Saat",
      topics: ["Kubernetes Temelleri", "CCE Platformu", "Pod ve Container"]
    },
    {
      week: "Hafta 2",
      title: "Konfigürasyon & Veri Yönetimi",
      description: "ConfigMap, Secret, Persistent Volume ve Huawei OBS entegrasyonu ile veri yönetimi.",
      icon: <Target className="w-6 h-6" />,
      duration: "4 Saat",
      topics: ["ConfigMap & Secret", "Persistent Volume", "Huawei OBS"]
    },
    {
      week: "Hafta 3",
      title: "İzleme & Container Yönetimi",
      description: "AOM servisi ile monitoring, SWR ile container imaj yönetimi ve CCE deployment.",
      icon: <Play className="w-6 h-6" />,
      duration: "4 Saat",
      topics: ["AOM Monitoring", "SWR Container", "CCE Deployment"]
    },
    {
      week: "Hafta 4",
      title: "Ağ Yönetimi & Sertifikasyon",
      description: "Ingress ile ağ yönetimi, proje geliştirme ve HCCDA-Cloud Native sertifikasyon hazırlığı.",
      icon: <Flag className="w-6 h-6" />,
      duration: "4 Saat",
      topics: ["Ingress Ağ Yönetimi", "Proje Geliştirme", "HCCDA Sertifikasyon"]
    }
  ];

  return (
    <section id="timeline" className="relative py-20 bg-[#F8FAFC]">
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
              <Calendar className="w-4 h-4" />
              <span>Eğitim Programı</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-[var(--text)] mb-6">
              Eğitim <span className="text-[var(--primary)]">Takvimi</span>
            </h2>
            <p className="text-lg text-[var(--text-muted)] max-w-4xl mx-auto leading-relaxed">
              4 haftalık online eğitim programı ile Kubernetes ve container yönetimi konusunda uzmanlaşın ve HCCDA sertifikası kazanın
            </p>
          </motion.div>

          {/* Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[var(--primary)] to-[var(--accent)]"></div>
            
            <div className="space-y-12">
              {timelineEvents.map((event, index) => (
                <motion.div
                  key={event.week}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="relative flex items-start space-x-8"
                >
                  {/* Timeline Dot */}
                  <div className="flex-shrink-0 relative z-10">
                    <div className="w-16 h-16 bg-[var(--primary)] rounded-2xl flex items-center justify-center shadow-lg">
                      <div className="text-white">{event.icon}</div>
                    </div>
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-[var(--accent)] rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {index + 1}
                    </div>
                  </div>

                  {/* Content Card */}
                  <div className="flex-1">
                    <div className="bg-white border border-[var(--border)] rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <div className="inline-flex items-center space-x-2 bg-[var(--primary)]/10 text-[var(--primary)] px-3 py-1 rounded-full text-sm font-semibold mb-3">
                            <span>{event.week}</span>
                          </div>
                          <h3 className="text-2xl font-bold text-[var(--text)] mb-2">{event.title}</h3>
                          <p className="text-[var(--text-muted)] leading-relaxed">{event.description}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-[var(--text-muted)] mb-1">Süre</div>
                          <div className="text-lg font-bold text-[var(--primary)]">{event.duration}</div>
                        </div>
                      </div>

                      {/* Topics */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {event.topics.map((topic, topicIndex) => (
                          <div key={topicIndex} className="flex items-center space-x-2 bg-[var(--accent)]/5 rounded-lg p-3">
                            <CheckCircle className="w-4 h-4 text-[var(--accent)] flex-shrink-0" />
                            <span className="text-sm text-[var(--text-muted)]">{topic}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Summary Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
            className="mt-16"
          >
            <div className="bg-white border border-[var(--border)] rounded-2xl p-8 shadow-sm">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-[var(--text)] mb-4">Program Özeti</h3>
                <p className="text-[var(--text-muted)]">4 haftalık eğitim programının genel bilgileri</p>
              </div>
              
              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-[var(--primary)] rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-[var(--text)] mb-1">4</div>
                  <div className="text-sm text-[var(--text-muted)]">Hafta</div>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-[var(--accent)] rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-[var(--text)] mb-1">16</div>
                  <div className="text-sm text-[var(--text-muted)]">Saat</div>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-[var(--primary)] rounded-xl flex items-center justify-center mx-auto mb-3">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-[var(--text)] mb-1">4</div>
                  <div className="text-sm text-[var(--text-muted)]">Modül</div>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-[var(--accent)] rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-[var(--text)] mb-1">1</div>
                  <div className="text-sm text-[var(--text-muted)]">Sertifika</div>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Timeline;