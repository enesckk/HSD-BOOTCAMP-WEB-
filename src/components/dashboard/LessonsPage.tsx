'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Play,
  ExternalLink,
  Calendar,
  Clock,
  User,
  BookOpen,
  Video,
  FileText,
  Download,
  Eye,
  ChevronRight,
  Search,
  Filter,
  Star,
  Award,
  CheckCircle
} from 'lucide-react';

interface Lesson {
  id: string;
  title: string;
  description: string;
  instructor: string;
  duration: string;
  date: string;
  type: 'video' | 'document' | 'live' | 'assignment';
  url: string;
  thumbnail?: string;
  isCompleted?: boolean;
  isRequired?: boolean;
  tags?: string[];
}

const LessonsPage = () => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Mock data - gerçek uygulamada API'den gelecek
  useEffect(() => {
    const mockLessons: Lesson[] = [
      {
        id: '1',
        title: 'Python Temelleri',
        description: 'Python programlama dilinin temel kavramları ve syntax yapısı',
        instructor: 'Dr. Ahmet Yılmaz',
        duration: '2 saat 30 dakika',
        date: '2024-01-15',
        type: 'video',
        url: 'https://example.com/python-temelleri',
        thumbnail: '/api/placeholder/400/225',
        isCompleted: true,
        isRequired: true,
        tags: ['Python', 'Temel', 'Programlama']
      },
      {
        id: '2',
        title: 'Veri Yapıları ve Algoritmalar',
        description: 'Temel veri yapıları ve algoritma tasarım prensipleri',
        instructor: 'Prof. Dr. Mehmet Kaya',
        duration: '3 saat',
        date: '2024-01-20',
        type: 'video',
        url: 'https://example.com/veri-yapilari',
        thumbnail: '/api/placeholder/400/225',
        isCompleted: false,
        isRequired: true,
        tags: ['Algoritma', 'Veri Yapıları', 'İleri Seviye']
      },
      {
        id: '3',
        title: 'Web Geliştirme Temelleri',
        description: 'HTML, CSS ve JavaScript ile web geliştirme',
        instructor: 'Öğr. Gör. Ayşe Demir',
        duration: '4 saat',
        date: '2024-01-25',
        type: 'live',
        url: 'https://example.com/web-gelistirme',
        isCompleted: false,
        isRequired: true,
        tags: ['Web', 'HTML', 'CSS', 'JavaScript']
      },
      {
        id: '4',
        title: 'Makine Öğrenmesi Giriş',
        description: 'Makine öğrenmesi kavramları ve uygulamaları',
        instructor: 'Dr. Fatma Özkan',
        duration: '2 saat 45 dakika',
        date: '2024-01-30',
        type: 'video',
        url: 'https://example.com/makine-ogrenmesi',
        thumbnail: '/api/placeholder/400/225',
        isCompleted: false,
        isRequired: false,
        tags: ['AI', 'Makine Öğrenmesi', 'Veri Bilimi']
      },
      {
        id: '5',
        title: 'Proje Yönetimi',
        description: 'Yazılım projelerinde proje yönetimi teknikleri',
        instructor: 'İnş. Müh. Can Yıldız',
        duration: '1 saat 30 dakika',
        date: '2024-02-05',
        type: 'document',
        url: 'https://example.com/proje-yonetimi.pdf',
        isCompleted: false,
        isRequired: false,
        tags: ['Proje Yönetimi', 'İş Süreçleri']
      }
    ];

    // Simulate API call
    setTimeout(() => {
      setLessons(mockLessons);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredLessons = lessons.filter(lesson => {
    const matchesSearch = lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lesson.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lesson.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || lesson.type === filterType;
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'completed' && lesson.isCompleted) ||
                         (filterStatus === 'pending' && !lesson.isCompleted);
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="w-5 h-5" />;
      case 'document':
        return <FileText className="w-5 h-5" />;
      case 'live':
        return <Play className="w-5 h-5" />;
      case 'assignment':
        return <BookOpen className="w-5 h-5" />;
      default:
        return <BookOpen className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'video':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'document':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'live':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'assignment':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'video':
        return 'Video Ders';
      case 'document':
        return 'Döküman';
      case 'live':
        return 'Canlı Ders';
      case 'assignment':
        return 'Ödev';
      default:
        return 'Ders';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Dersler yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Ders Linkleri</h1>
            <p className="text-gray-600 mt-2">Eğitim programındaki tüm derslere buradan erişebilirsiniz</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              Toplam: {lessons.length} ders
            </div>
            <div className="text-sm text-green-600">
              Tamamlanan: {lessons.filter(l => l.isCompleted).length}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Arama</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Ders, eğitmen veya konu ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900 placeholder-gray-500 bg-white"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ders Türü</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900 bg-white"
              >
                <option value="all">Tümü</option>
                <option value="video">Video Ders</option>
                <option value="live">Canlı Ders</option>
                <option value="document">Döküman</option>
                <option value="assignment">Ödev</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Durum</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900 bg-white"
              >
                <option value="all">Tümü</option>
                <option value="completed">Tamamlanan</option>
                <option value="pending">Bekleyen</option>
              </select>
            </div>
            <div className="flex items-end">
              <button className="w-full bg-gray-100 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2">
                <Filter className="w-4 h-4" />
                <span>Filtrele</span>
              </button>
            </div>
          </div>
        </div>

        {/* Lessons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLessons.map((lesson) => (
            <motion.div
              key={lesson.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              {/* Thumbnail */}
              {lesson.thumbnail && (
                <div className="relative h-48 bg-gradient-to-br from-red-50 to-red-100">
                  <div className="absolute inset-0 flex items-center justify-center">
                    {getTypeIcon(lesson.type)}
                  </div>
                  {lesson.isCompleted && (
                    <div className="absolute top-4 right-4">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  )}
                  {lesson.isRequired && (
                    <div className="absolute top-4 left-4">
                      <div className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                        Zorunlu
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                      {lesson.title}
                    </h3>
                    <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium border ${getTypeColor(lesson.type)}`}>
                      {getTypeIcon(lesson.type)}
                      <span>{getTypeLabel(lesson.type)}</span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {lesson.description}
                </p>

                {/* Instructor */}
                <div className="flex items-center space-x-2 mb-4">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{lesson.instructor}</span>
                </div>

                {/* Duration and Date */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{lesson.duration}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(lesson.date).toLocaleDateString('tr-TR')}</span>
                  </div>
                </div>

                {/* Tags */}
                {lesson.tags && lesson.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {lesson.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                    {lesson.tags.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        +{lesson.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}

                {/* Action Button */}
                <div className="flex items-center justify-between">
                  <a
                    href={lesson.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                  >
                    {lesson.type === 'video' || lesson.type === 'live' ? (
                      <Play className="w-4 h-4" />
                    ) : lesson.type === 'document' ? (
                      <Download className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                    <span>
                      {lesson.type === 'video' || lesson.type === 'live' ? 'İzle' : 
                       lesson.type === 'document' ? 'İndir' : 'Görüntüle'}
                    </span>
                  </a>
                  
                  {lesson.isCompleted && (
                    <div className="flex items-center space-x-1 text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">Tamamlandı</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredLessons.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Ders bulunamadı</h3>
            <p className="text-gray-600">
              Arama kriterlerinize uygun ders bulunamadı. Filtreleri değiştirmeyi deneyin.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonsPage;
