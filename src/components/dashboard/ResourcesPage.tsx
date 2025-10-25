'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Download, ExternalLink, Video, FileText, Code, Database, Cloud, Zap, Target, Play, Flag } from 'lucide-react';

const ResourcesPage = () => {
  const resourceCategories = [
    {
      title: 'Kubernetes Temelleri',
      icon: <Zap className="w-6 h-6" />,
      resources: [
        {
          title: 'Kubernetes Temel Kavramlar',
          type: 'PDF',
          size: '2.5 MB',
          icon: <FileText className="w-5 h-5" />,
          downloadUrl: '#',
          description: 'Pod, Service, Deployment gibi temel kavramlar'
        },
        {
          title: 'Kubernetes Architecture Video',
          type: 'Video',
          size: '45 dk',
          icon: <Video className="w-5 h-5" />,
          downloadUrl: '#',
          description: 'Kubernetes mimarisi detaylı anlatım'
        },
        {
          title: 'Hands-on Lab: Pod Yönetimi',
          type: 'Lab',
          size: '30 dk',
          icon: <Code className="w-5 h-5" />,
          downloadUrl: '#',
          description: 'Pratik pod oluşturma ve yönetimi'
        }
      ]
    },
    {
      title: 'Konfigürasyon & Veri Yönetimi',
      icon: <Target className="w-6 h-6" />,
      resources: [
        {
          title: 'ConfigMap ve Secret Kullanımı',
          type: 'PDF',
          size: '1.8 MB',
          icon: <FileText className="w-5 h-5" />,
          downloadUrl: '#',
          description: 'Konfigürasyon yönetimi rehberi'
        },
        {
          title: 'Persistent Volume Workshop',
          type: 'Video',
          size: '60 dk',
          icon: <Video className="w-5 h-5" />,
          downloadUrl: '#',
          description: 'Veri kalıcılığı ve storage yönetimi'
        },
        {
          title: 'Huawei OBS Entegrasyonu',
          type: 'Lab',
          size: '45 dk',
          icon: <Database className="w-5 h-5" />,
          downloadUrl: '#',
          description: 'Object Storage Service entegrasyonu'
        }
      ]
    },
    {
      title: 'İzleme & Container Yönetimi',
      icon: <Play className="w-6 h-6" />,
      resources: [
        {
          title: 'AOM Monitoring Guide',
          type: 'PDF',
          size: '3.2 MB',
          icon: <FileText className="w-5 h-5" />,
          downloadUrl: '#',
          description: 'Application Operations Management rehberi'
        },
        {
          title: 'SWR Container Registry',
          type: 'Video',
          size: '35 dk',
          icon: <Video className="w-5 h-5" />,
          downloadUrl: '#',
          description: 'Container image yönetimi'
        },
        {
          title: 'Monitoring Best Practices',
          type: 'Lab',
          size: '50 dk',
          icon: <Code className="w-5 h-5" />,
          downloadUrl: '#',
          description: 'Uygulama izleme stratejileri'
        }
      ]
    },
    {
      title: 'Ağ Yönetimi & Sertifikasyon',
      icon: <Flag className="w-6 h-6" />,
      resources: [
        {
          title: 'Ingress Controller Setup',
          type: 'PDF',
          size: '2.1 MB',
          icon: <FileText className="w-5 h-5" />,
          downloadUrl: '#',
          description: 'Ağ yönetimi ve load balancing'
        },
        {
          title: 'HCCDA Sertifikasyon Hazırlık',
          type: 'Video',
          size: '90 dk',
          icon: <Video className="w-5 h-5" />,
          downloadUrl: '#',
          description: 'Sertifikasyon sınavı hazırlık rehberi'
        },
        {
          title: 'Final Project Template',
          type: 'Template',
          size: '5.0 MB',
          icon: <Code className="w-5 h-5" />,
          downloadUrl: '#',
          description: 'Bitirme projesi şablonu'
        }
      ]
    }
  ];

  const additionalResources = [
    {
      title: 'Huawei Cloud Documentation',
      description: 'Resmi Huawei Cloud dokümantasyonu',
      icon: <Cloud className="w-6 h-6" />,
      url: 'https://docs.huaweicloud.com',
      type: 'External'
    },
    {
      title: 'Kubernetes Official Docs',
      description: 'Kubernetes resmi dokümantasyonu',
      icon: <BookOpen className="w-6 h-6" />,
      url: 'https://kubernetes.io/docs',
      type: 'External'
    },
    {
      title: 'CNCF Learning Path',
      description: 'Cloud Native Computing Foundation öğrenme yolu',
      icon: <Target className="w-6 h-6" />,
      url: 'https://www.cncf.io/certification/training',
      type: 'External'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
     
      
        <p className="text-lg text-gray-600 leading-relaxed">
          Kubernetes bootcamp programı için hazırlanmış tüm eğitim materyalleri, videolar, 
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
                      <div>
                        <span className="text-sm font-semibold text-gray-900">{resource.type}</span>
                        <p className="text-xs text-gray-500">{resource.size}</p>
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-red-600 transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{resource.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{resource.description}</p>
                  
                  <button className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center space-x-2">
                    <Download className="w-4 h-4" />
                    <span>İndir</span>
                  </button>
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

      {/* Download All */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-8 border border-red-200 text-center"
      >
        <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Download className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Tüm Materyalleri İndir</h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Tüm eğitim materyallerini tek seferde ZIP dosyası olarak indirebilirsiniz.
        </p>
        <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center space-x-2 mx-auto">
          <Download className="w-5 h-5" />
          <span>Tümünü İndir (ZIP)</span>
        </button>
      </motion.div>
    </div>
  );
};

export default ResourcesPage;
