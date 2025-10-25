'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Download, ExternalLink, Video, FileText, Code, Database, Cloud, Zap, Target, Play, Flag } from 'lucide-react';

const ResourcesPage = () => {
  const resourceCategories = [
    {
      title: 'Cloud Native Mimarilerine Genel Bakış',
      icon: <Cloud className="w-6 h-6" />,
      resources: [
        {
          title: 'Cloud Native Computing Arka Planı',
          type: 'Content',
          icon: <FileText className="w-5 h-5" />,
          description: 'Cloud native computing\'in temellerini ve gelişim sürecini öğrenin. Modern uygulama geliştirme yaklaşımlarını anlayın.'
        },
        {
          title: 'Temel Cloud Native Teknolojiler',
          type: 'Content',
          icon: <FileText className="w-5 h-5" />,
          description: 'Container, Kubernetes, microservices gibi temel cloud native teknolojileri ve bunların birbirleriyle ilişkilerini keşfedin.'
        },
        {
          title: 'Huawei Cloud Native Çözümleri',
          type: 'Content',
          icon: <FileText className="w-5 h-5" />,
          description: 'Huawei Cloud\'un cloud native ekosistemindeki çözümlerini ve hizmetlerini tanıyın.'
        }
      ]
    },
    {
      title: 'Cloud Native Altyapı - Container\'lar',
      icon: <Zap className="w-6 h-6" />,
      resources: [
        {
          title: 'Container Teknolojileri',
          type: 'Content',
          icon: <FileText className="w-5 h-5" />,
          description: 'Docker, containerd gibi container teknolojilerini ve bunların nasıl çalıştığını öğrenin.'
        },
        {
          title: 'Container Yaşam Döngüsü Yönetimi',
          type: 'Content',
          icon: <FileText className="w-5 h-5" />,
          description: 'Container\'ların oluşturulması, çalıştırılması, durdurulması ve silinmesi süreçlerini yönetmeyi öğrenin.'
        }
      ]
    },
    {
      title: 'Cloud Native Altyapı - Kubernetes',
      icon: <Target className="w-6 h-6" />,
      resources: [
        {
          title: 'Kubernetes Temel Teknolojileri',
          type: 'Content',
          icon: <FileText className="w-5 h-5" />,
          description: 'Pod, Service, Deployment, ConfigMap gibi Kubernetes temel bileşenlerini öğrenin.'
        },
        {
          title: 'Container Orkestrasyonu',
          type: 'Content',
          icon: <FileText className="w-5 h-5" />,
          description: 'Kubernetes ile container\'ları nasıl orkestre edeceğinizi ve yöneteceğinizi öğrenin.'
        }
      ]
    },
    {
      title: 'Huawei Cloud Container Servisleri',
      icon: <Play className="w-6 h-6" />,
      resources: [
        {
          title: 'CCE (Cloud Container Engine)',
          type: 'Content',
          icon: <FileText className="w-5 h-5" />,
          description: 'Huawei Cloud Container Engine servisini tanıyın ve Kubernetes cluster\'larını nasıl yöneteceğinizi öğrenin.'
        },
        {
          title: 'CCI (Cloud Container Instance)',
          type: 'Content',
          icon: <FileText className="w-5 h-5" />,
          description: 'Serverless container çözümü CCI ile tanışın ve kullanım senaryolarını öğrenin.'
        },
        {
          title: 'SWR (Software Repository)',
          type: 'Content',
          icon: <FileText className="w-5 h-5" />,
          description: 'Container image\'lerini saklama ve yönetme için SWR servisini kullanmayı öğrenin.'
        }
      ]
    },
    {
      title: 'Mikroservis Mimarisi',
      icon: <Database className="w-6 h-6" />,
      resources: [
        {
          title: 'Mikroservis Mimarisi Temelleri',
          type: 'Content',
          icon: <FileText className="w-5 h-5" />,
          description: 'Mikroservis mimarisinin temel prensiplerini ve avantajlarını öğrenin.'
        },
        {
          title: 'ServiceStage ile Mikroservis Yönetimi',
          type: 'Content',
          icon: <FileText className="w-5 h-5" />,
          description: 'Huawei Cloud ServiceStage platformunda mikroservislerin deployment ve yönetimini öğrenin.'
        }
      ]
    },
    {
      title: 'Istio Service Mesh',
      icon: <Flag className="w-6 h-6" />,
      resources: [
        {
          title: 'Service Mesh Nedir?',
          type: 'Content',
          icon: <FileText className="w-5 h-5" />,
          description: 'Service mesh kavramını ve modern mikroservis mimarilerindeki rolünü öğrenin.'
        },
        {
          title: 'Istio Mimarisi',
          type: 'Content',
          icon: <FileText className="w-5 h-5" />,
          description: 'Istio\'nun bileşenlerini ve nasıl çalıştığını detaylı olarak öğrenin.'
        },
        {
          title: 'Istio Trafik Yönetimi',
          type: 'Content',
          icon: <FileText className="w-5 h-5" />,
          description: 'Istio ile trafik yönetimi politikalarını nasıl uygulayacağınızı öğrenin.'
        }
      ]
    },
    {
      title: 'Cloud Native DevSecOps',
      icon: <BookOpen className="w-6 h-6" />,
      resources: [
        {
          title: 'Agile Yazılım Geliştirme',
          type: 'Content',
          icon: <FileText className="w-5 h-5" />,
          description: 'Agile metodolojilerini ve modern yazılım geliştirme süreçlerini öğrenin.'
        },
        {
          title: 'DevOps Mindset',
          type: 'Content',
          icon: <FileText className="w-5 h-5" />,
          description: 'DevOps kültürünü ve geliştirme-operasyon işbirliğini anlayın.'
        },
        {
          title: 'Huawei Cloud HE2E DevOps Framework',
          type: 'Content',
          icon: <FileText className="w-5 h-5" />,
          description: 'Huawei Cloud\'un end-to-end DevOps çözümlerini ve framework\'ünü öğrenin.'
        }
      ]
    }
  ];

  const additionalResources = [
    {
      title: 'Huawei Cloud Native Eğitimi',
      description: 'Cloud Native Architectures resmi eğitim kursu',
      icon: <Cloud className="w-6 h-6" />,
      url: 'https://connect.huaweicloud.com/intl/en-us/courses/learn/C101714287822705994/about/sp:cloudEdu_en',
      type: 'External'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
     
      
        <p className="text-lg text-gray-600 leading-relaxed">
          Cloud Native Architectures bootcamp programı için hazırlanmış tüm eğitim materyalleri, videolar, 
          laboratuvarlar ve ek kaynaklar.
        </p>
      {/* Resource Categories */}
      <div className="space-y-8">
        {resourceCategories.map((category, categoryIndex) => (
          <motion.div
            key={categoryIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: categoryIndex * 0.1 }}
            className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center text-red-600">
                {category.icon}
              </div>
              <h2 className="text-2xl font-bold text-gray-900">{category.title}</h2>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.resources.map((resource, resourceIndex) => (
                <motion.div
                  key={resourceIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (categoryIndex * 0.1) + (resourceIndex * 0.05) }}
                  className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600">
                        {resource.icon}
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{resource.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{resource.description}</p>
                  
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Additional Resources */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Ek Kaynaklar</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {additionalResources.map((resource, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center text-red-600">
                  {resource.icon}
                </div>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold">
                  {resource.type}
                </span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{resource.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{resource.description}</p>
              <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center space-x-2"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Ziyaret Et</span>
              </a>
            </motion.div>
          ))}
        </div>
      </motion.div>

    </div>
  );
};

export default ResourcesPage;
