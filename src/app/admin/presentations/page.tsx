 'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/dashboard/AdminLayout';
import { AnimatePresence, motion } from 'framer-motion';
import { Users, Presentation, Loader2, Link as LinkIcon, File as FileIcon, Eye, CheckCircle, XCircle, X, Clock } from 'lucide-react';

interface Team {
  id: string;
  name: string;
  leader: { id: string; fullName: string; email: string } | null;
  members: Array<{ id: string; fullName: string; email: string }>;
}

interface PresentationItem {
  id: string;
  userId: string;
  teamName?: string;
  memberNames?: string;
  title: string;
  description?: string;
  uploadType?: 'file' | 'link';
  fileUrl?: string | null;
  linkUrl?: string | null;
  status?: 'pending' | 'approved' | 'rejected' | string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminPresentationsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [userIdToPresentations, setUserIdToPresentations] = useState<Record<string, PresentationItem[]>>({});
  const [selectedPresentation, setSelectedPresentation] = useState<PresentationItem | null>(null);
  const [showPresentationModal, setShowPresentationModal] = useState(false);

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        const teamsRes = await fetch('/api/teams?all=true');
        const teamsData = await teamsRes.json();
        const list: Team[] = teamsData.items || teamsData || [];
        setTeams(list);

        const memberIds = new Set<string>();
        for (const t of list) {
          if (t.leader?.id) memberIds.add(t.leader.id);
          for (const m of t.members || []) memberIds.add(m.id);
        }
        const ids = Array.from(memberIds);
        const chunks: string[][] = [];
        for (let i = 0; i < ids.length; i += 6) chunks.push(ids.slice(i, i + 6));
        const map: Record<string, PresentationItem[]> = {};
        for (const chunk of chunks) {
          await Promise.all(
            chunk.map(async (uid) => {
              try {
                const res = await fetch(`/api/presentations?userId=${uid}`);
                const data = await res.json();
                const items: PresentationItem[] = (data.items || data || []).map((d: any) => ({
                  id: d.id,
                  userId: d.userId,
                  teamName: d.teamName,
                  memberNames: d.memberNames,
                  title: d.title,
                  description: d.description,
                  uploadType: d.uploadType,
                  fileUrl: d.fileUrl,
                  linkUrl: d.linkUrl,
                  status: d.status,
                  createdAt: d.createdAt,
                  updatedAt: d.updatedAt,
                }));
                map[uid] = items;
              } catch (e) {
                map[uid] = [];
              }
            })
          );
        }
        setUserIdToPresentations(map);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  const toggle = (teamId: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(teamId)) next.delete(teamId); else next.add(teamId);
      return next;
    });
  };

  const updatePresentationStatus = async (presentationId: string, status: 'approved' | 'rejected' | 'pending') => {
    try {
      console.log('Updating presentation status:', { presentationId, status });
      const response = await fetch(`/api/presentations/${presentationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      console.log('Presentation update response:', response.status, response.statusText);

      if (response.ok) {
        const updatedPresentation = await response.json();
        console.log('Updated presentation:', updatedPresentation);
        
        // Update local state
        setUserIdToPresentations(prev => {
          const updated = { ...prev };
          Object.keys(updated).forEach(userId => {
            updated[userId] = updated[userId].map(presentation => 
              presentation.id === presentationId ? { ...presentation, status } : presentation
            );
          });
          return updated;
        });
      } else {
        const errorData = await response.json();
        console.error('Presentation update failed:', errorData);
      }
    } catch (error) {
      console.error('Error updating presentation status:', error);
    }
  };

  const openPresentationModal = (presentation: PresentationItem) => {
    setSelectedPresentation(presentation);
    setShowPresentationModal(true);
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
              <p className="text-sm text-red-700">Takımların yüklediği sunumları görüntüleyebilir, takım bazında sunum durumlarını takip edebilirsiniz.</p>
            </div>
          </div>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-red-600 animate-spin" />
          </div>
        ) : teams.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <Presentation className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Henüz Sunum Yok</h3>
            <p className="text-gray-600">Henüz takım oluşturulmamış veya sunum yüklenmemiş.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 divide-y divide-gray-200">
            {teams.map((t) => {
              const isOpen = expanded.has(t.id);
              const teamMembers = [
                t.leader ? { ...t.leader, isLeader: true } : null,
                ...(t.members || []).map((m) => ({ ...m, isLeader: false })),
              ].filter(Boolean) as Array<{ id: string; fullName: string; email: string; isLeader: boolean }>;
              const teamPresentations = teamMembers.flatMap((m) => userIdToPresentations[m.id] || []);
              return (
                <div key={t.id}>
                  <button onClick={() => toggle(t.id)} className="w-full text-left py-4 px-5 hover:bg-gray-50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                        <Presentation className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{t.name}</p>
                        <p className="text-xs text-gray-600">Sunum: <span className="font-medium text-gray-900">{teamPresentations.length}</span> • Üye: <span className="font-medium text-gray-900">{teamMembers.length}</span></p>
                      </div>
                    </div>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="px-5 pb-5">
                        {/* Üyeler listesi */}
                        <div className="border border-gray-200 rounded-lg overflow-hidden">
                          <div className="bg-gray-50 px-4 py-2 text-sm font-semibold text-gray-700">Takım Üyeleri</div>
                          <ul className="divide-y divide-gray-200">
                            {teamMembers.map((m) => (
                              <li key={m.id} className="px-4 py-2 flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                  <Users className="w-4 h-4 text-gray-500" />
                                  <span className="font-medium text-gray-900">{m.fullName}</span>
                                  {m.isLeader && <span className="text-xs px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-200">Lider</span>}
                                </div>
                                <span className="text-gray-700">{m.email}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Sunumlar tablosu */}
                        <div className="overflow-x-auto border border-gray-200 rounded-lg mt-4">
                          <table className="min-w-full text-sm">
                            <thead>
                              <tr className="bg-gray-50 text-gray-700">
                                <th className="px-3 py-2 text-left w-12">#</th>
                                <th className="px-3 py-2 text-left">Başlık</th>
                                <th className="px-3 py-2 text-left">Yükleyen</th>
                                <th className="px-3 py-2 text-left">Durum</th>
                                <th className="px-3 py-2 text-left">Bağlantı/Dosya</th>
                                <th className="px-3 py-2 text-left">Güncellendi</th>
                                <th className="px-3 py-2 text-left">İşlemler</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 text-gray-900">
                              {teamPresentations.length === 0 ? (
                                <tr>
                                  <td className="px-3 py-4 text-center text-gray-600" colSpan={7}>Henüz sunum bulunmuyor</td>
                                </tr>
                              ) : (
                                teamPresentations.map((p, idx) => {
                                  const owner = teamMembers.find((m) => m.id === p.userId);
                                  const statusLabel = p.status === 'approved' ? 'Onaylandı' : p.status === 'rejected' ? 'Reddedildi' : 'Beklemede';
                                  return (
                                    <tr key={p.id} className="hover:bg-gray-50">
                                      <td className="px-3 py-2">{idx + 1}</td>
                                      <td className="px-3 py-2 font-medium text-gray-900">{p.title}</td>
                                      <td className="px-3 py-2">{owner ? owner.fullName : '-'}</td>
                                      <td className="px-3 py-2">{statusLabel}</td>
                                      <td className="px-3 py-2">
                                        {p.uploadType === 'LINK' && p.fileUrl ? (
                                          <a className="inline-flex items-center gap-1 text-red-700 hover:underline" href={p.fileUrl} target="_blank" rel="noreferrer">
                                            <LinkIcon className="w-4 h-4" /> Bağlantı
                                          </a>
                                        ) : p.uploadType === 'FILE' && p.fileUrl ? (
                                          <a className="inline-flex items-center gap-1 text-red-700 hover:underline" href={p.fileUrl} target="_blank" rel="noreferrer">
                                            <FileIcon className="w-4 h-4" /> Dosya
                                          </a>
                                        ) : p.fileUrl ? (
                                          <a className="inline-flex items-center gap-1 text-red-700 hover:underline" href={p.fileUrl} target="_blank" rel="noreferrer">
                                            {p.uploadType === 'LINK' ? <LinkIcon className="w-4 h-4" /> : <FileIcon className="w-4 h-4" />}
                                            {p.uploadType === 'LINK' ? 'Bağlantı' : 'Dosya'}
                                          </a>
                                        ) : (
                                          <span className="text-gray-600">—</span>
                                        )}
                                      </td>
                                      <td className="px-3 py-2">{new Date(p.updatedAt).toLocaleDateString('tr-TR')}</td>
                                      <td className="px-3 py-2">
                                        <div className="flex items-center gap-2">
                                          <button
                                            onClick={() => openPresentationModal(p)}
                                            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                            title="Sunum Detayları"
                                          >
                                            <Eye className="w-4 h-4" />
                                          </button>
                                          <button
                                            onClick={() => updatePresentationStatus(p.id, 'approved')}
                                            className={`p-1 rounded ${
                                              p.status === 'approved' 
                                                ? 'text-green-700 bg-green-100' 
                                                : 'text-green-600 hover:bg-green-50'
                                            }`}
                                            title="Onayla"
                                          >
                                            <CheckCircle className="w-4 h-4" />
                                          </button>
                                          <button
                                            onClick={() => updatePresentationStatus(p.id, 'rejected')}
                                            className={`p-1 rounded ${
                                              p.status === 'rejected' 
                                                ? 'text-red-700 bg-red-100' 
                                                : 'text-red-600 hover:bg-red-50'
                                            }`}
                                            title="Reddet"
                                          >
                                            <XCircle className="w-4 h-4" />
                                          </button>
                                          <button
                                            onClick={() => updatePresentationStatus(p.id, 'pending')}
                                            className={`p-1 rounded ${
                                              p.status === 'pending' 
                                                ? 'text-yellow-700 bg-yellow-100' 
                                                : 'text-yellow-600 hover:bg-yellow-50'
                                            }`}
                                            title="Beklemede İşaretle"
                                          >
                                            <Clock className="w-4 h-4" />
                                          </button>
                                        </div>
                                      </td>
                                    </tr>
                                  );
                                })
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

        {/* Sunum Detay Modal */}
        <AnimatePresence>
          {showPresentationModal && selectedPresentation && (
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
                        : selectedPresentation.status === 'rejected'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {selectedPresentation.status === 'approved' ? 'Onaylandı' : 
                       selectedPresentation.status === 'rejected' ? 'Reddedildi' : 'Beklemede'}
                    </span>
        </div>
        
                  {selectedPresentation.fileUrl && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Ek Dosya/Bağlantı</label>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          {selectedPresentation.uploadType === 'LINK' ? (
                            <LinkIcon className="w-4 h-4 text-gray-500" />
                          ) : (
                            <FileIcon className="w-4 h-4 text-gray-500" />
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
        
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Oluşturulma Tarihi</label>
                      <p className="text-gray-900">{new Date(selectedPresentation.createdAt).toLocaleString('tr-TR')}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Son Güncelleme</label>
                      <p className="text-gray-900">{new Date(selectedPresentation.updatedAt).toLocaleString('tr-TR')}</p>
                    </div>
        </div>
                </div>
                
                <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
                  <button
                    onClick={() => setShowPresentationModal(false)}
                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium"
                  >
                    Kapat
                  </button>
                  <button
                    onClick={() => {
                      updatePresentationStatus(selectedPresentation.id, 'approved');
                      setShowPresentationModal(false);
                    }}
                    className={`px-4 py-2 rounded-lg font-medium ${
                      selectedPresentation.status === 'approved'
                        ? 'bg-green-700 text-white'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    Onayla
                  </button>
                  <button
                    onClick={() => {
                      updatePresentationStatus(selectedPresentation.id, 'rejected');
                      setShowPresentationModal(false);
                    }}
                    className={`px-4 py-2 rounded-lg font-medium ${
                      selectedPresentation.status === 'rejected'
                        ? 'bg-red-700 text-white'
                        : 'bg-red-600 text-white hover:bg-red-700'
                    }`}
                  >
                    Reddet
                  </button>
                  <button
                    onClick={() => {
                      updatePresentationStatus(selectedPresentation.id, 'pending');
                      setShowPresentationModal(false);
                    }}
                    className={`px-4 py-2 rounded-lg font-medium ${
                      selectedPresentation.status === 'pending'
                        ? 'bg-yellow-700 text-white'
                        : 'bg-yellow-600 text-white hover:bg-yellow-700'
                    }`}
                  >
                    Beklemede
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AdminLayout>
  );
}

