'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, ExternalLink, Calendar, Tag, Search, Filter } from 'lucide-react';

interface Lesson {
  id: string;
  title: string;
  description: string;
  youtubeUrl: string;
  duration: string;
  instructor: string;
  category: string;
  week: number;
  isPublished: boolean;
  isActive: boolean;
  thumbnailUrl: string;
  tags: string;
  showDate: string;
  order: number;
  prerequisites: string;
  objectives: string;
  resources: string;
  createdAt: string;
  updatedAt: string;
}

const LessonsPage: React.FC = () => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWeek, setSelectedWeek] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    fetchLessons();
  }, []);

  const fetchLessons = async () => {
    try {
      setLoading(true);
      console.log('Fetching lessons...');
      
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (selectedWeek !== 'all') params.append('week', selectedWeek);
      if (selectedCategory !== 'all') params.append('category', selectedCategory);

      const response = await fetch(`/api/lessons?${params.toString()}`);
      const data = await response.json();
      
      console.log('Lessons API response:', data);
      
      if (data.success) {
        setLessons(data.lessons || []);
        console.log('Lessons set:', data.lessons);
      } else {
        console.error('API error:', data.error);
        setLessons([]);
      }
    } catch (error) {
      console.error('Error fetching lessons:', error);
      setLessons([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLessons();
  }, [searchTerm, selectedWeek, selectedCategory]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchLessons();
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedWeek('all');
    setSelectedCategory('all');
  };

  const getWeekOptions = () => {
    const weeks = [...new Set(lessons.map(lesson => lesson.week))].sort((a, b) => a - b);
    return weeks;
  };

  const getCategoryOptions = () => {
    const categories = [...new Set(lessons.map(lesson => lesson.category))].filter(Boolean);
    return categories;
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Ders Linkleri</h1>
          <p className="text-gray-600">Tüm ders materyallerine buradan erişebilirsiniz</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Ders ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
            </form>

            {/* Week Filter */}
            <div className="lg:w-48">
              <select
                value={selectedWeek}
                onChange={(e) => setSelectedWeek(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="all">Tüm Haftalar</option>
                {getWeekOptions().map(week => (
                  <option key={week} value={week.toString()}>
                    Hafta {week}
                  </option>
                ))}
              </select>
            </div>

            {/* Category Filter */}
            <div className="lg:w-48">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="all">Tüm Kategoriler</option>
                {getCategoryOptions().map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Clear Filters */}
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Temizle
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="mb-4">
          <p className="text-gray-600">
            {lessons.length} ders bulundu
          </p>
        </div>

        {/* Lessons Grid */}
        {lessons.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Ders bulunamadı</h3>
            <p className="text-gray-500">
              {searchTerm || selectedWeek !== 'all' || selectedCategory !== 'all'
                ? 'Arama kriterlerinize uygun ders bulunamadı.'
                : 'Henüz ders eklenmemiş.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lessons.map((lesson, index) => (
              <motion.div
                key={lesson.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow ${
                  lesson.isPublished && lesson.isActive 
                    ? 'border-gray-200' 
                    : 'border-orange-200 bg-orange-50'
                }`}
              >
                <div className="p-6">
                  {/* Thumbnail */}
                  {lesson.thumbnailUrl && (
                    <div className="mb-4">
                      <img 
                        src={lesson.thumbnailUrl} 
                        alt={lesson.title}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    </div>
                  )}

                  {/* Status Badge */}
                  {(!lesson.isPublished || !lesson.isActive) && (
                    <div className="mb-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                        Henüz Yayınlanmadı
                      </span>
                    </div>
                  )}

                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                        {lesson.title}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>Hafta {lesson.week}</span>
                        </div>
                        {lesson.category && (
                          <div className="flex items-center gap-1">
                            <Tag className="h-4 w-4" />
                            <span>{lesson.category}</span>
                          </div>
                        )}
                      </div>
                      {lesson.instructor && (
                        <p className="text-sm text-gray-600 mb-2">
                          <strong>Eğitmen:</strong> {lesson.instructor}
                        </p>
                      )}
                      {lesson.duration && lesson.duration !== "00:00" && (
                        <p className="text-sm text-gray-600 mb-2">
                          <strong>Süre:</strong> {lesson.duration}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  {lesson.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {lesson.description}
                    </p>
                  )}

                  {/* Tags */}
                  {lesson.tags && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {lesson.tags.split(',').slice(0, 3).map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                        >
                          {tag.trim()}
                        </span>
                      ))}
                      {lesson.tags.split(',').length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          +{lesson.tags.split(',').length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Link Button */}
                  {lesson.youtubeUrl && (
                    <a
                      href={lesson.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <ExternalLink className="h-4 w-4" />
                      YouTube'da İzle
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonsPage;