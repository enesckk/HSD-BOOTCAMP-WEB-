'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Users, Hash, ExternalLink, Send, Plus, Search, Bell, User, Mail, HelpCircle, BookOpen, Send as SendIcon } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const ChannelsPage = () => {
  const { user } = useAuth();
  const [activeChannel, setActiveChannel] = useState('genel');
  const [message, setMessage] = useState('');
  const [question, setQuestion] = useState('');
  const [channels, setChannels] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Channel renkleri
  const getChannelColor = (channelName) => {
    const colors = {
      'genel': 'bg-gray-600',
      'kubernetes': 'bg-blue-600',
      'linkedin': 'bg-blue-500',
      'github': 'bg-gray-800',
      'yardim': 'bg-orange-600',
      'duyurular': 'bg-red-600'
    };
    return colors[channelName] || 'bg-gray-600';
  };

  const communityRules = [
    'Saygılı ve yapıcı iletişim kurun',
    'Spam ve gereksiz mesajlardan kaçının',
    'Teknik sorularınızı ilgili kanallarda sorun',
    'Kişisel bilgilerinizi paylaşmayın',
    'Eğitmenlerin talimatlarına uyun'
  ];


  // API fonksiyonları
  const fetchChannels = async () => {
    try {
      const response = await fetch('/api/channels');
      const data = await response.json();
      setChannels(data.channels || []);
    } catch (error) {
      console.error('Error fetching channels:', error);
    }
  };

  const fetchMessages = async (channelName) => {
    try {
      const channel = channels.find(c => c.name === channelName);
      if (!channel) return;

      const response = await fetch(`/api/channels/${channel.id}/messages`);
      const data = await response.json();
      setMessages(data.messages || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!message.trim() || !user) return;

    try {
      const channel = channels.find(c => c.name === activeChannel);
      if (!channel) return;

      const response = await fetch(`/api/channels/${channel.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: message,
          messageType: 'text',
          userId: user.id
        })
      });

      if (response.ok) {
        setMessage('');
        fetchMessages(activeChannel); // Mesajları yenile
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const sendQuestion = async () => {
    if (!question.trim() || !user) return;

    try {
      // Genel kanala soru gönder
      const generalChannel = channels.find(c => c.name === 'genel');
      if (!generalChannel) return;

      const response = await fetch(`/api/channels/${generalChannel.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: `❓ Soru: ${question}`,
          messageType: 'question',
          userId: user.id
        })
      });

      if (response.ok) {
        setQuestion('');
        fetchMessages('genel'); // Genel kanal mesajlarını yenile
      }
    } catch (error) {
      console.error('Error sending question:', error);
    }
  };

  // Component mount
  useEffect(() => {
    fetchChannels();
  }, []);

  // Active channel değiştiğinde mesajları getir
  useEffect(() => {
    if (channels.length > 0) {
      fetchMessages(activeChannel);
      setLoading(false);
    }
  }, [activeChannel, channels]);

  const handleSendMessage = () => {
    sendMessage();
  };

  const handleSendQuestion = () => {
    sendQuestion();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-8 text-white"
      >
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <MessageSquare className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Kanallar</h1>
            <p className="text-red-100">Topluluk ile iletişim kurun ve sorularınızı sorun</p>
          </div>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Sol Panel - Sohbet Kanalları */}
        <div className="lg:col-span-2 space-y-6">
          {/* Sohbet Kanalları */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6">Sohbet Kanalları</h2>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              {channels.map((channel, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className={`p-4 border rounded-xl cursor-pointer transition-all duration-300 ${
                    activeChannel === channel.name
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                  }`}
                  onClick={() => setActiveChannel(channel.name)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className={`w-6 h-6 ${getChannelColor(channel.name)} rounded flex items-center justify-center text-white`}>
                        <Hash className="w-4 h-4" />
                      </div>
                      <span className="font-semibold text-gray-900">{channel.displayName}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Users className="w-4 h-4" />
                      <span>Online</span>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">{channel.description}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Aktif</span>
                    <span>{channel.messages?.length || 0} mesaj</span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Aktif Kanal Sohbet */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center space-x-2 mb-4">
                <div className={`w-6 h-6 ${getChannelColor(activeChannel)} rounded flex items-center justify-center text-white`}>
                  <Hash className="w-4 h-4" />
                </div>
                <span className="font-semibold text-gray-900">
                  #{activeChannel}
                </span>
                <span className="text-sm text-gray-500">
                  Aktif kanal
                </span>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-4 h-48 overflow-y-auto">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                  </div>
                ) : messages.length > 0 ? (
                  <div className="space-y-3">
                    {messages.slice().reverse().map((msg, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                          {msg.user?.fullName?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold text-gray-900">
                              {msg.user?.role === 'ADMIN' ? 'Eğitmen' : msg.user?.fullName || 'Kullanıcı'}
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date(msg.createdAt).toLocaleTimeString('tr-TR', { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </span>
                          </div>
                          <p className="text-gray-700">{msg.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <p>Henüz mesaj yok. İlk mesajı siz gönderin!</p>
                  </div>
                )}
              </div>

              <div className="flex space-x-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={`#${activeChannel} kanalına mesaj yazın...`}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button
                  onClick={handleSendMessage}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-300"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Sağ Panel - Soru Sorma ve Kurallar */}
        <div className="space-y-6">
          {/* Genel Soru Sorma */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6">Eğitmenlere Soru Sor</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sorunuzu yazın
                </label>
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Teknik sorularınızı, yardım ihtiyaçlarınızı veya önerilerinizi buraya yazabilirsiniz. Eğitmenlerimiz genel havuzdan sorularınızı görüp cevaplayacaklar."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none text-gray-900 placeholder-gray-500"
                  rows={4}
                />
              </div>
              <button
                onClick={handleSendQuestion}
                className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors duration-300 flex items-center justify-center space-x-2"
              >
                <SendIcon className="w-4 h-4" />
                <span>Soruyu Gönder</span>
              </button>
            </div>
          </motion.div>

          {/* Topluluk Kuralları */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6">Topluluk Kuralları</h2>
            <div className="space-y-3">
              {communityRules.map((rule, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-start space-x-3"
                >
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 text-sm">{rule}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default ChannelsPage;