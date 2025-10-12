'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
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
  XCircle
} from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTeams: 0,
    totalTasks: 0,
    totalPresentations: 0,
    totalAnnouncements: 0,
    totalMessages: 0,
    unreadMessages: 0,
    completedTasks: 0,
    pendingTasks: 0,
    totalApplications: 0,
    pendingApplications: 0,
    approvedApplications: 0,
    rejectedApplications: 0,
  });
  const [recentActivities, setRecentActivities] = useState<any[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/admin/stats');
        const data = await response.json();
        
        if (data.stats) {
          setStats(data.stats);
        }

        // Son aktiviteleri formatla
        const activities = [];
        
        if (data.recentActivities?.applications) {
          data.recentActivities.applications.forEach((app: any) => {
            activities.push({
              id: `app-${app.id}`,
              type: 'application',
              title: app.status === 'PENDING' ? 'Yeni başvuru' : app.status === 'APPROVED' ? 'Başvuru onaylandı' : 'Başvuru reddedildi',
              description: `${app.fullName} başvurusu`,
              time: getTimeAgo(new Date(app.createdAt)),
              icon: FileText,
              color: 'text-red-600'
            });
          });
        }

        if (data.recentActivities?.messages) {
          data.recentActivities.messages.forEach((msg: any) => {
            activities.push({
              id: `msg-${msg.id}`,
              type: 'message',
              title: msg.unread ? 'Yeni mesaj' : 'Mesaj',
              description: msg.subject,
              time: getTimeAgo(new Date(msg.createdAt)),
              icon: MessageSquare,
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
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

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

  const statsCards = [
    {
      title: 'Toplam Başvuru',
      value: stats.totalApplications,
      icon: FileText,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      href: '/admin/applications'
    },
    {
      title: 'Bekleyen Başvuru',
      value: stats.pendingApplications,
      icon: Clock,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      href: '/admin/applications'
    },
    {
      title: 'Onaylanan',
      value: stats.approvedApplications,
      icon: CheckCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      href: '/admin/applications'
    },
    {
      title: 'Toplam Katılımcı',
      value: stats.totalUsers,
      icon: Users,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      href: '/admin/participants'
    },
    {
      title: 'Toplam Takım',
      value: stats.totalTeams,
      icon: UserCheck,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      href: '/admin/teams'
    },
    {
      title: 'Okunmamış Mesaj',
      value: stats.unreadMessages,
      icon: MessageSquare,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      href: '/admin/messages'
    }
  ];

  const progressStats = [
    {
      title: 'Tamamlanan Görevler',
      value: stats.completedTasks,
      total: stats.totalTasks,
      percentage: stats.totalTasks > 0 ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0,
      icon: CheckCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      title: 'Bekleyen Görevler',
      value: stats.pendingTasks,
      total: stats.totalTasks,
      percentage: stats.totalTasks > 0 ? Math.round((stats.pendingTasks / stats.totalTasks) * 100) : 0,
      icon: Clock,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    }
  ];


  return (
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
              Afet Yönetimi Teknolojileri Fikir Maratonu Admin Paneli
            </p>
            <p className="text-red-200 mt-2">
              Maraton sürecini yönetin ve katılımcıları takip edin.
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
              <BarChart3 className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid - Küçük kartlar */}
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: 'Başvuruları İncele', description: 'Başvuruları onayla/reddet', icon: FileText, href: '/admin/applications', color: 'text-red-600', bgColor: 'bg-red-50' },
            { title: 'Yeni Duyuru', description: 'Katılımcılara duyuru gönder', icon: Bell, href: '/admin/announcements', color: 'text-red-600', bgColor: 'bg-red-50' },
            { title: 'Takım Eşleştir', description: 'Katılımcıları takımlara eşleştir', icon: UserCheck, href: '/admin/team-matching', color: 'text-red-600', bgColor: 'bg-red-50' },
            { title: 'Mesaj Gönder', description: 'Toplu mesaj gönder', icon: MessageSquare, href: '/admin/messages', color: 'text-red-600', bgColor: 'bg-red-50' }
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Progress Overview */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6">Görev İlerlemesi</h2>
            <div className="space-y-6">
              {progressStats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <div key={stat.title} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                          <IconComponent className={`w-4 h-4 ${stat.color}`} />
                        </div>
                        <span className="text-gray-600">{stat.title}</span>
                      </div>
                      <span className="font-semibold text-gray-900">{stat.value}/{stat.total}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${stat.percentage}%` }}
                        transition={{ duration: 1, delay: 0.6 + index * 0.2 }}
                        className={`h-3 rounded-full bg-gradient-to-r from-red-500 to-red-600`}
                      />
                    </div>
                    <div className="text-right">
                      <span className="text-sm text-gray-500">{stat.percentage}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Recent Activities */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Son Aktiviteler</h2>
              <Activity className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
                </div>
              ) : recentActivities.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Henüz aktivite yok
                </div>
              ) : (
                recentActivities.map((activity, index) => {
                  const IconComponent = activity.icon;
                  return (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className={`w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <IconComponent className={`w-5 h-5 ${activity.color}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{activity.title}</h3>
                        <p className="text-gray-600 text-sm mt-1">{activity.description}</p>
                        <p className="text-gray-400 text-xs mt-2">{activity.time}</p>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;


