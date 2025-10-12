'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/dashboard/AdminLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, ListChecks, Loader2, Eye, CheckCircle, XCircle, FileText, Link as LinkIcon, X, Clock } from 'lucide-react';

interface Team {
  id: string;
  name: string;
  leader: { id: string; fullName: string; email: string };
  members: Array<{ id: string; fullName: string; email: string }>;
}

interface TaskItem {
  id: string;
  title: string;
  description?: string;
  status: string; // 'pending' | 'completed'
  fileUrl?: string;
  linkUrl?: string;
  huaweiCloudAccount?: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminTasksPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [userIdToTasks, setUserIdToTasks] = useState<Record<string, TaskItem[]>>({});
  const [selectedTask, setSelectedTask] = useState<TaskItem | null>(null);
  const [showTaskModal, setShowTaskModal] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const teamsRes = await fetch('/api/teams?all=true');
        const teamsData = await teamsRes.json();
        const list: Team[] = teamsData.items || teamsData || [];
        setTeams(list);

        // fetch tasks for each team member (leader + members)
        const memberIds = new Set<string>();
        for (const t of list) {
          if (t.leader?.id) memberIds.add(t.leader.id);
          for (const m of t.members || []) memberIds.add(m.id);
        }
        const ids = Array.from(memberIds);
        const chunks: string[][] = [];
        // simple chunking to avoid too many parallel
        for (let i = 0; i < ids.length; i += 6) chunks.push(ids.slice(i, i + 6));
        const result: Record<string, TaskItem[]> = {};
        for (const chunk of chunks) {
          await Promise.all(
            chunk.map(async (uid) => {
              try {
                const res = await fetch(`/api/tasks?userId=${uid}`);
                const data = await res.json();
                const items: TaskItem[] = (data.items || data || []).map((d: any) => ({
                  id: d.id,
                  title: d.title,
                  description: d.description,
                  status: (d.status || 'pending').toLowerCase(),
                  fileUrl: d.fileUrl,
                  linkUrl: d.linkUrl,
                  huaweiCloudAccount: d.huaweiCloudAccount,
                  createdAt: d.createdAt,
                  updatedAt: d.updatedAt,
                }));
                result[uid] = items;
              } catch (e) {
                result[uid] = [];
              }
            })
          );
        }
        setUserIdToTasks(result);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const toggle = (teamId: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(teamId)) next.delete(teamId); else next.add(teamId);
      return next;
    });
  };

  const getStatsForUser = (userId: string) => {
    const tasks = userIdToTasks[userId] || [];
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === 'completed').length;
    const last = tasks
      .slice()
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())[0];
    return { total, completed, last };
  };

  const updateTaskStatus = async (taskId: string, status: 'completed' | 'pending' | 'rejected') => {
    try {
      console.log('Updating task status:', { taskId, status });
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      console.log('Task update response:', response.status, response.statusText);

      if (response.ok) {
        const updatedTask = await response.json();
        console.log('Updated task:', updatedTask);
        
        // Update local state
        setUserIdToTasks(prev => {
          const updated = { ...prev };
          Object.keys(updated).forEach(userId => {
            updated[userId] = updated[userId].map(task => 
              task.id === taskId ? { ...task, status } : task
            );
          });
          return updated;
        });
      } else {
        const errorData = await response.json();
        console.error('Task update failed:', errorData);
      }
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const openTaskModal = (task: TaskItem) => {
    setSelectedTask(task);
    setShowTaskModal(true);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Bilgi */}
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 text-red-600 mt-0.5">
              <svg fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-red-700">Takım üyelerinin görev tamamlama durumlarını takip edebilir, görev ilerlemelerini görüntüleyebilirsiniz.</p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-red-600 animate-spin" />
          </div>
        ) : teams.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <ListChecks className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Henüz Görev Yok</h3>
            <p className="text-gray-600">Henüz takım oluşturulmamış veya görev atanmamış.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 divide-y divide-gray-200">
            {teams.map((t) => {
              const isOpen = expanded.has(t.id);
              const teamMembers = [{ id: t.leader?.id, fullName: t.leader?.fullName, email: t.leader?.email, isLeader: true }, ...(t.members || []).map(m => ({ ...m, isLeader: false }))].filter(m => m.id);
              const totalTasks = teamMembers.reduce((acc, m: any) => acc + (userIdToTasks[m.id!]?.length || 0), 0);
              const totalCompleted = teamMembers.reduce((acc, m: any) => acc + (userIdToTasks[m.id!]?.filter((x: any) => (x.status || '').toLowerCase() === 'completed').length || 0), 0);
              const completion = totalTasks === 0 ? 0 : Math.round((totalCompleted / totalTasks) * 100);
              return (
                <div key={t.id}>
                  <button onClick={() => toggle(t.id)} className="w-full text-left py-4 px-5 hover:bg-gray-50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                        <Users className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{t.name}</p>
                        <p className="text-xs text-gray-600">Tamamlanma: <span className="font-medium text-gray-900">%{completion}</span></p>
                      </div>
                    </div>
                    <div className="w-48">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-red-600 h-2 rounded-full" style={{ width: `${completion}%` }} />
                      </div>
                    </div>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="px-5 pb-5">
                        <div className="overflow-x-auto border border-gray-200 rounded-lg">
                          <table className="min-w-full text-sm">
                            <thead>
                              <tr className="bg-gray-50 text-gray-700">
                                <th className="px-3 py-2 text-left w-12">#</th>
                                <th className="px-3 py-2 text-left">Üye</th>
                                <th className="px-3 py-2 text-left">E-posta</th>
                                <th className="px-3 py-2 text-left">Huawei Cloud</th>
                                <th className="px-3 py-2 text-left">Tamamlanan</th>
                                <th className="px-3 py-2 text-left">Toplam</th>
                                <th className="px-3 py-2 text-left">Son Durum</th>
                                <th className="px-3 py-2 text-left">Güncellendi</th>
                                <th className="px-3 py-2 text-left">İşlemler</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 text-gray-900">
                              {teamMembers.map((m: any, idx: number) => {
                                const { total, completed, last } = getStatsForUser(m.id);
                                const userTasks = userIdToTasks[m.id] || [];
                                return (
                                  <tr key={m.id} className="hover:bg-gray-50">
                                    <td className="px-3 py-2">{idx + 1}</td>
                                    <td className="px-3 py-2 font-medium text-gray-900">{m.fullName}{m.isLeader ? ' (Lider)' : ''}</td>
                                    <td className="px-3 py-2 text-gray-900">{m.email}</td>
                                    <td className="px-3 py-2">
                                      {userTasks.length > 0 && userTasks[0].huaweiCloudAccount ? (
                                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded font-mono">
                                          {userTasks[0].huaweiCloudAccount}
                                        </span>
                                      ) : (
                                        <span className="text-gray-400">-</span>
                                      )}
                                    </td>
                                    <td className="px-3 py-2">{completed}</td>
                                    <td className="px-3 py-2">{total}</td>
                                    <td className="px-3 py-2">{last ? (last.status === 'completed' ? 'Tamamlandı' : 'Beklemede') : '-'}</td>
                                    <td className="px-3 py-2">{last ? new Date(last.updatedAt).toLocaleDateString('tr-TR') : '-'}</td>
                                    <td className="px-3 py-2">
                                      <div className="flex items-center gap-2">
                                        {userTasks.map((task) => (
                                          <div key={task.id} className="flex items-center gap-2">
                                            <button
                                              onClick={() => openTaskModal(task)}
                                              className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                              title="Görev Detayları"
                                            >
                                              <Eye className="w-4 h-4" />
                                            </button>
                                            <button
                                              onClick={() => updateTaskStatus(task.id, 'completed')}
                                              className={`p-1 rounded ${
                                                task.status === 'completed' 
                                                  ? 'text-green-700 bg-green-100' 
                                                  : 'text-green-600 hover:bg-green-50'
                                              }`}
                                              title="Onayla"
                                            >
                                              <CheckCircle className="w-4 h-4" />
                                            </button>
                                            <button
                                              onClick={() => updateTaskStatus(task.id, 'rejected')}
                                              className={`p-1 rounded ${
                                                task.status === 'rejected' 
                                                  ? 'text-red-700 bg-red-100' 
                                                  : 'text-red-600 hover:bg-red-50'
                                              }`}
                                              title="Reddet"
                                            >
                                              <XCircle className="w-4 h-4" />
                                            </button>
                                            <button
                                              onClick={() => updateTaskStatus(task.id, 'pending')}
                                              className={`p-1 rounded ${
                                                task.status === 'pending' 
                                                  ? 'text-yellow-700 bg-yellow-100' 
                                                  : 'text-yellow-600 hover:bg-yellow-50'
                                              }`}
                                              title="Beklemede İşaretle"
                                            >
                                              <Clock className="w-4 h-4" />
                                            </button>
                                          </div>
                                        ))}
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })}
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

        {/* Görev Detay Modal */}
        <AnimatePresence>
          {showTaskModal && selectedTask && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900">Görev Detayları</h3>
                  <button
                    onClick={() => setShowTaskModal(false)}
                    className="p-2 rounded-lg hover:bg-gray-100"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
                
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Başlık</label>
                    <p className="text-gray-900 font-semibold">{selectedTask.title}</p>
                  </div>
                  
                  {selectedTask.description && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Açıklama</label>
                      <p className="text-gray-900">{selectedTask.description}</p>
                    </div>
                  )}
                  
                  {selectedTask.huaweiCloudAccount && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Huawei Cloud Hesabı</label>
                      <p className="text-gray-900 font-mono text-sm bg-gray-100 px-3 py-2 rounded">{selectedTask.huaweiCloudAccount}</p>
                    </div>
                  )}
                  
        <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Durum</label>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      selectedTask.status === 'completed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {selectedTask.status === 'completed' ? 'Tamamlandı' : 'Beklemede'}
                    </span>
        </div>
        
                  {(selectedTask.fileUrl || selectedTask.linkUrl) && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Ek Dosya/Bağlantı</label>
                      <div className="space-y-2">
                        {selectedTask.fileUrl && (
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-gray-500" />
                            <a
                              href={selectedTask.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 underline"
                            >
                              Dosyayı İndir
                            </a>
                          </div>
                        )}
                        {selectedTask.linkUrl && (
                          <div className="flex items-center gap-2">
                            <LinkIcon className="w-4 h-4 text-gray-500" />
                            <a
                              href={selectedTask.linkUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 underline"
                            >
                              Bağlantıyı Aç
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Oluşturulma Tarihi</label>
                      <p className="text-gray-900">{new Date(selectedTask.createdAt).toLocaleString('tr-TR')}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Son Güncelleme</label>
                      <p className="text-gray-900">{new Date(selectedTask.updatedAt).toLocaleString('tr-TR')}</p>
                    </div>
        </div>
                </div>
                
                <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
                  <button
                    onClick={() => setShowTaskModal(false)}
                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium"
                  >
                    Kapat
                  </button>
                  {selectedTask.status === 'pending' ? (
                    <>
                      <button
                        onClick={() => {
                          updateTaskStatus(selectedTask.id, 'completed');
                          setShowTaskModal(false);
                        }}
                        className="px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded-lg font-medium"
                      >
                        Onayla
                      </button>
                      <button
                        onClick={() => {
                          updateTaskStatus(selectedTask.id, 'rejected');
                          setShowTaskModal(false);
                        }}
                        className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg font-medium"
                      >
                        Reddet
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => {
                        updateTaskStatus(selectedTask.id, 'pending');
                        setShowTaskModal(false);
                      }}
                      className="px-4 py-2 bg-orange-600 text-white hover:bg-orange-700 rounded-lg font-medium"
                    >
                      Beklemede İşaretle
                    </button>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AdminLayout>
  );
}


