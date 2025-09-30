'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Inbox, Send, Plus, Search, User, Calendar, Clock, Paperclip, Trash2, AlertCircle, X, Edit3, Save } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

type Message = {
  id: number;
  subject: string;
  body: string;
  from: string;
  to: string;
  date?: string; // ISO
  time?: string;
  createdAt?: string; // ISO
  attachments?: { name: string; url?: string }[];
  unread?: boolean;
};

const inboxSeed: Message[] = [
  {
    id: 1,
    subject: 'Mentorluk Oturumu',
    body: 'Merhaba, mentorluk için uygun saatlerinizi iletir misiniz? 13:00-16:00 arası uygunuz.',
    from: 'Organizasyon',
    to: 'Siz',
    date: '2024-10-12',
    time: '10:30',
    unread: true
  },
  {
    id: 2,
    subject: 'Sunum Dosyası',
    body: 'Final sunumu için örnek şablonu ekte paylaşıyorum.',
    from: 'Jüri',
    to: 'Siz',
    date: '2024-10-10',
    attachments: [{ name: 'sunum_sablon.pptx' }],
    unread: false
  }
];

const sentSeed: Message[] = [
  {
    id: 3,
    subject: 'Takım Bilgileri',
    body: 'Merhaba, takım bilgilerini güncelledim. Onaylayabilir misiniz?',
    from: 'Siz',
    to: 'Organizasyon',
    date: '2024-10-11',
    time: '09:15'
  }
];

