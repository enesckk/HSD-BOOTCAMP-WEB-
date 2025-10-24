'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { MessageSquare, Send, User, Clock, CheckCircle } from 'lucide-react';
import InstructorLayout from '@/components/layout/InstructorLayout';

interface Question {
  id: string;
  content: string;
  user: {
    fullName: string;
    email: string;
  };
  createdAt: string;
  unread: boolean;
  replies?: {
    id: string;
    content: string;
    createdAt: string;
  }[];
}

const InstructorQuestionsPage = () => {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [answerText, setAnswerText] = useState('');
  const [showAnswerModal, setShowAnswerModal] = useState(false);

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated || !user || user.role !== 'INSTRUCTOR') {
        router.push('/login');
        return;
      }
      setIsLoading(false);
    }
  }, [authLoading, isAuthenticated, user, router]);

  useEffect(() => {
    const fetchQuestions = async () => {
      if (!user || user.role !== 'INSTRUCTOR') return;
      
      try {
        const response = await fetch('/api/instructor/questions');
        const data = await response.json();
        setQuestions(data.questions || []);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    if (user && user.role === 'INSTRUCTOR') {
      fetchQuestions();
    }
  }, [user]);

  const handleAnswerQuestion = (question: Question) => {
    setSelectedQuestion(question);
    setShowAnswerModal(true);
  };

  const submitAnswer = async () => {
    if (!selectedQuestion || !answerText.trim()) return;

    try {
      const response = await fetch('/api/instructor/questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          questionId: selectedQuestion.id,
          answer: answerText,
        }),
      });

      if (response.ok) {
        // Refresh questions list
        const fetchQuestions = async () => {
          const response = await fetch('/api/instructor/questions');
          const data = await response.json();
          setQuestions(data.questions || []);
        };
        fetchQuestions();
        
        setShowAnswerModal(false);
        setAnswerText('');
        setSelectedQuestion(null);
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
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
    <InstructorLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Sorular</h1>
          <p className="text-gray-600">Öğrencilerden gelen soruları görüntüleyin ve cevaplayın.</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Gelen Sorular</h2>
          </div>
          
          {questions.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Henüz soru bulunmuyor.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {questions.map((question) => (
                <div key={question.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <User className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm font-medium text-gray-900">
                          {question.user.fullName}
                        </span>
                        <span className="text-sm text-gray-500 ml-2">
                          ({question.user.email})
                        </span>
                        {question.unread && (
                          <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Yeni
                          </span>
                        )}
                      </div>
                      <p className="text-gray-700 mb-3">{question.content}</p>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        {new Date(question.createdAt).toLocaleString('tr-TR')}
                      </div>
                      
                      {question.replies && question.replies.length > 0 && (
                        <div className="mt-4 pl-4 border-l-2 border-gray-200">
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Cevaplar:</h4>
                          {question.replies.map((reply) => (
                            <div key={reply.id} className="mb-2 p-3 bg-gray-50 rounded">
                              <p className="text-sm text-gray-700">{reply.content}</p>
                              <p className="text-xs text-gray-500 mt-1">
                                {new Date(reply.createdAt).toLocaleString('tr-TR')}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <button
                        onClick={() => handleAnswerQuestion(question)}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        <Send className="h-4 w-4 mr-1" />
                        Cevapla
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Answer Modal */}
        {showAnswerModal && selectedQuestion && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Soruyu Cevapla
                </h3>
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Soruyu soran:</strong> {selectedQuestion.user.fullName}
                  </p>
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Soru:</strong> {selectedQuestion.content}
                  </p>
                </div>
                <textarea
                  value={answerText}
                  onChange={(e) => setAnswerText(e.target.value)}
                  placeholder="Cevabınızı yazın..."
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                  rows={4}
                />
                <div className="flex justify-end space-x-3 mt-4">
                  <button
                    onClick={() => {
                      setShowAnswerModal(false);
                      setAnswerText('');
                      setSelectedQuestion(null);
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                  >
                    İptal
                  </button>
                  <button
                    onClick={submitAnswer}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700"
                  >
                    Cevabı Gönder
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </InstructorLayout>
  );
};

export default InstructorQuestionsPage;
