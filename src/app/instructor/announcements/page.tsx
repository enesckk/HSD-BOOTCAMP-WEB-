'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Bell, Calendar, Pin, Tag } from 'lucide-react';

interface Announcement {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: string;
  date: string;
  time: string;
  pinned: boolean;
  createdAt: string;
}

const InstructorAnnouncementsPage = () => {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

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
    const fetchAnnouncements = async () => {
      if (!user || user.role !== 'INSTRUCTOR') return;
      
      try {
        const response = await fetch('/api/announcements');
        const data = await response.json();
        setAnnouncements(data.items || []);
      } catch (error) {
        console.error('Error fetching announcements:', error);
      }
    };

    if (user && user.role === 'INSTRUCTOR') {
      fetchAnnouncements();
    }
  }, [user]);

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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Duyurular</h1>
          <p className="text-gray-600">Bootcamp duyurularını görüntüleyin.</p>
        </div>

        <div className="space-y-6">
          {announcements.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
              <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Henüz duyuru bulunmuyor.</p>
            </div>
          ) : (
            announcements.map((announcement) => (
              <div key={announcement.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 mr-3">
                          {announcement.title}
                        </h3>
                        {announcement.pinned && (
                          <Pin className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                      <p className="text-gray-600 mb-3">{announcement.summary}</p>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <Tag className="h-3 w-3 mr-1" />
                        {announcement.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="prose max-w-none text-gray-700 mb-4">
                    <div dangerouslySetInnerHTML={{ __html: announcement.content }} />
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {announcement.date && new Date(announcement.date).toLocaleDateString('tr-TR')}
                      </div>
                      {announcement.time && (
                        <div className="flex items-center">
                          <span>{announcement.time}</span>
                        </div>
                      )}
                    </div>
                    <div>
                      {new Date(announcement.createdAt).toLocaleString('tr-TR')}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default InstructorAnnouncementsPage;
