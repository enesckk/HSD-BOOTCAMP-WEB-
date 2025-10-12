 'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/dashboard/AdminLayout';
import { Send, Users, User, UsersRound, Loader2, Inbox, Plus } from 'lucide-react';

type RecipientType = 'user' | 'team' | 'teamMembers';

interface UserItem {
  id: string;
  fullName: string;
  email: string;
}

interface TeamItem {
  id: string;
  name: string;
  leader?: UserItem;
  members: UserItem[];
}

export default function AdminMessagesPage() {
  const [recipientType, setRecipientType] = useState<RecipientType>('user');
  const [users, setUsers] = useState<UserItem[]>([]);
  const [teams, setTeams] = useState<TeamItem[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [selectedTeamId, setSelectedTeamId] = useState<string>('');
  const [selectedTeamMemberIds, setSelectedTeamMemberIds] = useState<string[]>([]);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'inbox' | 'sent' | 'compose'>('inbox');
  const [messages, setMessages] = useState<any[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [query, setQuery] = useState('');
  const [onlyUnread, setOnlyUnread] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<any | null>(null);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editSubject, setEditSubject] = useState('');
  const [editBody, setEditBody] = useState('');
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState({ type: '', message: '', isSuccess: true });

  const showAlert = (type: string, message: string, isSuccess: boolean = true) => {
    setAlertMessage({ type, message, isSuccess });
    setShowAlertModal(true);
    setTimeout(() => {
      setShowAlertModal(false);
    }, 3000);
  };

  const markAsRead = async (messageId: string) => {
    try {
      const response = await fetch(`/api/messages/${messageId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          unread: false,
        }),
      });
      
      if (response.ok) {
        // Mesaj listesini güncelle
        setMessages(prev => prev.map(msg => 
          msg.id === messageId ? { ...msg, unread: false } : msg
        ));
      }
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const deleteMessage = async (messageId: string) => {
    if (!confirm('Bu mesajı silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      const response = await fetch(`/api/messages/${messageId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        // Mesaj listesinden kaldır
        setMessages(prev => prev.filter(m => m.id !== messageId));
        setShowMessageModal(false);
        setSelectedMessage(null);
        showAlert('Başarılı', 'Mesaj silindi', true);
      } else {
        showAlert('Hata', 'Mesaj silinirken hata oluştu', false);
      }
    } catch (error) {
      console.error('Error deleting message:', error);
      showAlert('Hata', 'Mesaj silinirken hata oluştu', false);
    }
  };

  const updateMessage = async () => {
    if (!editSubject.trim() || !editBody.trim()) {
      showAlert('Uyarı', 'Konu ve içerik boş olamaz', false);
      return;
    }

    try {
      const response = await fetch(`/api/messages/${selectedMessage.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject: editSubject,
          body: editBody,
        }),
      });
      
      if (response.ok) {
        // Mesaj listesini güncelle
        setMessages(prev => prev.map(m => 
          m.id === selectedMessage.id 
            ? { ...m, subject: editSubject, body: editBody }
            : m
        ));
        setSelectedMessage(prev => 
          prev ? { ...prev, subject: editSubject, body: editBody } : null
        );
        setIsEditing(false);
        showAlert('Başarılı', 'Mesaj güncellendi', true);
      } else {
        showAlert('Hata', 'Mesaj güncellenirken hata oluştu', false);
      }
    } catch (error) {
      console.error('Error updating message:', error);
      showAlert('Hata', 'Mesaj güncellenirken hata oluştu', false);
    }
  };

  const startEditing = () => {
    setEditSubject(selectedMessage?.subject || '');
    setEditBody(selectedMessage?.body || '');
    setIsEditing(true);
  };

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [usersRes, teamsRes] = await Promise.all([
          fetch('/api/users'),
          fetch('/api/teams?all=true')
        ]);
        const usersData = await usersRes.json();
        const teamsData = await teamsRes.json();
        const parsedUsers = Array.isArray(usersData?.items)
          ? usersData.items
          : Array.isArray(usersData?.users)
            ? usersData.users
            : Array.isArray(usersData)
              ? usersData
              : [];
        const parsedTeams = Array.isArray(teamsData?.items)
          ? teamsData.items
          : Array.isArray(teamsData)
            ? teamsData
            : [];
        setUsers(parsedUsers.map((u: any) => ({ id: u.id, fullName: u.fullName || u.name || u.email, email: u.email })));
        setTeams(parsedTeams.map((t: any) => ({ id: t.id, name: t.name, leader: t.leader ? { id: t.leader.id, fullName: t.leader.fullName, email: t.leader.email } : undefined, members: (t.members || []).map((m: any) => ({ id: m.id, fullName: m.fullName, email: m.email })) })));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    const loadMessages = async () => {
      try {
        setLoadingMessages(true);
        const box = activeTab === 'sent' ? 'sent' : 'inbox';
        const res = await fetch(`/api/messages?box=${box}`);
        const data = await res.json();
        const items = Array.isArray(data?.items) ? data.items : (Array.isArray(data) ? data : []);
        setMessages(items);
      } finally {
        setLoadingMessages(false);
      }
    };
    if (activeTab !== 'compose') {
      loadMessages();
    }
  }, [activeTab]);

  const filteredMessages = (messages || []).filter((m: any) => {
    if (!m) return false;
    if (activeTab === 'inbox' && onlyUnread && !m.unread) return false;
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    const fields = [m.subject, m.body].filter(Boolean).map((x: string) => x.toLowerCase());
    return fields.some((f: string) => f.includes(q));
  });

  const resetSelections = () => {
    setSelectedUserIds([]);
    setSelectedTeamId('');
    setSelectedTeamMemberIds([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !body.trim()) return;
    setSubmitting(true);
    try {
      const payload: any = { recipientType, subject, body };
      if (recipientType === 'user') {
        payload.userIds = selectedUserIds;
      } else if (recipientType === 'team') {
        payload.teamId = selectedTeamId;
      } else if (recipientType === 'teamMembers') {
        payload.teamId = selectedTeamId;
        payload.userIds = selectedTeamMemberIds;
      }
      await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      setSubject('');
      setBody('');
      resetSelections();
      showAlert('Başarılı', 'Mesaj gönderildi', true);
    } finally {
      setSubmitting(false);
    }
  };

  const currentTeam = teams.find((t) => t.id === selectedTeamId);
  const teamMembers = currentTeam ? [currentTeam.leader, ...(currentTeam.members || [])].filter(Boolean) as UserItem[] : [];

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
              <p className="text-sm text-red-700">Katılımcılara, takımlara veya seçili kişilere mesaj gönderebilirsiniz. Gelen ve gönderilen mesajları yönetebilirsiniz.</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="border-b border-gray-200 flex items-center">
            <button onClick={() => setActiveTab('inbox')} className={`px-4 py-3 text-sm font-semibold flex items-center gap-2 ${activeTab === 'inbox' ? 'text-red-700 border-b-2 border-red-600' : 'text-gray-900'}`}>
              <Inbox className="w-4 h-4" /> Gelen Mesajlar
            </button>
            <button onClick={() => setActiveTab('sent')} className={`px-4 py-3 text-sm font-semibold flex items-center gap-2 ${activeTab === 'sent' ? 'text-red-700 border-b-2 border-red-600' : 'text-gray-900'}`}>
              <Send className="w-4 h-4" /> Gönderilen Mesajlar
            </button>
            <button onClick={() => setActiveTab('compose')} className={`px-4 py-3 text-sm font-semibold flex items-center gap-2 ${activeTab === 'compose' ? 'text-red-700 border-b-2 border-red-600' : 'text-gray-900'}`}>
              <Plus className="w-4 h-4" /> Yeni Mesaj
            </button>
          </div>
        </div>

        {/* Form - sadece compose sekmesinde */}
        {activeTab === 'compose' && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-5">
          {/* Alıcı Tipi */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <label className="inline-flex items-center gap-2 p-3 border rounded-lg cursor-pointer">
              <input type="radio" name="rtype" checked={recipientType === 'user'} onChange={() => { setRecipientType('user'); resetSelections(); }} />
              <span className="text-sm text-gray-900 inline-flex items-center gap-2"><User className="w-4 h-4" /> Kullanıcı</span>
            </label>
            <label className="inline-flex items-center gap-2 p-3 border rounded-lg cursor-pointer">
              <input type="radio" name="rtype" checked={recipientType === 'team'} onChange={() => { setRecipientType('team'); resetSelections(); }} />
              <span className="text-sm text-gray-900 inline-flex items-center gap-2"><Users className="w-4 h-4" /> Takım</span>
            </label>
            <label className="inline-flex items-center gap-2 p-3 border rounded-lg cursor-pointer">
              <input type="radio" name="rtype" checked={recipientType === 'teamMembers'} onChange={() => { setRecipientType('teamMembers'); resetSelections(); }} />
              <span className="text-sm text-gray-900 inline-flex items-center gap-2"><UsersRound className="w-4 h-4" /> Takımdan Seçili Kişiler</span>
            </label>
          </div>

          {/* Alıcı Seçimi */}
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 text-red-600 animate-spin" />
            </div>
          ) : (
            <div className="space-y-4">
              {recipientType === 'user' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Kullanıcı Seç</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-56 overflow-auto border rounded-lg p-3">
                    {(users || []).map((u) => {
                      const checked = selectedUserIds.includes(u.id);
                      return (
                        <label key={u.id} className="inline-flex items-center gap-2 text-sm">
                          <input type="checkbox" checked={checked} onChange={(e) => {
                            setSelectedUserIds((prev) => e.target.checked ? [...prev, u.id] : prev.filter(id => id !== u.id));
                          }} />
                          <span className="text-gray-900">{u.fullName} - {u.email}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              {(recipientType === 'team' || recipientType === 'teamMembers') && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Takım Seç</label>
                    <select value={selectedTeamId} onChange={(e) => { setSelectedTeamId(e.target.value); setSelectedTeamMemberIds([]); }} className="w-full rounded-lg border border-gray-300 focus:ring-red-500 focus:border-red-500 text-gray-900">
                      <option value="">Seçiniz</option>
                      {(teams || []).map((t) => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                      ))}
                    </select>
                  </div>
                  {recipientType === 'teamMembers' && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Takım Üyeleri</label>
                      <div className="grid grid-cols-1 gap-2 max-h-56 overflow-auto border rounded-lg p-3">
                        {teamMembers.length === 0 ? (
                          <span className="text-sm text-gray-900">Üye bulunamadı</span>
                        ) : teamMembers.map((m) => {
                          const checked = selectedTeamMemberIds.includes(m.id);
                          return (
                            <label key={m.id} className="inline-flex items-center gap-2 text-sm">
                              <input type="checkbox" checked={checked} onChange={(e) => {
                                setSelectedTeamMemberIds((prev) => e.target.checked ? [...prev, m.id] : prev.filter(id => id !== m.id));
                              }} />
                              <span className="text-gray-900">{m.fullName} - {m.email}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Konu & Mesaj */}
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-1">Konu</label>
              <input value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full rounded-lg border border-gray-300 focus:ring-red-500 focus:border-red-500 text-gray-900" placeholder="Kısa konu" />
            </div>
        <div>
              <label className="block text-sm font-semibold text-gray-900 mb-1">Mesaj</label>
              <textarea value={body} onChange={(e) => setBody(e.target.value)} className="w-full rounded-lg border border-gray-300 focus:ring-red-500 focus:border-red-500 min-h-[140px] text-gray-900" placeholder="Mesaj içeriği" />
            </div>
        </div>
        
          <div className="flex justify-end">
            <button disabled={submitting} type="submit" className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-semibold disabled:opacity-60">
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />} Gönder
            </button>
          </div>
        </form>
        )}

        {/* Filtreler - sadece inbox/sent sekmelerinde */}
        {activeTab !== 'compose' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex items-center justify-between gap-3">
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Mesajlarda ara..." className="w-full md:max-w-md rounded-lg border border-gray-300 focus:ring-red-500 focus:border-red-500 text-gray-900 px-3 py-2" />
            {activeTab === 'inbox' && (
              <label className="inline-flex items-center gap-2 text-sm">
                <input type="checkbox" checked={onlyUnread} onChange={(e) => setOnlyUnread(e.target.checked)} className="rounded border-gray-300 text-red-600 focus:ring-red-500" />
                <span className="text-gray-900">Sadece okunmamış</span>
              </label>
            )}
          </div>
        )}

        {/* Listeler - sadece inbox/sent sekmelerinde */}
        {activeTab !== 'compose' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          {loadingMessages ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 text-red-600 animate-spin" />
            </div>
          ) : filteredMessages.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <Inbox className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Henüz Mesaj Yok</h3>
              <p className="text-gray-600">Henüz mesaj bulunmuyor. Yeni mesaj göndermek için "Yeni Mesaj" sekmesini kullanın.</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {filteredMessages.map((m: any) => (
                <li key={m.id} className="p-4 flex items-start justify-between gap-4 cursor-pointer hover:bg-gray-50" onClick={() => { 
                  setSelectedMessage(m); 
                  setShowMessageModal(true); 
                  // Gelen mesajlar için okundu olarak işaretle
                  if (activeTab === 'inbox' && m.unread) {
                    markAsRead(m.id);
                  }
                }}>
                  <div>
                    <div className="flex items-center gap-2">
                      {/* Unread badge - kırmızı yanıp sönen */}
                      {m.unread && activeTab === 'inbox' ? (
                        <span className="inline-flex w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
                      ) : null}
                      {m.unread && activeTab === 'inbox' && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                          Yeni
                        </span>
                      )}
                      <p className="font-semibold text-gray-900">{m.subject || 'Konu yok'}</p>
                    </div>
                    <p className="text-sm text-gray-900 mt-1 line-clamp-2">{m.body}</p>
                    <div className="text-xs text-gray-600 mt-1">
                      <span>{new Date(m.createdAt || Date.now()).toLocaleString('tr-TR')}</span>
                      {activeTab === 'sent' && (
                        <span className="ml-2">
                          • Alıcı: {
                            m.toUser ? 
                              `${m.toUser.fullName} (${m.toUser.email})` :
                              m.toTeam ? 
                                `Takım: ${m.toTeam.name}` :
                                'Tüm Katılımcılar'
                          }
                        </span>
                      )}
                      {activeTab === 'inbox' && (
                        <span className="ml-2">
                          • Gönderen: {m.fromUser?.fullName || 'Sistem'}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-xs text-gray-900 mt-1 min-w-[120px] text-right">
                    {activeTab === 'inbox' ? (
                      <span className="inline-block px-2 py-1 rounded border border-gray-200">Gelen</span>
                    ) : (
                      <span className="inline-block px-2 py-1 rounded border border-gray-200">Gönderilen</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        )}

        {/* Mesaj Detay Modal */}
        {showMessageModal && selectedMessage && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">Mesaj Detayları</h2>
                  <button
                    onClick={() => setShowMessageModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Konu</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editSubject}
                      onChange={(e) => setEditSubject(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900"
                    />
                  ) : (
                    <p className="text-gray-900 font-semibold">{selectedMessage.subject || 'Konu yok'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">İçerik</label>
                  {isEditing ? (
                    <textarea
                      value={editBody}
                      onChange={(e) => setEditBody(e.target.value)}
                      rows={6}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900"
                    />
                  ) : (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-900 whitespace-pre-wrap">{selectedMessage.body}</p>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gönderen</label>
                    <p className="text-gray-900">{selectedMessage.fromUser?.fullName || 'Sistem'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tarih</label>
                    <p className="text-gray-900">{new Date(selectedMessage.createdAt || Date.now()).toLocaleString('tr-TR')}</p>
                  </div>
                </div>

        <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Alıcı</label>
                  <p className="text-gray-900">
                    {selectedMessage.toUser ? 
                      `${selectedMessage.toUser.fullName} (${selectedMessage.toUser.email})` :
                      selectedMessage.toTeam ? 
                        `Takım: ${selectedMessage.toTeam.name}` :
                        selectedMessage.toRole === 'participant' ? 'Tüm Katılımcılar' : 
                        selectedMessage.toRole || 'Belirtilmemiş'
                    }
                  </p>
                </div>

                {selectedMessage.unread && activeTab === 'inbox' && (
                  <div className="flex items-center gap-2">
                    <span className="inline-flex w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
                    <span className="text-sm text-red-600 font-medium">Okunmamış</span>
                  </div>
                )}
        </div>
        
              <div className="p-6 border-t border-gray-200 flex justify-between">
                <div className="flex gap-2">
                  {activeTab === 'sent' && !isEditing && (
                    <>
                      <button
                        onClick={startEditing}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all"
                      >
                        Düzenle
                      </button>
                      <button
                        onClick={() => deleteMessage(selectedMessage.id)}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all"
                      >
                        Sil
                      </button>
                    </>
                  )}
                </div>
                <div className="flex gap-2">
                  {isEditing ? (
                    <>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-all"
                      >
                        İptal
                      </button>
                      <button
                        onClick={updateMessage}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-all"
                      >
                        Kaydet
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setShowMessageModal(false)}
                      className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-all"
                    >
                      Kapat
                    </button>
                  )}
                </div>
              </div>
        </div>
          </div>
        )}

        {/* Alert Modal */}
        {showAlertModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className={`bg-white rounded-xl shadow-xl max-w-md w-full p-6 ${
              alertMessage.isSuccess ? 'border-l-4 border-green-500' : 'border-l-4 border-red-500'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  alertMessage.isSuccess ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  {alertMessage.isSuccess ? (
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                </div>
                <div>
                  <h3 className={`font-semibold ${
                    alertMessage.isSuccess ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {alertMessage.type}
                  </h3>
                  <p className={`text-sm ${
                    alertMessage.isSuccess ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {alertMessage.message}
                  </p>
                </div>
              </div>
        </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

