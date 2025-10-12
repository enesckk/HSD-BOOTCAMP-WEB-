'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminLayout from '@/components/dashboard/AdminLayout';
import {
  Users,
  Loader2,
  Info,
  X,
  CheckCircle,
  XCircle,
} from 'lucide-react';

interface Participant {
  id: string;
  fullName: string;
  email: string;
  university: string;
  department: string;
  teamRole?: string;
  teamId?: string;
}

export default function AdminTeamMatchingPage() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [teams, setTeams] = useState<any[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<any | null>(null);
  const [selectedParticipants, setSelectedParticipants] = useState<Set<string>>(new Set());
  const [showCreateTeamModal, setShowCreateTeamModal] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageModal, setMessageModal] = useState({ type: '', message: '', isSuccess: true });
  const [showEditTeamModal, setShowEditTeamModal] = useState(false);
  const [editingTeam, setEditingTeam] = useState<any>(null);
  const [editTeamName, setEditTeamName] = useState('');

  const showMessage = (type: string, message: string, isSuccess: boolean = true) => {
    setMessageModal({ type, message, isSuccess });
    setShowMessageModal(true);
    setTimeout(() => {
      setShowMessageModal(false);
    }, 3000);
  };

  const formatRole = (role: string | undefined) => {
    if (!role) return '-';
    
    switch (role) {
      case 'LIDER':
        return 'Lider';
      case 'TEKNIK_SORUMLU':
        return 'Teknik Sorumlu';
      case 'TASARIMCI':
        return 'Tasarımcı';
      default:
        return role;
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  // Sayfa odağa geldiğinde verileri yenile
  useEffect(() => {
    const handleFocus = () => {
      fetchInitialData();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [usersRes, teamsRes] = await Promise.all([
        fetch('/api/users'),
        fetch('/api/teams?all=true')
      ]);
      const usersData = await usersRes.json();
      const teamsData = await teamsRes.json();
      console.log('Users data:', usersData);
      console.log('Teams data:', teamsData);
      setParticipants(usersData.users || usersData || []);
      setTeams(teamsData.items || teamsData || []);
    } catch (error) {
      console.error('Error fetching participants:', error);
    } finally {
      setLoading(false);
    }
  };

  const teamIdToTeam = new Map(teams.map((t: any) => [t.id, t]));
  const withoutTeam = participants.filter(p => !p.teamId);
  const withTeam = participants.filter(p => p.teamId).map(p => ({ ...p, teamName: teamIdToTeam.get(p.teamId!)?.name || '—' }));

  // Group assigned participants by team
  const teamIdToAssigned: Record<string, any[]> = {};
  for (const p of withTeam) {
    if (!p.teamId) continue;
    if (!teamIdToAssigned[p.teamId]) teamIdToAssigned[p.teamId] = [];
    teamIdToAssigned[p.teamId].push(p);
  }

  // Tüm takımları göster (boş takımlar dahil)
  const allTeams = teams;

  const [expandedTeams, setExpandedTeams] = useState<Set<string>>(new Set());
  const toggleTeam = (teamId: string) => {
    setExpandedTeams(prev => {
      const next = new Set(prev);
      if (next.has(teamId)) next.delete(teamId); else next.add(teamId);
      return next;
    });
  };

  const assignToTeam = async (participantId: string, teamId: string) => {
    try {
      const response = await fetch(`/api/teams/${teamId}/members`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: participantId }),
      });

      if (response.ok) {
        // Refresh data
        fetchInitialData();
      } else {
        alert('Atama işlemi başarısız oldu');
      }
    } catch (error) {
      console.error('Error assigning participant:', error);
      alert('Atama işlemi sırasında hata oluştu');
    }
  };

  const removeFromTeam = async (participantId: string, teamId: string) => {
    try {
      const response = await fetch(`/api/teams/${teamId}/members`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: participantId }),
      });

      if (response.ok) {
        // Refresh data
        fetchInitialData();
      } else {
        alert('Çıkarma işlemi başarısız oldu');
      }
    } catch (error) {
      console.error('Error removing participant:', error);
      alert('Çıkarma işlemi sırasında hata oluştu');
    }
  };

  const createEmptyTeam = async () => {
    if (!newTeamName.trim()) {
      alert('Takım adı giriniz');
      return;
    }

    try {
      const response = await fetch('/api/teams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          name: newTeamName.trim(),
          leaderId: null // Boş takım
        }),
      });

      if (response.ok) {
        setNewTeamName('');
        setShowCreateTeamModal(false);
        fetchInitialData();
        showMessage('Başarılı', 'Boş takım oluşturuldu', true);
      } else {
        showMessage('Hata', 'Takım oluşturma işlemi başarısız oldu', false);
      }
    } catch (error) {
      console.error('Error creating team:', error);
      showMessage('Hata', 'Takım oluşturma sırasında hata oluştu', false);
    }
  };

  const toggleParticipantSelection = (participantId: string) => {
    setSelectedParticipants(prev => {
      const newSet = new Set(prev);
      if (newSet.has(participantId)) {
        newSet.delete(participantId);
      } else {
        newSet.add(participantId);
      }
      return newSet;
    });
  };

  const assignSelectedToTeam = async (teamId: string) => {
    if (selectedParticipants.size === 0) {
      showMessage('Uyarı', 'Önce katılımcı seçiniz', false);
      return;
    }

    try {
      const promises = Array.from(selectedParticipants).map(participantId => 
        assignToTeam(participantId, teamId)
      );
      
      await Promise.all(promises);
      setSelectedParticipants(new Set());
      showMessage('Başarılı', 'Seçilen katılımcılar takıma atandı', true);
    } catch (error) {
      console.error('Error assigning participants:', error);
      showMessage('Hata', 'Atama işlemi sırasında hata oluştu', false);
    }
  };

  const deleteTeam = async (teamId: string) => {
    if (!confirm('Bu takımı silmek istediğinizden emin misiniz? Takımdaki tüm üyeler takımsız kalacak.')) {
      return;
    }

    try {
      const response = await fetch(`/api/teams/${teamId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchInitialData();
        showMessage('Başarılı', 'Takım silindi', true);
      } else {
        showMessage('Hata', 'Takım silme işlemi başarısız oldu', false);
      }
    } catch (error) {
      console.error('Error deleting team:', error);
      showMessage('Hata', 'Takım silme sırasında hata oluştu', false);
    }
  };

  const openEditTeamModal = (team: any) => {
    setEditingTeam(team);
    setEditTeamName(team.name);
    setShowEditTeamModal(true);
  };

  const updateTeam = async () => {
    if (!editTeamName.trim()) {
      showMessage('Uyarı', 'Takım adı giriniz', false);
      return;
    }

    try {
      const response = await fetch(`/api/teams/${editingTeam.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: editTeamName.trim() }),
      });

      if (response.ok) {
        setShowEditTeamModal(false);
        setEditingTeam(null);
        setEditTeamName('');
        fetchInitialData();
        showMessage('Başarılı', 'Takım adı güncellendi', true);
      } else {
        showMessage('Hata', 'Takım güncelleme işlemi başarısız oldu', false);
      }
    } catch (error) {
      console.error('Error updating team:', error);
      showMessage('Hata', 'Takım güncelleme sırasında hata oluştu', false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header removed as requested */}

        {/* Info Box - unified red theme */}
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-start space-x-3">
            <Info className="w-5 h-5 text-red-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-900">Onaylı Katılımcılar</h3>
              <p className="text-red-700 text-sm mt-1">
                Bu sayfada sadece başvurusu onaylanan katılımcılar görüntülenir.
                Onaylanmamış başvuruları görmek için <a href="/admin/applications" className="underline font-medium">Başvurular</a> sayfasını ziyaret edin.
              </p>
            </div>
          </div>
        </div>

        {/* Stats - unified red accents */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Toplam Katılımcı</p>
                <p className="text-2xl font-bold text-gray-900">{participants.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Takıma Atanan</p>
                <p className="text-2xl font-bold text-gray-900">{withTeam.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-red-600" />
              </div>
        <div>
                <p className="text-gray-600 text-sm">Takımsız</p>
                <p className="text-2xl font-bold text-gray-900">{withoutTeam.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-red-600 animate-spin" />
          </div>
        ) : participants.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Henüz Katılımcı Yok</h3>
            <p className="text-gray-600 mb-4">
              Henüz hiçbir başvuru onaylanmamış. Başvuruları onaylamak için Başvurular sayfasına gidin.
            </p>
            <a
              href="/admin/applications"
              className="inline-block px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all"
            >
              Başvuruları İncele
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Takımsız Katılımcılar - Tablo (üstte) */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-red-600" />
                  <span className="text-gray-900">Takımsız Katılımcılar ({withoutTeam.length})</span>
                  {selectedParticipants.size > 0 && (
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                      {selectedParticipants.size} seçili
                    </span>
                  )}
                </div>
              </div>
              {withoutTeam.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Tüm katılımcılar takıma atanmış</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 text-gray-700">
                        <th className="px-3 py-2 text-left w-12">
                          <input
                            type="checkbox"
                            checked={selectedParticipants.size === withoutTeam.length && withoutTeam.length > 0}
                            onChange={() => {
                              if (selectedParticipants.size === withoutTeam.length) {
                                setSelectedParticipants(new Set());
                              } else {
                                setSelectedParticipants(new Set(withoutTeam.map(p => p.id)));
                              }
                            }}
                            className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                          />
                        </th>
                        <th className="px-3 py-2 text-left">#</th>
                        <th className="px-3 py-2 text-left">Ad Soyad</th>
                        <th className="px-3 py-2 text-left">E-posta</th>
                        <th className="px-3 py-2 text-left">Üniversite</th>
                        <th className="px-3 py-2 text-left">Bölüm</th>
                        <th className="px-3 py-2 text-left">Rol</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 text-gray-900">
                      {withoutTeam.map((p, idx) => (
                        <tr key={p.id} className={`hover:bg-gray-50 ${selectedParticipants.has(p.id) ? 'bg-red-50' : ''}`}>
                          <td className="px-3 py-2">
                            <input
                              type="checkbox"
                              checked={selectedParticipants.has(p.id)}
                              onChange={() => toggleParticipantSelection(p.id)}
                              className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                            />
                          </td>
                          <td className="px-3 py-2">{idx + 1}</td>
                          <td className="px-3 py-2 font-medium text-gray-900">{p.fullName}</td>
                          <td className="px-3 py-2 text-gray-900">{p.email}</td>
                          <td className="px-3 py-2 text-gray-900">{p.university}</td>
                          <td className="px-3 py-2 text-gray-900">{p.department}</td>
                          <td className="px-3 py-2 text-gray-900">{formatRole(p.teamRole)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
        </div>
        
            {/* Takıma Atananlar - Takım bazlı akordeon (altta) */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-red-600" />
                  <span className="text-gray-900">Takıma Atanan ({withTeam.length})</span>
                </div>
                <button
                  onClick={() => setShowCreateTeamModal(true)}
                  className="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"
                >
                  Takım Oluştur
                </button>
              </div>
              {allTeams.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Henüz takım oluşturulmamış</p>
              ) : (
                <div className="divide-y divide-gray-200">
                  {allTeams.map((t: any, idx: number) => {
                    const isOpen = expandedTeams.has(t.id);
                    const assigned = teamIdToAssigned[t.id] || [];
                    return (
                      <div key={t.id}>
                        <div className="flex items-center justify-between py-4 px-3 hover:bg-gray-50">
                          <div className="flex items-center gap-3">
                            {/* Takım Checkbox */}
                            {selectedParticipants.size > 0 && (
                              <input
                                type="checkbox"
                                checked={false}
                                disabled={assigned.length >= (t.capacity ?? 3)}
                                onChange={() => assignSelectedToTeam(t.id)}
                                className={`rounded border-gray-300 text-red-600 focus:ring-red-500 ${
                                  assigned.length >= (t.capacity ?? 3) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                                }`}
                                title={
                                  assigned.length >= (t.capacity ?? 3) 
                                    ? "Takım dolu" 
                                    : "Seçili katılımcıları bu takıma ata"
                                }
                              />
                            )}
                            
                            <button className="flex-1 text-left flex items-center justify-between" onClick={() => toggleTeam(t.id)}>
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                                  <Users className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                  <p className="font-semibold text-gray-900">{t.name}</p>
                                </div>
                              </div>
                              <div className="ml-4 inline-flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-red-50 text-red-700 border border-red-200 text-xs font-semibold">
                                Kontenjan: {assigned.length} / {t.capacity ?? 3}
                              </div>
                            </button>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openEditTeamModal(t);
                              }}
                              className="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-lg text-sm font-medium border border-blue-200"
                            >
                              Düzenle
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteTeam(t.id);
                              }}
                              className="px-3 py-1 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium border border-red-200"
                            >
                              Takımı Sil
                            </button>
                          </div>
                        </div>
                        <AnimatePresence>
                          {isOpen && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="px-3 pb-4">
                              <div className="overflow-x-auto border border-gray-200 rounded-lg">
                                <table className="min-w-full text-sm">
                                  <thead>
                                    <tr className="bg-gray-50 text-gray-700">
                                      <th className="px-3 py-2 text-left w-12">#</th>
                                      <th className="px-3 py-2 text-left">Ad Soyad</th>
                                      <th className="px-3 py-2 text-left">E-posta</th>
                                      <th className="px-3 py-2 text-left">Rol</th>
                                      <th className="px-3 py-2 text-left">Aksiyon</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-gray-200 text-gray-900">
                                    {assigned.length === 0 ? (
                                      <tr>
                                        <td colSpan={5} className="px-3 py-8 text-center text-gray-500">
                                          Henüz üye yok
                                        </td>
                                      </tr>
                                    ) : (
                                      assigned.map((p: any, pIdx: number) => (
                                        <tr key={p.id} className="hover:bg-gray-50">
                                          <td className="px-3 py-2">{pIdx + 1}</td>
                                          <td className="px-3 py-2 font-medium text-gray-900">{p.fullName}</td>
                                          <td className="px-3 py-2 text-gray-900">{p.email}</td>
                                          <td className="px-3 py-2 text-gray-900">{formatRole(p.teamRole)}</td>
                                          <td className="px-3 py-2">
                                            <button 
                                              onClick={() => removeFromTeam(p.id, t.id)}
                                              className="px-2 py-1 rounded border border-red-200 text-red-700 hover:bg-red-50 text-xs font-semibold"
                                            >
                                              Çıkar
                                            </button>
                                          </td>
                                        </tr>
                                      ))
                                    )}
                                  </tbody>
                                </table>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Team Info Modal */}
        <AnimatePresence>
          {selectedTeam && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} className="bg-white rounded-xl shadow-xl w-full max-w-2xl">
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{selectedTeam.name}</h3>
                    <div className="mt-1 text-sm text-gray-600">
                      Üye Sayısı: <span className="font-medium text-gray-900">{(selectedTeam.members || []).length}</span>
                      <span className="mx-2">•</span>
                      Boş Kontenjan: <span className="font-medium text-gray-900">—</span>
                    </div>
                  </div>
                  <button onClick={() => setSelectedTeam(null)} className="p-2 rounded-lg hover:bg-gray-100">
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm text-gray-600">Üyeler</p>
                    <button className="px-3 py-1.5 rounded-lg border border-red-200 text-red-700 hover:bg-red-50 text-xs font-semibold">Tümünü Çıkar</button>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {(selectedTeam.members || []).map((m: any) => (
                      <div key={m.id} className="px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-sm text-gray-700 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-red-600 text-white flex items-center justify-center font-semibold">
                          {(m.fullName || 'U').charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-gray-900 truncate">{m.fullName}</p>
                            <p className="text-xs text-gray-500 truncate">{m.email}</p>
                          </div>
                        </div>
                        <button className="px-2 py-1 rounded border border-red-200 text-red-700 hover:bg-red-50 text-xs font-semibold">Çıkar</button>
                      </div>
                    ))}
        </div>
                </div>
                <div className="px-5 py-4 border-t border-gray-200 flex items-center justify-end gap-2">
                  <button onClick={() => setSelectedTeam(null)} className="px-3 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 text-sm font-semibold">Kapat</button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Takım Oluşturma Modal */}
        <AnimatePresence>
          {showCreateTeamModal && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} className="bg-white rounded-xl shadow-xl w-full max-w-md">
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900">Yeni Takım Oluştur</h3>
                  <button onClick={() => setShowCreateTeamModal(false)} className="p-2 rounded-lg hover:bg-gray-100">
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
                <div className="p-5">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Takım Adı
                      </label>
                      <input
                        type="text"
                        value={newTeamName}
                        onChange={(e) => setNewTeamName(e.target.value)}
                        placeholder="Takım adını giriniz"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        autoFocus
                      />
                    </div>
                  </div>
                </div>
                <div className="px-5 py-4 border-t border-gray-200 flex items-center justify-end gap-2">
                  <button 
                    onClick={() => setShowCreateTeamModal(false)} 
                    className="px-3 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 text-sm font-semibold"
                  >
                    İptal
                  </button>
                  <button 
                    onClick={createEmptyTeam}
                    className="px-3 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 text-sm font-semibold"
                  >
                    Oluştur
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Takım Düzenleme Modal */}
        <AnimatePresence>
          {showEditTeamModal && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} className="bg-white rounded-xl shadow-xl w-full max-w-md">
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900">Takım Adını Düzenle</h3>
                  <button onClick={() => setShowEditTeamModal(false)} className="p-2 rounded-lg hover:bg-gray-100">
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
                <div className="p-5">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Takım Adı
                      </label>
                      <input
                        type="text"
                        value={editTeamName}
                        onChange={(e) => setEditTeamName(e.target.value)}
                        placeholder="Takım adını giriniz"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        autoFocus
                      />
                    </div>
                  </div>
                </div>
                <div className="px-5 py-4 border-t border-gray-200 flex items-center justify-end gap-2">
                  <button 
                    onClick={() => setShowEditTeamModal(false)} 
                    className="px-3 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 text-sm font-semibold"
                  >
                    İptal
                  </button>
                  <button 
                    onClick={updateTeam}
                    className="px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-sm font-semibold"
                  >
                    Güncelle
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mesaj Modal */}
        <AnimatePresence>
          {showMessageModal && (
            <motion.div 
              initial={{ opacity: 0, y: 50, scale: 0.9 }} 
              animate={{ opacity: 1, y: 0, scale: 1 }} 
              exit={{ opacity: 0, y: 50, scale: 0.9 }}
              className="fixed bottom-6 right-6 z-50"
            >
              <div className={`rounded-xl shadow-xl border p-4 max-w-sm ${
                messageModal.isSuccess 
                  ? 'bg-green-50 border-green-200 text-green-800' 
                  : 'bg-red-50 border-red-200 text-red-800'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    messageModal.isSuccess ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {messageModal.isSuccess ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{messageModal.type}</p>
                    <p className="text-sm opacity-90">{messageModal.message}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AdminLayout>
  );
}
