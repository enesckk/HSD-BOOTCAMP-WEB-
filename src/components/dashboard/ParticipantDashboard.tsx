 'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';
import {
  Calendar,
  Clock,
  Users,
  Upload,
  Presentation,
  Bell,
  MessageSquare,
  TrendingUp,
  Award,
  CheckCircle,
  AlertCircle,
  Info,
  Cloud,
  Target
} from 'lucide-react';

const ParticipantDashboard = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [tasks, setTasks] = useState<any[]>([]);
  const [presentations, setPresentations] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        setIsLoading(true);
        const tasksRes = await fetch(`/api/tasks?userId=${user.id}`);
        const tasksJson = await tasksRes.json();
        
        console.log('Dashboard data:', { tasksJson });
        console.log('Tasks from API:', tasksJson.tasks);
        console.log('Tasks length:', tasksJson.tasks?.length || 0);
        
        setTasks(tasksJson.tasks || []);
        setPresentations([]); // Presentations artık yok
      } catch (e) {
        console.error('Dashboard data fetch error:', e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const completedTasks = useMemo(() => {
    console.log('Tasks state in useMemo:', tasks);
    console.log('Tasks length in useMemo:', tasks.length);
    
    // Tüm teslim edilen görevleri say (SUBMITTED, APPROVED, COMPLETED)
    const completed = tasks.filter(t => 
      t.status === 'COMPLETED' || 
      t.status === 'SUBMITTED' || 
      t.status === 'APPROVED'
    ).length;
    
    const submitted = tasks.filter(t => t.status === 'SUBMITTED').length;
    const approved = tasks.filter(t => t.status === 'APPROVED').length;
    const completedOnly = tasks.filter(t => t.status === 'COMPLETED').length;
    
    console.log('Tasks analysis:', { 
      tasks: tasks.length, 
      completed: completed, 
      submitted: submitted,
      approved: approved,
      completedOnly: completedOnly,
      total: tasks.length,
      taskStatuses: tasks.map(t => ({ id: t.id, title: t.title, status: t.status }))
    });
    return completed;
  }, [tasks]);
  const totalTasks = tasks.length;
  const pendingTasks = Math.max(totalTasks - completedTasks, 0);
  const inProgressTasks = 0;
  

  const stats = [
    {
      title: 'Bootcamp Başlangıcı',
      value: '27 Ekim 2025',
      icon: Calendar,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200'
    },
    {
      title: 'Eğitim Modülü',
      value: 'Kubernetes',
      icon: Award,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200'
    },
    {
      title: 'Onaylanan Görevler',
      value: totalTasks ? `${completedTasks}/${totalTasks}` : '0/0',
      icon: CheckCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200'
    },
  ];

  const recentActivities = useMemo(() => {
    const items: any[] = [];
    tasks.slice(0, 3).forEach(t => {
      const isActive = !t.startDate || new Date(t.startDate) <= new Date();
      items.push({
        id: `task-${t.id}`,
        type: 'upload',
        title: `Görev: ${t.title}`,
        description: t.description,
        time: new Date(t.createdAt).toLocaleString('tr-TR'),
        icon: Upload,
        color: isActive ? 'text-red-600' : 'text-gray-400',
        isActive: isActive,
        startDate: t.startDate
      });
    });
    presentations.slice(0, 2).forEach(p => {
      items.push({
        id: `pres-${p.id}`,
        type: 'presentation',
        title: `Sunum: ${p.title}`,
        description: p.description,
        time: new Date(p.createdAt).toLocaleString('tr-TR'),
        icon: Presentation,
        color: 'text-red-600'
      });
    });
    return items.slice(0, 5);
  }, [tasks, presentations]);

  const upcomingEvents = [
    {
      title: 'Hafta 1: Kubernetes Temelleri',
      date: '27 Ekim 2025',
      time: '20:00',
      type: 'deadline',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200'
    },
    {
      title: 'Hafta 2: Konfigürasyon & Veri Yönetimi',
      date: '3 Kasım 2025',
      time: '20:00',
      type: 'presentation',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200'
    },
    {
      title: 'Sertifikasyon Sınavı',
      date: '24 Kasım 2025',
      time: '20:00',
      type: 'award',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200'
    }
  ];

  const quickActions = [
    {
      title: 'Haftalık Görevler',
      description: 'Haftalık görevlerinizi görüntüleyin',
      icon: Upload,
      href: '/dashboard/tasks',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      hoverColor: 'hover:bg-red-100'
    },
    {
      title: 'Eğitim Kaynağı',
      description: 'Eğitim materyallerini görüntüle',
      icon: Award,
      href: '/dashboard/resources',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      hoverColor: 'hover:bg-red-100'
    },
    {
      title: 'Duyurular',
      description: 'Son duyuruları kontrol et',
      icon: Bell,
      href: '/dashboard/announcements',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      hoverColor: 'hover:bg-red-100'
    },
    {
      title: 'Sertifika',
      description: 'Sertifika durumunuzu görüntüleyin',
      icon: Award,
      href: '/dashboard/certificate',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      hoverColor: 'hover:bg-red-100'
    },
    {
      title: 'Huawei Cloud',
      description: 'Huawei Cloud hesabınızı yönetin',
      icon: Cloud,
      href: '/dashboard/huawei-cloud',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      hoverColor: 'hover:bg-red-100'
    },
    {
      title: 'Kanallar',
      description: 'LinkedIn, Medium ve sohbet kanalları',
      icon: MessageSquare,
      href: '/dashboard/channels',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      hoverColor: 'hover:bg-red-100'
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
              Huawei Cloud CCE (Kubernetes) Bootcamp programımıza katılmaya hak kazandığınız için tebrikler!
            </p>
            <p className="text-red-200 mt-2">
              Eğitim programınızı takip edin ve teknoloji dünyasında uzmanlaşın!
            </p>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <Image
                src="/hsd-logo-white.png"
                alt="HSD Logo"
                width={80}
                height={40}
                className="object-contain"
              />
              <Image
                src="/Huawei-Logo.png"
                alt="Huawei Logo"
                width={100}
                height={40}
                className="object-contain brightness-0 invert"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* All stats cards */}
        {stats.map((stat, index) => {
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
                <TrendingUp className="w-5 h-5 text-gray-900" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{isLoading ? '...' : stat.value}</h3>
              <p className="text-gray-600 text-sm">{stat.title}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <h2 className="text-xl font-bold text-gray-900 mb-6">Hızlı İşlemler</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => {
            const IconComponent = action.icon;
            return (
              <motion.a
                key={action.title}
                href={action.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-6 rounded-xl border border-gray-200 ${action.bgColor} ${action.hoverColor} transition-all duration-200 hover:shadow-md group`}
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
        {/* Recent Activities */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Son Aktiviteler</h2>
              <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                Tümünü Gör
              </button>
            </div>
            <div className="space-y-4">
              {recentActivities.length > 0 ? (
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
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Info className="w-8 h-8 text-gray-900" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Henüz Aktivite Yok</h3>
                  <p className="text-gray-500">Görev yükleyerek veya sunum hazırlayarak aktivitelerinizi burada görebilirsiniz.</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Upcoming Events */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Yaklaşan Etkinlikler</h2>
              <Calendar className="w-5 h-5 text-gray-900" />
            </div>
            <div className="space-y-4">
              {upcomingEvents.map((event, index) => (
                <motion.div
                  key={event.title}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-lg border ${event.borderColor} ${event.bgColor}`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className={`font-medium ${event.color}`}>{event.title}</h3>
                      <p className="text-gray-600 text-sm mt-1">{event.date}</p>
                      <p className="text-gray-500 text-xs mt-1">{event.time}</p>
                    </div>
                    {event.type === 'deadline' && (
                      <AlertCircle className="w-5 h-5 text-red-500" />
                    )}
                    {event.type === 'presentation' && (
                      <Presentation className="w-5 h-5 text-red-500" />
                    )}
                    {event.type === 'award' && (
                      <Award className="w-5 h-5 text-red-500" />
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

    </div>
  );
};

export default ParticipantDashboard;
