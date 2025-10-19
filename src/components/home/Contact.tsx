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
  Twitter,
  Instagram,
  Facebook,
  Youtube,
  Navigation,
  Star,
  Calendar,
  Users,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

const Contact: React.FC = () => {

  const contactInfo = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: "E-posta",
      value: "info@huawei.com.tr",
      description: "Genel sorularınız için",
      color: "from-red-500 to-red-600"
    },
  ];

  const socialMedia = [
    {
      name: "LinkedIn",
      icon: <Linkedin className="w-5 h-5" />,
      url: "https://www.linkedin.com/company/huawei-turkey",
      color: "from-blue-600 to-blue-700"
    },
    {
      name: "X",
      icon: <Twitter className="w-5 h-5" />,
      url: "https://twitter.com/HuaweiTurkey",
      color: "from-gray-600 to-gray-700"
    },
    {
      name: "Instagram",
      icon: <Instagram className="w-5 h-5" />,
      url: "https://www.instagram.com/huaweiturkey",
      color: "from-pink-500 to-pink-600"
    },
    {
      name: "YouTube",
      icon: <Youtube className="w-5 h-5" />,
      url: "https://www.youtube.com/c/HuaweiDeveloperGroupsTürkiye",
      color: "from-red-500 to-red-600"
    },
    {
      name: "Medium",
      icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M13.54 12a6.8 6.8 0 1 1-6.8-6.8 6.8 6.8 0 0 1 6.8 6.8zM20.96 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9zM2.5 12c0 4.97 4.03 9 9 9s9-4.03 9-9-4.03-9-9-9-9 4.03-9 9z"/></svg>,
      url: "https://medium.com/@huaweiturkey",
      color: "from-green-600 to-green-700"
    }
  ];


  return (
    <section id="contact" className="relative py-20 bg-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
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
            className="text-center mb-20"
          >
            <div className="inline-flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
              <MessageSquare className="w-4 h-4" />
              <span>İletişim</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Bizimle <span className="text-red-600">İletişime Geçin</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Sorularınız için bizimle iletişime geçebilir, sosyal medya hesaplarımızı takip edebilir 
              ve bootcamp programları hakkında güncel bilgiler alabilirsiniz
            </p>
          </motion.div>


          {/* Contact Content */}
          <div className="max-w-4xl mx-auto">
            
            {/* Contact Info & Social Media */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="space-y-12"
            >
              {/* Contact Info */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 relative overflow-hidden">
                {/* Top Accent Line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-red-600"></div>
                <div className="text-center mb-8">
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">İletişim Bilgileri</h3>
                  <p className="text-gray-600 text-lg">Bizimle iletişime geçin</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  {contactInfo.map((info, index) => (
                    <motion.div
                      key={info.title}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="text-center p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-300"
                    >
                      <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <div className="text-white">
                          {info.icon}
                        </div>
                      </div>
                      <h4 className="text-lg font-bold text-gray-900 mb-2">{info.title}</h4>
                      <p className="text-gray-900 font-medium mb-2">{info.value}</p>
                        <p className="text-gray-600 text-sm">{info.description}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Social Media */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 relative overflow-hidden">
                {/* Top Accent Line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-red-600"></div>
                <div className="text-center mb-8">
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">Sosyal Medya</h3>
                  <p className="text-gray-600 text-lg">Bizi takip edin</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {socialMedia.map((social, index) => (
                    <motion.a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="bg-gray-100 text-gray-700 p-4 rounded-xl flex flex-col items-center justify-center space-y-2 hover:bg-red-600 hover:text-white hover:shadow-lg transition-all duration-300 transform"
                    >
                      <div className="text-2xl">{social.icon}</div>
                      <span className="font-medium text-sm">{social.name}</span>
                    </motion.a>
                  ))}
                </div>
              </div>

            </motion.div>
          </div>
          {/* Final Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-8 border border-red-200 shadow-lg relative overflow-hidden">
              {/* Top Accent Line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-red-600"></div>
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-5">
                <div 
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23dc2626' fill-opacity='0.1'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z'/%3E%3C/g%3E%3C/svg%3E")`,
                  }}
                />
              </div>
              
              <div className="relative z-10">
                <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Star className="w-8 h-8 text-white" />
                </div>
                
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Bu Heyecan Verici <span className="text-red-600">Yolculuğa Katılın</span>
                </h2>
                
                <p className="text-lg text-gray-700 mb-6 max-w-2xl mx-auto leading-relaxed">
                Teknoloji alanında kendinizi geliştirin, 
                takım çalışması deneyimi kazanın ve modern teknolojilerle tanışın.
              </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
              <button                onClick={() => window.location.href = '/application'}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center space-x-2"
              >
                    <span>Hemen Başvurunuzu Yapın</span>
                    <ArrowRight className="w-4 h-4" />
              </button>
                  
                  <div className="flex items-center space-x-4 text-gray-600">
                    <div className="flex items-center space-x-1">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm font-medium">Ücretsiz</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4 text-blue-500" />
                      <span className="text-sm font-medium">2 Gün</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4 text-purple-500" />
                      <span className="text-sm font-medium">30 Kişi</span>
                    </div>
                  </div>
                </div>
                
                {/* Bottom Accent */}
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-8 h-px bg-gradient-to-r from-transparent to-red-300" />
                  <div className="w-2 h-2 bg-red-500 rounded-full" />
                  <div className="w-8 h-px bg-gradient-to-l from-transparent to-red-300" />
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
