'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/dashboard/AdminLayout';
import { Hash, MessageSquare, Users, Trash2, Eye, Search, Filter, MoreVertical } from 'lucide-react';

export default function AdminChannelsPage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [channels, setChannels] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !user || user.role !== 'ADMIN')) {
      router.push('/login');
      return;
    }
  }, [isLoading, isAuthenticated, user, router]);

  useEffect(() => {
    fetchChannels();
  }, []);

  const fetchChannels = async () => {
    try {
      const response = await fetch('/api/channels');
      const data = await response.json();
      setChannels(data.channels || []);
    } catch (error) {
      console.error('Error fetching channels:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchChannelMessages = async (channelId) => {
    try {
      const response = await fetch(`/api/admin/channels?channelId=${channelId}`);
      const data = await response.json();
      setMessages(data.messages || []);
    } catch (error) {
      console.error('Error fetching channel messages:', error);
    }
  };

  const deleteMessage = async (messageId) => {
    try {
      const response = await fetch('/api/admin/channels', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messageId })
      });

      if (response.ok) {
        setMessages(messages.filter(msg => msg.id !== messageId));
      }
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const sendReply = async (messageId: string, content: string) => {
    if (!content.trim()) return;
    try {
      await fetch('/api/admin/channel-replies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messageId, content, adminId: user?.id })
      });
      if (selectedChannel?.id) {
        await fetchChannelMessages(selectedChannel.id);
      }
    } catch (error) {
      console.error('Error sending reply:', error);
    }
  };

  const filteredChannels = channels.filter(channel =>
    channel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    channel.displayName.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <div className="flex items-center space-x-4 mb-4">
            <Hash className="w-12 h-12" />
            <div>
              <h1 className="text-4xl font-bold">Kanal Yönetimi</h1>
              <p className="text-red-100 text-lg mt-1">Sohbet kanallarını ve mesajları yönetin</p>
            </div>
          </div>
          <p className="text-red-200 mt-4">
            Katılımcıların sohbet kanallarındaki mesajlarını takip edin ve gerekirse müdahale edin.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Kanallar Listesi */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Kanallar</h2>
                <div className="flex items-center space-x-2">
                  <Search className="w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Kanal ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="text-sm border border-gray-200 rounded-lg px-3 py-1 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="space-y-3">
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
                  </div>
                ) : filteredChannels.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    Kanal bulunamadı
                  </div>
                ) : (
                  filteredChannels.map((channel, index) => (
                    <motion.div
                      key={channel.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                      className={`p-4 rounded-xl border cursor-pointer transition-all duration-300 ${
                        selectedChannel?.id === channel.id
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                      }`}
                      onClick={() => {
                        setSelectedChannel(channel);
                        fetchChannelMessages(channel.id);
                      }}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center text-white">
                          <Hash className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{channel.displayName}</h3>
                          <p className="text-gray-600 text-sm">{channel.description}</p>
                          <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                            <span className="flex items-center space-x-1">
                              <MessageSquare className="w-3 h-3" />
                              <span>{channel.messages?.length || 0} mesaj</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Users className="w-3 h-3" />
                              <span>Aktif</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          </div>

          {/* Mesajlar */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
            >
              {selectedChannel ? (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center text-white">
                        <Hash className="w-5 h-5" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">{selectedChannel.displayName}</h2>
                        <p className="text-gray-600 text-sm">{selectedChannel.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">{messages.length} mesaj</span>
                    </div>
                  </div>

                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {messages.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        Bu kanalda henüz mesaj yok
                      </div>
                    ) : (
                      messages.map((message, index) => (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                            {message.user?.fullName?.charAt(0) || 'U'}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <span className="font-semibold text-gray-900">
                                  {message.user?.role === 'ADMIN' ? 'Eğitmen' : message.user?.fullName || 'Kullanıcı'}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {new Date(message.createdAt).toLocaleString('tr-TR')}
                                </span>
                              </div>
                              <button
                                onClick={() => deleteMessage(message.id)}
                                className="text-red-600 hover:text-red-800 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                            <p className="text-gray-700 mt-1">{message.content}</p>
                            {message.messageType === 'question' && (
                              <div className="mt-2 space-y-2">
                                <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                                  ❓ Soru
                                </span>
                                <div className="flex items-center gap-2">
                                  <input
                                    type="text"
                                    placeholder="Cevabınızı yazın ve Enter'a basın"
                                    onKeyDown={async (e) => {
                                      if (e.key === 'Enter') {
                                        const value = (e.target as HTMLInputElement).value;
                                        await sendReply(message.id, value);
                                        (e.target as HTMLInputElement).value = '';
                                      }
                                    }}
                                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <Hash className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Kanal Seçin</h3>
                  <p className="text-gray-600">Mesajları görüntülemek için sol taraftan bir kanal seçin.</p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
