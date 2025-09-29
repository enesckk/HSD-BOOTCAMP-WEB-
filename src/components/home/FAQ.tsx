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
  MessageCircle
} from 'lucide-react';

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqItems = [
    {
      question: "Maraton ne zaman ve nerede düzenlenecek?",
      answer: "Maraton 19-20 Şubat 2026 tarihlerinde Gaziantep Şehitkamil Kongre ve Sanat Merkezi'nde düzenlenecektir. Fiziksel katılım zorunludur. 24 saat boyunca kesintisiz proje geliştirme süreci yaşanacak.",
      icon: <Calendar className="w-5 h-5" />,
      category: "Etkinlik"
    },
    {
      question: "Maratona kimler katılabilir?",
      answer: "18-30 yaş arasındaki üniversite öğrencileri katılabilir. Başvurular bireysel olarak alınır, takımlar etkinlik sırasında oluşturulur. Afet yönetimi teknolojileri alanında ilgi duyan, yenilikçi fikirler üretmeye istekli tüm öğrenciler başvurabilir.",
      icon: <Users className="w-5 h-5" />,
      category: "Katılım"
    },
    {
      question: "Son başvuru tarihi ne zaman?",
      answer: "Son başvuru tarihi 15 Şubat 2026, 23:59'dur. Bu tarihten sonra başvuru alınmayacaktır. Başvurunuzu zamanında tamamlamanız önemlidir.",
      icon: <Clock className="w-5 h-5" />,
      category: "Başvuru"
    },
    {
      question: "Başvuru sürecinde ne yapmam gerekiyor?",
      answer: "Başvuru formunu doldurmanız, yaratıcılığınızı göstereceğiniz soruları cevaplamanız ve kendinizi tanıtan bir video hazırlamanız gerekmektedir. Başvuru süreci yaklaşık 30 dakika sürmektedir.",
      icon: <Target className="w-5 h-5" />,
      category: "Başvuru"
    },
    {
      question: "Hangi ödüller verilecek?",
      answer: "1. Takım: Huawei MatePad 11.5, 2. Takım: Huawei Watch GT4, 3. Takım: Huawei Watch Fit 3. Diğer takımlar için Huawei Band 9 ve tüm katılımcılara sertifika verilecektir.",
      icon: <Award className="w-5 h-5" />,
      category: "Ödüller"
    },
    {
      question: "Takım nasıl oluşturulacak?",
      answer: "30 katılımcı 10 takıma ayrılacak. Her takım 3 kişiden oluşur: Takım Lideri, Teknik Sorumlu ve Tasarımcı. Takımlar etkinlik sırasında oluşturulur ve dengeli dağılım sağlanır.",
      icon: <Users className="w-5 h-5" />,
      category: "Takım"
    },
    {
      question: "Maraton sırasında ne tür proje fikirleri geliştirilecek?",
      answer: "Afet yönetimi teknolojileri alanında yenilikçi proje fikirleri geliştirilecek. Katılımcılar IoT sensörleri, mobil uygulamalar, web platformları, AI destekli sistemler gibi teknolojileri kullanarak sadece proje fikirlerini sunacaklar. Herhangi bir uygulama geliştirilmeyecek, sadece fikir ve konsept sunumu yapılacaktır.",
      icon: <Star className="w-5 h-5" />,
      category: "Proje"
    },
    {
      question: "Maraton sırasında yemek desteği sağlanacak mı?",
      answer: "Maraton süresince tüm yemekler ve içecekler ücretsiz olarak sağlanacaktır. Katılımcılarımızın enerjilerini korumaları için sağlıklı ve besleyici yemekler sunulacaktır.",
      icon: <MapPin className="w-5 h-5" />,
      category: "Etkinlik"
    },
    {
      question: "Ulaşım ve konaklama desteği sağlanacak mı?",
      answer: "Ulaşım ve konaklama desteği sağlanmayacaktır. Katılımcılar kendi ulaşım ve konaklama ihtiyaçlarını karşılamalıdır. Gaziantep'e ulaşım ve konaklama konusunda öneriler için iletişime geçebilirsiniz.",
      icon: <MapPin className="w-5 h-5" />,
      category: "Etkinlik"
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="relative py-20 bg-white">
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
        <div className="max-w-4xl mx-auto">
          
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
              <HelpCircle className="w-4 h-4" />
              <span>Sıkça Sorulan Sorular</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Sıkça <span className="text-red-600">Sorulan Sorular</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Maraton hakkında merak ettiğiniz soruların cevaplarını burada bulabilirsiniz. 
              Eğer sorunuzun cevabını bulamazsanız, iletişim bölümünden bize ulaşabilirsiniz.
            </p>
          </motion.div>

          {/* FAQ Items */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            {faqItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 relative"
              >
                {/* Top Accent Line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-red-600"></div>
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-300"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <div className="text-white">
                        {item.icon}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">
                        {item.question}
                      </h3>
                      <span className="text-sm text-red-600 font-medium">
                        {item.category}
                      </span>
                    </div>
                  </div>
                  <div className="flex-shrink-0 ml-4">
                    {openIndex === index ? (
                      <ChevronUp className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    )}
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
                        <div className="pt-4 border-t border-gray-100">
                          <p className="text-gray-700 leading-relaxed">
                            {item.answer}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>

          {/* Contact CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
              <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Sorunuzun Cevabını Bulamadınız mı?
              </h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Yukarıdaki sorular arasında aradığınız cevabı bulamadıysanız, 
                iletişim bölümünden bizimle iletişime geçebilirsiniz.
              </p>
              <button 
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                İletişime Geçin
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
