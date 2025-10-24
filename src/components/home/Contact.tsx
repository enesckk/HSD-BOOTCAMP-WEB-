'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  MessageSquare,
  Globe,
  Linkedin,
  X,
  Instagram,
  Facebook,
  Youtube,
  Navigation,
  Star,
  Calendar,
  Users,
  ArrowRight,
  CheckCircle,
  Send,
  User,
  BookOpen
} from 'lucide-react';

const Contact: React.FC = () => {
  const contactMethods = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: "E-posta",
      value: "info@huawei.com.tr",
      description: "Genel sorularınız için",
      action: "E-posta Gönder"
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Telefon",
      value: "+90 212 123 45 67",
      description: "Hafta içi 09:00 - 18:00",
      action: "Ara"
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Adres",
      value: "Huawei Türkiye",
      description: "İstanbul, Türkiye",
      action: "Konum"
    }
  ];

  const socialMedia = [
    {
      name: "LinkedIn",
      icon: <Linkedin className="w-5 h-5" />,
      url: "https://www.linkedin.com/company/hsdturkiye/posts/?feedView=all"
    },
    {
      name: "Instagram",
      icon: <Instagram className="w-5 h-5" />,
      url: "https://www.instagram.com/hsdturkiye/"
    },
    {
      name: "YouTube",
      icon: <Youtube className="w-5 h-5" />,
      url: "https://www.youtube.com/c/HuaweiDeveloperGroupsTürkiye"
    },
    {
      name: "Medium",
      icon: <span className="font-bold text-xs text-white">M</span>,
      url: "https://medium.com/huawei-developers"
    },
    {
      name: "X",
      icon: <span className="font-bold text-lg text-white">𝕏</span>,
      url: "https://x.com/turkiye_hsd"
    }
  ];

  const quickActions = [
    {
      icon: <BookOpen className="w-5 h-5" />,
      title: "Bootcamp Programları",
      description: "Aktif programları görüntüle",
      action: "Programları İncele"
    },
    {
      icon: <Calendar className="w-5 h-5" />,
      title: "Etkinlik Takvimi",
      description: "Yaklaşan etkinlikleri gör",
      action: "Takvimi Gör"
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: "Topluluk",
      description: "Diğer katılımcılarla tanış",
      action: "Topluluğa Katıl"
    }
  ];

  return (
    <section id="contact" className="relative py-20 bg-[#F8FAFC]">
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
              <MessageSquare className="w-4 h-4" />
              <span>İletişim</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-[var(--text)] mb-6">
              Bizimle <span className="text-[var(--primary)]">İletişime Geçin</span>
            </h2>
            <p className="text-lg text-[var(--text-muted)] max-w-3xl mx-auto leading-relaxed">
              Sorularınız için bizimle iletişime geçebilir, sosyal medya hesaplarımızı takip edebilir 
              ve bootcamp programları hakkında güncel bilgiler alabilirsiniz
            </p>
          </motion.div>

          {/* Contact Methods */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-6 mb-16"
          >
            {contactMethods.map((method, index) => (
              <motion.div
                key={method.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white border border-[var(--border)] rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 text-center group"
              >
                <div className="w-16 h-16 bg-[var(--primary)] rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <div className="text-white">{method.icon}</div>
                </div>
                <h3 className="text-xl font-bold text-[var(--text)] mb-2">{method.title}</h3>
                <p className="text-[var(--primary)] font-semibold mb-1">{method.value}</p>
                <p className="text-[var(--text-muted)] text-sm mb-4">{method.description}</p>
                <button className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 hover:shadow-lg text-sm">
                  {method.action}
                </button>
              </motion.div>
            ))}
          </motion.div>

          {/* Social Media */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-[var(--text)] mb-4">
                Sosyal <span className="text-[var(--accent)]">Medya</span>
              </h3>
              <p className="text-lg text-[var(--text-muted)]">Bizi takip edin ve güncel kalın</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {socialMedia.map((social, index) => (
                <motion.a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white border border-[var(--border)] rounded-xl p-4 hover:shadow-lg transition-all duration-300 text-center group"
                >
                  <div className="w-12 h-12 bg-[var(--accent)] rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                    <div className="text-white">{social.icon}</div>
                  </div>
                  <h4 className="font-bold text-[var(--text)] mb-1">{social.name}</h4>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-[var(--text)] mb-4">
                Hızlı <span className="text-[var(--primary)]">Erişim</span>
              </h3>
              <p className="text-lg text-[var(--text-muted)]">En çok kullanılan sayfalar</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {quickActions.map((action, index) => (
                <motion.div
                  key={action.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white border border-[var(--border)] rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 group cursor-pointer"
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-[var(--primary)] rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <div className="text-white">{action.icon}</div>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-[var(--text)] mb-2">{action.title}</h4>
                      <p className="text-[var(--text-muted)] text-sm mb-3">{action.description}</p>
                      <button className="text-[var(--primary)] font-semibold text-sm hover:text-[var(--primary-hover)] transition-colors duration-300 flex items-center space-x-1">
                        <span>{action.action}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Modern CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            viewport={{ once: true }}
            className="relative mt-20"
          >
            {/* Subtle Wave Top */}
            <div className="relative">
              <svg className="w-full h-16" viewBox="0 0 1200 120" preserveAspectRatio="none">
                <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" fill="#F8FAFC" fillOpacity="0.8"/>
              </svg>
            </div>

            {/* Main CTA Card */}
            <div className="bg-[var(--accent)] relative overflow-hidden rounded-3xl mx-4 shadow-2xl">
              {/* Animated Background Elements */}
              <div className="absolute inset-0">
                <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
                <div className="absolute bottom-10 right-10 w-24 h-24 bg-white/5 rounded-full blur-lg animate-pulse" style={{animationDelay: '1s'}}></div>
                <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/5 rounded-full blur-md animate-pulse" style={{animationDelay: '2s'}}></div>
              </div>

              <div className="relative z-10 py-16 px-8">
                <div className="max-w-5xl mx-auto">
                  {/* Icon */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-8 backdrop-blur-sm border border-white/30"
                  >
                    <Send className="w-8 h-8 text-white" />
                  </motion.div>
                  
                  {/* Content */}
                  <div className="text-center mb-10">
                    <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
                      Hemen <span className="text-white/90">Başlayın</span>
                    </h3>
                    
                    <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
                      Bootcamp programlarımıza katılın ve teknoloji dünyasında kendinizi geliştirin. 
                      Ücretsiz eğitimler ve sertifikasyon fırsatları sizi bekliyor.
                    </p>
                  </div>
                  
                  {/* Buttons */}
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-white text-[var(--accent)] font-bold py-4 px-8 rounded-2xl transition-all duration-300 hover:bg-white/90 hover:shadow-2xl flex items-center space-x-3 text-lg shadow-lg"
                    >
                      <span>Programları İncele</span>
                      <ArrowRight className="w-5 h-5" />
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-white/20 backdrop-blur-sm text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 hover:bg-white/30 hover:shadow-xl flex items-center space-x-3 text-lg border border-white/30"
                    >
                      <span>Tüm Kurslar</span>
                      <ArrowRight className="w-5 h-5" />
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>

          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Contact;