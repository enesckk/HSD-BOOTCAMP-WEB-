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
  Activity
} from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState({
    totalParticipants: 0,
    totalTeams: 0,
    totalTasks: 0,
    totalPresentations: 0,
    totalAnnouncements: 0,
    totalMessages: 0,
    completedTasks: 0,
    pendingTasks: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        // API çağrıları burada yapılacak
        // Şimdilik mock data
        setStats({
          totalParticipants: 156,
          totalTeams: 42,
          totalTasks: 28,
          totalPresentations: 15,
          totalAnnouncements: 8,
          totalMessages: 234,
          completedTasks: 18,
          pendingTasks: 10
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statsCards = [
    {
      title: 'Toplam Katılımcı',
      value: stats.totalParticipants,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: 'Toplam Takım',
      value: stats.totalTeams,
      icon: UserCheck,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      change: '+8%',
      changeType: 'positive'
    },
    {
      title: 'Toplam Görev',
      value: stats.totalTasks,
      icon: Target,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      change: '+5%',
      changeType: 'positive'
    },
    {
      title: 'Toplam Sunum',
      value: stats.totalPresentations,
      icon: Presentation,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      change: '+15%',
      changeType: 'positive'
    },
    {
      title: 'Duyuru Sayısı',
      value: stats.totalAnnouncements,
      icon: Bell,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      change: '+3%',
      changeType: 'positive'
    },
    {
      title: 'Mesaj Sayısı',
      value: stats.totalMessages,
      icon: MessageSquare,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200',
      change: '+22%',
      changeType: 'positive'
    }
  ];

  const progressStats = [
    {
      title: 'Tamamlanan Görevler',
      value: stats.completedTasks,
      total: stats.totalTasks,
      percentage: stats.totalTasks > 0 ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Bekleyen Görevler',
      value: stats.pendingTasks,
      total: stats.totalTasks,
      percentage: stats.totalTasks > 0 ? Math.round((stats.pendingTasks / stats.totalTasks) * 100) : 0,
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'participant',
      title: 'Yeni katılımcı kaydı',
      description: 'Ahmet Yılmaz sisteme kaydoldu',
      time: '2 dakika önce',
      icon: Users,
      color: 'text-blue-600'
    },
    {
      id: 2,
      type: 'task',
      title: 'Görev tamamlandı',
      description: 'Takım Alpha görev #3\'ü tamamladı',
      time: '15 dakika önce',
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      id: 3,
      type: 'presentation',
      title: 'Sunum yüklendi',
      description: 'Takım Beta final sunumunu yükledi',
      time: '1 saat önce',
      icon: Presentation,
      color: 'text-purple-600'
    },
    {
      id: 4,
      type: 'message',
      title: 'Yeni mesaj',
      description: 'Katılımcıdan gelen yeni mesaj',
      time: '2 saat önce',
      icon: MessageSquare,
      color: 'text-indigo-600'
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

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statsCards.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-white rounded-xl p-6 border ${stat.borderColor} shadow-sm hover:shadow-md transition-shadow`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                  <IconComponent className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className="text-right">
                  <span className={`text-sm font-medium ${stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change}
                  </span>
                  <p className="text-xs text-gray-500">Bu hafta</p>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{isLoading ? '...' : stat.value}</h3>
              <p className="text-gray-600 text-sm">{stat.title}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Progress Overview */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
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
                        className={`h-3 rounded-full ${
                          stat.title.includes('Tamamlanan') 
                            ? 'bg-gradient-to-r from-green-500 to-green-600' 
                            : 'bg-gradient-to-r from-orange-500 to-orange-600'
                        }`}
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
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Son Aktiviteler</h2>
              <Activity className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => {
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
              })}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <h2 className="text-xl font-bold text-gray-900 mb-6">Hızlı İşlemler</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: 'Yeni Duyuru', description: 'Katılımcılara duyuru gönder', icon: Bell, href: '/admin/announcements', color: 'text-orange-600', bgColor: 'bg-orange-50' },
            { title: 'Takım Eşleştir', description: 'Katılımcıları takımlara eşleştir', icon: UserCheck, href: '/admin/team-matching', color: 'text-green-600', bgColor: 'bg-green-50' },
            { title: 'Görev Oluştur', description: 'Yeni görev ekle', icon: Target, href: '/admin/tasks', color: 'text-red-600', bgColor: 'bg-red-50' },
            { title: 'Mesaj Gönder', description: 'Toplu mesaj gönder', icon: MessageSquare, href: '/admin/messages', color: 'text-indigo-600', bgColor: 'bg-indigo-50' }
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
    </div>
  );
};

export default AdminDashboard;
