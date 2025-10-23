'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Cloud, ExternalLink, CreditCard, Settings, Shield, Zap, Database, Server, Globe, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import BackButton from '@/components/ui/BackButton';

const HuaweiCloudPage = () => {
  const { user } = useAuth();
  const [accountData, setAccountData] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHuaweiCloudData = async () => {
      if (!user) return;
      
      try {
        const response = await fetch(`/api/huawei-cloud?userId=${user.id}`);
        const data = await response.json();
        
        if (data.success) {
          setAccountData(data.account);
          setServices(data.services);
        }
      } catch (error) {
        console.error('Huawei Cloud data fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHuaweiCloudData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
      </div>
    );
  }

  const accountInfo = accountData || {
    status: 'Active',
    credits: 1000,
    region: 'Turkey',
    accountType: 'Free Tier',
    expirationDate: '30 Kasım 2025',
    services: ['CCE', 'OBS', 'AOM', 'SWR'],
    accountId: '1234567890',
    lastLogin: '2 gün önce'
  };

  const servicesData = services.length > 0 ? services : [
    {
      name: 'Cloud Container Engine (CCE)',
      description: 'Kubernetes tabanlı container orkestrasyonu',
      status: 'Available',
      usage: '0/100 hours',
      icon: <Server className="w-6 h-6" />
    },
    {
      name: 'Object Storage Service (OBS)',
      description: 'Bulut tabanlı dosya depolama',
      status: 'Available',
      usage: '0/50 GB',
      icon: <Database className="w-6 h-6" />
    },
    {
      name: 'Application Operations Management (AOM)',
      description: 'Uygulama izleme ve yönetimi',
      status: 'Available',
      usage: '0/30 days',
      icon: <Shield className="w-6 h-6" />
    },
    {
      name: 'Software Repository (SWR)',
      description: 'Container image registry',
      status: 'Available',
      usage: '0/10 images',
      icon: <Globe className="w-6 h-6" />
    }
  ];

  const quickActions = [
    {
      title: 'CCE Console',
      description: 'Kubernetes cluster yönetimi',
      icon: <Server className="w-5 h-5" />,
      url: 'https://console.huaweicloud.com/cce',
      color: 'bg-blue-600'
    },
    {
      title: 'OBS Console',
      description: 'Dosya depolama yönetimi',
      icon: <Database className="w-5 h-5" />,
      url: 'https://console.huaweicloud.com/obs',
      color: 'bg-green-600'
    },
    {
      title: 'AOM Console',
      description: 'Uygulama izleme',
      icon: <Shield className="w-5 h-5" />,
      url: 'https://console.huaweicloud.com/aom',
      color: 'bg-purple-600'
    },
    {
      title: 'SWR Console',
      description: 'Container registry',
      icon: <Globe className="w-5 h-5" />,
      url: 'https://console.huaweicloud.com/swr',
      color: 'bg-orange-600'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Geri Tuşu */}
      <BackButton title="Huawei Cloud'dan Geri Dön" showHome={true} />
      
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-8 text-white"
      >
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
            <Cloud className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Huawei Cloud Hesabı</h1>
            <p className="text-red-100">Bulut servisleri ve kaynak yönetimi</p>
          </div>
        </div>
        <p className="text-lg text-red-100 leading-relaxed">
          Huawei Cloud hesabınızı yönetin, servisleri kullanın ve bootcamp projelerinizi geliştirin.
        </p>
      </motion.div>

      {/* Account Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Hesap Durumu</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gray-50 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Durum</h3>
                <p className="text-green-600 font-semibold">{accountInfo.status}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Kredi</h3>
                <p className="text-blue-600 font-semibold">{accountInfo.credits} TL</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Globe className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Bölge</h3>
                <p className="text-purple-600 font-semibold">{accountInfo.region}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Settings className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Hesap Tipi</h3>
                <p className="text-orange-600 font-semibold">{accountInfo.accountType}</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Services */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Kullanılabilir Servisler</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {servicesData.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center text-red-600">
                  {service.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-bold text-gray-900">{service.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      service.status === 'Available' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {service.status}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">{service.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 text-sm">Kullanım:</span>
                    <span className="text-gray-700 text-sm font-semibold">{service.usage}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Hızlı Erişim</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <motion.a
              key={index}
              href={action.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className={`${action.color} hover:opacity-90 text-white p-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg`}
            >
              <div className="flex items-center space-x-3 mb-3">
                {action.icon}
                <ExternalLink className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-white mb-2">{action.title}</h3>
              <p className="text-white/80 text-sm">{action.description}</p>
            </motion.a>
          ))}
        </div>
      </motion.div>

      {/* Account Management */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Hesap Yönetimi</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900">Hesap Bilgileri</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Hesap ID:</span>
                <span className="font-semibold text-gray-900">1234567890</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Bölge:</span>
                <span className="font-semibold text-gray-900">Turkey</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Son Giriş:</span>
                <span className="font-semibold text-gray-900">2 gün önce</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900">Hızlı İşlemler</h3>
            <div className="space-y-3">
              <button className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors duration-300 flex items-center justify-center space-x-2">
                <Settings className="w-4 h-4" />
                <span>Hesap Ayarları</span>
              </button>
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors duration-300 flex items-center justify-center space-x-2">
                <CreditCard className="w-4 h-4" />
                <span>Faturalandırma</span>
              </button>
              <button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors duration-300 flex items-center justify-center space-x-2">
                <Shield className="w-4 h-4" />
                <span>Güvenlik</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Important Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-8 border border-yellow-200"
      >
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <AlertCircle className="w-6 h-6 text-yellow-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Önemli Bilgiler</h2>
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <Info className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-1" />
                <p className="text-gray-700 text-sm">
                  <strong>Kredi Sınırı:</strong> Bootcamp süresince 1000 TL kredi sağlanmaktadır.
                </p>
              </div>
              <div className="flex items-start space-x-2">
                <Info className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-1" />
                <p className="text-gray-700 text-sm">
                  <strong>Hesap Süresi:</strong> Hesabınız {accountInfo.expirationDate} tarihine kadar aktif kalacaktır.
                </p>
              </div>
              <div className="flex items-start space-x-2">
                <Info className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-1" />
                <p className="text-gray-700 text-sm">
                  <strong>Destek:</strong> Teknik destek için eğitmenlerle iletişime geçebilirsiniz.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Support */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 text-center"
      >
        <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Zap className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Teknik Destek</h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Huawei Cloud hesabınızla ilgili sorularınız için eğitmenlerimizle iletişime geçebilir 
          veya Huawei Cloud dokümantasyonunu inceleyebilirsiniz.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg">
            Eğitmenlerle İletişim
          </button>
          <a
            href="https://docs.huaweicloud.com"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 px-6 rounded-xl transition-all duration-300 flex items-center space-x-2"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Dokümantasyon</span>
          </a>
        </div>
      </motion.div>
    </div>
  );
};

export default HuaweiCloudPage;
