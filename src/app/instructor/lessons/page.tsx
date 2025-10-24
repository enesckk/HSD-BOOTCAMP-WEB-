'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { BookOpen, Clock, Calendar, ExternalLink, Video, FileText, Users } from 'lucide-react';
import InstructorLayout from '@/components/layout/InstructorLayout';

interface Lesson {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  date: string;
  instructor: string;
  link: string;
  materials: string[];
  isActive: boolean;
  isPublished: boolean;
  createdAt: string;
}

const InstructorLessonsPage = () => {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [lessons, setLessons] = useState<Lesson[]>([]);

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated || !user || user.role !== 'INSTRUCTOR') {
        router.push('/login');
        return;
      }
      setIsLoading(false);
    }
  }, [authLoading, isAuthenticated, user, router]);

  useEffect(() => {
    const fetchLessons = async () => {
      if (!user || user.role !== 'INSTRUCTOR') return;
      
      try {
        const response = await fetch('/api/lessons');
        const data = await response.json();
        setLessons(data.lessons || []);
      } catch (error) {
        console.error('Error fetching lessons:', error);
      }
    };

    if (user && user.role === 'INSTRUCTOR') {
      fetchLessons();
    }
  }, [user]);

  const formatTime = (timeString: string) => {
    if (!timeString) return 'Belirtilmemiş';
    const time = new Date(`2000-01-01T${timeString}`);
    return time.toLocaleTimeString('tr-TR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getStatusColor = (isActive: boolean, isPublished: boolean) => {
    if (!isPublished) return 'text-gray-600 bg-gray-100';
    if (isActive) return 'text-green-600 bg-green-100';
    return 'text-blue-600 bg-blue-100';
  };

  const getStatusText = (isActive: boolean, isPublished: boolean) => {
    if (!isPublished) return 'Yayınlanmamış';
    if (isActive) return 'Aktif';
    return 'Tamamlandı';
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
    <InstructorLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Ders Programı</h1>
          <p className="text-gray-600">Bootcamp ders saatlerini görüntüleyin ve ders linklerine erişin.</p>
        </div>

        <div className="space-y-6">
          {lessons.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
              <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Henüz ders bulunmuyor.</p>
            </div>
          ) : (
            lessons.map((lesson) => (
              <div key={lesson.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 mr-3">
                          {lesson.title}
                        </h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(lesson.isActive, lesson.isPublished)}`}>
                          {getStatusText(lesson.isActive, lesson.isPublished)}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-3">{lesson.description}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                      <span className="font-medium">Tarih:</span>
                      <span className="ml-1">{new Date(lesson.date).toLocaleDateString('tr-TR')}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-2 text-gray-400" />
                      <span className="font-medium">Saat:</span>
                      <span className="ml-1">{formatTime(lesson.startTime)} - {formatTime(lesson.endTime)}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="h-4 w-4 mr-2 text-gray-400" />
                      <span className="font-medium">Eğitmen:</span>
                      <span className="ml-1">{lesson.instructor}</span>
                    </div>
                  </div>

                  {lesson.link && (
                    <div className="mb-4">
                      <a
                        href={lesson.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Ders Linkine Git
                      </a>
                    </div>
                  )}

                  {lesson.materials && lesson.materials.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Ders Materyalleri:</h4>
                      <div className="flex flex-wrap gap-2">
                        {lesson.materials.map((material, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                          >
                            <FileText className="h-3 w-3 mr-1" />
                            {material}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="text-sm text-gray-500">
                    Oluşturulma: {new Date(lesson.createdAt).toLocaleString('tr-TR')}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </InstructorLayout>
  );
};

export default InstructorLessonsPage;
