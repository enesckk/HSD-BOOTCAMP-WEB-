'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
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
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [showPresentationModal, setShowPresentationModal] = useState(false);
  const [selectedPresentation, setSelectedPresentation] = useState<any | null>(null);
  const [isEditingTeamName, setIsEditingTeamName] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [team, setTeam] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSavingName, setIsSavingName] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchTeam = async () => {
      if (!user) return;
      try {
        setIsLoading(true);
        console.log('Fetching team for user:', user.id);
        const res = await fetch(`/api/teams?userId=${user.id}`);
        const json = await res.json();
        console.log('Team API response:', json);
        
        // API response formatını kontrol et
        const t = json.items && json.items.length > 0 ? json.items[0] : 
                 json.length > 0 ? json[0] : 
                 json.team || null;
        
        console.log('Selected team:', t);
        setTeam(t);
        setTeamName(t?.name || '');
        
        if (!t) {
          setError('Henüz bir takıma atanmamışsınız. Lütfen yönetici ile iletişime geçin.');
        }
      } catch (e) {
        console.error('Team fetch error', e);
        setError('Takım bilgileri alınamadı');
      } finally {
        setIsLoading(false);
      }
    };
    fetchTeam();
  }, [user]);

  const teamMembers = useMemo(() => {
    if (!team) return [] as any[];
    return (team.members || []).map((m: any) => {
      const tasks = m.tasks || [];
      const presentations = m.presentations || [];
      const completedTasks = tasks.filter((t: any) => t.status === 'COMPLETED').length;
      const approvedPresentations = presentations.filter((p: any) => p.status === 'approved').length;
      
      return {
        id: m.id,
        name: m.fullName,
        role: m.teamRole === 'LIDER' ? 'Lider' : m.teamRole === 'TEKNIK_SORUMLU' ? 'Teknik Sorumlu' : 'Tasarımcı',
        email: m.email,
        phone: m.phone,
        university: m.university,
        department: m.department,
        avatar: (m.fullName || 'U')[0]?.toUpperCase(),
        status: m.isActive ? 'active' : 'inactive',
        joinDate: new Date(m.createdAt).toLocaleDateString('tr-TR'),
        tasksCompleted: completedTasks,
        totalTasks: tasks.length,
        presentationsCompleted: approvedPresentations,
        totalPresentations: presentations.length,
        contribution: Math.round(((completedTasks + approvedPresentations) / Math.max(tasks.length + presentations.length, 1)) * 100),
        tasks: tasks,
        presentations: presentations,
      };
    });
  }, [team]);

  const teamStats = useMemo(() => {
    const totalTasks = teamMembers.reduce((sum: number, m: any) => sum + m.totalTasks, 0);
    const completedTasks = teamMembers.reduce((sum: number, m: any) => sum + m.tasksCompleted, 0);
    const totalPresentations = teamMembers.reduce((sum: number, m: any) => sum + m.totalPresentations, 0);
    const completedPresentations = teamMembers.reduce((sum: number, m: any) => sum + m.presentationsCompleted, 0);
    
    return {
      totalMembers: teamMembers.length,
      activeMembers: teamMembers.filter((m: any) => m.status === 'active').length,
      totalTasks,
      completedTasks,
      totalPresentations,
      completedPresentations,
      completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
      presentationRate: totalPresentations > 0 ? Math.round((completedPresentations / totalPresentations) * 100) : 0
    };
  }, [teamMembers]);

  const [activities, setActivities] = useState<any[]>([]);
  const [activitiesLoading, setActivitiesLoading] = useState(false);

  const openPresentationModal = (presentation: any) => {
    setSelectedPresentation(presentation);
    setShowPresentationModal(true);
  };

  useEffect(() => {
    const fetchActivities = async () => {
      if (!user) return;
      try {
        setActivitiesLoading(true);
        const [tasksRes, presentationsRes] = await Promise.all([
          fetch(`/api/tasks?userId=${user.id}`),
          fetch(`/api/presentations?userId=${user.id}`)
        ]);
        
        const tasks = await tasksRes.json();
        const presentations = await presentationsRes.json();
        
        const allActivities = [
          ...(tasks.items || tasks || []).map((task: any) => ({
            id: `task-${task.id}`,
            type: 'task',
            title: `${task.title} ${task.status === 'COMPLETED' ? 'tamamlandı' : 'yüklendi'}`,
            description: `${user?.fullName || 'Kullanıcı'} görevini ${task.status === 'COMPLETED' ? 'tamamladı' : 'yükledi'}`,
            time: new Date(task.createdAt).toLocaleDateString('tr-TR'),
            icon: task.status === 'COMPLETED' ? CheckCircle : Upload,
            color: 'text-red-600'
          })),
          ...(presentations.items || presentations || []).map((presentation: any) => ({
            id: `presentation-${presentation.id}`,
            type: 'presentation',
            title: `${presentation.title} sunumu yüklendi`,
            description: `${user?.fullName || 'Kullanıcı'} sunumunu yükledi`,
            time: new Date(presentation.createdAt).toLocaleDateString('tr-TR'),
            icon: Upload,
            color: 'text-red-600'
          }))
        ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
        
        setActivities(allActivities);
      } catch (e) {
        console.error('Activities fetch error', e);
      } finally {
        setActivitiesLoading(false);
      }
    };
    
    fetchActivities();
  }, [user]);


  const tabs = [
    { id: 'overview', label: 'Genel Bakış', icon: Target },
    { id: 'members', label: 'Takım Üyeleri', icon: Users },
    { id: 'tasks', label: 'Görevler', icon: CheckCircle },
    { id: 'presentations', label: 'Sunumlar', icon: Award },
    { id: 'activities', label: 'Aktiviteler', icon: Clock }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        <span className="ml-3 text-gray-600">Takım bilgileri yükleniyor...</span>
      </div>
    );
  }

  // Takım yoksa da sekmeleri göster, ama içeriklerini "takım oluştur" mesajı ile doldur

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="sr-only">Takım Bilgileri</h1>
          <p className="text-gray-600 mt-2">Takımınızı yönetin, üyeleri görüntüleyin ve aktiviteleri takip edin</p>
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
            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-md">
              <Users className="w-8 h-8 text-white" />
            </div>
            <div>
              {!team ? (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Takım Oluşturulmadı</h2>
                  <p className="text-gray-600 mt-1">Henüz bir takıma atanmamışsınız</p>
                </div>
              ) : isEditingTeamName ? (
                <div className="flex items-center space-x-3">
                  <input
                    type="text"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    className="text-2xl font-bold text-gray-900 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent shadow-sm"
                    autoFocus
                  />
                  <button
                    onClick={async () => {
                      if (!team) {
                        setError('Takım bilgisi bulunamadı');
                        return;
                      }
                      try {
                        setIsSavingName(true);
                        setError('');
                        setSuccessMessage('');
                        
                        console.log('Takım adı güncelleniyor:', { teamId: team.id, newName: teamName });
                        
                        const res = await fetch(`/api/teams/${team.id}`, {
                          method: 'PUT',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ name: teamName })
                        });
                        
                        console.log('API Response:', res.status, res.statusText);
                        
                        if (!res.ok) {
                          const errorData = await res.json();
                          console.error('API Error:', errorData);
                          throw new Error(`API Error: ${res.status} - ${errorData.error || res.statusText}`);
                        }
                        
                        const updated = await res.json();
                        console.log('Updated team:', updated);
                        
                        // Takım verilerini yeniden çek
                        if (user?.id) {
                          const teamRes = await fetch(`/api/teams?userId=${user.id}`);
                          const teamJson = await teamRes.json();
                          const refreshedTeam = teamJson.items && teamJson.items.length > 0 ? teamJson.items[0] : 
                                             teamJson.length > 0 ? teamJson[0] : 
                                             teamJson.team || null;
                          
                          setTeam(refreshedTeam);
                          setTeamName(refreshedTeam?.name || '');
                        }
                        
                        setIsEditingTeamName(false);
                        setSuccessMessage('Takım adı başarıyla kaydedildi!');
                        setTimeout(() => setSuccessMessage(''), 3000);
                      } catch (e) {
                        console.error('Takım adı güncelleme hatası', e);
                        setError(`Takım adı güncellenemedi: ${e instanceof Error ? e.message : 'Bilinmeyen hata'}`);
                      } finally {
                        setIsSavingName(false);
                      }
                    }}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-60 shadow-sm"
                    disabled={isSavingName}
                  >
                    <CheckCircle className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setIsEditingTeamName(false)}
                    className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors shadow-sm"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">{teamName || 'Takım Adı'}</h2>
                  <button
                    onClick={() => setIsEditingTeamName(true)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors shadow-sm"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>
              )}
              <p className="text-gray-600 mt-1">
                {team ? `${teamMembers.length} üye • ${teamMembers.filter((m: any) => m.status==='active').length} aktif` : 'Takım bilgileri mevcut değil'}
              </p>
            </div>
          </div>
        </div>
        
        {/* Success/Error Messages */}
        {successMessage && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 text-sm">{successMessage}</p>
          </div>
        )}
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}
      </motion.div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-1">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-2 px-3 rounded-t-lg font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white border-x border-t border-gray-200 text-red-600'
                    : 'text-gray-600 hover:text-gray-900'
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
          {!team ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm text-center"
            >
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Takım Oluşturulmadı</h3>
              <p className="text-gray-600">Takım bilgilerinizi görmek için önce bir takıma atanmanız gerekiyor.</p>
              <p className="text-sm text-gray-500 mt-2">Lütfen yönetici ile iletişime geçin.</p>
            </motion.div>
          ) : (
            <>
              {/* Team Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 text-white shadow-lg"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <span className="text-3xl font-extrabold">{teamStats.totalMembers}</span>
              </div>
              <h3 className="text-sm font-semibold text-white/90">Toplam Üye</h3>
              <p className="text-xs text-white/80 mt-1">Aktif: {teamStats.activeMembers}</p>
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
              <h3 className="text-sm font-medium text-gray-600">Görev Tamamlanma Oranı</h3>
              <p className="text-xs text-gray-500 mt-1">Mükemmel performans</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center">
                  <Award className="w-6 h-6 text-red-600" />
                </div>
                <span className="text-2xl font-bold text-gray-900">{teamStats.completedPresentations}</span>
              </div>
              <h3 className="text-sm font-medium text-gray-600">Onaylanan Sunum</h3>
              <p className="text-xs text-gray-500 mt-1">Toplam: {teamStats.totalPresentations}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center">
                  <Award className="w-6 h-6 text-red-600" />
                </div>
                <span className="text-2xl font-bold text-gray-900">{teamStats.presentationRate}%</span>
              </div>
              <h3 className="text-sm font-medium text-gray-600">Sunum Onaylanma Oranı</h3>
              <p className="text-xs text-gray-500 mt-1">Harika çalışma</p>
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
            </>
          )}
        </div>
      )}

      {activeTab === 'members' && (
        <div className="space-y-6">
          {!team ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm text-center"
            >
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Takım Oluşturulmadı</h3>
              <p className="text-gray-600">Takım üyelerinizi görmek için önce bir takıma atanmanız gerekiyor.</p>
              <p className="text-sm text-gray-500 mt-2">Lütfen yönetici ile iletişime geçin.</p>
            </motion.div>
          ) : teamMembers.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm text-center"
            >
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Henüz takım üyesi eklenmemiş</h3>
              <p className="text-gray-600">Takımınıza üye eklemek için yönetici ile iletişime geçin.</p>
            </motion.div>
          ) : (
            teamMembers.map((member: any, index: number) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-md">
                    <span className="text-white font-bold text-lg">{member.avatar}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
                      <span className="px-2 py-1 bg-red-50 text-red-700 border border-red-200 text-xs font-semibold rounded-full">
                        {member.role}
                      </span>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${
                        member.status === 'active' 
                          ? 'bg-green-50 text-green-700 border-green-200' 
                          : 'bg-gray-50 text-gray-700 border-gray-200'
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
            ))
          )}
        </div>
      )}

      {activeTab === 'tasks' && (
        <div className="space-y-6">
          {!team ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm text-center"
            >
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Takım Oluşturulmadı</h3>
              <p className="text-gray-600">Takım görevlerini görmek için önce bir takıma atanmanız gerekiyor.</p>
              <p className="text-sm text-gray-500 mt-2">Lütfen yönetici ile iletişime geçin.</p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6">Takım Görevleri</h2>
              {teamMembers.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Henüz görev yok</h3>
                  <p className="text-gray-600">Takım üyeleri görev yüklediğinde burada görünecek.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {teamMembers.map((member: any) => (
                    <div key={member.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                            <span className="text-red-600 font-semibold">{member.avatar}</span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{member.name}</h3>
                            <p className="text-sm text-gray-500">{member.role}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">
                            {member.tasksCompleted}/{member.totalTasks} tamamlandı
                          </p>
                          <div className="w-24 bg-gray-200 rounded-full h-2 mt-1">
                            <div 
                              className="bg-red-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${member.totalTasks > 0 ? (member.tasksCompleted / member.totalTasks) * 100 : 0}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      
                      {member.tasks && member.tasks.length > 0 ? (
                        <div className="space-y-3">
                          {member.tasks.map((task: any) => (
                            <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-900">{task.title}</h4>
                                <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {new Date(task.createdAt).toLocaleDateString('tr-TR')}
                                </p>
                              </div>
                              <div className="flex items-center space-x-2">
                                {task.status === 'COMPLETED' ? (
                                  <CheckCircle className="w-5 h-5 text-green-600" />
                                ) : task.status === 'PENDING' ? (
                                  <Clock className="w-5 h-5 text-yellow-600" />
                                ) : (
                                  <AlertCircle className="w-5 h-5 text-red-600" />
                                )}
                                <span className={`text-sm font-medium ${
                                  task.status === 'COMPLETED' ? 'text-green-600' : 
                                  task.status === 'PENDING' ? 'text-yellow-600' : 'text-red-600'
                                }`}>
                                  {task.status === 'COMPLETED' ? 'Tamamlandı' : 
                                   task.status === 'PENDING' ? 'Beklemede' : 'Reddedildi'}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-4 text-gray-500">
                          <p>Bu üye henüz görev yüklemedi.</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </div>
      )}

      {activeTab === 'presentations' && (
        <div className="space-y-6">
          {!team ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm text-center"
            >
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Takım Oluşturulmadı</h3>
              <p className="text-gray-600">Takım sunumlarını görmek için önce bir takıma atanmanız gerekiyor.</p>
              <p className="text-sm text-gray-500 mt-2">Lütfen yönetici ile iletişime geçin.</p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6">Takım Sunumları</h2>
              {teamMembers.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Henüz sunum yok</h3>
                  <p className="text-gray-600">Takım üyeleri sunum yüklediğinde burada görünecek.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {teamMembers.map((member: any) => (
                    <div key={member.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                            <span className="text-red-600 font-semibold">{member.avatar}</span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{member.name}</h3>
                            <p className="text-sm text-gray-500">{member.role}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">
                            {member.presentationsCompleted}/{member.totalPresentations} onaylandı
                          </p>
                          <div className="w-24 bg-gray-200 rounded-full h-2 mt-1">
                            <div 
                              className="bg-red-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${member.totalPresentations > 0 ? (member.presentationsCompleted / member.totalPresentations) * 100 : 0}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      
                      {member.presentations && member.presentations.length > 0 ? (
                        <div className="space-y-3">
                          {member.presentations.map((presentation: any) => (
                            <div 
                              key={presentation.id} 
                              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                              onClick={() => openPresentationModal(presentation)}
                            >
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-900">{presentation.title}</h4>
                                <p className="text-sm text-gray-600 mt-1">{presentation.description}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {new Date(presentation.createdAt).toLocaleDateString('tr-TR')}
                                </p>
                              </div>
                              <div className="flex items-center space-x-2">
                                {presentation.status === 'approved' ? (
                                  <CheckCircle className="w-5 h-5 text-green-600" />
                                ) : presentation.status === 'PENDING' ? (
                                  <Clock className="w-5 h-5 text-yellow-600" />
                                ) : (
                                  <AlertCircle className="w-5 h-5 text-red-600" />
                                )}
                                <span className={`text-sm font-medium ${
                                  presentation.status === 'approved' ? 'text-green-600' : 
                                  presentation.status === 'PENDING' ? 'text-yellow-600' : 'text-red-600'
                                }`}>
                                  {presentation.status === 'approved' ? 'Onaylandı' : 
                                   presentation.status === 'PENDING' ? 'Beklemede' : 'Reddedildi'}
                                </span>
                                <Eye className="w-4 h-4 text-gray-400" />
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-4 text-gray-500">
                          <p>Bu üye henüz sunum yüklemedi.</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </div>
      )}

      {activeTab === 'activities' && (
        <div className="space-y-6">
          {!team ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm text-center"
            >
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Takım Oluşturulmadı</h3>
              <p className="text-gray-600">Takım aktivitelerinizi görmek için önce bir takıma atanmanız gerekiyor.</p>
              <p className="text-sm text-gray-500 mt-2">Lütfen yönetici ile iletişime geçin.</p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6">Son Aktiviteler</h2>
            {activitiesLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                <span className="ml-2 text-gray-600">Aktiviteler yükleniyor...</span>
              </div>
            ) : activities.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Henüz aktivite yok</h3>
                <p className="text-gray-600">Görev veya sunum yüklediğinizde aktiviteler burada görünecek.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {activities.map((activity, index) => {
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
            )}
          </motion.div>
          )}
        </div>
      )}

    {/* Sunum Detay Modalı */}
    {showPresentationModal && selectedPresentation && (
      <div className="fixed inset-0 bg-white/10 backdrop-blur-md flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-900">Sunum Detayları</h3>
            <button
              onClick={() => setShowPresentationModal(false)}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Başlık</label>
              <p className="text-gray-900 font-semibold">{selectedPresentation.title}</p>
            </div>
            
            {selectedPresentation.description && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Açıklama</label>
                <p className="text-gray-900">{selectedPresentation.description}</p>
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Durum</label>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                selectedPresentation.status === 'approved' 
                  ? 'bg-green-100 text-green-800' 
                  : selectedPresentation.status === 'PENDING'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {selectedPresentation.status === 'approved' ? 'Onaylandı' : 
                 selectedPresentation.status === 'PENDING' ? 'Beklemede' : 'Reddedildi'}
              </span>
            </div>
            
            {selectedPresentation.fileUrl && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ek Dosya/Bağlantı</label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    {selectedPresentation.uploadType === 'LINK' ? (
                      <Download className="w-4 h-4 text-gray-500" />
                    ) : (
                      <Download className="w-4 h-4 text-gray-500" />
                    )}
                    <a
                      href={selectedPresentation.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      {selectedPresentation.uploadType === 'LINK' ? 'Bağlantıyı Aç' : 'Dosyayı İndir'}
                    </a>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="text-sm text-gray-500">
                Yüklenme: {new Date(selectedPresentation.createdAt).toLocaleDateString('tr-TR')}
              </div>
              <button
                onClick={() => setShowPresentationModal(false)}
                className="px-4 py-2 bg-gray-600 text-white hover:bg-gray-700 rounded-lg font-medium"
              >
                Kapat
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    )}
  </div>
  );
};

export default TeamPage;
