'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Mail, 
  Phone, 
  GraduationCap, 
  BookOpen, 
  Lock, 
  Eye, 
  EyeOff,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

interface RegisterFormData {
  marathonId: string;
  fullName: string;
  email: string;
  phone: string;
  university: string;
  department: string;
  password: string;
}


const RegisterForm = () => {
  const { register, checkMarathonId } = useAuth();
  const router = useRouter();
  
  const [formData, setFormData] = useState<RegisterFormData>({
    marathonId: '',
    fullName: '',
    email: '',
    phone: '',
    university: '',
    department: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<RegisterFormData>>({});
  const [submitError, setSubmitError] = useState<string>('');
  const [marathonIdError, setMarathonIdError] = useState<string>('');

  // Marathon ID validation
  const validateMarathonId = async (marathonId: string) => {
    if (!marathonId) return;
    
    try {
      const result = await checkMarathonId(marathonId);
      if (!result.available) {
        setMarathonIdError(result.message || 'Marathon ID kullanılamaz');
      } else {
        setMarathonIdError('');
      }
    } catch (error) {
      setMarathonIdError('Marathon ID kontrol edilemedi');
    }
  };

  // Şifre güçlülük kontrolü
  useEffect(() => {
    const checkPasswordStrength = (password: string) => {
      let strength = 0;
      
      if (password.length >= 6) strength++;
      if (/[a-z]/.test(password)) strength++;
      if (/[A-Z]/.test(password)) strength++;
      if (/[0-9]/.test(password)) strength++;
      if (/[^A-Za-z0-9]/.test(password)) strength++;
      if (password.length >= 8) strength++;
      
      setPasswordStrength(strength);
    };

    checkPasswordStrength(formData.password);
  }, [formData.password]);

  const handleInputChange = (field: keyof RegisterFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
    
    // Marathon ID için özel kontrol
    if (field === 'marathonId') {
      validateMarathonId(value);
    }
  };

  const validateForm = () => {
    const newErrors: Partial<RegisterFormData> = {};

    if (!formData.marathonId.trim()) newErrors.marathonId = 'Marathon ID gereklidir';
    if (!formData.fullName.trim()) newErrors.fullName = 'Ad soyad gereklidir';
    if (!formData.email.trim()) newErrors.email = 'E-posta gereklidir';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Geçerli bir e-posta adresi giriniz';
    if (!formData.phone.trim()) newErrors.phone = 'Telefon numarası gereklidir';
    if (!formData.university.trim()) newErrors.university = 'Üniversite adı gereklidir';
    if (!formData.department.trim()) newErrors.department = 'Bölüm adı gereklidir';
    if (!formData.password) newErrors.password = 'Şifre gereklidir';
    else if (formData.password.length < 6) newErrors.password = 'Şifre en az 6 karakter olmalıdır';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    if (marathonIdError) return;

    setIsLoading(true);
    setSubmitError('');
    
    try {
      await register(formData as any);
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Kayıt hatası:', error);
      setSubmitError(error.message || 'Kayıt olurken bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoBack = () => {
    window.location.href = '/';
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 2) return 'bg-red-500';
    if (passwordStrength <= 4) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 2) return 'Zayıf';
    if (passwordStrength <= 4) return 'Orta';
    return 'Güçlü';
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
          <div 
            className="absolute inset-0"
            style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='20' cy='20' r='1'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="relative z-10 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <h2 className="text-3xl font-bold text-red-600 mb-2">
              HSD Türkiye Bootcamp
            </h2>
            <p className="text-gray-600">
              Maratona katılmak için kayıt olun
          </p>
        </motion.div>

          {/* Register Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 relative overflow-hidden"
          >
            {/* Top Accent Line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-red-600"></div>
            
            {/* Header inside card */}
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Hesap Oluşturun
              </h3>
              <p className="text-gray-600">
                Maratona katılmak için hesap oluşturun
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Personal Information */}
              <div className="grid md:grid-cols-2 gap-6">
            {/* Marathon ID */}
                <div>
                  <label htmlFor="marathonId" className="block text-sm font-medium text-gray-700 mb-2">
                Marathon ID *
              </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                      id="marathonId"
                  type="text"
                  value={formData.marathonId}
                  onChange={(e) => handleInputChange('marathonId', e.target.value)}
                      className={`block w-full pl-10 pr-3 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300 placeholder-gray-400 placeholder-opacity-100 ${
                        errors.marathonId || marathonIdError ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
                  }`}
                      placeholder="Marathon ID'nizi giriniz"
                />
              </div>
                  {errors.marathonId && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <span className="mr-1">⚠</span>
                      {errors.marathonId}
                    </p>
                  )}
                  {marathonIdError && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <span className="mr-1">⚠</span>
                      {marathonIdError}
                    </p>
              )}
            </div>

                {/* Full Name */}
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                Ad Soyad *
              </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                <input
                      id="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                      className={`block w-full pl-10 pr-3 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300 placeholder-gray-400 placeholder-opacity-100 ${
                        errors.fullName ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
                  }`}
                  placeholder="Adınız ve soyadınız"
                />
              </div>
              {errors.fullName && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <span className="mr-1">⚠</span>
                      {errors.fullName}
                    </p>
                  )}
                </div>
            </div>

              {/* Contact Information */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                E-posta Adresi *
              </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                <input
                      id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`block w-full pl-10 pr-3 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300 placeholder-gray-400 placeholder-opacity-100 ${
                        errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
                  }`}
                  placeholder="ornek@email.com"
                />
              </div>
              {errors.email && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <span className="mr-1">⚠</span>
                      {errors.email}
                    </p>
              )}
            </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Telefon Numarası *
              </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                <input
                      id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                      className={`block w-full pl-10 pr-3 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300 placeholder-gray-400 placeholder-opacity-100 ${
                        errors.phone ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
                  }`}
                      placeholder="+90 5XX XXX XX XX"
                />
              </div>
              {errors.phone && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <span className="mr-1">⚠</span>
                      {errors.phone}
                    </p>
                  )}
                </div>
            </div>

              {/* University Information */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* University */}
              <div>
                  <label htmlFor="university" className="block text-sm font-medium text-gray-700 mb-2">
                  Üniversite *
                </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <GraduationCap className="h-5 w-5 text-gray-400" />
                    </div>
                  <input
                      id="university"
                    type="text"
                    value={formData.university}
                    onChange={(e) => handleInputChange('university', e.target.value)}
                      className={`block w-full pl-10 pr-3 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300 placeholder-gray-400 placeholder-opacity-100 ${
                        errors.university ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
                    }`}
                    placeholder="Üniversite adınız"
                  />
                </div>
                {errors.university && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <span className="mr-1">⚠</span>
                      {errors.university}
                    </p>
                )}
              </div>

                {/* Department */}
              <div>
                  <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
                  Bölüm *
                </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <BookOpen className="h-5 w-5 text-gray-400" />
                    </div>
                  <input
                      id="department"
                    type="text"
                    value={formData.department}
                    onChange={(e) => handleInputChange('department', e.target.value)}
                      className={`block w-full pl-10 pr-3 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300 placeholder-gray-400 placeholder-opacity-100 ${
                        errors.department ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
                    }`}
                    placeholder="Bölüm adınız"
                  />
                </div>
                {errors.department && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <span className="mr-1">⚠</span>
                      {errors.department}
                    </p>
                )}
              </div>
            </div>


              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Şifre *
              </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                <input
                    id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                    className={`block w-full pl-10 pr-12 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300 placeholder-gray-400 placeholder-opacity-100 ${
                      errors.password ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
                  }`}
                    placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                </button>
              </div>

                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                          style={{ width: `${(passwordStrength / 6) * 100}%` }}
                        />
                      </div>
                      <span className={`text-sm font-medium ${
                        passwordStrength <= 2 ? 'text-red-600' : 
                        passwordStrength <= 4 ? 'text-yellow-600' : 'text-green-600'
                      }`}>
                        {getPasswordStrengthText()}
                  </span>
                </div>
                </div>
                )}
                
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <span className="mr-1">⚠</span>
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Submit Error */}
              {submitError && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <p className="text-sm text-red-600 flex items-center">
                    <span className="mr-2">⚠</span>
                    {submitError}
                  </p>
                </div>
              )}

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg"
            >
              {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                    <ArrowRight className="w-5 h-5" />
                  <span>Kayıt Ol</span>
                </>
              )}
            </motion.button>

            </form>

            {/* Footer Links */}
            <div className="mt-6 text-center space-y-4">
              <div className="text-sm text-gray-600">
                Zaten hesabınız var mı?{' '}
                <a 
                  href="/login" 
                  className="text-red-600 hover:text-red-700 font-medium transition-colors duration-300"
                >
                  Giriş yapın
                </a>
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <button
                  onClick={handleGoBack}
                  className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors duration-300"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Geri Dön</span>
                </button>
              </div>
            </div>
        </motion.div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;