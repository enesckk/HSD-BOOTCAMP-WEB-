'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { User, Mail, Phone, Settings, Save, Edit3, Eye, EyeOff } from 'lucide-react';
import InstructorLayout from '@/components/layout/InstructorLayout';
import { SuccessModal } from '@/components/ui/SuccessModal';

interface ProfileData {
  fullName: string;
  email: string;
  phone?: string;
  role: string;
  password?: string;
}

const InstructorProfilePage = () => {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    fullName: '',
    email: '',
    phone: '',
    role: 'INSTRUCTOR',
    password: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated || !user || user.role !== 'INSTRUCTOR') {
        router.push('/login');
        return;
      }
      setIsLoading(false);
      setProfileData({
        fullName: user.fullName || '',
        email: user.email || '',
        phone: user.phone || '',
        role: user.role || 'INSTRUCTOR',
        password: ''
      });
    }
  }, [authLoading, isAuthenticated, user, router]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Test API first
      console.log('Testing API...');
      const testResponse = await fetch('/api/test-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ test: 'data' }),
      });
      
      if (testResponse.ok) {
        const testData = await testResponse.json();
        console.log('Test API success:', testData);
      } else {
        console.error('Test API failed');
      }
      
      // Now try the real API
      const token = localStorage.getItem('afet_maratonu_token');
      console.log('Token from localStorage:', token ? 'exists' : 'missing');
      console.log('Token content (first 50 chars):', token ? token.substring(0, 50) + '...' : 'null');
      
      const response = await fetch('/api/instructor/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('API Response:', data); // Debug log
        setIsEditing(false);
        setShowSuccessModal(true);
        
        // Update local state with new data from API response
        if (data.instructor) {
          console.log('Updating profile data with:', data.instructor); // Debug log
          setProfileData({
            fullName: data.instructor.fullName,
            email: data.instructor.email,
            phone: data.instructor.phone || '',
            role: data.instructor.role,
            password: '' // Clear password field
          });
        }
      } else {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        alert(errorData.message || 'Profil güncellenemedi');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Profil güncellenirken hata oluştu');
    } finally {
      setIsSaving(false);
    }
  };


  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'INSTRUCTOR') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Erişim Reddedildi</h2>
          <p className="text-gray-600">Bu sayfaya erişim yetkiniz yok.</p>
        </div>
      </div>
    );
  }

  return (
    <InstructorLayout title="Profil" subtitle="Eğitmen Profil Ayarları">
      <div className="space-y-6">
        {/* Description */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            Profil bilgilerinizi görüntüleyin ve düzenleyin. Şifre ve e-posta adresinizi değiştirebilirsiniz.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Profil Bilgileri</h2>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <Edit3 className="h-4 w-4 mr-2" />
                {isEditing ? 'İptal' : 'Düzenle'}
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 gap-6">
              {/* Profile Picture */}
              <div className="flex items-center space-x-6">
                <div className="flex-shrink-0">
                  <div className="h-20 w-20 bg-red-100 rounded-full flex items-center justify-center">
                    <User className="h-10 w-10 text-red-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{profileData.fullName}</h3>
                  <p className="text-sm text-gray-500">Eğitmen</p>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ad Soyad
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.fullName}
                      onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                    />
                  ) : (
                    <p className="text-sm text-gray-900 flex items-center">
                      <User className="h-4 w-4 mr-2 text-gray-400" />
                      {profileData.fullName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    E-posta
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                    />
                  ) : (
                    <p className="text-sm text-gray-900 flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-gray-400" />
                      {profileData.email}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefon
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={profileData.phone || ''}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                    />
                  ) : (
                    <p className="text-sm text-gray-900 flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-gray-400" />
                      {profileData.phone || 'Belirtilmemiş'}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Şifre
                  </label>
                  {isEditing ? (
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={profileData.password || ''}
                        onChange={(e) => setProfileData({ ...profileData, password: e.target.value })}
                        placeholder="Yeni şifre (boş bırakırsanız değişmez)"
                        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                      </button>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-900 flex items-center">
                      <Settings className="h-4 w-4 mr-2 text-gray-400" />
                      ••••••••
                    </p>
                  )}
                  {isEditing && (
                    <p className="text-xs text-gray-500 mt-1">Boş bırakırsanız şifre değişmez</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rol
                  </label>
                  <p className="text-sm text-gray-900 flex items-center">
                    <Settings className="h-4 w-4 mr-2 text-gray-400" />
                    Eğitmen
                  </p>
                </div>
              </div>

              {/* Save Button */}
              {isEditing && (
                <div className="flex justify-end pt-6 border-t border-gray-200">
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {isSaving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
      
      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Profil Güncellendi!"
        message="Profil bilgileriniz başarıyla güncellendi."
      />
    </InstructorLayout>
  );
};

export default InstructorProfilePage;
