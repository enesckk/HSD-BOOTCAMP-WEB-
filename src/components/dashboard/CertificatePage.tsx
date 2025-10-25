'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Award, Download, CheckCircle, Clock, Star, ExternalLink, Calendar, Users, Target } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const CertificatePage = () => {
  const { user } = useAuth();
  const [certificateData, setCertificateData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCertificateData = async () => {
      if (!user) return;
      
      try {
        // Admin tarafından yüklenen sertifikaları getir
        const response = await fetch(`/api/certificates/user?userId=${user.id}`);
        const data = await response.json();
        
        if (data.success) {
          setCertificateData(data.certificates);
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

  // Admin tarafından yüklenen sertifikalar
  const certificates = certificateData || [];

  return (
    <div className="space-y-8">
      {/* Header */}
      
        <p className="text-lg text-gray-600 leading-relaxed">
          Programı başarıyla tamamlayarak Huawei Cloud sertifikası kazanın ve 
          kariyerinizde bir adım öne geçin.
        </p>


      {/* Certificate Cards */}
      <div className="grid lg:grid-cols-1 gap-8">
        {certificates.length > 0 ? (
          certificates.map((certificate, index) => (
            <motion.div
              key={certificate.id}
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
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">{certificate.programName}</h2>
                      <p className="text-gray-600 mb-4">Huawei Technologies</p>
                      <div className="flex items-center space-x-4">
                        <span className="px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">
                          Sertifika Yüklendi
                        </span>
                        <span className="text-gray-500 text-sm">
                          {new Date(certificate.completionDate).toLocaleDateString('tr-TR')}
                        </span>
                      </div>
                    </div>
                    <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-red-200 rounded-2xl flex items-center justify-center">
                      <Award className="w-10 h-10 text-red-600" />
                    </div>
                  </div>

                  <p className="text-gray-600 mb-6">
                    {certificate.notes || 'Huawei Cloud Container Engine (CCE) ve Kubernetes uzmanlık sertifikası'}
                  </p>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-4">Sertifika Detayları</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Program:</span>
                          <span className="font-semibold text-gray-900">{certificate.programName}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Tamamlanma:</span>
                          <span className="font-semibold text-gray-900">
                            {new Date(certificate.completionDate).toLocaleDateString('tr-TR')}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Durum:</span>
                          <span className="font-semibold text-green-600">Yüklendi</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-4">Onaylanan Görevler</h3>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-red-600 mb-2">
                          {certificate.approvedTasks || 0}
                        </div>
                        <p className="text-gray-600">Görev Onaylandı</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="lg:w-1/3">
                  <div className="bg-gray-50 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Sertifika İşlemleri</h3>
                    
                    <div className="space-y-3">
                      {certificate.fileUrl && (
                        <a
                          href={certificate.fileUrl}
                          download
                          className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Sertifikayı İndir
                        </a>
                      )}
                      
                      {certificate.linkUrl && (
                        <a
                          href={certificate.linkUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center"
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Sertifikayı Görüntüle
                        </a>
                      )}
                      
                      
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 text-center"
          >
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Henüz Sertifika Yok</h3>
            <p className="text-gray-600 mb-4">
              Admin tarafından yüklenen sertifikanız bulunmuyor. Programı tamamladıktan sonra sertifikanız yüklenecektir.
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800 text-sm">
                Sertifika alabilmek için programı %80 oranında tamamlamanız gerekmektedir.
              </p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Exam Information */}
     

      {/* Study Resources */}
      

      {/* Certificate Benefits */}
     
    </div>
  );
};

export default CertificatePage;

