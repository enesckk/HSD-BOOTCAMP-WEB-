'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { MessageSquare, Send, Clock, User, Reply } from 'lucide-react';
import InstructorLayout from '@/components/layout/InstructorLayout';
import { SuccessModal } from '@/components/ui/SuccessModal';

interface Message {
  id: string;
  content: string;
  user: {
    fullName: string;
    email: string;
  };
  channel: {
    name: string;
    displayName: string;
  };
  messageType: string;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
  isAnswered?: boolean;
  replies?: {
    id: string;
    content: string;
    user: {
      fullName: string;
      email: string;
    };
    createdAt: string;
  }[];
}

const QuestionsPage = () => {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [replyText, setReplyText] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated || !user || user.role !== 'INSTRUCTOR') {
        router.push('/login');
        return;
      }
      setIsLoading(false);
      fetchMessages();
    }
  }, [authLoading, isAuthenticated, user, router]);

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('afet_maratonu_token');
      const response = await fetch('/api/instructor/messages', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success && data.messages) {
        setMessages(data.messages);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleReply = async () => {
    if (!selectedMessage || !replyText.trim()) return;
    
    try {
      const token = localStorage.getItem('afet_maratonu_token');
      const response = await fetch('/api/instructor/messages/reply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          messageId: selectedMessage.id,
          reply: replyText,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setReplyText('');
          setSelectedMessage(null);
          setSuccessMessage('Cevap başarıyla gönderildi!');
          setShowSuccessModal(true);
          fetchMessages();
        }
      } else {
        const errorData = await response.json();
        alert('Cevap gönderilirken hata oluştu: ' + (errorData.message || 'Bilinmeyen hata'));
      }
    } catch (error) {
      console.error('Error sending reply:', error);
      alert('Cevap gönderilirken hata oluştu');
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

  if (!user || user.role !== 'INSTRUCTOR') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Erişim Reddedildi</h2>
          <p className="text-gray-600">Bu sayfaya erişim yetkiniz yok.</p>
        </div>
      </div>
    );
  }

  return (
    <InstructorLayout title="Mesajlar" subtitle="Öğrenci Soruları ve Mesajları">
      <div className="space-y-6">
        {/* Description */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            Öğrenci sorularını görüntüleyin ve cevaplayın. Mesaj durumlarını takip edin, bekleyen soruları yanıtlayın.
          </p>
        </div>


        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Messages List */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Mesajlar ({messages.length})
              </h2>
            </div>
            
            <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`p-4 cursor-pointer hover:bg-gray-50 ${
                    selectedMessage?.id === message.id ? 'bg-red-50' : ''
                  }`}
                  onClick={() => {
                    setSelectedMessage(message);
                  }}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-red-600" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">
                          {message.user.fullName}
                        </p>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500">
                            {new Date(message.createdAt).toLocaleDateString('tr-TR')}
                          </span>
                          {message.isAnswered ? (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Cevaplandı
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              Bekliyor
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {message.content}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        #{message.channel.displayName}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Message Detail */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Mesaj Detayı</h2>
            </div>
            
            {selectedMessage ? (
              <div className="p-6">
                <div className="mb-4">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-red-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {selectedMessage.user.fullName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {selectedMessage.user.email}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    {selectedMessage.content}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(selectedMessage.createdAt).toLocaleString('tr-TR')}
                  </p>
                </div>

                {selectedMessage.isAnswered && selectedMessage.replies && selectedMessage.replies.length > 0 ? (
                  <div className="border-t pt-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Reply className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-green-800">Cevap</span>
                        <span className="text-xs text-green-600">
                          {new Date(selectedMessage.replies[0].createdAt).toLocaleString('tr-TR')}
                        </span>
                      </div>
                      <p className="text-sm text-green-700">{selectedMessage.replies[0].content}</p>
                    </div>
                  </div>
                ) : (
                  <div className="border-t pt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cevap
                    </label>
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                      placeholder="Cevabınızı yazın..."
                    />
                    <div className="mt-3">
                      <button
                        onClick={handleReply}
                        disabled={!replyText.trim()}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 disabled:opacity-50"
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Cevap Gönder
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-6 text-center text-gray-500">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Bir mesaj seçin</p>
              </div>
            )}
          </div>
        </div>

        {/* Success Modal */}
        <SuccessModal
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          title="Başarılı!"
          message={successMessage}
        />
      </div>
    </InstructorLayout>
  );
};

export default QuestionsPage;