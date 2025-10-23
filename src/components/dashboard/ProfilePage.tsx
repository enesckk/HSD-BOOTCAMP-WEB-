'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { 
  User, 
  Mail, 
  Phone, 
  GraduationCap, 
  BookOpen, 
  Edit3,
  Save,
  X,
  Camera,
  Shield,
  Loader2
} from 'lucide-react';

const ProfilePage = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    university: '',
    department: '',
    marathonId: ''
  });
  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' });

  // User verilerini formData'ya yükle
  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        email: user.email || '',
        phone: user.phone || '',
        university: user.university || '',
        department: user.department || '',
        marathonId: user.marathonId || ''
      });
      setPasswords({ current: '', next: '', confirm: '' });
    }
  }, [user]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!user) return;
    
    setError('');
    
    // takım rolü değişmeyecek
    const payload: any = {
      fullName: formData.fullName,
      phone: formData.phone,
      university: formData.university,
      department: formData.department,
      email: formData.email,
    };

    // şifre güncelleme (opsiyonel)
    if (passwords.next) {
      if (passwords.next !== passwords.confirm) {
        setError('Yeni şifre ve doğrulama eşleşmiyor');
        return;
      }
      payload.password = passwords.next;
    }

    try {
      setIsLoading(true);
      
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const updatedUser = await response.json();
        // Auth context storage anahtarı projede STORAGE_KEYS.USER
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setIsEditing(false);
        setPasswords({ current: '', next: '', confirm: '' });
        // Sayfayı yenile
        window.location.reload();
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Profil güncelleme hatası');
      }
    } catch (error) {
      console.error('Profil güncelleme hatası:', error);
      setError('Bağlantı hatası');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // Orijinal verileri geri yükle
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        email: user.email || '',
        phone: user.phone || '',
        university: user.university || '',
        department: user.department || '',
        marathonId: user.marathonId || ''
      });
    }
    setError('');
    setIsEditing(false);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="sr-only">Profil Bilgileri</h1>
          <p className="text-gray-600 mt-2">Kişisel bilgilerinizi görüntüleyin ve düzenleyin</p>
        </div>
        <div className="flex items-center space-x-3">
          {!isEditing ? (
            <motion.button
              onClick={() => setIsEditing(true)}
              className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Edit3 className="w-4 h-4" />
              <span>Düzenle</span>
            </motion.button>
          ) : (
            <div className="flex items-center space-x-2">
              <motion.button
                onClick={handleSave}
                disabled={isLoading}
                className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-4 py-2 rounded-lg transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>{isLoading ? 'Kaydediliyor...' : 'Kaydet'}</span>
              </motion.button>
              <motion.button
                onClick={handleCancel}
                className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <X className="w-4 h-4" />
                <span>İptal</span>
              </motion.button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="text-center">
              <div className="relative inline-block">
                <div className="w-24 h-24 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-12 h-12 text-white" />
                </div>
                {isEditing && (
                  <button className="absolute bottom-0 right-0 w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 transition-colors">
                    <Camera className="w-4 h-4" />
                  </button>
                )}
              </div>
              <h2 className="text-xl font-bold text-gray-900">{formData.fullName}</h2>
              <p className="text-gray-600">{formData.email}</p>
              <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                <Shield className="w-4 h-4 mr-1" />
                {formData.marathonId}
              </div>
            </div>
          </motion.div>

        </div>

        {/* Profile Form */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Kişisel Bilgiler</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ad Soyad
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 placeholder-gray-600"
                  />
                ) : (
                  <p className="text-gray-900 py-2">{formData.fullName}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  E-posta
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 placeholder-gray-600"
                  />
                ) : (
                  <p className="text-gray-900 py-2">{formData.email}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telefon
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 placeholder-gray-600"
                  />
                ) : (
                  <p className="text-gray-900 py-2">{formData.phone}</p>
                )}
              </div>

              {/* Marathon ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Marathon ID
                </label>
                <p className="text-gray-900 py-2 font-mono bg-gray-50 px-3 rounded-lg">{formData.marathonId}</p>
                <p className="text-xs text-gray-500 mt-1">Bu alan değiştirilemez</p>
              </div>

              {/* University */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Üniversite
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.university}
                    onChange={(e) => handleInputChange('university', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 placeholder-gray-600"
                  />
                ) : (
                  <p className="text-gray-900 py-2">{formData.university}</p>
                )}
              </div>

              {/* Department */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bölüm
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => handleInputChange('department', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 placeholder-gray-600"
                  />
                ) : (
                  <p className="text-gray-900 py-2">{formData.department}</p>
                )}
              </div>

            </div>

            {/* Password Update */}
            {isEditing && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Şifre Güncelle</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mevcut Şifre</label>
                    <input
                      type="password"
                      value={passwords.current}
                      onChange={(e) => setPasswords(prev => ({ ...prev, current: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 placeholder-gray-600"
                      placeholder="••••••••"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Yeni Şifre</label>
                    <input
                      type="password"
                      value={passwords.next}
                      onChange={(e) => setPasswords(prev => ({ ...prev, next: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 placeholder-gray-600"
                      placeholder="En az 6 karakter"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Yeni Şifre (Tekrar)</label>
                    <input
                      type="password"
                      value={passwords.confirm}
                      onChange={(e) => setPasswords(prev => ({ ...prev, confirm: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 placeholder-gray-600"
                      placeholder="Yeni şifreyi tekrar yazın"
                    />
                  </div>
                </div>
              </div>
            )}
            {error && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">
                  <strong>Hata:</strong> {error}
                </p>
              </div>
            )}

            {isEditing && !error && (
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Not:</strong> Bilgilerinizi güncelledikten sonra değişikliklerin onaylanması gerekebilir.
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
