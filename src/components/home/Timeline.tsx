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
  CheckCircle2
} from 'lucide-react';

const Timeline: React.FC = () => {
  const timelineEvents = [
    {
      date: "15 Şubat 2026",
      time: "23:59",
      title: "Son Başvuru Tarihi",
      description: "Maratona katılmak için son başvuru tarihi. Başvurunuzu tamamlayın ve bu heyecan verici yolculuğa katılın!",
      icon: <CheckCircle className="w-5 h-5" />,
      status: "deadline",
      badge: "Son Başvuru"
    },
    {
      date: "16-18 Şubat 2026",
      time: "Değerlendirme",
      title: "Başvuru Değerlendirmesi",
      description: "Başvuruların değerlendirilmesi ve katılımcı seçimi. Seçilen katılımcılar e-posta ile bilgilendirilecek.",
      icon: <Users className="w-5 h-5" />,
      status: "evaluation",
      badge: "Değerlendirme"
    },
    {
      date: "19 Şubat 2026",
      time: "09:00 - 18:00",
      title: "Maraton Günü 1",
      description: "Açılış töreni, takım oluşturma, mentor eşleştirme ve proje geliştirme sürecinin başlangıcı.",
      icon: <Play className="w-5 h-5" />,
      status: "event",
      badge: "Etkinlik Günü"
    },
    {
      date: "20 Şubat 2026",
      time: "09:00 - 18:00",
      title: "Maraton Günü 2",
      description: "Proje tamamlama, sunum hazırlıkları, jüri değerlendirmesi ve ödül töreni.",
      icon: <Flag className="w-5 h-5" />,
      status: "event",
      badge: "Etkinlik Günü"
    }
  ];

  return (
    <section id="timeline" className="relative py-24 bg-white">
      {/* Subtle Background Pattern - Apple Style */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='20' cy='20' r='1'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Section Header - Professional Style */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center space-x-2 bg-red-600 text-white px-6 py-2 rounded-full text-sm font-semibold mb-8">
              <Calendar className="w-4 h-4" />
              <span>Etkinlik Takvimi</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-8 leading-tight">
              Maraton <span className="text-red-600">Takvimi</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              19-20 Şubat 2026 tarihlerinde <span className="font-semibold text-red-600">Gaziantep Şehitkamil Kongre ve Sanat Merkezi</span>'nde gerçekleşecek 
              Afet Yönetimi Teknolojileri Fikir Maratonu'nun detaylı programı
            </p>
          </motion.div>

          {/* Professional Zigzag Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative max-w-6xl mx-auto"
          >
            {/* Timeline Line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-red-500 to-red-600 transform -translate-x-1/2 rounded-full"></div>
            
            <div className="space-y-16">
              {timelineEvents.map((event, index) => {
                const isLeft = index % 2 === 0;
                return (
                  <motion.div
                    key={event.date}
                    initial={{ opacity: 0, x: isLeft ? -80 : 80 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.15 }}
                    viewport={{ once: true }}
                    className="relative w-full"
                  >
                    {/* Left Side Card */}
                    {isLeft && (
                      <div className="w-5/12 pr-8 relative z-10 float-left">
                        <motion.div
                          whileHover={{ scale: 1.02, y: -5 }}
                          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-500 relative overflow-hidden"
                        >
                          {/* Top Accent Line */}
                          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-red-600"></div>
                          
                          {/* Badge */}
                          <div className="inline-flex items-center space-x-2 bg-red-50 text-red-700 px-3 py-1.5 rounded-full text-xs font-semibold mb-4 border border-red-100">
                            <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
                            <span>{event.badge}</span>
                          </div>

                          {/* Date and Time */}
                          <div className="flex items-center space-x-4 mb-4">
                            <div className="flex items-center space-x-2 text-gray-500">
                              <Calendar className="w-3 h-3" />
                              <span className="text-xs font-medium">{event.date}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-gray-500">
                              <Clock className="w-3 h-3" />
                              <span className="text-xs font-medium">{event.time}</span>
                            </div>
                          </div>

                          {/* Title */}
                          <h3 className="text-xl font-bold text-gray-900 mb-4 leading-tight">{event.title}</h3>

                          {/* Description */}
                          <p className="text-gray-600 leading-relaxed mb-6 text-sm">{event.description}</p>

                          {/* Action Indicator */}
                          <div className="flex items-center space-x-2 text-red-600 group">
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                            <span className="text-xs font-semibold">
                              {event.status === 'deadline' 
                                ? 'Başvurunuzu tamamlayın' 
                                : event.status === 'event' 
                                ? 'Etkinlik günü' 
                                : 'Değerlendirme süreci'
                              }
                            </span>
                          </div>
                        </motion.div>
                      </div>
                    )}

                    {/* Center Icon */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 z-20">
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-xl border-3 border-white relative"
                      >
                        <div className="text-white text-lg">
                          {event.icon}
                        </div>
                        {/* Glow Effect */}
                        <div className="absolute inset-0 bg-red-500 rounded-full opacity-20 blur-md"></div>
                      </motion.div>
                    </div>

                    {/* Right Side Card */}
                    {!isLeft && (
                      <div className="w-5/12 pl-8 relative z-10 float-right">
                        <motion.div
                          whileHover={{ scale: 1.02, y: -5 }}
                          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-500 relative overflow-hidden"
                        >
                          {/* Top Accent Line */}
                          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-red-600"></div>
                          
                          {/* Badge */}
                          <div className="inline-flex items-center space-x-2 bg-red-50 text-red-700 px-3 py-1.5 rounded-full text-xs font-semibold mb-4 border border-red-100">
                            <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
                            <span>{event.badge}</span>
                          </div>

                          {/* Date and Time */}
                          <div className="flex items-center space-x-4 mb-4">
                            <div className="flex items-center space-x-2 text-gray-500">
                              <Calendar className="w-3 h-3" />
                              <span className="text-xs font-medium">{event.date}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-gray-500">
                              <Clock className="w-3 h-3" />
                              <span className="text-xs font-medium">{event.time}</span>
                            </div>
                          </div>

                          {/* Title */}
                          <h3 className="text-xl font-bold text-gray-900 mb-4 leading-tight">{event.title}</h3>

                          {/* Description */}
                          <p className="text-gray-600 leading-relaxed mb-6 text-sm">{event.description}</p>

                          {/* Action Indicator */}
                          <div className="flex items-center space-x-2 text-red-600 group">
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                            <span className="text-xs font-semibold">
                              {event.status === 'deadline' 
                                ? 'Başvurunuzu tamamlayın' 
                                : event.status === 'event' 
                                ? 'Etkinlik günü' 
                                : 'Değerlendirme süreci'
                              }
                            </span>
                          </div>
                        </motion.div>
                      </div>
                    )}

                    {/* Clear float */}
                    <div className="clear-both"></div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Timeline;
