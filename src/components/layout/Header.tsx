'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LogIn } from 'lucide-react';
import Image from 'next/image';
import { APP_NAME } from '@/utils/constants';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 50);
          
          // Aktif bölümü belirle
          const sections = ['home', 'about', 'timeline', 'faq', 'contact'];
          const scrollPosition = window.scrollY + 200; // Header yüksekliği + offset
          
          let currentSection = 'home';
          
          for (const sectionId of sections) {
            const section = document.getElementById(sectionId);
            if (section) {
              const sectionTop = section.offsetTop;
              const sectionHeight = section.offsetHeight;
              
              if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = sectionId;
                break;
              }
            }
          }
          
          // Eğer hiçbir bölümde değilse, en son bölümü aktif yap
          if (scrollPosition >= document.body.scrollHeight - window.innerHeight) {
            currentSection = 'contact';
          }
          
          setActiveSection(currentSection);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Sayfa yüklendiğinde de çalıştır
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLoginClick = () => {
    window.location.href = '/login';
  };


  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const menuItems = [
    { id: 'home', label: 'Ana Sayfa', href: '#home' },
    { id: 'about', label: 'Hakkında', href: '#about' },
    { id: 'timeline', label: 'Takvim', href: '#timeline' },
    { id: 'faq', label: 'SSS', href: '#faq' },
    { id: 'contact', label: 'İletişim', href: '#contact' },
  ];

  const isActive = (sectionId: string) => activeSection === sectionId;

  return (
    <>
      {/* Top Bar - Site Adı ve Butonlar */}
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-gradient-to-r from-[#E31B23] via-[#2563EB] to-white backdrop-blur-xl shadow-sm border-b border-[#E5E7EB]'
            : 'bg-gradient-to-r from-[#E31B23]/90 via-[#2563EB]/90 to-white/80 backdrop-blur-md border-b border-white/40'
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo ve Site Adı */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-4 cursor-pointer"
              onClick={() => scrollToSection('home')}
            >
              <Image
                src="/huaweilogo.png"
                alt="Huawei Logo"
                width={100}
                height={60}
                className="object-contain"
                priority
              />
              <div className="hidden sm:block">
                <h1 className={`font-semibold text-xl lg:text-2xl text-white`}>
                  {APP_NAME}
                </h1>
              </div>
            </motion.div>

            {/* Auth Buttons */}
            <div className="flex items-center space-x-6">
              <button
                onClick={handleLoginClick}
                className="group relative bg-[#E31B23] hover:bg-[#C8161D] text-white font-semibold py-2.5 px-5 rounded-xl text-sm transition-colors flex items-center justify-center gap-2 shadow-md"
              >
                <LogIn className="w-5 h-5" />
                <span>Giriş Yap</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Bottom Bar - Navigation Menu */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.1 }}
        className={`fixed top-20 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-[#F8FAFC]/95 backdrop-blur-xl border-t border-[#E5E7EB]'
            : 'bg-[#F8FAFC]/70 backdrop-blur-md border-t border-[#E5E7EB]/60'
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-16">
            {/* Desktop Navigation - Ortalanmış */}
            <nav className="hidden lg:flex items-center space-x-10">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`font-medium text-base transition-colors duration-200 relative ${
                    isScrolled 
                      ? isActive(item.id)
                        ? 'text-[#2563EB]'
                        : 'text-[#4B5563] hover:text-[#2563EB]'
                      : isActive(item.id)
                        ? 'text-[#2563EB]'
                        : 'text-[#0B0F19] hover:text-[#2563EB]'
                  }`}
                >
                  {item.label}
                  {isActive(item.id) && (
                    <motion.div
                      layoutId="activeIndicator"
                      className={`absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-[#2563EB]`}
                      initial={false}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </button>
              ))}
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`lg:hidden p-3 rounded-lg transition-colors ${
                isScrolled
                  ? 'text-[#4B5563] hover:bg-gray-100'
                  : 'text-[#0B0F19] hover:bg-black/5'
              }`}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-white/95 backdrop-blur-xl border-t border-[#E5E7EB]"
            >
              <div className="container mx-auto px-4 py-6">
                <nav className="flex flex-col space-y-6">
                  {menuItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className={`text-left font-medium text-base py-3 transition-colors duration-200 relative ${
                        isActive(item.id)
                          ? 'text-[#2563EB]'
                          : 'text-[#4B5563] hover:text-[#2563EB]'
                      }`}
                    >
                      {item.label}
                      {isActive(item.id) && (
                        <motion.div
                          layoutId="mobileActiveIndicator"
                          className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-[#2563EB] rounded-full"
                          initial={false}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      )}
                    </button>
                  ))}
                  
                  <div className="pt-6 border-t border-gray-200">
                    <button
                      onClick={handleLoginClick}
                      className="flex items-center gap-3 text-[#4B5563] font-medium py-3 hover:text-[#2563EB] transition-colors duration-200 w-full"
                    >
                      <LogIn className="w-5 h-5" />
                      <span>Giriş Yap</span>
                    </button>
                  </div>
                </nav>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
};

export default Header;
