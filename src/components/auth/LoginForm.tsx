'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff,
  LogIn,
  ArrowLeft,
  Shield,
  CheckCircle,
  AlertTriangle,
  Users
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

interface LoginFormData {
  email: string;
  password: string;
}

const LoginForm = () => {
  const { login } = useAuth();
  const router = useRouter();
  
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<LoginFormData>>({});
  const [submitError, setSubmitError] = useState<string>('');

  const handleInputChange = (field: keyof LoginFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors: Partial<LoginFormData> = {};

    if (!formData.email.trim()) newErrors.email = 'E-posta gereklidir';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Geçerli bir e-posta adresi giriniz';
    
    if (!formData.password) newErrors.password = 'Şifre gereklidir';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setSubmitError('');
    
    try {
      const user = await login(formData);
      
      // Kullanıcı rolüne göre yönlendirme
      if (user?.role === 'ADMIN') {
        router.push('/admin');
      } else if (user?.role === 'INSTRUCTOR') {
        router.push('/instructor');
      } else {
        router.push('/dashboard');
      }
    } catch (error: any) {
      console.error('Giriş hatası:', error);
      console.error('Error type:', typeof error);
      console.error('Error message:', error?.message);
      console.error('Error details:', error);
      
      let errorMessage = 'Giriş yapılırken bir hata oluştu';
      
      if (error?.message) {
        errorMessage = error.message;
      } else if (error?.error) {
        errorMessage = error.error;
      } else if (typeof error === 'string') {
        errorMessage = error;
      } else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      
      console.log('Final error message:', errorMessage);
      setSubmitError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoBack = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      {/* Technology Background Animation */}
      <div className="absolute inset-0">
        {/* Animated Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div 
            className="absolute inset-0 animate-pulse"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>
        
        {/* Floating Tech Elements */}
        <div className="absolute top-20 left-20 w-4 h-4 bg-red-500 rounded-full animate-bounce opacity-20"></div>
        <div className="absolute top-40 right-32 w-3 h-3 bg-blue-400 rounded-full animate-pulse opacity-30"></div>
        <div className="absolute bottom-32 left-16 w-5 h-5 bg-red-500 rounded-full animate-ping opacity-10"></div>
        <div className="absolute bottom-20 right-20 w-2 h-2 bg-red-400 rounded-full animate-bounce opacity-25"></div>
        
        {/* Subtle Wave Animation */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-red-600/10 to-transparent animate-pulse"></div>
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-blue-600/10 to-transparent animate-pulse"></div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-lg w-full">
          
          {/* Professional Header */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-10"
          >
            <h2 className="text-2xl font-bold text-red-600 mb-2">
              HSD Türkiye Bootcamp
            </h2>
            <p className="text-gray-600">
              E-posta adresiniz ve şifreniz ile giriş yapın
            </p>
          </motion.div>

          {/* Professional Login Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white rounded-3xl shadow-xl border border-gray-200/50 p-10 relative overflow-hidden"
          >
            {/* Top Accent Line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-red-600"></div>
            
            {/* Header inside card */}
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Hesabınıza Giriş Yapın
              </h3>
              <p className="text-gray-600">
                E-posta adresiniz sistemde kayıtlı rolünüze göre otomatik yönlendirileceksiniz
              </p>
            </div>

            {/* Form */}
            <form className="space-y-6" onSubmit={handleSubmit}>
              
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-3">
                  E-posta Adresi
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`block w-full pl-12 pr-4 py-4 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300 text-base text-gray-900 placeholder-gray-400 placeholder-opacity-100 ${
                      errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white hover:border-gray-400'
                    }`}
                    placeholder="ornek@email.com"
                  />
                </div>
                {errors.email && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 flex items-center space-x-2 text-red-600"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    <span className="text-sm font-medium">{errors.email}</span>
                  </motion.div>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-3">
                  Şifre
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className={`block w-full pl-12 pr-12 py-4 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300 text-base text-gray-900 placeholder-gray-400 placeholder-opacity-100 ${
                      errors.password ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white hover:border-gray-400'
                    }`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center hover:text-gray-600 transition-colors duration-300"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 flex items-center space-x-2 text-red-600"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    <span className="text-sm font-medium">{errors.password}</span>
                  </motion.div>
                )}
              </div>

              {/* Submit Error */}
              {submitError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 border-2 border-red-200 rounded-xl p-4"
                >
                  <p className="text-red-600 flex items-center space-x-2">
                    <AlertTriangle className="w-5 h-5" />
                    <span className="font-medium">{submitError}</span>
                  </p>
                </motion.div>
              )}

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg text-base"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    <span>Giriş Yap</span>
                  </>
                )}
              </motion.button>

            </form>

            {/* Footer Links */}
            <div className="mt-8 text-center space-y-4">
              <div className="text-gray-600">
                Başvurunuz yok mu?{' '}
                <a 
                  href="https://developer.huaweicloud.com/intl/en-us/activity" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-red-600 hover:text-red-700 font-semibold transition-colors duration-300 hover:underline"
                >
                  Başvuru yapın
                </a>
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <button
                  onClick={handleGoBack}
                  className="inline-flex items-center space-x-2 text-gray-500 hover:text-gray-700 transition-colors duration-300 font-medium"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Ana Sayfaya Dön</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;