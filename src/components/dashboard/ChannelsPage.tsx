'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Users, Hash, Send, HelpCircle, Lock, Globe, User, Mail, Edit, Trash2, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { SuccessModal } from '@/components/ui/SuccessModal';
import ConfirmationModal from '@/components/ui/ConfirmationModal';

interface Channel {
  id: string;
  name: string;
  displayName: string;
  description: string;
  category: string;
  isPrivate: boolean;
  messageCount: number;
}

interface Message {
  id: string;
  content: string;
  createdAt: string;
  user: {
    fullName: string;
  };
}

interface PrivateMessage {
  id: string;
  body: string;
  subject?: string;
  createdAt: string;
  fromUser?: {
    fullName: string;
  };
}

interface Question {
  id: string;
  content: string;
  tags?: string;
  createdAt: string;
  replies?: {
    id: string;
    content: string;
    createdAt: string;
    userId: string;
  }[];
}

const ChannelsPage = () => {
  const { user } = useAuth();
  const [channels, setChannels] = useState<Channel[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Eğitmene Sor için state'ler
  const [askInstructorMessage, setAskInstructorMessage] = useState('');
  const [askInstructorTags, setAskInstructorTags] = useState('');
  const [isAskingInstructor, setIsAskingInstructor] = useState(false);
  const [privateMessages, setPrivateMessages] = useState<PrivateMessage[]>([]);
  const [showAskInstructor, setShowAskInstructor] = useState(false);
  
  // Katılımcı için soru-cevap listesi
  const [userQuestions, setUserQuestions] = useState<Question[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  
  // Success Modal
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Question Edit/Delete
  const [editingQuestion, setEditingQuestion] = useState<any>(null);
  const [editQuestionText, setEditQuestionText] = useState('');
  
  // Confirmation Modal
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState<string | null>(null);
  
  // Questions Modal
  const [showQuestionsModal, setShowQuestionsModal] = useState(false);

  useEffect(() => {
    fetchChannels();
    fetchPrivateMessages();
    if (user?.role === 'PARTICIPANT') {
      fetchUserQuestions();
    }
  }, [user]);

  useEffect(() => {
    if (selectedChannel) {
      // Eğitmene Sor kanalı seçildiyse özel mesajları göster
      if (selectedChannel.name === 'egitmene-sor' || selectedChannel.displayName === 'Eğitmene Sor') {
        setShowAskInstructor(true);
        setMessages([]); // Normal mesajları temizle
      } else {
        setShowAskInstructor(false);
        fetchMessages(selectedChannel.id);
      }
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

  const fetchMessages = async (channelId: string) => {
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
    if (!user?.id) return;
    
    try {
      const response = await fetch('/api/private-messages', {
        headers: {
          'x-user-id': user.id
        }
      });
      if (response.ok) {
        const data = await response.json();
        setPrivateMessages(data.messages || []);
      } else {
        console.error('Failed to fetch private messages:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error fetching private messages:', error);
    }
  };

  const fetchUserQuestions = async () => {
    if (!user?.id) return;
    
    try {
      setLoadingQuestions(true);
      const token = localStorage.getItem('afet_maratonu_token');
      const headers: Record<string, string> = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(`/api/participant/questions?userId=${user.id}`, { headers });
      if (response.ok) {
        const data = await response.json();
        setUserQuestions(data.questions || []);
      } else {
        console.error('Failed to fetch questions:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error fetching user questions:', error);
    } finally {
      setLoadingQuestions(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedChannel || !user) return;

    try {
      const response = await fetch(`/api/chat/channels/${selectedChannel.id}/messages`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-user-id': user.id
        },
        body: JSON.stringify({
          content: newMessage,
          messageType: 'text'
        })
      });

      if (response.ok) {
        setNewMessage('');
        fetchMessages(selectedChannel.id);
      } else {
        const errorData = await response.json();
        console.error('Error sending message:', errorData);
        alert('Mesaj gönderilemedi: ' + (errorData.error || 'Bilinmeyen hata'));
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Mesaj gönderilemedi: ' + error);
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
          toRole: 'INSTRUCTOR'
        }),
      });

      const data = await response.json();
      console.log('Ask instructor response:', data);
      if (data.success) {
        setAskInstructorMessage('');
        setAskInstructorTags('');
        setSuccessMessage('Sorunuz eğitmene özel mesaj olarak iletildi!');
        setShowSuccessModal(true);
        fetchPrivateMessages();
        fetchUserQuestions(); // Soru listesini yenile
      } else {
        console.error('Ask instructor failed:', data);
        setSuccessMessage('Soru gönderilemedi: ' + data.error);
        setShowSuccessModal(true);
      }
    } catch (error) {
      console.error('Error asking instructor:', error);
      setSuccessMessage('Soru gönderilemedi: ' + error);
      setShowSuccessModal(true);
    } finally {
      setIsAskingInstructor(false);
    }
  };

  const handleEditQuestion = (question: any) => {
    setEditingQuestion(question);
    setEditQuestionText(question.content);
  };

  const handleUpdateQuestion = async () => {
    if (!editingQuestion || !editQuestionText.trim()) return;
    
    try {
      const token = localStorage.getItem('afet_maratonu_token');
      const response = await fetch(`/api/messages/${editingQuestion.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          body: editQuestionText
        }),
      });

      if (response.ok) {
        setEditingQuestion(null);
        setEditQuestionText('');
        setSuccessMessage('Sorunuz başarıyla güncellendi!');
        setShowSuccessModal(true);
        fetchUserQuestions();
      } else {
        const errorData = await response.json();
        setSuccessMessage('Soru güncellenemedi: ' + (errorData.message || 'Bilinmeyen hata'));
        setShowSuccessModal(true);
      }
    } catch (error) {
      console.error('Error updating question:', error);
      setSuccessMessage('Soru güncellenemedi: ' + error);
      setShowSuccessModal(true);
    }
  };

  const handleDeleteQuestion = (questionId: string) => {
    setQuestionToDelete(questionId);
    setShowConfirmModal(true);
  };

  const confirmDeleteQuestion = async () => {
    if (!questionToDelete) return;
    
    try {
      const token = localStorage.getItem('afet_maratonu_token');
      const response = await fetch(`/api/messages/${questionToDelete}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setSuccessMessage('Sorunuz başarıyla silindi!');
        setShowSuccessModal(true);
        fetchUserQuestions();
      } else {
        const errorData = await response.json();
        setSuccessMessage('Soru silinemedi: ' + (errorData.message || 'Bilinmeyen hata'));
        setShowSuccessModal(true);
      }
    } catch (error) {
      console.error('Error deleting question:', error);
      setSuccessMessage('Soru silinemedi: ' + error);
      setShowSuccessModal(true);
    } finally {
      setShowConfirmModal(false);
      setQuestionToDelete(null);
    }
  };

  const getChannelColor = (category: string) => {
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
            
            {/* Eğitmene Sor - Sadece Eğitmene Sor kanalı seçildiğinde ve katılımcılar için */}
            {showAskInstructor && user?.role === 'PARTICIPANT' && (
              <div className="bg-red-50 border-b border-red-200 p-6 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center">
                      <HelpCircle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-red-900">Eğitmene Sor</h3>
                      <p className="text-sm text-red-700">Özel sorularınızı admin'e iletebilirsiniz</p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setShowQuestionsModal(true)}
                    className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 flex items-center space-x-2"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Sorularım</span>
                  </button>
                </div>
                
                <div className="flex-1 flex flex-col justify-center space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sorunuz
                    </label>
                    <textarea
                      value={askInstructorMessage}
                      onChange={(e) => setAskInstructorMessage(e.target.value)}
                      placeholder="Sorunuzu buraya yazın..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900 placeholder-gray-500 bg-white resize-none"
                      rows={4}
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
                  <div className="flex justify-center">
                    <button
                      onClick={askInstructor}
                      disabled={!askInstructorMessage.trim() || isAskingInstructor}
                      className="px-8 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
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
              </div>
            )}


            {/* Admin/Eğitmen için Özel Mesaj Görüntüleme - Sadece Eğitmene Sor kanalı seçildiğinde */}
            {showAskInstructor && (user?.role === 'ADMIN' || user?.role === 'INSTRUCTOR') && (
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

            {/* Normal Kanal Mesajları - Eğitmene Sor kanalı değilse */}
            {selectedChannel && !showAskInstructor && (
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
            )}

            {/* Kanal seçilmediğinde */}
            {!selectedChannel && (
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
      
      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        message={successMessage}
      />
      
      {/* Confirmation Modal */}
      <div className={`fixed inset-0 z-[60] ${showConfirmModal ? 'block' : 'hidden'}`}>
        <ConfirmationModal
          isOpen={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          onConfirm={confirmDeleteQuestion}
          title="Soruyu Silme Onayı"
          message="Bu soruyu silmek istediğinizden emin misiniz? Bu işlem geri alınamaz."
          confirmText="Evet, Sil"
          cancelText="İptal"
          type="danger"
        />
      </div>
      
      {/* Questions Modal */}
      {showQuestionsModal && (
        <div className="fixed inset-0 bg-transparent backdrop-blur-md flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-2xl max-w-4xl w-full border border-gray-200 max-h-[90vh] flex flex-col"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Sorularım ve Cevaplar</h3>
                    <p className="text-sm text-gray-600">{userQuestions.length} soru</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowQuestionsModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                {loadingQuestions ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                    <p className="text-sm text-green-600 mt-2">Sorular yükleniyor...</p>
                  </div>
                ) : userQuestions.length > 0 ? (
                  userQuestions.map((question, index) => (
                    <div key={index} className="bg-white rounded-lg p-6 border border-green-200 shadow-sm">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-sm font-medium text-green-900">
                          Soru #{index + 1}
                        </span>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-green-600">
                            {new Date(question.createdAt).toLocaleString('tr-TR')}
                          </span>
                          <div className="flex space-x-1">
                            <button
                              onClick={() => handleEditQuestion(question)}
                              className="p-1 text-green-600 hover:text-green-800 hover:bg-green-100 rounded transition-colors"
                              title="Soruyu Düzenle"
                            >
                              <Edit className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => handleDeleteQuestion(question.id)}
                              className="p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded transition-colors"
                              title="Soruyu Sil"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                      <p className="text-base text-green-800 mb-4 leading-relaxed">{question.content}</p>
                      {question.tags && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {question.tags.split(',').map((tag, tagIndex) => (
                            <span key={tagIndex} className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                              {tag.trim()}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      {/* Cevap varsa göster */}
                      {question.replies && question.replies.length > 0 ? (
                        <div className="mt-3 pt-3 border-t border-green-200">
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs font-bold">E</span>
                            </div>
                            <span className="text-sm font-medium text-green-900">Eğitmen Cevabı</span>
                            <span className="text-xs text-green-600">
                              {new Date(question.replies[0].createdAt).toLocaleString('tr-TR')}
                            </span>
                          </div>
                          <p className="text-base text-green-800 bg-green-50 p-4 rounded-lg leading-relaxed">
                            {question.replies[0].content}
                          </p>
                        </div>
                      ) : (
                        <div className="mt-3 pt-3 border-t border-green-200">
                          <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs">⏳</span>
                            </div>
                            <span className="text-sm text-yellow-700">Cevap bekleniyor...</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                    <p>Henüz soru sormadınız</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
      
      {/* Edit Question Modal */}
      {editingQuestion && (
        <div className="fixed inset-0 bg-transparent backdrop-blur-md flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-2xl max-w-lg w-full border border-gray-200"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">Soruyu Düzenle</h3>
                <button
                  onClick={() => setEditingQuestion(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sorunuz
                  </label>
                  <textarea
                    value={editQuestionText}
                    onChange={(e) => setEditQuestionText(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Sorunuzu yazın..."
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setEditingQuestion(null)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  İptal
                </button>
                <button
                  onClick={handleUpdateQuestion}
                  disabled={!editQuestionText.trim()}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  Güncelle
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ChannelsPage;
