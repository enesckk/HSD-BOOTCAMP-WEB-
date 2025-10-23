'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { 
  MessageSquare, 
  Hash, 
  Users, 
  Send, 
  Pin, 
  MoreVertical,
  Tag,
  Reply,
  Trash2,
  VolumeX,
  Volume2,
  Search,
  Settings,
  Plus,
  Lock,
  Globe,
  Github,
  Linkedin,
  BookOpen,
  HelpCircle,
  Megaphone,
  Crown,
  ArrowLeft
} from 'lucide-react';

interface Channel {
  id: string;
  name: string;
  displayName: string;
  description: string;
  category: string;
  isPrivate: boolean;
  messageCount?: number;
  lastMessage?: {
    content: string;
    user: string;
    time: string;
  };
}

interface Message {
  id: string;
  content: string;
  messageType: string;
  parentId?: string;
  isAnswered: boolean;
  isPinned: boolean;
  isDeleted: boolean;
  tags?: string;
  linkPreview?: string;
  createdAt: string;
  user: {
    id: string;
    fullName: string;
    role: string;
  };
  replies?: Message[];
}

const ChatPage = () => {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [channels, setChannels] = useState<Channel[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  const [tags, setTags] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [isAskingInstructor, setIsAskingInstructor] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAnnouncement, setIsAnnouncement] = useState(false);
  const [askInstructorMessage, setAskInstructorMessage] = useState('');
  const [showMentions, setShowMentions] = useState(false);
  const [mentionQuery, setMentionQuery] = useState('');
  const [mentionPosition, setMentionPosition] = useState(0);
  const [askInstructorTags, setAskInstructorTags] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }
    
    if (isAuthenticated) {
      fetchChannels();
    }
  }, [user, isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (selectedChannel) {
      fetchMessages(selectedChannel.id);
      // Kanal değiştiğinde mesaj alanını temizle
      setNewMessage('');
      setTags('');
      setReplyTo(null);
      setIsAnnouncement(false);
    }
  }, [selectedChannel]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchChannels = async () => {
    try {
      console.log('Fetching channels for user:', user?.id);
      const response = await fetch('/api/chat/channels', {
        headers: {
          'x-user-id': user?.id || ''
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Channels API response:', data);
      
      if (data.success) {
        setChannels(data.channels);
        if (data.channels.length > 0) {
          setSelectedChannel(data.channels[0]);
        }
        console.log(`${data.channels.length} kanal yüklendi`);
      } else {
        console.error('API returned error:', data.error);
        throw new Error(data.error || 'Kanallar getirilemedi');
      }
    } catch (error) {
      console.error('Error fetching channels:', error);
      // Hata durumunda boş array set et
      setChannels([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMessages = async (channelId: string) => {
    try {
      const response = await fetch(`/api/chat/channels/${channelId}/messages`);
      const data = await response.json();
      if (data.success) {
        setMessages(data.messages);
        console.log(`Kanal ${channelId} için ${data.messages.length} mesaj yüklendi`);
        
        // Mesajları okundu olarak işaretle
        markChannelAsRead(channelId);
      } else {
        console.error('Error fetching messages:', data.error);
        // Hata durumunda boş array set et
        setMessages([]);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      // Hata durumunda boş array set et
      setMessages([]);
    }
  };

  const markChannelAsRead = async (channelId: string) => {
    if (!user?.id) return;
    
    try {
      await fetch(`/api/chat/channels/${channelId}/mark-read`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user.id
        }
      });
      
      // Kanal okundu işaretlendikten sonra kanalları yeniden yükle
      fetchChannels();
    } catch (error) {
      console.error('Error marking channel as read:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedChannel || isSendingMessage) return;

    // Duyuru kontrolü - sadece admin duyuru gönderebilir
    if (isAnnouncement && user?.role !== 'ADMIN') {
      alert('Yalnızca yöneticiler duyuru gönderebilir.');
      return;
    }

    console.log('Send message debug:', {
      user: user,
      selectedChannel: selectedChannel,
      newMessage: newMessage
    });

    if (!user?.id) {
      alert('Kullanıcı bilgisi bulunamadı. Lütfen tekrar giriş yapın.');
      return;
    }

    setIsSendingMessage(true);
    try {
      const response = await fetch(`/api/chat/channels/${selectedChannel.id}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user.id
        },
        body: JSON.stringify({
          content: newMessage,
          messageType: 'text',
          parentId: replyTo?.id,
          tags: tags,
          isAnnouncement: isAnnouncement && user?.role === 'ADMIN', // Sadece admin için duyuru
        }),
      });

      const data = await response.json();
      if (data.success) {
        setNewMessage('');
        setTags('');
        setReplyTo(null);
        setIsAnnouncement(false);
        fetchMessages(selectedChannel.id);
        // Başarı mesajı göster
        console.log('Mesaj başarıyla gönderildi');
      } else {
        console.error('Mesaj gönderme hatası:', data.error);
        alert('Mesaj gönderilemedi: ' + data.error);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Mesaj gönderilemedi: ' + error);
    } finally {
      setIsSendingMessage(false);
    }
  };

  const pinMessage = async (messageId: string) => {
    if (!user?.id) {
      alert('Kullanıcı bilgisi bulunamadı.');
      return;
    }

    try {
      const response = await fetch(`/api/chat/messages/${messageId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user.id
        },
        body: JSON.stringify({
          action: 'pin'
        }),
      });

      const data = await response.json();
      if (data.success) {
        fetchMessages(selectedChannel!.id);
        console.log('Mesaj başarıyla sabitlendi');
      } else {
        console.error('Mesaj sabitleme hatası:', data.error);
        alert('Mesaj sabitlenemedi: ' + data.error);
      }
    } catch (error) {
      console.error('Error pinning message:', error);
      alert('Mesaj sabitlenemedi: ' + error);
    }
  };

  const deleteMessage = async (messageId: string) => {
    if (!user?.id) {
      alert('Kullanıcı bilgisi bulunamadı.');
      return;
    }

    try {
      const response = await fetch(`/api/chat/messages/${messageId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user.id
        },
        body: JSON.stringify({
          action: 'delete'
        }),
      });

      const data = await response.json();
      if (data.success) {
        fetchMessages(selectedChannel!.id);
      } else {
        alert('Mesaj silinemedi: ' + data.error);
      }
    } catch (error) {
      console.error('Error deleting message:', error);
      alert('Mesaj silinemedi: ' + error);
    }
  };

  const answerQuestion = async (messageId: string) => {
    if (!user?.id) {
      alert('Kullanıcı bilgisi bulunamadı.');
      return;
    }

    try {
      const response = await fetch(`/api/chat/messages/${messageId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user.id
        },
        body: JSON.stringify({
          action: 'answer'
        }),
      });

      const data = await response.json();
      if (data.success) {
        fetchMessages(selectedChannel!.id);
      } else {
        alert('Soru cevaplanamadı: ' + data.error);
      }
    } catch (error) {
      console.error('Error answering question:', error);
      alert('Soru cevaplanamadı: ' + error);
    }
  };

  const askInstructor = async () => {
    if (!askInstructorMessage.trim() || isAskingInstructor) return;

    if (!user?.id) {
      alert('Kullanıcı bilgisi bulunamadı. Lütfen tekrar giriş yapın.');
      return;
    }

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
          toRole: 'ADMIN' // Admin'e özel mesaj gönder
        }),
      });

      const data = await response.json();
      if (data.success) {
        setAskInstructorMessage('');
        setAskInstructorTags('');
        alert('Sorunuz admin\'e özel mesaj olarak iletildi!');
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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getChannelIcon = (channel: Channel) => {
    switch (channel.name) {
      case 'genel': return <MessageSquare className="w-4 h-4" />;
      case 'duyurular': return <Megaphone className="w-4 h-4" />;
      case 'kubernetes': return <Crown className="w-4 h-4" />;
      case 'egitmene-sor': return <HelpCircle className="w-4 h-4" />;
      case 'yardim': return <HelpCircle className="w-4 h-4" />;
      case 'linkedin-paylasimlari': return <Linkedin className="w-4 h-4" />;
      case 'github-projeleri': return <Github className="w-4 h-4" />;
      case 'medium-yazilari': return <BookOpen className="w-4 h-4" />;
      case 'yonetim-kanali': return <Lock className="w-4 h-4" />;
      default: return <Hash className="w-4 h-4" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'GENEL': return <Globe className="w-4 h-4" />;
      case 'BOOTCAMP': return <Crown className="w-4 h-4" />;
      case 'PAYLASIMLAR': return <Users className="w-4 h-4" />;
      case 'YONETIM': return <Lock className="w-4 h-4" />;
      default: return <Hash className="w-4 h-4" />;
    }
  };

  const canAccessChannel = (channel: Channel) => {
    if (!channel.isPrivate) return true;
    return user?.role === 'ADMIN' || user?.role === 'INSTRUCTOR';
  };

  const filteredChannels = channels.filter(channel => {
    if (!canAccessChannel(channel)) return false;
    if (!searchQuery.trim()) return true;
    return channel.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
           channel.description.toLowerCase().includes(searchQuery.toLowerCase());
  });

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <MessageSquare className="w-8 h-8 text-white animate-pulse" />
          </div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Chat yükleniyor...</p>
        </div>
      </div>
    );
  }

  // Debug bilgisi ekle
  console.log('Chat page debug:', {
    user: user,
    isAuthenticated: isAuthenticated,
    authLoading: authLoading,
    selectedChannel: selectedChannel
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Lock className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Yetkisiz Erişim</h1>
          <p className="text-gray-600 mb-6">Bu sayfaya erişim yetkiniz bulunmamaktadır.</p>
          <button
            onClick={() => router.push('/login')}
            className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            Giriş Yap
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex max-w-full overflow-hidden">
      {/* Sidebar */}
      <div className="w-80 bg-white shadow-xl border-r border-gray-200 flex flex-col h-screen flex-shrink-0">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-red-600 to-red-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">HSD Türkiye Chat</h1>
                <p className="text-sm text-red-100">Hoş geldin, {user?.fullName}</p>
              </div>
            </div>
            
            <button
              onClick={() => window.history.back()}
              className="p-2 rounded-lg hover:bg-white/20 transition-colors flex items-center space-x-2 text-white hover:text-white"
              title="Geri Dön"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline text-sm font-medium">Geri</span>
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Kanal ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900 placeholder-gray-500 bg-white shadow-sm"
            />
          </div>
        </div>

        {/* Channels */}
        <div className="flex-1 overflow-y-auto max-h-[calc(100vh-200px)]">
          {['GENEL', 'BOOTCAMP', 'PAYLASIMLAR', 'YONETIM'].map(category => {
            const categoryChannels = filteredChannels.filter(ch => ch.category === category);
            if (categoryChannels.length === 0) return null;

            return (
              <div key={category} className="mb-6">
                <div className="px-4 py-3 bg-gradient-to-r from-gray-100 to-gray-50 border-b border-gray-200">
                  <div className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                    {getCategoryIcon(category)}
                    <span>{category}</span>
                  </div>
                </div>
                {categoryChannels.map(channel => (
                  <motion.button
                    key={channel.id}
                    whileHover={{ backgroundColor: '#f8fafc', scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setSelectedChannel(channel);
                      // Kanal değiştiğinde mesaj alanını temizle
                      setNewMessage('');
                      setTags('');
                      setReplyTo(null);
                      setIsAnnouncement(false);
                    }}
                    className={`w-full px-4 py-4 text-left flex items-center space-x-3 transition-all duration-200 ${
                      selectedChannel?.id === channel.id 
                        ? 'bg-gradient-to-r from-red-50 to-red-100 border-r-4 border-red-500 shadow-sm' 
                        : 'hover:bg-gray-50 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex-shrink-0">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        selectedChannel?.id === channel.id 
                          ? 'bg-red-500 text-white' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {getChannelIcon(channel)}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className={`font-medium ${
                          selectedChannel?.id === channel.id 
                            ? 'text-red-700' 
                            : 'text-gray-900'
                        }`}>{channel.displayName}</span>
                        {channel.isPrivate && <Lock className="w-3 h-3 text-gray-400" />}
                        {channel.messageCount && channel.messageCount > 0 && (
                          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                            {channel.messageCount}
                          </span>
                        )}
                      </div>
                      <p className={`text-sm truncate ${
                        selectedChannel?.id === channel.id 
                          ? 'text-red-600' 
                          : 'text-gray-600'
                      }`}>{channel.description}</p>
                    </div>
                  </motion.button>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white shadow-lg h-screen max-w-full overflow-hidden">
        {selectedChannel ? (
          <>
            {/* Channel Header */}
            <div className="bg-gradient-to-r from-white to-gray-50 border-b border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                    <div className="text-white">
                      {getChannelIcon(selectedChannel)}
                    </div>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{selectedChannel.displayName}</h2>
                    <p className="text-sm text-gray-600">{selectedChannel.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-3 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-100 transition-colors">
                    <Search className="w-5 h-5" />
                  </button>
                  {(user?.role === 'ADMIN' || user?.role === 'INSTRUCTOR') && (
                    <button className="p-3 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-100 transition-colors">
                      <Plus className="w-5 h-5" />
                    </button>
                  )}
                  <button className="p-3 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-100 transition-colors">
                    <Settings className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-gray-50 to-white max-w-full" style={{ maxHeight: 'calc(100vh - 250px)' }}>
              {/* Channel Welcome Message */}
              {messages.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <div className="text-white">
                      {getChannelIcon(selectedChannel)}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    #{selectedChannel?.name} kanalına hoş geldiniz!
                  </h3>
                  <p className="text-gray-600 mb-4">{selectedChannel?.description}</p>
                  <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 max-w-md mx-auto">
                    <p className="text-sm text-gray-700">
                      💡 <strong>İpucu:</strong> Bu kanalda {selectedChannel?.displayName} konularında sohbet edebilirsiniz.
                    </p>
                  </div>
                </div>
              )}
              
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={`flex space-x-4 ${message.parentId ? 'ml-12 border-l-4 border-gray-200 pl-6 bg-gray-50 rounded-r-lg' : ''}`}
                  >
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-sm font-bold text-white">
                          {message.user.fullName.charAt(0)}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="font-semibold text-gray-900">{message.user.fullName}</span>
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                            {new Date(message.createdAt).toLocaleTimeString('tr-TR', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </span>
                          {message.isPinned && (
                            <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full flex items-center space-x-1">
                              <Pin className="w-3 h-3" />
                              <span>Sabitli</span>
                            </span>
                          )}
                          {message.tags && (
                            <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
                              {message.tags}
                            </span>
                          )}
                        </div>
                        <p className="text-gray-800 leading-relaxed">{message.content}</p>
                        {message.linkPreview && (
                          <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="text-sm text-gray-600">🔗 Link Önizleme</div>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-4 mt-3 ml-2">
                        <button
                          onClick={() => setReplyTo(message)}
                          className="text-xs text-gray-500 hover:text-blue-600 flex items-center space-x-1 transition-colors"
                        >
                          <Reply className="w-3 h-3" />
                          <span>Yanıtla</span>
                        </button>
                        {(user?.role === 'ADMIN' || user?.role === 'INSTRUCTOR') && (
                          <>
                            <button 
                              onClick={() => pinMessage(message.id)}
                              className={`text-xs flex items-center space-x-1 transition-colors ${
                                message.isPinned 
                                  ? 'text-red-600' 
                                  : 'text-gray-500 hover:text-red-600'
                              }`}
                            >
                              <Pin className="w-3 h-3" />
                              <span>{message.isPinned ? 'Sabitli' : 'Sabitle'}</span>
                            </button>
                            <button 
                              onClick={() => deleteMessage(message.id)}
                              className="text-xs text-gray-500 hover:text-red-600 flex items-center space-x-1 transition-colors"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>Sil</span>
                            </button>
                            {!message.isAnswered && (
                              <button 
                                onClick={() => answerQuestion(message.id)}
                                className="text-xs text-green-600 hover:text-green-800 flex items-center space-x-1 transition-colors"
                              >
                                <span>✓</span>
                                <span>Yanıtla</span>
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>

            {/* Reply Indicator */}
            {replyTo && (
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-400 p-4 mx-6 rounded-r-lg shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <Reply className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <span className="text-sm font-medium text-blue-800">
                        {replyTo.user.fullName} kullanıcısına yanıt veriyorsunuz
                      </span>
                      <p className="text-xs text-blue-600 mt-1 truncate max-w-md">
                        {replyTo.content}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setReplyTo(null)}
                    className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-200 rounded-full transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}

            {/* Message Input - Fixed Position at Top */}
            <div className="bg-gradient-to-r from-white to-gray-50 border-t border-gray-200 p-4 shadow-lg sticky top-0 z-10">
              <div className="flex items-start space-x-4">
                {/* Channel Info - Compact Version */}
                <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200 min-w-[200px]">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center">
                      <div className="text-white text-xs">
                        {getChannelIcon(selectedChannel)}
                      </div>
                    </div>
                    <div>
                      <span className="font-bold text-gray-900 text-sm">{selectedChannel?.displayName}</span>
                      {selectedChannel?.isPrivate && (
                        <Lock className="w-3 h-3 text-gray-400 ml-1" />
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mb-2 leading-relaxed">{selectedChannel?.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Kategori:</span>
                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                      {selectedChannel?.category}
                    </span>
                  </div>
                </div>

                {/* Message Input Area - Enhanced */}
                <div className="flex-shrink-0 bg-white border-t border-gray-200 p-2 w-full max-w-full overflow-hidden">
                  {(user?.role === 'ADMIN' || user?.role === 'INSTRUCTOR') && (
                    <div className="bg-gradient-to-r from-red-100 to-red-200 border-2 border-red-300 rounded-xl p-3 mb-3 shadow-lg">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="announcement"
                          checked={isAnnouncement}
                          onChange={(e) => setIsAnnouncement(e.target.checked)}
                          className="w-5 h-5 text-red-600 border-2 border-red-400 rounded-md focus:ring-red-500 focus:ring-2 cursor-pointer"
                        />
                        <label htmlFor="announcement" className="text-sm font-bold text-red-900 flex items-center space-x-2 cursor-pointer">
                          <span className="text-lg">📢</span>
                          <span>Duyuru olarak gönder</span>
                        </label>
                      </div>
                      <p className="text-sm text-red-700 mt-2 ml-7 font-medium">
                        ⚠️ Bu mesaj tüm kullanıcılara duyuru olarak gönderilecek
                      </p>
                    </div>
                  )}
                  
                  <div className="flex space-x-1 w-full relative gap-1 max-w-full overflow-hidden">
                    <input
                      type="text"
                      placeholder={
                        selectedChannel?.name === 'genel' 
                          ? 'Genel sohbet için mesaj yazın... @ ile etiketleyebilirsiniz' 
                          : selectedChannel?.name === 'duyurular'
                          ? 'Duyuru mesajı yazın... @ ile etiketleyebilirsiniz'
                          : selectedChannel?.name === 'kubernetes'
                          ? 'Kubernetes hakkında soru sorun... @ ile etiketleyebilirsiniz'
                          : selectedChannel?.name === 'yardim'
                          ? 'Yardım isteyin... @ ile etiketleyebilirsiniz'
                          : selectedChannel?.name === 'linkedin-paylasimlari'
                          ? 'LinkedIn paylaşımı yapın... @ ile etiketleyebilirsiniz'
                          : selectedChannel?.name === 'github-projeleri'
                          ? 'GitHub projesi paylaşın... @ ile etiketleyebilirsiniz'
                          : selectedChannel?.name === 'medium-yazilari'
                          ? 'Medium yazısı paylaşın... @ ile etiketleyebilirsiniz'
                          : selectedChannel?.name === 'yonetim-kanali'
                          ? 'Yönetim mesajı yazın... @ ile etiketleyebilirsiniz'
                          : `#${selectedChannel?.name} kanalına mesaj yazın... @ ile etiketleyebilirsiniz`
                      }
                      value={newMessage}
                      onChange={(e) => {
                        const value = e.target.value;
                        setNewMessage(value);
                        
                        // @ işareti kontrolü - eski çalışan versiyon
                        const cursorPos = e.target.selectionStart || 0;
                        const textBeforeCursor = value.substring(0, cursorPos);
                        const lastAtIndex = textBeforeCursor.lastIndexOf('@');
                        
                        if (lastAtIndex !== -1) {
                          const textAfterAt = textBeforeCursor.substring(lastAtIndex + 1);
                          if (!textAfterAt.includes(' ')) {
                            setShowMentions(true);
                            setMentionQuery(textAfterAt);
                            setMentionPosition(lastAtIndex);
                          } else {
                            setShowMentions(false);
                          }
                        } else {
                          setShowMentions(false);
                        }
                      }}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900 placeholder-gray-500 bg-white shadow-sm text-sm min-w-0 max-w-sm"
                    />
                    
                    {/* Mention Dropdown */}
                    {showMentions && (
                      <div className="absolute bottom-full left-0 right-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
                        <div className="p-3">
                          <div className="text-sm font-semibold text-red-700 mb-3 flex items-center space-x-1">
                            <span>👥</span>
                            <span>Etiketleyebileceğiniz kişiler:</span>
                          </div>
                          {['admin@hsd.com', 'instructor@hsd.com', 'participant@hsd.com'].filter(email => 
                            email.toLowerCase().includes(mentionQuery.toLowerCase())
                          ).map((email, index) => (
                            <div
                              key={index}
                              className="p-2 hover:bg-gray-100 rounded cursor-pointer flex items-center space-x-2"
                              onClick={() => {
                                const beforeAt = newMessage.substring(0, mentionPosition);
                                const afterAt = newMessage.substring(mentionPosition + 1 + mentionQuery.length);
                                const newText = beforeAt + '@' + email + ' ' + afterAt;
                                setNewMessage(newText);
                                setShowMentions(false);
                              }}
                            >
                              <div className="w-6 h-6 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                                {email.charAt(0).toUpperCase()}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-gray-900 text-sm truncate">{email}</div>
                                <div className="text-xs text-gray-500">
                                  {email.includes('admin') ? 'Yönetici' : 
                                   email.includes('instructor') ? 'Eğitmen' : 'Katılımcı'}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    <button
                      onClick={sendMessage}
                      disabled={!newMessage.trim() || isSendingMessage}
                      className="px-3 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded hover:from-red-700 hover:to-red-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-1 shadow-sm transition-all duration-200 transform hover:scale-105 text-sm font-semibold flex-shrink-0"
                    >
                      {isSendingMessage ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                      <span className="font-medium">Gönder</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="text-center max-w-2xl mx-auto p-8">
              <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <MessageSquare className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Bir kanal seçin</h3>
              <p className="text-gray-600 mb-8 text-lg">Sohbete başlamak için sol menüden bir kanal seçin</p>
              
              {/* Eğitmene Sor Formu */}
              <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-xl">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center">
                    <HelpCircle className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900">Eğitmene Sor</h4>
                </div>
                <p className="text-gray-600 mb-6 text-center">
                  Sorularınızı admin'e özel mesaj olarak iletebilirsiniz. Mesajınız sadece admin tarafından görülebilir ve size özel olarak cevaplanacaktır.
                </p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Sorunuz
                    </label>
                    <textarea
                      value={askInstructorMessage}
                      onChange={(e) => setAskInstructorMessage(e.target.value)}
                      placeholder="Sorunuzu buraya yazın..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900 placeholder-gray-500 bg-white resize-none shadow-sm"
                      rows={4}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Etiketler (opsiyonel)
                    </label>
                    <input
                      type="text"
                      value={askInstructorTags}
                      onChange={(e) => setAskInstructorTags(e.target.value)}
                      placeholder="Örn: kubernetes, docker, huawei-cloud"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900 placeholder-gray-500 bg-white shadow-sm"
                    />
                  </div>
                  <button
                    onClick={askInstructor}
                    disabled={!askInstructorMessage.trim() || isAskingInstructor}
                    className="w-full px-6 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 shadow-lg transition-all duration-200 transform hover:scale-105"
                  >
                    {isAskingInstructor ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      <HelpCircle className="w-5 h-5" />
                    )}
                    <span className="font-semibold">{isAskingInstructor ? 'Gönderiliyor...' : 'Soruyu Gönder'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