const MessagesPage = () => {
  const [activeTab, setActiveTab] = useState<'inbox' | 'sent' | 'compose'>('inbox');
  const [query, setQuery] = useState('');
  const [inbox, setInbox] = useState<Message[]>(inboxSeed);
  const [sent, setSent] = useState<Message[]>(sentSeed);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const token = localStorage.getItem('afet_maratonu_token');
    console.log('MessagesPage - Token from localStorage:', token);
    console.log('MessagesPage - Token length:', token ? token.length : 0);
    console.log('MessagesPage - Token starts with:', token ? token.substring(0, 20) + '...' : 'No token');
    const headers: Record<string, string> = token ? { 'Authorization': `Bearer ${token}` } : {};
    console.log('MessagesPage - Headers:', headers);
    
    fetch('/api/messages?box=inbox', { headers })
      .then(r => {
        console.log('Inbox response status:', r.status);
        return r.json();
      })
      .then(d => {
        console.log('Inbox data:', d);
        setInbox(d.items || []);
      })
      .catch(err => {
        console.error('Inbox fetch error:', err);
        setInbox([]);
      });
      
    fetch('/api/messages?box=sent', { headers })
      .then(r => {
        console.log('Sent response status:', r.status);
        return r.json();
      })
      .then(d => {
        console.log('Sent data:', d);
        setSent(d.items || []);
      })
      .catch(err => {
        console.error('Sent fetch error:', err);
        setSent([]);
      });
  }, []);
  const [onlyUnread, setOnlyUnread] = useState(false);
  const [openInboxId, setOpenInboxId] = useState<number | null>(null);
  const [openSentId, setOpenSentId] = useState<number | null>(null);
  const [selectedInboxIds, setSelectedInboxIds] = useState<number[]>([]);
  const [selectedSentIds, setSelectedSentIds] = useState<number[]>([]);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState<Message | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState<Message | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [messageToEdit, setMessageToEdit] = useState<Message | null>(null);

  const [compose, setCompose] = useState({ to: 'admin', subject: '', body: '' });
  const [isSending, setIsSending] = useState(false);


  const filteredInbox = useMemo(() => {
    if (!inbox || !Array.isArray(inbox)) return [];
    const base = inbox.filter(m => {
      if (!m) return false;
      const searchFields = [m.subject, m.body, m.from, m.to].filter(field => field && typeof field === 'string');
      return searchFields.some(v => v.toLowerCase().includes(query.toLowerCase()));
    });
    return onlyUnread ? base.filter(m => m && m.unread) : base;
  }, [inbox, query, onlyUnread]);
  const filteredSent = useMemo(() => {
    if (!sent || !Array.isArray(sent)) return [];
    return sent.filter(m => {
      if (!m) return false;
      const searchFields = [m.subject, m.body, m.from, m.to].filter(field => field && typeof field === 'string');
      return searchFields.some(v => v.toLowerCase().includes(query.toLowerCase()));
    });
  }, [sent, query]);

  // Bulk actions
  const toggleInboxSelectAll = (checked: boolean) => {
    setSelectedInboxIds(checked ? filteredInbox.map(m => m.id) : []);
  };
  const toggleSentSelectAll = (checked: boolean) => {
    setSelectedSentIds(checked ? filteredSent.map(m => m.id) : []);
  };
  const toggleInboxSelect = (id: number, checked: boolean) => {
    setSelectedInboxIds(prev => (checked ? [...new Set([...(prev || []), id])] : (prev || []).filter(x => x !== id)));
  };
  const toggleSentSelect = (id: number, checked: boolean) => {
    setSelectedSentIds(prev => (checked ? [...new Set([...(prev || []), id])] : (prev || []).filter(x => x !== id)));
  };
  const markInboxRead = (ids: number[]) => {
    setInbox(prev => (prev || []).map(m => (ids.includes(m.id) ? { ...m, unread: false } : m)));
    setSelectedInboxIds(prev => (prev || []).filter(id => !ids.includes(id)));
    const token = localStorage.getItem('afet_maratonu_token');
    const headers: Record<string, string> = token ? { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
    fetch('/api/messages', { method: 'PUT', headers, body: JSON.stringify({ ids, action: 'markRead' }) });
  };
  const markInboxUnread = (ids: number[]) => {
    setInbox(prev => (prev || []).map(m => (ids.includes(m.id) ? { ...m, unread: true } : m)));
    const token = localStorage.getItem('afet_maratonu_token');
    const headers: Record<string, string> = token ? { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
    fetch('/api/messages', { method: 'PUT', headers, body: JSON.stringify({ ids, action: 'markUnread' }) });
  };
  const deleteSent = (ids: number[]) => {
    setSent(prev => (prev || []).filter(m => !ids.includes(m.id)));
    setSelectedSentIds(prev => (prev || []).filter(id => !ids.includes(id)));
    const token = localStorage.getItem('afet_maratonu_token');
    const headers: Record<string, string> = token ? { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
    fetch('/api/messages', { method: 'PUT', headers, body: JSON.stringify({ ids, action: 'deleteSent' }) });
  };

  const openMessageModal = (message: Message, source: 'inbox' | 'sent') => {
    setModalMessage(message);
    setShowModal(true);
    if (source === 'inbox' && message.unread) {
      markInboxRead([message.id]);
    }
  };

  const editMessage = (message: Message) => {
    setMessageToEdit(message);
    setShowEditModal(true);
  };

  const handleDeleteClick = (message: Message) => {
    setMessageToDelete(message);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    if (messageToDelete) {
      deleteSent([messageToDelete.id]);
      setShowDeleteModal(false);
      setMessageToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setMessageToDelete(null);
  };

  const handleEditCancel = () => {
    setShowEditModal(false);
    setMessageToEdit(null);
  };

  const handleEditSave = async () => {
    if (messageToEdit) {
      // Mesajı güncelle
      const res = await fetch(`/api/messages/${messageToEdit.id}`, { 
        method: 'PUT', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({
          subject: messageToEdit.subject,
          body: messageToEdit.body
        }) 
      });
      if (res.ok) {
        setShowEditModal(false);
        setMessageToEdit(null);
        // Mesajları yeniden yükle
        window.location.reload();
      }
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Form validation
    if (!compose.subject.trim() || !compose.body.trim()) {
      setSuccessMessage('Konu ve mesaj içeriği gereklidir');
      setShowSuccessModal(true);
      return;
    }
    
    setIsSending(true);
    
    try {
      const token = localStorage.getItem('afet_maratonu_token');
      console.log('Sending message with token:', token ? 'Present' : 'Missing');
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      console.log('Sending message data:', compose);
      
      const res = await fetch('/api/messages', { 
        method: 'POST', 
        headers, 
        body: JSON.stringify(compose) 
      });
      
      console.log('Send message response status:', res.status);
      
      if (!res.ok) {
        const errorData = await res.json();
        console.error('Send message failed:', errorData);
        setSuccessMessage('Mesaj gönderilemedi: ' + (errorData.error || 'Bilinmeyen hata'));
        setShowSuccessModal(true);
        return;
      }
      
      const data = await res.json();
      console.log('Send message response data:', data);
      
      if (data.item) {
        // Mesajı sent listesine ekle
        setSent(prev => [data.item, ...(prev || [])]);
        console.log('Message added to sent list:', data.item);
        
        // Form'u temizle
        setCompose({ to: 'admin', subject: '', body: '' });
        
        // Sent tab'ına geç
        setActiveTab('sent');
        
        setSuccessMessage('Mesaj başarıyla gönderildi!');
        setShowSuccessModal(true);
      } else {
        console.error('No item in response:', data);
        setSuccessMessage('Mesaj gönderildi ama yanıt beklenmiyor');
        setShowSuccessModal(true);
      }
      
    } catch (error) {
      console.error('Send message error:', error);
      setSuccessMessage('Mesaj gönderilirken hata oluştu: ' + (error instanceof Error ? error.message : 'Bilinmeyen hata'));
      setShowSuccessModal(true);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="sr-only">Mesajlar</h1>
          <p className="text-gray-600 mt-2">Gelen, gönderilen ve yeni mesaj oluşturma</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-8">
          <button
            onClick={() => setActiveTab('inbox')}
            className={`flex items-center gap-2 py-3 border-b-2 text-sm font-medium ${
              activeTab === 'inbox'
                ? 'border-red-600 text-red-700'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Inbox className="w-4 h-4" /> Gelen Kutusu
          </button>
          <button
            onClick={() => setActiveTab('sent')}
            className={`flex items-center gap-2 py-3 border-b-2 text-sm font-medium ${
              activeTab === 'sent'
                ? 'border-red-600 text-red-700'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Send className="w-4 h-4" /> Gönderilenler
          </button>
          <button
            onClick={() => setActiveTab('compose')}
            className={`flex items-center gap-2 py-3 border-b-2 text-sm font-medium ${
              activeTab === 'compose'
                ? 'border-red-600 text-red-700'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Plus className="w-4 h-4" /> Yeni Mesaj
          </button>
        </nav>
      </div>

      {/* Search & Filters + Bulk actions */}
      {activeTab !== 'compose' && (
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex flex-col gap-4">
          <div className="relative max-w-xl w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 placeholder-gray-600"
              placeholder="Mesajlarda ara..."
            />
          </div>
          <div className="flex items-center justify-between gap-3">
            {activeTab === 'inbox' ? (
              <div className="flex items-center gap-4">
                <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={onlyUnread}
                    onChange={e => setOnlyUnread(e.target.checked)}
                    className="form-checkbox h-4 w-4 text-red-600 rounded"
                  />
                  <span className="text-sm text-gray-700">Sadece okunmamışlar</span>
                </label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleInboxSelectAll(selectedInboxIds.length !== filteredInbox.length)}
                    className="text-sm px-3 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                  >
                    {selectedInboxIds.length === filteredInbox.length && filteredInbox.length > 0 ? 'Tümünü Kaldır' : 'Tümünü Seç'}
                  </button>
                  <button
                    onClick={() => markInboxRead(selectedInboxIds)}
                    className="text-sm px-3 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                  >
                    Okundu İşaretle
                  </button>
                  <button
                    onClick={() => markInboxUnread(selectedInboxIds)}
                    className="text-sm px-3 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                  >
                    Okunmadı Yap
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleSentSelectAll(selectedSentIds.length !== filteredSent.length)}
                  className="text-sm px-3 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                >
                  {selectedSentIds.length === filteredSent.length && filteredSent.length > 0 ? 'Tümünü Kaldır' : 'Tümünü Seç'}
                </button>
                <button
                  onClick={() => deleteSent(selectedSentIds)}
                  className="text-sm px-3 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                >
                  Sil
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Lists */}
      {activeTab === 'inbox' && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm divide-y divide-gray-100">
          {filteredInbox.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Inbox className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Gelen kutusu boş</h3>
              <p className="text-gray-600">Henüz gelen mesajınız bulunmuyor.</p>
            </div>
          ) : (
            filteredInbox.map((m, idx) => {
            const open = openInboxId === m.id;
            return (
              <div key={m.id}>
                <motion.button
                  type="button"
                  onClick={() => openMessageModal(m, 'inbox')}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  className="w-full text-left p-4 hover:bg-gray-50"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 min-w-0">
                      <input
                        type="checkbox"
                        checked={selectedInboxIds.includes(m.id)}
                        onChange={(e) => {
                          e.stopPropagation();
                          toggleInboxSelect(m.id, e.target.checked);
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        className="mt-1 h-4 w-4 text-red-600 rounded border-gray-300 focus:ring-red-500"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-red-600" />
                          {m.unread && <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />}
                          <span className="truncate tracking-tight text-lg md:text-xl font-bold text-gray-900">{m?.subject || 'Başlık yok'}</span>
                        {m.unread && (
                          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                            Yeni
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{m?.body || 'İçerik yok'}</p>
                      <div className="flex items-center gap-3 text-xs text-gray-500 mt-2">
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" /> {m.createdAt ? new Date(m.createdAt).toLocaleDateString('tr-TR') : 'Tarih yok'}
                        </span>
                        {m.createdAt && (
                          <span className="inline-flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" /> {new Date(m.createdAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        )}
                        {m.attachments && m.attachments.length > 0 && (
                          <span className="inline-flex items-center gap-1">
                            <Paperclip className="w-3.5 h-3.5" /> {m.attachments.length} ek
                          </span>
                        )}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500 whitespace-nowrap">Yönetim</span>
                  </div>
                </motion.button>
                
              </div>
            );
          })
          )}
        </div>
      )}

      {activeTab === 'sent' && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm divide-y divide-gray-100">
          {filteredSent.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Gönderilen mesaj yok</h3>
              <p className="text-gray-600">Henüz gönderdiğiniz mesaj bulunmuyor.</p>
            </div>
          ) : (
            filteredSent.map((m, idx) => {
            const open = openSentId === m.id;
            return (
              <div key={m.id}>
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  className="p-4 hover:bg-gray-50"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 min-w-0">
                      <input
                        type="checkbox"
                        checked={selectedSentIds.includes(m.id)}
                        onChange={(e) => {
                          e.stopPropagation();
                          toggleSentSelect(m.id, e.target.checked);
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        className="mt-1 h-4 w-4 text-red-600 rounded border-gray-300 focus:ring-red-500"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-red-600" />
                          <span className="truncate tracking-tight text-lg md:text-xl font-bold text-gray-900">{m?.subject || 'Başlık yok'}</span>
                        </div>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{m?.body || 'İçerik yok'}</p>
                      <div className="flex items-center gap-3 text-xs text-gray-500 mt-2">
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" /> {m.createdAt ? new Date(m.createdAt).toLocaleDateString('tr-TR') : 'Tarih yok'}
                        </span>
                        {m.createdAt && (
                          <span className="inline-flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" /> {new Date(m.createdAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 whitespace-nowrap">{user?.fullName || 'Kullanıcı'}</span>
                      <button
                        onClick={() => openMessageModal(m, 'sent')}
                        className="px-2 py-1 text-xs text-gray-600 hover:text-red-700"
                        title="Detay"
                      >
                        Detay
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          editMessage(m);
                        }}
                        className="px-2 py-1 text-xs text-gray-600 hover:text-red-700" 
                        title="Düzenle"
                      >
                        Düzenle
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClick(m);
                        }}
                        className="px-2 py-1 text-xs text-gray-600 hover:text-red-700" 
                        title="Sil"
                      >
                        Sil
                      </button>
                    </div>
                  </div>
                </motion.div>
                
              </div>
            );
          })
          )}
        </div>
      )}

      {/* Modal for message details */}
      {showModal && modalMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-xl border border-gray-200 shadow-2xl w-full max-w-2xl mx-4">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">{modalMessage.subject}</h3>
              <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
                <span>Gönderen: Yönetim</span>
                <span>Alıcı: {modalMessage.to === 'Yönetim' ? 'Yönetim' : (user?.fullName || 'Kullanıcı')}</span>
                <span>{modalMessage.createdAt ? new Date(modalMessage.createdAt).toLocaleDateString('tr-TR') : 'Tarih yok'}{modalMessage.createdAt ? ` • ${new Date(modalMessage.createdAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}` : ''}</span>
              </div>
            </div>
            <div className="p-6 text-gray-700 whitespace-pre-line">
              {modalMessage.body}
              {modalMessage.attachments && modalMessage.attachments.length > 0 && (
                <div className="mt-4 text-sm text-gray-600">
                  Ekler: {modalMessage.attachments.map(a => a.name).join(', ')}
                </div>
              )}
            </div>
            <div className="p-4 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'compose' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6">Yeni Mesaj</h2>
          <form onSubmit={handleSend} className="space-y-5 max-w-2xl">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Kime</label>
              <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900">
                Yönetim (Admin Paneli)
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Konu</label>
              <input
                value={compose.subject}
                onChange={e => setCompose({ ...compose, subject: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 placeholder-gray-600"
                placeholder="Konu başlığı"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mesaj</label>
              <textarea
                value={compose.body}
                onChange={e => setCompose({ ...compose, body: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 placeholder-gray-600"
                placeholder="Mesajınızı yazın..."
                rows={6}
                required
              />
            </div>
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setCompose({ to: '', subject: '', body: '' })}
                className="px-5 py-3 text-gray-600 hover:text-gray-800"
              >
                Temizle
              </button>
              <motion.button
                type="submit"
                disabled={isSending}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isSending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Gönderiliyor...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" /> Gönder
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && messageToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30" onClick={handleDeleteCancel} />
          <div className="relative bg-white rounded-xl border border-gray-200 shadow-2xl w-full max-w-md mx-4">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Mesajı Sil</h3>
              <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
                <span>Konu: {messageToDelete.subject}</span>
                <span>Alıcı: Yönetim</span>
              </div>
            </div>
            <div className="p-6">
              <div className="p-4 bg-red-50 rounded-lg mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <Trash2 className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{messageToDelete.subject}</h4>
                    <p className="text-sm text-gray-600">Bu mesajı silmek istediğinizden emin misiniz?</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-yellow-800">
                      <strong>Uyarı:</strong> Bu işlem geri alınamaz. Mesaj kalıcı olarak silinecektir.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={handleDeleteCancel}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                İptal
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Evet, Sil
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && messageToEdit && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30" onClick={handleEditCancel} />
          <div className="relative bg-white rounded-xl border border-gray-200 shadow-2xl w-full max-w-2xl mx-4">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Mesajı Düzenle</h3>
              <div className="flex items-center gap-4 text-sm text-gray-700 mt-2">
                <span className="font-medium">Konu: {messageToEdit.subject}</span>
                <span className="font-medium">Alıcı: Yönetim</span>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Konu
                  </label>
                  <input
                    type="text"
                    value={messageToEdit.subject}
                    onChange={(e) => setMessageToEdit({...messageToEdit, subject: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900 font-medium"
                    placeholder="Mesaj konusu"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Mesaj İçeriği
                  </label>
                  <textarea
                    value={messageToEdit.body}
                    onChange={(e) => setMessageToEdit({...messageToEdit, body: e.target.value})}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900 font-medium"
                    placeholder="Mesaj içeriği"
                  />
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={handleEditCancel}
                className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors font-medium"
              >
                İptal
              </button>
              <button
                onClick={handleEditSave}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 font-medium"
              >
                <Save className="w-4 h-4" />
                Güncelle
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
              {successMessage.includes('başarıyla') ? 'Başarılı!' : 'Bilgi'}
            </h3>
            <p className="text-gray-600 text-center mb-6">
              {successMessage}
            </p>
            <div className="flex justify-center">
              <button
                onClick={() => setShowSuccessModal(false)}
                className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Tamam
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagesPage;


