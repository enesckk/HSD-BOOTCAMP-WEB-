'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import InstructorLayout from '@/components/layout/InstructorLayout';
import { 
  Users, 
  UserCheck,
  Target,
  Presentation,
  Bell,
  MessageSquare, 
  TrendingUp,
  Award,
  Clock,
  CheckCircle,
  AlertCircle,
  BarChart3,
  Activity,
  FileText,
  XCircle,
  BookOpen,
  Video,
  Send
} from 'lucide-react';

const InstructorDashboard = () => {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAnnouncements: 0,
    totalMessages: 0,
    totalNotifications: 0,
    totalLessons: 0,
  });
  const [recentActivities, setRecentActivities] = useState<any[]>([]);

  // Authentication and redirection logic
  useEffect(() => {
    if (!authLoading) { // Wait for auth context to load
      if (!isAuthenticated || !user || user.role !== 'INSTRUCTOR') {
      router.push('/login');
      return;
    }
      setIsLoading(false);
    }
  }, [authLoading, isAuthenticated, user, router]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/admin/stats');
        const data = await response.json();
        
        if (data.stats) {
          setStats(data.stats);
        }

        // Son aktiviteleri formatla
        const activities: any[] = [];
        
        if (data.recentActivities?.channelMessages) {
          data.recentActivities.channelMessages.forEach((msg: any) => {
            activities.push({
              id: `msg-${msg.id}`,
              type: 'message',
              title: 'Kanal Mesajı',
              description: `${msg.user?.fullName || 'Kullanıcı'} - ${msg.channel?.displayName || msg.channel?.name}`,
              time: getTimeAgo(new Date(msg.createdAt)),
              icon: MessageSquare,
              color: 'text-blue-600'
            });
          });
        }

        if (data.recentActivities?.announcements) {
          data.recentActivities.announcements.forEach((ann: any) => {
            activities.push({
              id: `ann-${ann.id}`,
              type: 'announcement',
              title: 'Yeni Duyuru',
              description: ann.title,
              time: getTimeAgo(new Date(ann.createdAt)),
              icon: Bell,
              color: 'text-red-600'
            });
          });
        }

        // Tarihe göre sırala
        activities.sort((a, b) => {
          const timeA = parseTimeAgo(a.time);
          const timeB = parseTimeAgo(b.time);
          return timeA - timeB;
        });

        setRecentActivities(activities.slice(0, 5));

      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    if (user && user.role === 'INSTRUCTOR') {
      fetchStats();
    }
  }, [user]);

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Az önce';
    if (diffMins < 60) return `${diffMins} dakika önce`;
    if (diffHours < 24) return `${diffHours} saat önce`;
    return `${diffDays} gün önce`;
  };

  const parseTimeAgo = (timeStr: string): number => {
    if (timeStr === 'Az önce') return 0;
    const match = timeStr.match(/(\d+)/);
    if (!match) return 999999;
    const num = parseInt(match[1]);
    if (timeStr.includes('dakika')) return num;
    if (timeStr.includes('saat')) return num * 60;
    if (timeStr.includes('gün')) return num * 1440;
    return 999999;
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
          <div className="text-red-600 mb-4">
            <AlertCircle className="h-12 w-12 mx-auto" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Erişim Reddedildi</h2>
          <p className="text-gray-600">Bu sayfaya erişim yetkiniz yok.</p>
        </div>
      </div>
    );
  }

  const statsCards = [
    {
      title: 'Toplam Katılımcı',
      value: stats.totalUsers,
      icon: Users,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      href: '/instructor/students'
    },
    {
      title: 'Kanal Mesajları',
      value: stats.totalMessages,
      icon: MessageSquare,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      href: '/instructor/questions'
    },
    {
      title: 'Ders Programı',
      value: stats.totalLessons || 0,
      icon: BookOpen,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      href: '/instructor/lessons'
    },
    {
      title: 'Duyurular',
      value: stats.totalAnnouncements,
      icon: Bell,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      href: '/instructor/announcements'
    },
    {
      title: 'Bildirimler',
      value: stats.totalNotifications,
      icon: AlertCircle,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      href: '/instructor/notifications'
    }
  ];

  return (
    <InstructorLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-8 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Hoş Geldiniz{user?.fullName ? `, ${user.fullName}` : ''}! 👋
              </h1>
              <p className="text-red-100 text-lg">
                HSD Türkiye Bootcamp Eğitmen Paneli
              </p>
              <p className="text-red-200 mt-2">
                Bootcamp sürecini yönetin ve öğrencileri takip edin.
              </p>
            </div>
            <div className="hidden md:block">
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
                <BarChart3 className="w-12 h-12 text-white" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {statsCards.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <motion.a
                key={stat.title}
                href={stat.href}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`bg-white rounded-lg p-4 border ${stat.borderColor} shadow-sm hover:shadow-md transition-all cursor-pointer`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-8 h-8 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                    <IconComponent className={`w-4 h-4 ${stat.color}`} />
                      </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  {isLoading ? '...' : (stat.value || 0)}
                </h3>
                <p className="text-gray-600 text-xs">{stat.title}</p>
              </motion.a>
            );
          })}
        </div>

        {/* Hızlı İşlemler */}
                  <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6">Hızlı İşlemler</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { title: 'Öğrencileri Görüntüle', description: 'Öğrencileri görüntüle ve takip et', icon: Users, href: '/instructor/students', color: 'text-red-600', bgColor: 'bg-red-50' },
              { title: 'Görevleri Görüntüle', description: 'Mevcut görevleri görüntüle', icon: Target, href: '/instructor/tasks', color: 'text-red-600', bgColor: 'bg-red-50' },
              { title: 'Ders Programı', description: 'Ders saatleri ve linkler', icon: BookOpen, href: '/instructor/lessons', color: 'text-red-600', bgColor: 'bg-red-50' },
              { title: 'Soruları Cevapla', description: 'Öğrenci sorularını cevapla', icon: MessageSquare, href: '/instructor/questions', color: 'text-red-600', bgColor: 'bg-red-50' },
              { title: 'Duyuruları Görüntüle', description: 'Duyuruları görüntüle', icon: Bell, href: '/instructor/announcements', color: 'text-red-600', bgColor: 'bg-red-50' }
            ].map((action, index) => {
              const IconComponent = action.icon;
              return (
                <motion.a
                  key={action.title}
                  href={action.href}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  className={`p-6 rounded-xl border border-gray-200 ${action.bgColor} hover:shadow-md transition-all duration-200 group`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <IconComponent className={`w-6 h-6 ${action.color}`} />
                    <h3 className="font-semibold text-gray-900">{action.title}</h3>
                        </div>
                  <p className="text-gray-600 text-sm">{action.description}</p>
                </motion.a>
              );
            })}
          </div>
        </motion.div>

        {/* Son Aktiviteler */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6">Son Aktiviteler</h2>
          {recentActivities.length === 0 ? (
            <div className="text-center py-8">
              <Activity className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Henüz aktivite yok</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentActivities.map((activity, index) => {
                const IconComponent = activity.icon;
                return (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="flex items-center p-4 bg-gray-50 rounded-lg"
                  >
                    <div className={`flex-shrink-0 ${activity.color}`}>
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <div className="ml-4 flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                      <p className="text-sm text-gray-500">{activity.description}</p>
                    </div>
                    <div className="text-sm text-gray-400">{activity.time}</div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </InstructorLayout>
  );
};

export default InstructorDashboard;