'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Users, 
  Calendar, 
  MapPin, 
  Award, 
  Clock,
  Star,
  Target,
  MessageCircle,
  ArrowRight,
  CheckCircle,
  BookOpen,
  Shield
} from 'lucide-react';

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqItems = [
    {
      question: "Bootcamp programları ne zaman düzenleniyor?",
      answer: "Afet Fikir Teknolojileri Maratonu programları yıl boyunca farklı teknoloji alanlarında düzenlenmektedir. Aktif programlar için ana sayfadaki 'Aktif Bootcamp' bölümünü kontrol edebilirsiniz.",
      icon: <Calendar className="w-5 h-5" />,
      category: "Program"
    },
    {
      question: "Bootcamp programlarına kimler katılabilir?",
      answer: "Teknoloji alanında ilgi duyan, öğrenmeye açık tüm katılımcılar başvurabilir. Program seviyesi ve ön koşullar her bootcamp için farklılık gösterebilir.",
      icon: <Users className="w-5 h-5" />,
      category: "Katılım"
    },
    {
      question: "Başvuru süreci nasıl işliyor?",
      answer: "Aktif bootcamp programları için verilen linkler üzerinden başvuru yapabilirsiniz. Her programın kendi başvuru süreci ve kriterleri bulunmaktadır.",
      icon: <Clock className="w-5 h-5" />,
      category: "Başvuru"
    },
    {
      question: "Eğitim formatı nasıl?",
      answer: "Bootcamp programları genellikle online formatında düzenlenmektedir. Bazı programlar hibrit (online + offline) formatında da olabilir. Detaylar her program için ayrı ayrı belirtilir.",
      icon: <Target className="w-5 h-5" />,
      category: "Eğitim"
    },
    {
      question: "Sertifikasyon var mı?",
      answer: "Evet, başarıyla tamamlanan bootcamp programları için sertifikasyon verilmektedir. Huawei Cloud sertifikaları ve HSD Türkiye katılım belgeleri sunulmaktadır.",
      icon: <Award className="w-5 h-5" />,
      category: "Sertifikasyon"
    },
    {
      question: "Eğitim ücretli mi?",
      answer: "HSD Türkiye Bootcamp programları tamamen ücretsizdir. Tüm eğitimler, materyaller ve sertifikasyonlar ücretsiz olarak sunulmaktadır.",
      icon: <Users className="w-5 h-5" />,
      category: "Ücret"
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="relative py-20 bg-[#F8FAFC]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center space-x-2 bg-[var(--accent)]/10 border border-[var(--accent)]/20 text-[var(--accent)] px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <HelpCircle className="w-4 h-4" />
              <span>Sıkça Sorulan Sorular</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-[var(--text)] mb-6">
              Sıkça <span className="text-[var(--primary)]">Sorulan Sorular</span>
            </h2>
           
          </motion.div>

          {/* Modern 2 Column Layout */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="grid lg:grid-cols-2 gap-12 items-start"
          >
            {/* Left Side - Large Animated Question Marks */}
            <div className="relative">
              {/* Large Animated Question Marks */}
              <div className="flex items-center space-x-8 mb-8">
                <motion.div
                  animate={{ 
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="w-32 h-32 bg-[var(--primary)]/10 rounded-full flex items-center justify-center"
                >
                  <HelpCircle className="w-16 h-16 text-[var(--primary)]" />
                </motion.div>
                
                <motion.div
                  animate={{ 
                    rotate: [0, -15, 15, 0],
                    scale: [1, 0.9, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1
                  }}
                  className="w-28 h-28 bg-[var(--accent)]/10 rounded-full flex items-center justify-center"
                >
                  <HelpCircle className="w-14 h-14 text-[var(--accent)]" />
                </motion.div>
              </div>

              <h3 className="text-3xl font-bold text-[var(--text)] mb-6">
                Merak Ettikleriniz
              </h3>
              <p className="text-lg text-[var(--text-muted)] leading-relaxed mb-8">
                Bootcamp programları hakkında en çok sorulan sorular ve cevapları. 
                Aradığınız bilgiyi bulamazsanız bizimle iletişime geçin.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-[var(--primary)]" />
                  <span className="text-[var(--text-muted)]">Program detayları</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-[var(--primary)]" />
                  <span className="text-[var(--text-muted)]">Katılım koşulları</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-[var(--primary)]" />
                  <span className="text-[var(--text-muted)]">Eğitim formatı</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-[var(--primary)]" />
                  <span className="text-[var(--text-muted)]">Sertifikasyon</span>
                </div>
              </div>
            </div>

            {/* Right Side - FAQ Items */}
            <div className="space-y-4">
              {faqItems.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white border border-[var(--border)] rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full p-6 text-left flex items-start space-x-4 hover:bg-[var(--bg)] transition-colors duration-300"
                  >
                    <div className="w-12 h-12 bg-[var(--primary)] rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                      <div className="text-white">{item.icon}</div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-[var(--accent)] font-semibold bg-[var(--accent)]/10 px-3 py-1 rounded-full">
                          {item.category}
                        </span>
                        {openIndex === index ? (
                          <ChevronUp className="w-5 h-5 text-[var(--text-muted)]" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-[var(--text-muted)]" />
                        )}
                      </div>
                      <h3 className="text-lg font-bold text-[var(--text)] leading-tight">
                        {item.question}
                      </h3>
                    </div>
                  </button>

                  <AnimatePresence>
                    {openIndex === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6">
                          <div className="pt-4 border-t border-[var(--border)]">
                            <p className="text-[var(--text-muted)] leading-relaxed">
                              {item.answer}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Contact CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            <div className="bg-[var(--accent)] rounded-2xl p-8 text-white">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">
                Sorunuzun Cevabını Bulamadınız mı?
              </h3>
              <p className="text-white/80 mb-6 max-w-2xl mx-auto">
                Yukarıdaki sorular arasında aradığınız cevabı bulamadıysanız, 
                iletişim bölümünden bizimle iletişime geçebilirsiniz.
              </p>
              <button 
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-white text-[var(--accent)] font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:bg-white/90 hover:shadow-lg flex items-center space-x-2 mx-auto"
              >
                <span>İletişime Geçin</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default FAQ;