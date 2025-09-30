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
    return (team.members || []).map((m: any) => ({
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
      tasksCompleted: 0,
      contribution: 0,
    }));
  }, [team]);

  const teamStats = useMemo(() => ({
    totalMembers: teamMembers.length,
    activeMembers: teamMembers.filter((m: any) => m.status === 'active').length,
    totalTasks: 0,
    completedTasks: 0,
    completionRate: 0
  }), [teamMembers]);

  const [activities, setActivities] = useState<any[]>([]);
  const [activitiesLoading, setActivitiesLoading] = useState(false);

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
                    className="text-2xl font-bold text-gray-900 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
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
                        
                        setTeam(updated);
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
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-60"
                    disabled={isSavingName}
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
                  <h2 className="text-2xl font-bold text-gray-900">{teamName || 'Takım Adı'}</h2>
                  <button
                    onClick={() => setIsEditingTeamName(true)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
            ))
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

    </div>
  );
};

export default TeamPage;
