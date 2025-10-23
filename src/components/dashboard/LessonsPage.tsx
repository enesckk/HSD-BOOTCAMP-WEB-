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
  youtubeUrl: string;
  thumbnailUrl?: string;
  category: string;
  week: number;
  tags: string;
  showDate: string;
  prerequisites?: string;
  objectives?: string;
  resources?: string;
  isPublished: boolean;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

const LessonsPage = () => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // API'den dersleri çek
  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const params = new URLSearchParams();
        if (searchTerm) params.append('search', searchTerm);
        if (filterType !== 'all') params.append('category', filterType);
        if (filterStatus !== 'all') params.append('week', filterStatus);

        console.log('Fetching lessons with params:', params.toString());
        const response = await fetch(`/api/lessons?${params.toString()}`);
        const data = await response.json();

        console.log('Lessons API response:', data);

        if (data.success) {
          console.log('Setting lessons:', data.lessons);
          setLessons(data.lessons);
        } else {
          console.error('Error fetching lessons:', data.error);
          setLessons([]);
        }
      } catch (error) {
        console.error('Error fetching lessons:', error);
        setLessons([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, [searchTerm, filterType, filterStatus]);

  // API'den gelen veriler zaten filtrelenmiş, sadece client-side filtreleme
  const filteredLessons = lessons;

  const getTypeIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'video':
      case 'youtube':
        return <Video className="w-5 h-5" />;
      case 'document':
      case 'döküman':
        return <FileText className="w-5 h-5" />;
      case 'live':
      case 'canlı':
        return <Play className="w-5 h-5" />;
      case 'assignment':
      case 'ödev':
        return <BookOpen className="w-5 h-5" />;
      default:
        return <Video className="w-5 h-5" />;
    }
  };

  const getTypeColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'video':
      case 'youtube':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'document':
      case 'döküman':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'live':
      case 'canlı':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'assignment':
      case 'ödev':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeLabel = (category: string) => {
    return category || 'Ders';
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900 bg-white"
              >
                <option value="all">Tüm Kategoriler</option>
                <option value="Genel">Genel</option>
                <option value="Teknik">Teknik</option>
                <option value="SoftSkill">Soft Skill</option>
                <option value="Proje">Proje</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Hafta</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900 bg-white"
              >
                <option value="all">Tüm Haftalar</option>
                <option value="1">Hafta 1</option>
                <option value="2">Hafta 2</option>
                <option value="3">Hafta 3</option>
                <option value="4">Hafta 4</option>
                <option value="5">Hafta 5</option>
                <option value="6">Hafta 6</option>
                <option value="7">Hafta 7</option>
                <option value="8">Hafta 8</option>
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
          {console.log('Rendering lessons:', filteredLessons)}
          {filteredLessons.length === 0 ? (
            <div className="lg:col-span-3 text-center py-10 text-gray-500">
              <BookOpen className="w-12 h-12 mx-auto mb-4" />
              <p className="text-lg">Henüz ders bulunamadı.</p>
            </div>
          ) : (
            filteredLessons.map((lesson) => (
            <motion.div
              key={lesson.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              {/* Thumbnail */}
              <div className="relative h-48 bg-gradient-to-br from-red-50 to-red-100">
                {lesson.thumbnailUrl ? (
                  <img 
                    src={lesson.thumbnailUrl} 
                    alt={lesson.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    {getTypeIcon(lesson.category)}
                  </div>
                )}
                <div className="absolute top-4 left-4">
                  <div className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                    Hafta {lesson.week}
                  </div>
                </div>
              </div>

              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                      {lesson.title}
                    </h3>
                    <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium border ${getTypeColor(lesson.category)}`}>
                      {getTypeIcon(lesson.category)}
                      <span>{getTypeLabel(lesson.category)}</span>
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
                    <span>{new Date(lesson.showDate).toLocaleDateString('tr-TR')}</span>
                  </div>
                </div>

                {/* Tags */}
                {lesson.tags && lesson.tags.split(',').length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {lesson.tags.split(',').slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                      >
                        {tag.trim()}
                      </span>
                    )}
                    {lesson.tags.split(',').length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        +{lesson.tags.split(',').length - 3}
                      </span>
                    )}
                  </div>
                )}

                {/* Action Button */}
                <div className="flex items-center justify-between">
                  <a
                    href={lesson.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                  >
                    <Play className="w-4 h-4" />
                    <span>YouTube'da İzle</span>
                  </a>
                  
                  <div className="flex items-center space-x-1 text-gray-500">
                    <ExternalLink className="w-4 h-4" />
                    <span className="text-sm">Dış Link</span>
                  </div>
                </div>
              </div>
            </motion.div>
            )
          )}
        </div>

      </div>
    </div>
  );
};

export default LessonsPage;
