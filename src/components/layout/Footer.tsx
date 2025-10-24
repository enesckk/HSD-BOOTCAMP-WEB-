'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import {
  Mail,
  Phone,
  MapPin,
  Linkedin,
  X,
  Instagram,
  Youtube,
  ArrowUp,
  Globe,
  Shield,
  Heart,
  BookOpen
} from 'lucide-react';

const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "Hakkımızda", href: "#about" },
    { name: "Aktif Bootcamp", href: "#active-bootcamp" },
    { name: "Eğitim Programı", href: "#timeline" },
    { name: "Katılım Kriterleri", href: "#requirements" },
    { name: "Geçmiş Programlar", href: "#previous" },
    { name: "SSS", href: "#faq" },
    { name: "İletişim", href: "#contact" }
  ];

  const programs = [
    { name: "Kubernetes Bootcamp", href: "#active-bootcamp" },
    { name: "Cloud Native Development", href: "#" },
    { name: "AI/ML Bootcamp", href: "#" },
    { name: "DevOps Workshop", href: "#" }
  ];

  const resources = [
    { name: "Eğitim Materyalleri", href: "#" },
    { name: "Sertifikasyon", href: "#" },
    { name: "Topluluk", href: "#" },
    { name: "Blog", href: "#" }
  ];

  const socialMedia = [
    {
      name: "LinkedIn",
      icon: <Linkedin className="w-5 h-5" />,
      href: "https://linkedin.com/company/huawei"
    },
    {
      name: "Twitter",
      icon: <X className="w-5 h-5" />,
      href: "https://twitter.com/huawei"
    },
    {
      name: "Instagram",
      icon: <Instagram className="w-5 h-5" />,
      href: "https://instagram.com/huawei"
    },
    {
      name: "YouTube",
      icon: <Youtube className="w-5 h-5" />,
      href: "https://youtube.com/huawei"
    },
    {
      name: "Medium",
      icon: <span className="w-5 h-5 flex items-center justify-center font-bold text-sm">M</span>,
      href: "https://medium.com/huawei"
    }
  ];

  return (
    <footer className="bg-white border-t border-[var(--border)]">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6 mb-8">
          
          {/* Company Info */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
               {/* Logolar */}
               <div className="flex items-center space-x-4 mb-6">
                 <div className="hover:scale-105 transition-transform duration-200">
                   <Image
                     src="/Huawei-Logo.png"
                     alt="Huawei Logo"
                     width={60}
                     height={45}
                     className="object-contain"
                   />
                 </div>
                 <div className="h-8 w-px bg-gray-300"></div>
                 <div className="hover:scale-105 transition-transform duration-200">
                   <Image
                     src="/hsd-logo.png"
                     alt="HSD Logo"
                     width={60}
                     height={45}
                     className="object-contain"
                   />
                 </div>
               </div>
               
               <h3 className="text-xl font-bold text-[var(--text)] mb-2">HSD Türkiye Bootcamp</h3>
               <p className="text-[var(--text-muted)] text-sm leading-relaxed mb-6">
                 Genç yetenekleri destekliyor, yenilikçi çözümler geliştiriyoruz. 
                 Teknoloji alanında uzmanlaşmak isteyen herkesi aramızda görmek istiyoruz.
               </p>

              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-[var(--text-muted)]">
                  <Mail className="w-4 h-4 text-[var(--primary)]" />
                  <span className="text-sm">info@huawei.com.tr</span>
                </div>
                <div className="flex items-center space-x-3 text-[var(--text-muted)]">
                  <Phone className="w-4 h-4 text-[var(--primary)]" />
                  <span className="text-sm">+90 212 123 45 67</span>
                </div>
                <div className="flex items-center space-x-3 text-[var(--text-muted)]">
                  <MapPin className="w-4 h-4 text-[var(--primary)]" />
                  <span className="text-sm">İstanbul, Türkiye</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Quick Links */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h4 className="text-lg font-semibold text-[var(--text)] mb-6">Hızlı Linkler</h4>
              <ul className="space-y-3">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors duration-200 text-sm"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Programs */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h4 className="text-lg font-semibold text-[var(--text)] mb-6">Programlar</h4>
              <ul className="space-y-3">
                {programs.map((program, index) => (
                  <li key={index}>
                    <a
                      href={program.href}
                      className="text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors duration-200 text-sm"
                    >
                      {program.name}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Resources */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <h4 className="text-lg font-semibold text-[var(--text)] mb-6">Kaynaklar</h4>
              <ul className="space-y-3">
                {resources.map((resource, index) => (
                  <li key={index}>
                    <a
                      href={resource.href}
                      className="text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors duration-200 text-sm"
                    >
                      {resource.name}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>

        {/* Social Media & Newsletter */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          
          {/* Social Media */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <h4 className="text-lg font-semibold text-[var(--text)] mb-6">Sosyal Medya</h4>
            <div className="flex space-x-4">
              {socialMedia.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110 ${
                    social.name === 'LinkedIn' 
                      ? 'bg-blue-600 text-white hover:bg-blue-700' 
                      : social.name === 'Twitter'
                      ? 'bg-black text-white hover:bg-gray-800'
                      : social.name === 'Instagram'
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
                      : social.name === 'Medium'
                      ? 'bg-gray-800 text-white hover:bg-gray-900'
                      : 'bg-red-600 text-white hover:bg-red-700'
                  }`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </motion.div>

          {/* Newsletter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            viewport={{ once: true }}
          >
            <h4 className="text-lg font-semibold text-[var(--text)] mb-6">Bülten</h4>
            <p className="text-[var(--text-muted)] text-sm mb-4">
              En son haberler ve güncellemeler için bültenimize abone olun.
            </p>
            <div className="flex space-x-2">
              <input
                type="email"
                placeholder="E-posta adresiniz"
                className="flex-1 px-4 py-2 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
              />
              <button className="px-6 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-hover)] transition-colors duration-200">
                Abone Ol
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[var(--border)] bg-[var(--bg)]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            
            {/* Copyright */}
            <div className="flex items-center space-x-2 text-[var(--text-muted)] text-sm">
              <Heart className="w-4 h-4 text-[var(--primary)]" />
              <span>© {currentYear} Huawei Türkiye. Tüm hakları saklıdır.</span>
            </div>

            {/* Additional Links */}
            <div className="flex items-center space-x-6 text-sm text-[var(--text-muted)]">
              <a href="#" className="hover:text-[var(--primary)] transition-colors duration-200 flex items-center space-x-1">
                <Shield className="w-4 h-4" />
                <span>Gizlilik Politikası</span>
              </a>
              <a href="#" className="hover:text-[var(--primary)] transition-colors duration-200 flex items-center space-x-1">
                <Globe className="w-4 h-4" />
                <span>Kullanım Şartları</span>
              </a>
            </div>

            {/* Back to Top */}
            <button
              onClick={scrollToTop}
              className="flex items-center space-x-2 text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors duration-200"
            >
              <span className="text-sm">Yukarı Çık</span>
              <ArrowUp className="w-4 h-4" />
            </button>

          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;