'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  UserPlus, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Award,
  Target,
  CheckCircle,
  Clock,
  AlertCircle,
  Edit3,
  Trash2,
  Eye,
  MessageSquare,
  Share2,
  Download,
  Upload,
  X
} from 'lucide-react';

const TeamPage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditingTeamName, setIsEditingTeamName] = useState(false);
  const [teamName, setTeamName] = useState('Afet Teknoloji Takımı');

  const teamMembers = [
    {
      id: 1,
      name: 'Ahmet Yılmaz',
      role: 'Lider',
      email: 'ahmet@example.com',
      phone: '+90 555 123 45 67',
      university: 'Gaziantep Üniversitesi',
      department: 'Bilgisayar Mühendisliği',
      avatar: 'AY',
      status: 'active',
      joinDate: '15 Eylül 2024',
      tasksCompleted: 8,
      contribution: 35
    },
    {
      id: 2,
      name: 'Fatma Demir',
      role: 'Teknik Sorumlu',
      email: 'fatma@example.com',
      phone: '+90 555 234 56 78',
      university: 'Gaziantep Üniversitesi',
      department: 'Yazılım Mühendisliği',
      avatar: 'FD',
      status: 'active',
      joinDate: '16 Eylül 2024',
      tasksCompleted: 6,
      contribution: 30
    },
    {
      id: 3,
      name: 'Mehmet Kaya',
      role: 'Tasarımcı',
      email: 'mehmet@example.com',
      phone: '+90 555 345 67 89',
      university: 'Gaziantep Üniversitesi',
      department: 'Endüstriyel Tasarım',
      avatar: 'MK',
      status: 'active',
      joinDate: '17 Eylül 2024',
      tasksCompleted: 5,
      contribution: 25
    }
  ];

  const teamStats = {
    totalMembers: 3,
    activeMembers: 3,
    totalTasks: 19,
    completedTasks: 19,
    completionRate: 100
  };

  const recentActivities = [
    {
      id: 1,
      type: 'task',
      title: 'Görev 3 tamamlandı',
      description: 'Ahmet Yılmaz kendi görevini tamamladı',
      time: '2 saat önce',
      icon: CheckCircle,
      color: 'text-red-600'
    },
    {
      id: 2,
      type: 'presentation',
      title: 'Sunum yüklendi',
      description: 'Fatma Demir final sunumunu yükledi',
      time: '1 gün önce',
      icon: Upload,
      color: 'text-red-600'
    },
    {
      id: 3,
      type: 'task',
      title: 'Görev 2 tamamlandı',
      description: 'Mehmet Kaya kendi görevini tamamladı',
      time: '2 gün önce',
      icon: CheckCircle,
      color: 'text-red-600'
    }
  ];


  const tabs = [
    { id: 'overview', label: 'Genel Bakış', icon: Target },
    { id: 'members', label: 'Takım Üyeleri', icon: Users },
    { id: 'activities', label: 'Aktiviteler', icon: Clock }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Takım Bilgileri</h1>
          <p className="text-gray-600 mt-2">Takımınızın performansını ve aktivitelerini takip edin</p>
        </div>
      </div>

      {/* Team Name Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
              <Users className="w-8 h-8 text-white" />
            </div>
            <div>
              {isEditingTeamName ? (
                <div className="flex items-center space-x-3">
                  <input
                    type="text"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    className="text-2xl font-bold text-gray-900 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    autoFocus
                  />
                  <button
                    onClick={() => setIsEditingTeamName(false)}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  >
                    <CheckCircle className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setIsEditingTeamName(false)}
                    className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <h2 className="text-2xl font-bold text-gray-900">{teamName}</h2>
                  <button
                    onClick={() => setIsEditingTeamName(true)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>
              )}
              <p className="text-gray-600 mt-1">3 üye • Aktif takım</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <IconComponent className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Team Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-red-600" />
                </div>
                <span className="text-2xl font-bold text-gray-900">{teamStats.totalMembers}</span>
              </div>
              <h3 className="text-sm font-medium text-gray-600">Toplam Üye</h3>
              <p className="text-xs text-gray-500 mt-1">Aktif: {teamStats.activeMembers}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-red-600" />
                </div>
                <span className="text-2xl font-bold text-gray-900">{teamStats.completedTasks}</span>
              </div>
              <h3 className="text-sm font-medium text-gray-600">Tamamlanan Görev</h3>
              <p className="text-xs text-gray-500 mt-1">Toplam: {teamStats.totalTasks}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center">
                  <Target className="w-6 h-6 text-red-600" />
                </div>
                <span className="text-2xl font-bold text-gray-900">{teamStats.completionRate}%</span>
              </div>
              <h3 className="text-sm font-medium text-gray-600">Tamamlanma Oranı</h3>
              <p className="text-xs text-gray-500 mt-1">Mükemmel performans</p>
            </motion.div>

          </div>

          {/* Team Progress */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6">Takım İlerlemesi</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Genel İlerleme</span>
                <span className="font-semibold text-gray-900">{teamStats.completionRate}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${teamStats.completionRate}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="bg-gradient-to-r from-red-500 to-red-600 h-3 rounded-full"
                />
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {activeTab === 'members' && (
        <div className="space-y-6">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">{member.avatar}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
                      <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                        {member.role}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        member.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {member.status === 'active' ? 'Aktif' : 'Pasif'}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-red-600" />
                        <span>{member.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-red-600" />
                        <span>{member.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-red-600" />
                        <span>{member.university}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Award className="w-4 h-4 text-red-600" />
                        <span>{member.department}</span>
                      </div>
                    </div>
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Katılım Tarihi:</span>
                        <p className="font-medium text-gray-900">{member.joinDate}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Tamamlanan Görev:</span>
                        <p className="font-medium text-gray-900">{member.tasksCompleted}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Katkı Oranı:</span>
                        <p className="font-medium text-gray-900">%{member.contribution}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <MessageSquare className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {activeTab === 'activities' && (
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6">Son Aktiviteler</h2>
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
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
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
      )}

    </div>
  );
};

export default TeamPage;
