'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Twitter,
  Instagram,
  Facebook,
  Youtube,
  ArrowUp
} from 'lucide-react';

const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "Hakkında", href: "#about" },
    { name: "Aktif Bootcamp", href: "#active-bootcamp" },
    { name: "Eğitim Programı", href: "#timeline" },
    { name: "Kriterler", href: "#requirements" },
    { name: "Geçmiş Programlar", href: "#previous" },
    { name: "SSS", href: "#faq" },
    { name: "İletişim", href: "#contact" }
  ];

  const socialMedia = [
    {
      name: "LinkedIn",
      icon: <Linkedin className="w-5 h-5" />,
      url: "https://www.linkedin.com/company/huawei-turkey",
      color: "hover:bg-blue-600"
    },
    {
      name: "X",
      icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
      url: "https://twitter.com/HuaweiTurkey",
      color: "hover:bg-gray-600"
    },
    {
      name: "Instagram",
      icon: <Instagram className="w-5 h-5" />,
      url: "https://www.instagram.com/huaweiturkey",
      color: "hover:bg-pink-500"
    },
    {
      name: "YouTube",
      icon: <Youtube className="w-5 h-5" />,
      url: "https://www.youtube.com/c/HuaweiDeveloperGroupsTürkiye",
      color: "hover:bg-red-500"
    },
    {
      name: "Medium",
      icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M13.54 12a6.8 6.8 0 1 1-6.8-6.8 6.8 6.8 0 0 1 6.8 6.8zM20.96 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9zM2.5 12c0 4.97 4.03 9 9 9s9-4.03 9-9-4.03-9-9-9-9 4.03-9 9z"/></svg>,
      url: "https://medium.com/@huaweiturkey",
      color: "hover:bg-green-600"
    }
  ];

  return (
    <footer className="bg-white border-t border-gray-200">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          
          {/* Company Info */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">HW</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Huawei Türkiye</h3>
              </div>
            </div>
            
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              Genç yetenekleri destekliyor, yenilikçi çözümler geliştiriyoruz.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-red-600" />
                <span className="text-sm text-gray-600">info@huawei.com.tr</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-red-600" />
                <span className="text-sm text-gray-600">+90 (212) 318 18 00</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-red-600" />
                <span className="text-sm text-gray-600">İstanbul, Türkiye</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Hızlı Linkler</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm text-gray-600 hover:text-red-600 transition-colors duration-300"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Media & Back to Top */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Bizi Takip Edin</h3>
            <p className="text-sm text-gray-600 mb-4">
              Güncel gelişmelerden haberdar olun.
            </p>
            
            {/* Social Media Icons */}
            <div className="flex space-x-3 mb-6">
              {socialMedia.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 transition-all duration-300 ${social.color} hover:text-white`}
                >
                  {social.icon}
                </a>
              ))}
            </div>

            {/* Back to Top Button */}
            <motion.button
              onClick={scrollToTop}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 text-sm"
            >
              <ArrowUp className="w-4 h-4" />
              <span>Yukarı Çık</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-2 md:space-y-0">
            {/* Copyright */}
            <div className="text-sm text-gray-500">
              © {currentYear} Huawei Türkiye. Tüm hakları saklıdır.
            </div>

            {/* Additional Links */}
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <a href="#" className="hover:text-red-600 transition-colors duration-300">
                Gizlilik Politikası
              </a>
              <a href="#" className="hover:text-red-600 transition-colors duration-300">
                Kullanım Şartları
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

