'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Users, Hash, Send, HelpCircle, Lock, Globe, User, Mail } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const ChannelsPage = () => {
  const { user } = useAuth();
  const [channels, setChannels] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Eğitmene Sor için state'ler
  const [askInstructorMessage, setAskInstructorMessage] = useState('');
  const [askInstructorTags, setAskInstructorTags] = useState('');
  const [isAskingInstructor, setIsAskingInstructor] = useState(false);
  const [privateMessages, setPrivateMessages] = useState([]);

  useEffect(() => {
    fetchChannels();
    fetchPrivateMessages();
  }, []);

  useEffect(() => {
    if (selectedChannel) {
      fetchMessages(selectedChannel.id);
    }
  }, [selectedChannel]);

  const fetchChannels = async () => {
    try {
      const response = await fetch('/api/chat/channels', {
        headers: {
          'x-user-id': user?.id || ''
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setChannels(data.channels || []);
        if (data.channels.length > 0) {
          setSelectedChannel(data.channels[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching channels:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (channelId) => {
    try {
      const response = await fetch(`/api/chat/channels/${channelId}/messages`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const fetchPrivateMessages = async () => {
    try {
      const response = await fetch('/api/private-messages');
      if (response.ok) {
        const data = await response.json();
        setPrivateMessages(data.messages || []);
      }
    } catch (error) {
      console.error('Error fetching private messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedChannel || !user) return;

    try {
      const response = await fetch(`/api/chat/channels/${selectedChannel.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: newMessage,
          messageType: 'text',
          userId: user.id
        })
      });

      if (response.ok) {
        setNewMessage('');
        fetchMessages(selectedChannel.id);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const askInstructor = async () => {
    if (!askInstructorMessage.trim() || isAskingInstructor || !user) return;

    setIsAskingInstructor(true);
    try {
      const response = await fetch('/api/private-messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user.id
        },
        body: JSON.stringify({
          content: askInstructorMessage,
          tags: askInstructorTags,
          toRole: 'ADMIN'
        }),
      });

      const data = await response.json();
      if (data.success) {
        setAskInstructorMessage('');
        setAskInstructorTags('');
        alert('Sorunuz admin\'e özel mesaj olarak iletildi!');
        fetchPrivateMessages();
      } else {
        alert('Soru gönderilemedi: ' + data.error);
      }
    } catch (error) {
      console.error('Error asking instructor:', error);
      alert('Soru gönderilemedi: ' + error);
    } finally {
      setIsAskingInstructor(false);
    }
  };

  const getChannelColor = (category) => {
    switch (category) {
      case 'GENEL': return 'bg-blue-500';
      case 'BOOTCAMP': return 'bg-red-500';
      case 'YONETIM': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-8rem)]">
          
          {/* Sol Sidebar - Kanallar */}
          <div className="lg:col-span-1 bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Kanallar</h2>
              <p className="text-sm text-gray-600">Sohbete katılın</p>
            </div>
            
            <div className="overflow-y-auto h-[calc(100%-120px)]">
              {channels.map((channel) => (
                <motion.div
                  key={channel.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedChannel(channel)}
                  className={`p-4 cursor-pointer border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                    selectedChannel?.id === channel.id ? 'bg-red-50 border-red-200' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getChannelColor(channel.category)}`}>
                      <Hash className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">
                        #{channel.displayName}
                      </h3>
                      <p className="text-sm text-gray-600 truncate">
                        {channel.description}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          {channel.category}
                        </span>
                        {channel.isPrivate && (
                          <Lock className="w-3 h-3 text-gray-500" />
                        )}
                        <span className="text-xs text-gray-500">
                          {channel.messageCount} mesaj
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Ana İçerik Alanı */}
          <div className="lg:col-span-3 bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden flex flex-col">
            
            {/* Eğitmene Sor - Sadece Katılımcılar için */}
            {user?.role === 'PARTICIPANT' && (
              <div className="bg-red-50 border-b border-red-200 p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center">
                    <HelpCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-red-900">Eğitmene Sor</h3>
                    <p className="text-sm text-red-700">Özel sorularınızı admin'e iletebilirsiniz</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sorunuz
                    </label>
                    <textarea
                      value={askInstructorMessage}
                      onChange={(e) => setAskInstructorMessage(e.target.value)}
                      placeholder="Sorunuzu buraya yazın..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900 placeholder-gray-500 bg-white resize-none"
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Etiketler (opsiyonel)
                    </label>
                    <input
                      type="text"
                      value={askInstructorTags}
                      onChange={(e) => setAskInstructorTags(e.target.value)}
                      placeholder="Örn: kubernetes, docker, huawei-cloud"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900 placeholder-gray-500 bg-white"
                    />
                  </div>
                  <button
                    onClick={askInstructor}
                    disabled={!askInstructorMessage.trim() || isAskingInstructor}
                    className="w-full px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {isAskingInstructor ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      <HelpCircle className="w-5 h-5" />
                    )}
                    <span className="font-semibold">
                      {isAskingInstructor ? 'Gönderiliyor...' : 'Soruyu Gönder'}
                    </span>
                  </button>
                </div>
              </div>
            )}

            {/* Admin/Eğitmen için Özel Mesaj Görüntüleme */}
            {(user?.role === 'ADMIN' || user?.role === 'INSTRUCTOR') && (
              <div className="bg-blue-50 border-b border-blue-200 p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-blue-900">Gelen Özel Mesajlar</h3>
                    <p className="text-sm text-blue-700">{privateMessages.length} yeni mesaj</p>
                  </div>
                </div>
                
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {privateMessages.length > 0 ? (
                    privateMessages.map((message, index) => (
                      <div key={index} className="bg-white rounded-lg p-4 border border-blue-200">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-sm font-medium text-blue-900">
                            {message.fromUser?.fullName || 'Bilinmeyen Kullanıcı'}
                          </span>
                          <span className="text-xs text-blue-600">
                            {new Date(message.createdAt).toLocaleString('tr-TR')}
                          </span>
                        </div>
                        <p className="text-sm text-blue-800 mb-2">{message.body}</p>
                        {message.subject && (
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {message.subject}
                          </span>
                        )}
                        <div className="mt-3 flex space-x-2">
                          <button className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
                            Cevapla
                          </button>
                          <button className="text-xs bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700">
                            Detay
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-gray-500 py-4">
                      <MessageSquare className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <p>Henüz özel mesaj yok</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Kanal Mesajları */}
            {selectedChannel ? (
              <>
                {/* Kanal Header */}
                <div className="p-6 border-b border-gray-200 bg-gray-50">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getChannelColor(selectedChannel.category)}`}>
                      <Hash className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">
                        #{selectedChannel.displayName}
                      </h2>
                      <p className="text-sm text-gray-600">{selectedChannel.description}</p>
                    </div>
                  </div>
                </div>

                {/* Mesajlar */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {messages.length > 0 ? (
                    messages.map((message, index) => (
                      <div key={index} className="flex space-x-3">
                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-semibold text-gray-900">
                              {message.user?.fullName || 'Bilinmeyen'}
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date(message.createdAt).toLocaleString('tr-TR')}
                            </span>
                          </div>
                          <p className="text-gray-800">{message.content}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Henüz mesaj yok</h3>
                      <p className="text-gray-600">İlk mesajı siz gönderin!</p>
                    </div>
                  )}
                </div>

                {/* Mesaj Gönderme */}
                <div className="p-6 border-t border-gray-200 bg-gray-50">
                  <div className="flex space-x-4">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      placeholder="Mesajınızı yazın..."
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900 placeholder-gray-500 bg-white"
                    />
                    <button
                      onClick={sendMessage}
                      disabled={!newMessage.trim()}
                      className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                      <Send className="w-5 h-5" />
                      <span>Gönder</span>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Bir kanal seçin</h3>
                  <p className="text-gray-600">Sohbete başlamak için sol menüden bir kanal seçin</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChannelsPage;