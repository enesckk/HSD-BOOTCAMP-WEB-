'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/dashboard/AdminLayout';
import { 
  Plus, 
  Edit, 
  Trash2, 
  MessageSquare,
  Hash,
  Lock,
  Globe,
  Users,
  Save,
  X,
  Eye,
  Send,
  MoreVertical,
  User
} from 'lucide-react';

interface Channel {
  id: string;
  name: string;
  displayName: string;
  description: string;
  category: string;
  type: string;
  isPrivate: boolean;
  createdAt: string;
  _count?: {
    messages: number;
  };
}

interface ChannelMessage {
  id: string;
  content: string;
  messageType: string;
  createdAt: string;
  user: {
    id: string;
    fullName: string;
    email: string;
  };
}

export default function AdminChannelsPage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingChannel, setEditingChannel] = useState<Channel | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    displayName: '',
    description: '',
    category: 'GENEL',
    type: 'public',
    isPrivate: false
  });
  const [error, setError] = useState('');
  
  // Yeni state'ler
  const [activeTab, setActiveTab] = useState<'management' | 'chat'>('management');
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [messages, setMessages] = useState<ChannelMessage[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    } else if (!isLoading && user?.role !== 'ADMIN') {
      router.push('/dashboard');
    }
  }, [isLoading, isAuthenticated, user, router]);

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      fetchChannels();
    }
  }, [user]);

  const fetchChannels = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/channels');
      const data = await response.json();
      setChannels(data.channels || []);
    } catch (error) {
      console.error('Error fetching channels:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      displayName: '',
      description: '',
      category: 'GENEL',
      type: 'public',
      isPrivate: false
    });
    setError('');
  };

  const openEditModal = (channel: Channel) => {
    setEditingChannel(channel);
    setFormData({
      name: channel.name,
      displayName: channel.displayName,
      description: channel.description,
      category: channel.category,
      type: channel.type,
      isPrivate: channel.isPrivate
    });
    setShowEditModal(true);
  };

  const handleCreateChannel = async () => {
    try {
      setError('');
      const response = await fetch('/api/admin/channels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setShowCreateModal(false);
        resetForm();
        fetchChannels();
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Kanal oluşturulamadı');
      }
    } catch (error) {
      console.error('Error creating channel:', error);
      setError('Bağlantı hatası');
    }
  };

  const handleUpdateChannel = async () => {
    if (!editingChannel) return;

    try {
      setError('');
      const response = await fetch(`/api/admin/channels/${editingChannel.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setShowEditModal(false);
        setEditingChannel(null);
        resetForm();
        fetchChannels();
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Kanal güncellenemedi');
      }
    } catch (error) {
      console.error('Error updating channel:', error);
      setError('Bağlantı hatası');
    }
  };

  const deleteChannel = async (id: string) => {
    if (!confirm('Bu kanalı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz ve kanaldaki tüm mesajlar silinecektir.')) return;

    try {
      setError('');
      console.log('Attempting to delete channel with ID:', id);
      
      const response = await fetch(`/api/admin/channels/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('Delete response status:', response.status);
      const responseData = await response.json();
      console.log('Delete response data:', responseData);

      if (response.ok && responseData.success) {
        console.log('Channel deleted successfully');
        await fetchChannels(); // Kanal listesini yenile
        alert(`Kanal "${responseData.deletedChannel}" başarıyla silindi!`);
      } else {
        console.error('Delete failed:', responseData);
        setError(responseData.error || 'Kanal silinemedi');
        alert('Kanal silinemedi: ' + (responseData.error || 'Bilinmeyen hata'));
      }
    } catch (error) {
      console.error('Error deleting channel:', error);
      setError('Bağlantı hatası: ' + error.message);
      alert('Kanal silinemedi: Bağlantı hatası - ' + error.message);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'GENEL':
        return 'bg-blue-100 text-blue-800';
      case 'BOOTCAMP':
        return 'bg-red-100 text-red-800';
      case 'YONETIM':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Yeni fonksiyonlar
  const fetchChannelMessages = async (channelId: string) => {
    try {
      setMessagesLoading(true);
      const response = await fetch(`/api/chat/channels/${channelId}/messages`);
      const data = await response.json();
      if (data.success) {
        setMessages(data.messages || []);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setMessagesLoading(false);
    }
  };

  const selectChannel = (channel: Channel) => {
    setSelectedChannel(channel);
    setActiveTab('chat');
    fetchChannelMessages(channel.id);
  };

  const sendMessage = async () => {
    if (!selectedChannel || !newMessage.trim()) return;

    try {
      setSendingMessage(true);
      const response = await fetch(`/api/chat/channels/${selectedChannel.id}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user?.id || ''
        },
        body: JSON.stringify({
          content: newMessage,
          messageType: 'text'
        })
      });

      if (response.ok) {
        setNewMessage('');
        fetchChannelMessages(selectedChannel.id);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSendingMessage(false);
    }
  };

  const deleteMessage = async (messageId: string) => {
    if (!confirm('Bu mesajı silmek istediğinizden emin misiniz?')) return;

    try {
      const response = await fetch(`/api/chat/messages/${messageId}`, {
        method: 'DELETE'
      });

      if (response.ok && selectedChannel) {
        fetchChannelMessages(selectedChannel.id);
      }
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!isAuthenticated || user?.role !== 'ADMIN') {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Yetkisiz Erişim</h2>
          <p className="text-gray-600">Bu sayfaya erişim yetkiniz bulunmamaktadır.</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Kanal Yönetimi</h1>
            <p className="text-gray-600 mt-2">Chat kanallarını yönetin ve sohbetleri görüntüleyin</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 flex items-center space-x-2 shadow-lg transition-all duration-200 transform hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            <span>Yeni Kanal</span>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
          <button
            onClick={() => setActiveTab('management')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'management'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Kanal Yönetimi
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'chat'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Kanal Sohbetleri
          </button>
        </div>

        {/* Hata Mesajı */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                <X className="w-3 h-3 text-white" />
              </div>
              <p className="text-sm text-red-800 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Tab Content */}
        {activeTab === 'management' && (
          <>
            {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
          </div>
        ) : channels.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-200">
            <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Kanal Bulunamadı</h3>
            <p className="text-gray-600 mb-6">Henüz hiç kanal oluşturulmamış.</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 flex items-center space-x-2 mx-auto shadow-lg transition-all duration-200 transform hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              <span>İlk Kanalı Oluştur</span>
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {channels.map((channel) => (
              <motion.div
                key={channel.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                        <Hash className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                          <span>#{channel.displayName}</span>
                          {channel.isPrivate ? (
                            <Lock className="w-4 h-4 text-gray-500" />
                          ) : (
                            <Globe className="w-4 h-4 text-gray-500" />
                          )}
                        </h3>
                        <p className="text-sm text-gray-600">{channel.description}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(channel.category)}`}>
                        {channel.category}
                      </span>
                      <span className="flex items-center space-x-1">
                        <MessageSquare className="w-4 h-4" />
                        <span>{channel._count?.messages || 0} mesaj</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{channel.type === 'public' ? 'Herkese Açık' : 'Özel'}</span>
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => selectChannel(channel)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Sohbeti Görüntüle"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openEditModal(channel)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Düzenle"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteChannel(channel.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Sil"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
          </>
        )}

        {/* Chat Tab */}
        {activeTab === 'chat' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Channel List */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Kanallar</h3>
                <div className="space-y-2">
                  {channels.map((channel) => (
                    <button
                      key={channel.id}
                      onClick={() => selectChannel(channel)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        selectedChannel?.id === channel.id
                          ? 'bg-red-50 border border-red-200 text-red-900'
                          : 'hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                          <Hash className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">#{channel.displayName}</p>
                          <p className="text-sm text-gray-500 truncate">{channel.description}</p>
                        </div>
                        <div className="text-xs text-gray-400">
                          {channel._count?.messages || 0}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Chat Area */}
            <div className="lg:col-span-2">
              {selectedChannel ? (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 h-[600px] flex flex-col">
                  {/* Chat Header */}
                  <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                        <Hash className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">#{selectedChannel.displayName}</h3>
                        <p className="text-sm text-gray-500">{selectedChannel.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(selectedChannel.category)}`}>
                        {selectedChannel.category}
                      </span>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messagesLoading ? (
                      <div className="flex items-center justify-center h-32">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600"></div>
                      </div>
                    ) : messages.length === 0 ? (
                      <div className="text-center py-8">
                        <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-500">Henüz mesaj yok</p>
                      </div>
                    ) : (
                      messages.map((message) => (
                        <div key={message.id} className="flex items-start space-x-3 group">
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                            <User className="w-4 h-4 text-gray-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="font-medium text-gray-900 text-sm">{message.user.fullName}</span>
                              <span className="text-xs text-gray-500">
                                {new Date(message.createdAt).toLocaleString('tr-TR')}
                              </span>
                            </div>
                            <p className="text-gray-800 text-sm whitespace-pre-wrap">{message.content}</p>
                          </div>
                          <button
                            onClick={() => deleteMessage(message.id)}
                            className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-600 transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-gray-200">
                    <div className="flex space-x-3">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        placeholder="Mesaj yazın..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        disabled={sendingMessage}
                      />
                      <button
                        onClick={sendMessage}
                        disabled={!newMessage.trim() || sendingMessage}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 h-[600px] flex items-center justify-center">
                  <div className="text-center">
                    <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Kanal Seçin</h3>
                    <p className="text-gray-600">Sohbet görüntülemek için sol taraftan bir kanal seçin</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Create Modal */}
        <AnimatePresence>
          {showCreateModal && (
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
                  <h3 className="text-xl font-bold text-gray-900">Yeni Kanal Oluştur</h3>
                  <button
                    onClick={() => {
                      setShowCreateModal(false);
                      resetForm();
                    }}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="p-6 space-y-6">
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <p className="text-sm text-red-800">{error}</p>
                    </div>
                  )}
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Kanal Adı</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 placeholder-gray-500 bg-white"
                      placeholder="ornek-kanal"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Görünen Ad</label>
                    <input
                      type="text"
                      value={formData.displayName}
                      onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 placeholder-gray-500 bg-white"
                      placeholder="Örnek Kanal"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Açıklama</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 placeholder-gray-500 bg-white"
                      placeholder="Kanal açıklaması"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 bg-white"
                      >
                        <option value="GENEL">Genel</option>
                        <option value="BOOTCAMP">Bootcamp</option>
                        <option value="YONETIM">Yönetim</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Tip</label>
                      <select
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 bg-white"
                      >
                        <option value="public">Herkese Açık</option>
                        <option value="private">Özel</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="isPrivate"
                      checked={formData.isPrivate}
                      onChange={(e) => setFormData({ ...formData, isPrivate: e.target.checked })}
                      className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                    />
                    <label htmlFor="isPrivate" className="text-sm font-medium text-gray-700">
                      Özel Kanal
                    </label>
                  </div>
                </div>
                
                <div className="flex items-center justify-end space-x-4 px-6 py-4 border-t border-gray-200">
                  <button
                    onClick={() => {
                      setShowCreateModal(false);
                      resetForm();
                    }}
                    className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    İptal
                  </button>
                  <button
                    onClick={handleCreateChannel}
                    className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 flex items-center space-x-2 shadow-lg transition-all duration-200 transform hover:scale-105"
                  >
                    <Save className="w-4 h-4" />
                    <span>Oluştur</span>
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Edit Modal */}
        <AnimatePresence>
          {showEditModal && editingChannel && (
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
                  <h3 className="text-xl font-bold text-gray-900">Kanalı Düzenle</h3>
                  <button
                    onClick={() => {
                      setShowEditModal(false);
                      setEditingChannel(null);
                      resetForm();
                    }}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="p-6 space-y-6">
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <p className="text-sm text-red-800">{error}</p>
                    </div>
                  )}
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Kanal Adı</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 placeholder-gray-500 bg-white"
                      placeholder="ornek-kanal"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Görünen Ad</label>
                    <input
                      type="text"
                      value={formData.displayName}
                      onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 placeholder-gray-500 bg-white"
                      placeholder="Örnek Kanal"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Açıklama</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 placeholder-gray-500 bg-white"
                      placeholder="Kanal açıklaması"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 bg-white"
                      >
                        <option value="GENEL">Genel</option>
                        <option value="BOOTCAMP">Bootcamp</option>
                        <option value="YONETIM">Yönetim</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Tip</label>
                      <select
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 bg-white"
                      >
                        <option value="public">Herkese Açık</option>
                        <option value="private">Özel</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="isPrivateEdit"
                      checked={formData.isPrivate}
                      onChange={(e) => setFormData({ ...formData, isPrivate: e.target.checked })}
                      className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                    />
                    <label htmlFor="isPrivateEdit" className="text-sm font-medium text-gray-700">
                      Özel Kanal
                    </label>
                  </div>
                </div>
                
                <div className="flex items-center justify-end space-x-4 px-6 py-4 border-t border-gray-200">
                  <button
                    onClick={() => {
                      setShowEditModal(false);
                      setEditingChannel(null);
                      resetForm();
                    }}
                    className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    İptal
                  </button>
                  <button
                    onClick={handleUpdateChannel}
                    className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 flex items-center space-x-2 shadow-lg transition-all duration-200 transform hover:scale-105"
                  >
                    <Save className="w-4 h-4" />
                    <span>Güncelle</span>
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