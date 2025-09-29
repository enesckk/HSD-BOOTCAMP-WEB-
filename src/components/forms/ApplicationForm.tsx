'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Phone, 
  GraduationCap, 
  BookOpen, 
  Lightbulb, 
  Youtube, 
  Brain,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Send
} from 'lucide-react';

interface ApplicationFormData {
  fullName: string;
  phone: string;
  university: string;
  department: string;
  projectIdea: string;
  youtubeVideo: string;
  logicQuestion1: string;
  logicQuestion2: string;
}

const ApplicationForm = () => {
  const [formData, setFormData] = useState<ApplicationFormData>({
    fullName: '',
    phone: '',
    university: '',
    department: '',
    projectIdea: '',
    youtubeVideo: '',
    logicQuestion1: '',
    logicQuestion2: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<ApplicationFormData>>({});
  const [submitError, setSubmitError] = useState<string>('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleInputChange = (field: keyof ApplicationFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors: Partial<ApplicationFormData> = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Ad soyad gereklidir';
    if (!formData.phone.trim()) newErrors.phone = 'Telefon numarası gereklidir';
    if (!formData.university.trim()) newErrors.university = 'Üniversite adı gereklidir';
    if (!formData.department.trim()) newErrors.department = 'Bölüm adı gereklidir';
    if (!formData.projectIdea.trim()) newErrors.projectIdea = 'Proje fikri gereklidir';
    if (!formData.youtubeVideo.trim()) newErrors.youtubeVideo = 'YouTube video linki gereklidir';
    else if (!formData.youtubeVideo.includes('youtube.com') && !formData.youtubeVideo.includes('youtu.be')) {
      newErrors.youtubeVideo = 'Geçerli bir YouTube linki giriniz';
    }
    if (!formData.logicQuestion1.trim()) newErrors.logicQuestion1 = '1. mantık sorusu cevabı gereklidir';
    if (!formData.logicQuestion2.trim()) newErrors.logicQuestion2 = '2. mantık sorusu cevabı gereklidir';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setSubmitError('');
    
    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Başvuru gönderilemedi');
      }

      setSubmitSuccess(true);
    } catch (error: any) {
      console.error('Başvuru hatası:', error);
      setSubmitError(error.message || 'Başvuru gönderilirken bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center"
        >
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Başvurunuz Alındı!
          </h2>
          <p className="text-gray-600 mb-6">
            Maratona başvurunuz başarıyla gönderildi. Değerlendirme sonuçları e-posta ile bildirilecektir.
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300"
          >
            Ana Sayfaya Dön
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl font-bold text-red-600 mb-2">
            Afet Yönetimi Teknolojileri Fikir Maratonu
          </h2>
          <p className="text-gray-600">
            Maratona başvuru formu
          </p>
        </motion.div>

        {/* Application Form */}
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
              Maratona Başvurun
            </h3>
            <p className="text-gray-600">
              Başvuru formunu doldurarak maratona katılın
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Personal Information */}
            <div className="grid md:grid-cols-2 gap-6">
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

            {/* Project Idea */}
            <div>
              <label htmlFor="projectIdea" className="block text-sm font-medium text-gray-700 mb-2">
                Proje Fikri *
              </label>
              <div className="relative">
                <div className="absolute top-3 left-3 flex items-center pointer-events-none">
                  <Lightbulb className="h-5 w-5 text-gray-400" />
                </div>
                <textarea
                  id="projectIdea"
                  rows={4}
                  value={formData.projectIdea}
                  onChange={(e) => handleInputChange('projectIdea', e.target.value)}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300 placeholder-gray-400 placeholder-opacity-100 resize-none ${
                    errors.projectIdea ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
                  }`}
                  placeholder="Proje fikrinizi detaylı bir şekilde açıklayın..."
                />
              </div>
              {errors.projectIdea && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <span className="mr-1">⚠</span>
                  {errors.projectIdea}
                </p>
              )}
            </div>

            {/* YouTube Video */}
            <div>
              <label htmlFor="youtubeVideo" className="block text-sm font-medium text-gray-700 mb-2">
                YouTube Video Linki *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Youtube className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="youtubeVideo"
                  type="url"
                  value={formData.youtubeVideo}
                  onChange={(e) => handleInputChange('youtubeVideo', e.target.value)}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300 placeholder-gray-400 placeholder-opacity-100 ${
                    errors.youtubeVideo ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
                  }`}
                  placeholder="https://www.youtube.com/watch?v=..."
                />
              </div>
              {errors.youtubeVideo && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <span className="mr-1">⚠</span>
                  {errors.youtubeVideo}
                </p>
              )}
            </div>

            {/* Logic Questions */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Brain className="w-5 h-5 text-red-600 mr-2" />
                Mantık Soruları
              </h3>
              <p className="text-sm text-gray-600">
                Aşağıdaki sorulardan en az birini cevaplayın. Her iki soruyu da cevaplarsanız değerlendirme sürecinde avantajlı olursunuz.
              </p>
              
              {/* Logic Question 1 */}
              <div>
                <label htmlFor="logicQuestion1" className="block text-sm font-medium text-gray-700 mb-2">
                  Mantık Sorusu 1 *
                </label>
                <div className="bg-gray-50 rounded-xl p-4 mb-3">
                  <p className="text-sm text-gray-700 font-medium mb-2">
                    Antarktika'da bir dondurma dükkanı açmanız gerekiyor. Sıcaklık -50°C ve hiç kimse dondurma yemek istemiyor. 
                    Bu durumda dondurmanızı nasıl satarsınız? Yaratıcı çözümlerinizi açıklayın.
                  </p>
                </div>
                <textarea
                  id="logicQuestion1"
                  rows={3}
                  value={formData.logicQuestion1}
                  onChange={(e) => handleInputChange('logicQuestion1', e.target.value)}
                  className={`block w-full px-3 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300 placeholder-gray-400 placeholder-opacity-100 resize-none ${
                    errors.logicQuestion1 ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
                  }`}
                  placeholder="Cevabınızı buraya yazın..."
                />
                {errors.logicQuestion1 && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <span className="mr-1">⚠</span>
                    {errors.logicQuestion1}
                  </p>
                )}
              </div>

              {/* Logic Question 2 */}
              <div>
                <label htmlFor="logicQuestion2" className="block text-sm font-medium text-gray-700 mb-2">
                  Mantık Sorusu 2 *
                </label>
                <div className="bg-gray-50 rounded-xl p-4 mb-3">
                  <p className="text-sm text-gray-700 font-medium mb-2">
                    Bir çölün ortasında, sadece kum ve güneş var. Burada bir su parkı açmanız gerekiyor. 
                    Su yok, elektrik yok, müşteri yok. Bu imkansız durumda nasıl bir su parkı işletirsiniz? 
                    Yaratıcı fikirlerinizi paylaşın.
                  </p>
                </div>
                <textarea
                  id="logicQuestion2"
                  rows={3}
                  value={formData.logicQuestion2}
                  onChange={(e) => handleInputChange('logicQuestion2', e.target.value)}
                  className={`block w-full px-3 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300 placeholder-gray-400 placeholder-opacity-100 resize-none ${
                    errors.logicQuestion2 ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
                  }`}
                  placeholder="Cevabınızı buraya yazın..."
                />
                {errors.logicQuestion2 && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <span className="mr-1">⚠</span>
                    {errors.logicQuestion2}
                  </p>
                )}
              </div>
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
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Başvuruyu Gönder</span>
                </>
              )}
            </motion.button>

          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default ApplicationForm;
