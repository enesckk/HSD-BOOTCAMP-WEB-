'use client';

import React from 'react';
import { motion } from 'framer-motion';
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
  Award,
  Users,
  Calendar,
  BookOpen,
  Shield,
  Heart
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
    { name: "Sıkça Sorulan Sorular", href: "#faq" },
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

  return (
    <footer className="bg-white border-t border-[var(--border)]">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8 mb-12">
          
          {/* Company Info */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-[var(--primary)] rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-xl">HW</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[var(--text)]">Huawei Türkiye</h3>
                  <p className="text-[var(--text-muted)] text-sm">HSD Bootcamp</p>
                </div>
              </div>
              
              <p className="text-[var(--text-muted)] text-sm leading-relaxed mb-6">
                Genç yetenekleri destekliyor, yenilikçi çözümler geliştiriyoruz. 
                Teknoloji alanında uzmanlaşmak isteyen herkesi aramızda görmek istiyoruz.
              </p>

              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-[var(--text-muted)] text-sm">
                  <Mail className="w-4 h-4 text-[var(--primary)]" />
                  <span>info@huawei.com.tr</span>
                </div>
                <div className="flex items-center space-x-3 text-[var(--text-muted)] text-sm">
                  <Phone className="w-4 h-4 text-[var(--primary)]" />
                  <span>+90 212 123 45 67</span>
                </div>
                <div className="flex items-center space-x-3 text-[var(--text-muted)] text-sm">
                  <MapPin className="w-4 h-4 text-[var(--primary)]" />
                  <span>İstanbul, Türkiye</span>
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
              <div className="space-y-3">
                {quickLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.href}
                    className="block text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors duration-200 text-sm hover:translate-x-1 transform"
                  >
                    {link.name}
                  </a>
                ))}
              </div>
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
              <div className="space-y-3">
                {programs.map((program, index) => (
                  <a
                    key={index}
                    href={program.href}
                    className="block text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors duration-200 text-sm hover:translate-x-1 transform"
                  >
                    {program.name}
                  </a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Resources & Social */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <h4 className="text-lg font-semibold text-[var(--text)] mb-6">Kaynaklar</h4>
              <div className="space-y-3 mb-8">
                {resources.map((resource, index) => (
                  <a
                    key={index}
                    href={resource.href}
                    className="block text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors duration-200 text-sm hover:translate-x-1 transform"
                  >
                    {resource.name}
                  </a>
                ))}
              </div>

              <h4 className="text-lg font-semibold text-[var(--text)] mb-4">Sosyal Medya</h4>
              <div className="grid grid-cols-2 gap-3">
                {socialMedia.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 p-3 bg-[var(--bg)] rounded-xl hover:bg-[var(--accent)]/10 transition-all duration-300 group"
                  >
                    <div className="w-8 h-8 bg-[var(--primary)] rounded-lg flex items-center justify-center text-white flex-shrink-0">
                      {social.icon}
                    </div>
                    <div>
                      <div className="text-[var(--text)] text-sm font-medium">{social.name}</div>
                    </div>
                  </a>
                ))}
              </div>
            </motion.div>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[var(--border)] bg-[var(--bg)]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
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