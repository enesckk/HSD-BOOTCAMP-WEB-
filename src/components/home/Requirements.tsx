'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  UserCheck,
  Calendar,
  MapPin,
  Users,
  Award,
  CheckCircle,
  AlertCircle,
  Target,
  ArrowRight,
  Video,
  Youtube,
  Star,
  User,
  Code,
  Palette,
  Zap
} from 'lucide-react';

const Requirements: React.FC = () => {
  const requirements = [
    {
      icon: <User className="w-6 h-6" />,
      title: "Yeni Başlayanlar",
      description: "Kubernetes konusunda yeni başlayanlar için tasarlanmış eğitim programı",
      color: "from-red-500 to-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200"
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Online Katılım",
      description: "Salı ve Perşembe günleri 15:00'te online eğitimlere katılım zorunludur",
      color: "from-red-500 to-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Ödev Tamamlama",
      description: "Katılım belgesi için en az 2 ödev tamamlanması gereklidir",
      color: "from-red-500 to-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200"
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Sertifikasyon",
      description: "3 yıl geçerliliği olan HCCDA-Cloud Native sertifikası alabilirsiniz",
      color: "from-red-500 to-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200"
    }
  ];

  const curriculumModules = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Kubernetes Temelleri",
      description: "Deployment, Pod, Service, Namespace gibi temel Kubernetes kaynakları",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Container Yönetimi",
      description: "SWR ile container imajları build etme, push etme ve CCE deployment",
      color: "from-green-500 to-green-600"
    },
    {
      icon: <Code className="w-6 h-6" />,
      title: "İzleme & Ağ Yönetimi",
      description: "AOM servisi ile monitoring ve Ingress ile ağ yönetimi",
      color: "from-purple-500 to-purple-600"
    }
  ];

  const keyPoints = [
    "Huawei Cloud CCE platformunda hands-on deneyim kazanacaksınız",
    "Kubernetes temel kavramlarını öğrenerek container yönetimi yapabileceksiniz",
    "SWR ile container imajları build edip CCE üzerinde deploy edeceksiniz",
    "AOM servisi ile monitoring ve logging çözümlerini öğreneceksiniz",
    "Eğitim sonunda HCCDA-Cloud Native sertifikası alacaksınız"
  ];

  return (
    <section className="relative py-20 bg-white overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center space-x-2 bg-white border border-[#2563EB]/30 text-[#2563EB] px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <UserCheck className="w-4 h-4 text-[#2563EB]" />
              <span>Katılım Kriterleri</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-8 leading-tight">
              Eğitim <span className="text-red-600">Kriterleri</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Bootcamp'e katılmak için sağlamanız gereken kriterler ve eğitim süreci hakkında detaylar. 
              Tüm kriterleri karşıladığınızdan emin olun.
            </p>
          </motion.div>

          {/* Requirements Grid */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-8 mb-16"
          >
            {requirements.map((req, index) => (
              <motion.div
                key={req.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
              >
                {/* Top Accent Line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-red-600"></div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <div className="text-white">
                      {req.icon}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{req.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{req.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>


          {/* Application Process Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <div className="text-center mb-12">
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Eğitim <span className="text-red-600">Süreci</span>
              </h3>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Bootcamp sürecinde neler öğreneceğiniz ve hangi becerileri kazanacağınız
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 relative overflow-hidden max-w-4xl mx-auto">
              {/* Top Accent Line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-red-600"></div>
              
              <div className="space-y-6">
                {keyPoints.map((point, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-300"
                  >
                    <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white font-bold text-sm">{index + 1}</span>
                    </div>
                    <div>
                      <span className="text-gray-700 leading-relaxed font-medium">{point}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Requirements;
