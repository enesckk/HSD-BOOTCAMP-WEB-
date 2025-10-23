'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Award, Download, CheckCircle, Clock, Star, ExternalLink, Calendar, Users, Target } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import BackButton from '@/components/ui/BackButton';

const CertificatePage = () => {
  const { user } = useAuth();
  const [certificateData, setCertificateData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCertificateData = async () => {
      if (!user) return;
      
      try {
        const response = await fetch(`/api/certificates?userId=${user.id}`);
        const data = await response.json();
        
        if (data.success) {
          setCertificateData(data.certificate);
        }
      } catch (error) {
        console.error('Certificate data fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificateData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
      </div>
    );
  }

  const certificates = [
    {
      name: 'HCCDA-Cloud Native',
      issuer: 'Huawei Technologies',
      status: certificateData?.status || 'In Progress',
      description: 'Huawei Cloud Container Engine (CCE) ve Kubernetes uzmanlık sertifikası',
      requirements: certificateData?.requirements || [
        'Programı %80 oranında tamamlama',
        'Final projesini başarıyla teslim etme',
        'Sertifikasyon sınavında %70 başarı',
        'Tüm haftalık görevleri tamamlama'
      ],
      validity: '3 yıl',
      level: 'Professional',
      color: 'from-red-500 to-red-600'
    }
  ];

  const progress = {
    programCompletion: certificateData?.programCompletion || 0,
    projectSubmission: certificateData?.projectSubmission || 0,
    examScore: certificateData?.examScore || 0,
    overallProgress: certificateData?.overallProgress || 0
  };

  const examInfo = certificateData?.examInfo || {
    date: '24 Kasım 2025',
    time: '20:00',
    duration: '90 dakika',
    questions: 50,
    passingScore: 70,
    format: 'Online, Çoktan seçmeli'
  };

  return (
    <div className="space-y-8">
      {/* Geri Tuşu */}
      <BackButton title="Sertifika'dan Geri Dön" showHome={true} />
      
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-8 text-white"
      >
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
            <Award className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Sertifika</h1>
            <p className="text-red-100">Huawei Cloud sertifikasyon programı</p>
          </div>
        </div>
        <p className="text-lg text-red-100 leading-relaxed">
          Programı başarıyla tamamlayarak Huawei Cloud sertifikası kazanın ve 
          kariyerinizde bir adım öne geçin.
        </p>
      </motion.div>

      {/* Certificate Cards */}
      <div className="grid lg:grid-cols-1 gap-8">
        {certificates.map((certificate, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
          >
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Certificate Info */}
              <div className="lg:w-2/3">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{certificate.name}</h2>
                    <p className="text-gray-600 mb-4">{certificate.issuer}</p>
                    <div className="flex items-center space-x-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        certificate.status === 'Eligible' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {certificate.status === 'Eligible' ? 'Sertifika Alınabilir' : 'Devam Ediyor'}
                      </span>
                      <span className="text-gray-500 text-sm">{certificate.validity} geçerli</span>
                    </div>
                  </div>
                  <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-red-200 rounded-2xl flex items-center justify-center">
                    <Award className="w-10 h-10 text-red-600" />
                  </div>
                </div>

                <p className="text-gray-600 mb-6">{certificate.description}</p>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Sertifika Gereksinimleri</h3>
                    <ul className="space-y-2">
                      {certificate.requirements.map((requirement, reqIndex) => (
                        <li key={reqIndex} className="flex items-start space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-1" />
                          <span className="text-gray-700 text-sm">{requirement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Sertifika Detayları</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Seviye:</span>
                        <span className="font-semibold text-gray-900">{certificate.level}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Geçerlilik:</span>
                        <span className="font-semibold text-gray-900">{certificate.validity}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Format:</span>
                        <span className="font-semibold text-gray-900">Dijital</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress & Actions */}
              <div className="lg:w-1/3">
                <div className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">İlerleme Durumu</h3>
                  
                  <div className="space-y-4 mb-6">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Program Tamamlama</span>
                        <span className="text-sm font-semibold text-gray-900">{progress.programCompletion}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-red-600 h-2 rounded-full" style={{ width: `${progress.programCompletion}%` }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Proje Teslimi</span>
                        <span className="text-sm font-semibold text-gray-900">{progress.projectSubmission}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-red-600 h-2 rounded-full" style={{ width: `${progress.projectSubmission}%` }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Sınav Puanı</span>
                        <span className="text-sm font-semibold text-gray-900">{progress.examScore}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-red-600 h-2 rounded-full" style={{ width: `${progress.examScore}%` }}></div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <button 
                      disabled={progress.overallProgress < 100}
                      className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
                        progress.overallProgress >= 100
                          ? 'bg-red-600 hover:bg-red-700 text-white transform hover:scale-105 shadow-lg'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      <Download className="w-4 h-4 inline mr-2" />
                      Sertifikayı İndir
                    </button>
                    
                    <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-xl font-semibold transition-colors duration-300">
                      <ExternalLink className="w-4 h-4 inline mr-2" />
                      Sertifikayı Doğrula
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Exam Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Sertifikasyon Sınavı</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gray-50 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Calendar className="w-6 h-6 text-red-600" />
              <h3 className="font-bold text-gray-900">Sınav Tarihi</h3>
            </div>
            <p className="text-gray-600">{examInfo.date}</p>
            <p className="text-gray-500 text-sm">{examInfo.time}</p>
          </div>
          
          <div className="bg-gray-50 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Clock className="w-6 h-6 text-red-600" />
              <h3 className="font-bold text-gray-900">Süre</h3>
            </div>
            <p className="text-gray-600">{examInfo.duration}</p>
            <p className="text-gray-500 text-sm">{examInfo.questions} soru</p>
          </div>
          
          <div className="bg-gray-50 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Target className="w-6 h-6 text-red-600" />
              <h3 className="font-bold text-gray-900">Geçme Notu</h3>
            </div>
            <p className="text-gray-600">%{examInfo.passingScore}</p>
            <p className="text-gray-500 text-sm">{examInfo.format}</p>
          </div>
        </div>
      </motion.div>

      {/* Study Resources */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-8 border border-red-200"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Sınav Hazırlık Kaynakları</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900">Hazırlık Materyalleri</h3>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-gray-700">Sınav rehberi ve örnek sorular</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-gray-700">Kubernetes best practices</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-gray-700">Huawei Cloud CCE dokümantasyonu</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-gray-700">Pratik laboratuvarlar</span>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900">Hazırlık İpuçları</h3>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="text-gray-700">Tüm eğitim videolarını tekrar izleyin</span>
              </li>
              <li className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="text-gray-700">Laboratuvarları tekrar yapın</span>
              </li>
              <li className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="text-gray-700">Örnek sınav sorularını çözün</span>
              </li>
              <li className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="text-gray-700">Eğitmenlerle iletişime geçin</span>
              </li>
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Certificate Benefits */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Sertifika Avantajları</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-gray-50 rounded-xl">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Kariyer Gelişimi</h3>
            <p className="text-gray-600 text-sm">Cloud Native uzmanı olarak kariyerinizde ilerleyin</p>
          </div>
          
          <div className="text-center p-6 bg-gray-50 rounded-xl">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Award className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Sektör Tanınırlığı</h3>
            <p className="text-gray-600 text-sm">Huawei Cloud ekosisteminde tanınan uzman olun</p>
          </div>
          
          <div className="text-center p-6 bg-gray-50 rounded-xl">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Target className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Proje Fırsatları</h3>
            <p className="text-gray-600 text-sm">Büyük ölçekli projelerde çalışma fırsatları</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CertificatePage;
