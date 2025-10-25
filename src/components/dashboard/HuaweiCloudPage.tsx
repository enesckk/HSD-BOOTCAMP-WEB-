'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Cloud, ExternalLink, CheckCircle, AlertCircle, Info, Play, Mail, CreditCard, Shield, Globe } from 'lucide-react';

const HuaweiCloudPage = () => {

  return (
    <div className="space-y-8">
      {/* Header */}
      
        <p className="text-lg text-gray-600 leading-relaxed">
          Aşağıdaki adımları takip ederek dakikalar içinde hesabınızı aktif hâle getirebilirsiniz.
        </p>


      {/* Account Creation Steps */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Hesap Oluşturma Adımları</h2>
        <div className="space-y-6">
          <div className="flex items-start space-x-4">
            <div className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center font-bold text-sm">1</div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Resmi Siteye Giriş</h3>
              <p className="text-gray-600 mb-3">Huawei Cloud resmi sitesine gidin</p>
              <a
                href="https://www.huaweicloud.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Huawei Cloud</span>
              </a>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center font-bold text-sm">2</div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Kayıt Ol</h3>
              <p className="text-gray-600 mb-3">Sağ üstteki "Register" veya "Sign Up" butonuna tıklayın</p>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-700">• E-posta adresi ile kayıt olun</p>
                <p className="text-sm text-gray-700">• Gelen doğrulama kodunu girin</p>
                <p className="text-sm text-gray-700">• Şifre ve kişisel bilgileri doldurun</p>
              </div>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center font-bold text-sm">3</div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Hesap Tipi Seçimi</h3>
              <p className="text-gray-600 mb-3">"Individual" seçeneği ile devam ederek kredi kartı bilginizi girin</p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <p className="text-yellow-800 text-sm">
                    <strong>Önemli:</strong> Ücret alınmaz, sadece doğrulama için kredi kartı bilgisi istenir.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center font-bold text-sm">4</div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Hesap Aktivasyonu</h3>
              <p className="text-gray-600">Doğrulama sonrası hesabınız aktif hâle gelecektir</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Video Guide */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6">📺 Video Rehber</h2>
        <p className="text-gray-600 mb-6">
          Aşağıdaki bağlantıya tıklayarak Huawei Cloud hesap açma sürecini adım adım izleyebilirsiniz:
        </p>
        <div className="bg-gray-50 rounded-xl p-6 text-center">
          <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Play className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Hesap Açma Videosu</h3>
          <p className="text-gray-600 mb-4">Adım adım hesap açma sürecini izleyin</p>
          <a
            href="https://www.youtube.com/watch?v=dkpHpOBsCMA"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors font-semibold"
          >
            <Play className="w-4 h-4" />
            <span>🔗 Videoyu YouTube'da Aç</span>
          </a>
        </div>
      </motion.div>

      {/* Next Steps */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 border border-green-200"
      >
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Sonraki Adımlar</h2>
            <p className="text-gray-700 mb-4">
              Hesabınızı başarıyla açtıktan sonra Huawei Cloud Console üzerinden servisleri keşfetmeye başlayabilirsiniz.
            </p>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-gray-700 text-sm">Huawei Cloud Console'a giriş yapın</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-gray-700 text-sm">CCE (Container Engine) servisini aktifleştirin</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-gray-700 text-sm">Bootcamp projelerinizi geliştirmeye başlayın</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Support */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Destek ve Yardım</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900">Teknik Destek</h3>
            <div className="space-y-3">
              <button className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors duration-300 flex items-center justify-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>Eğitmenlerle İletişim</span>
              </button>
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors duration-300 flex items-center justify-center space-x-2">
                <Shield className="w-4 h-4" />
                <span>Huawei Cloud Destek</span>
              </button>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900">Faydalı Linkler</h3>
            <div className="space-y-3">
              <a
                href="https://console.huaweicloud.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-xl transition-colors duration-300 flex items-center justify-center space-x-2"
              >
                <Globe className="w-4 h-4" />
                <span>Huawei Cloud Console</span>
              </a>
              <a
                href="https://docs.huaweicloud.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-xl transition-colors duration-300 flex items-center justify-center space-x-2"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Dokümantasyon</span>
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default HuaweiCloudPage;
