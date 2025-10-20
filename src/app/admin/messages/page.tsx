'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/dashboard/AdminLayout';
import { 
  Send, 
  Users, 
  User, 
  Plus, 
  Inbox, 
  Mail,
  Trash2,
  Edit,
  Save,
  X,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

interface User {
  id: string;
  fullName: string;
  email: string;
  role: string;
}

interface Message {
  id: string;
  subject: string;
  body: string;
  fromUser?: User;
  toUser?: User;
  toRole?: string;
  unread: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AdminMessagesPage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'inbox' | 'sent' | 'compose'>('inbox');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editSubject, setEditSubject] = useState('');
  const [editBody, setEditBody] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState({ type: '', message: '', isSuccess: true });

  // Compose form states
  const [recipientType, setRecipientType] = useState<'user' | 'all'>('user');
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !user || user.role !== 'ADMIN')) {
      router.push('/login');
      return;
    }
  }, [isLoading, isAuthenticated, user, router]);

  useEffect(() => {
    fetchUsers();
    fetchMessages();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      const data = await response.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchMessages = async () => {
    try {
      const box = activeTab === 'sent' ? 'sent' : 'inbox';
      const response = await fetch(`/api/messages?box=${box}`);
      const data = await response.json();
      setMessages(data.messages || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab !== 'compose') {
      fetchMessages();
    }
  }, [activeTab]);

  const showAlertMessage = (type: string, message: string, isSuccess: boolean = true) => {
    setAlertMessage({ type, message, isSuccess });
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const markAsRead = async (messageId: string) => {
    try {
      const response = await fetch(`/api/messages/${messageId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ unread: false })
      });

      if (response.ok) {
        setMessages(prev => prev.map(msg => 
          msg.id === messageId ? { ...msg, unread: false } : msg
        ));
      }
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const deleteMessage = async (messageId: string) => {
    if (!confirm('Bu mesajı silmek istediğinizden emin misiniz?')) return;

    try {
      const response = await fetch(`/api/messages/${messageId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setMessages(prev => prev.filter(m => m.id !== messageId));
        setShowMessageModal(false);
        setSelectedMessage(null);
        showAlertMessage('Başarılı', 'Mesaj silindi', true);
      } else {
        showAlertMessage('Hata', 'Mesaj silinirken hata oluştu', false);
      }
    } catch (error) {
      console.error('Error deleting message:', error);
      showAlertMessage('Hata', 'Mesaj silinirken hata oluştu', false);
    }
  };

  const updateMessage = async () => {
    if (!editSubject.trim() || !editBody.trim()) {
      showAlertMessage('Uyarı', 'Konu ve içerik boş olamaz', false);
      return;
    }

    try {
      const response = await fetch(`/api/messages/${selectedMessage?.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: editSubject,
          body: editBody
        })
      });

      if (response.ok) {
        setMessages(prev => prev.map(m => 
          m.id === selectedMessage?.id 
            ? { ...m, subject: editSubject, body: editBody }
            : m
        ));
        setSelectedMessage(prev => 
          prev ? { ...prev, subject: editSubject, body: editBody } : null
        );
        setIsEditing(false);
        showAlertMessage('Başarılı', 'Mesaj güncellendi', true);
      } else {
        showAlertMessage('Hata', 'Mesaj güncellenirken hata oluştu', false);
      }
    } catch (error) {
      console.error('Error updating message:', error);
      showAlertMessage('Hata', 'Mesaj güncellenirken hata oluştu', false);
    }
  };

  const startEditing = () => {
    setEditSubject(selectedMessage?.subject || '');
    setEditBody(selectedMessage?.body || '');
    setIsEditing(true);
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !body.trim()) return;

    setSubmitting(true);
    try {
      const payload: any = { subject, body };
      
      if (recipientType === 'user') {
        payload.userIds = selectedUserIds;
      } else {
        payload.toRole = 'participant';
      }

      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setSubject('');
        setBody('');
        setSelectedUserIds([]);
        showAlertMessage('Başarılı', 'Mesaj gönderildi', true);
      } else {
        showAlertMessage('Hata', 'Mesaj gönderilirken hata oluştu', false);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      showAlertMessage('Hata', 'Mesaj gönderilirken hata oluştu', false);
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user || user.role !== 'ADMIN') {
    return <div></div>;
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-8 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Mesaj Yönetimi</h1>
              <p className="text-red-100 text-lg">Katılımcılara mesaj gönderin ve mesajları yönetin</p>
            </div>
            <button
              onClick={() => setActiveTab('compose')}
              className="bg-white text-red-600 px-6 py-3 rounded-xl font-semibold hover:bg-red-50 transition-colors flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Yeni Mesaj</span>
            </button>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100"
        >
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('inbox')}
              className={`px-6 py-4 text-sm font-semibold flex items-center gap-2 transition-colors ${
                activeTab === 'inbox' 
                  ? 'text-red-600 border-b-2 border-red-600' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Inbox className="w-4 h-4" />
              Gelen Mesajlar
            </button>
            <button
              onClick={() => setActiveTab('sent')}
              className={`px-6 py-4 text-sm font-semibold flex items-center gap-2 transition-colors ${
                activeTab === 'sent' 
                  ? 'text-red-600 border-b-2 border-red-600' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Send className="w-4 h-4" />
              Gönderilen Mesajlar
            </button>
            <button
              onClick={() => setActiveTab('compose')}
              className={`px-6 py-4 text-sm font-semibold flex items-center gap-2 transition-colors ${
                activeTab === 'compose' 
                  ? 'text-red-600 border-b-2 border-red-600' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Plus className="w-4 h-4" />
              Yeni Mesaj
            </button>
          </div>
        </motion.div>

        {/* Compose Form */}
        {activeTab === 'compose' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
          >
            <form onSubmit={sendMessage} className="space-y-6">
              {/* Recipient Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="recipientType"
                    checked={recipientType === 'user'}
                    onChange={() => setRecipientType('user')}
                    className="text-red-600 focus:ring-red-500"
                  />
                  <User className="w-5 h-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-900">Seçili Kullanıcılar</span>
                </label>
                <label className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="recipientType"
                    checked={recipientType === 'all'}
                    onChange={() => setRecipientType('all')}
                    className="text-red-600 focus:ring-red-500"
                  />
                  <Users className="w-5 h-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-900">Tüm Katılımcılar</span>
                </label>
              </div>

              {/* User Selection */}
              {recipientType === 'user' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Kullanıcı Seç</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto border border-gray-200 rounded-lg p-4">
                    {users.map((user) => (
                      <label key={user.id} className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={selectedUserIds.includes(user.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedUserIds([...selectedUserIds, user.id]);
                            } else {
                              setSelectedUserIds(selectedUserIds.filter(id => id !== user.id));
                            }
                          }}
                          className="text-red-600 focus:ring-red-500"
                        />
                        <span className="text-sm text-gray-900">{user.fullName} - {user.email}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Konu</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Mesaj konusu"
                  required
                />
              </div>

              {/* Body */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mesaj</label>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Mesaj içeriği"
                  required
                />
              </div>

              {/* Submit */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50 flex items-center space-x-2"
                >
                  {submitting ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  <span>Gönder</span>
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Messages List */}
        {activeTab !== 'compose' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100"
          >
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
              </div>
            ) : messages.length === 0 ? (
              <div className="p-12 text-center">
                <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Henüz Mesaj Yok</h3>
                <p className="text-gray-600">Henüz mesaj bulunmuyor.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className="p-6 hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => {
                      setSelectedMessage(message);
                      setShowMessageModal(true);
                      if (activeTab === 'inbox' && message.unread) {
                        markAsRead(message.id);
                      }
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          {message.unread && activeTab === 'inbox' && (
                            <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                          )}
                          <h3 className="font-semibold text-gray-900">{message.subject}</h3>
                          {message.unread && activeTab === 'inbox' && (
                            <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">Yeni</span>
                          )}
                        </div>
                        <p className="text-gray-600 text-sm line-clamp-2">{message.body}</p>
                        <div className="flex items-center space-x-4 mt-3 text-xs text-gray-500">
                          <span>{new Date(message.createdAt).toLocaleString('tr-TR')}</span>
                          {activeTab === 'sent' && (
                            <span>
                              Alıcı: {message.toUser ? message.toUser.fullName : 'Tüm Katılımcılar'}
                            </span>
                          )}
                          {activeTab === 'inbox' && (
                            <span>
                              Gönderen: {message.fromUser?.fullName || 'Sistem'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Message Detail Modal */}
        <AnimatePresence>
          {showMessageModal && selectedMessage && (
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
                className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                  <h3 className="text-xl font-bold text-gray-900">Mesaj Detayları</h3>
                  <button
                    onClick={() => {
                      setShowMessageModal(false);
                      setSelectedMessage(null);
                      setIsEditing(false);
                    }}
                    className="p-2 rounded-lg hover:bg-gray-100"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
                
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Konu</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editSubject}
                        onChange={(e) => setEditSubject(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      />
                    ) : (
                      <p className="text-gray-900 font-semibold">{selectedMessage.subject}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">İçerik</label>
                    {isEditing ? (
                      <textarea
                        value={editBody}
                        onChange={(e) => setEditBody(e.target.value)}
                        rows={6}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
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
                      <p className="text-gray-900">{new Date(selectedMessage.createdAt).toLocaleString('tr-TR')}</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Alıcı</label>
                    <p className="text-gray-900">
                      {selectedMessage.toUser ? 
                        `${selectedMessage.toUser.fullName} (${selectedMessage.toUser.email})` :
                        selectedMessage.toRole === 'participant' ? 'Tüm Katılımcılar' : 
                        'Belirtilmemiş'
                      }
                    </p>
                  </div>

                  {selectedMessage.unread && activeTab === 'inbox' && (
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                      <span className="text-sm text-red-600 font-medium">Okunmamış</span>
                    </div>
                  )}
                </div>
                
                <div className="px-6 py-4 border-t border-gray-200 flex justify-between">
                  <div className="flex space-x-2">
                    {activeTab === 'sent' && !isEditing && (
                      <>
                        <button
                          onClick={startEditing}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center space-x-2"
                        >
                          <Edit className="w-4 h-4" />
                          <span>Düzenle</span>
                        </button>
                        <button
                          onClick={() => deleteMessage(selectedMessage.id)}
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium flex items-center space-x-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Sil</span>
                        </button>
                      </>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    {isEditing ? (
                      <>
                        <button
                          onClick={() => setIsEditing(false)}
                          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium"
                        >
                          İptal
                        </button>
                        <button
                          onClick={updateMessage}
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium flex items-center space-x-2"
                        >
                          <Save className="w-4 h-4" />
                          <span>Kaydet</span>
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => {
                          setShowMessageModal(false);
                          setSelectedMessage(null);
                        }}
                        className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium"
                      >
                        Kapat
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Alert */}
        <AnimatePresence>
          {showAlert && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed top-4 right-4 z-50"
            >
              <div className={`bg-white rounded-lg shadow-lg border-l-4 p-4 ${
                alertMessage.isSuccess ? 'border-green-500' : 'border-red-500'
              }`}>
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    alertMessage.isSuccess ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {alertMessage.isSuccess ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-600" />
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
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AdminLayout>
  );
}