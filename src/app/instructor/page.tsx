'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { 
  BookOpen, 
  Users, 
  MessageSquare, 
  Calendar,
  Award,
  Clock,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  FileText,
  Video,
  Download,
  Plus,
  Eye,
  Edit,
  Trash2,
  Send,
  Bell,
  Settings,
  BarChart3,
  Target,
  Star,
  UserCheck,
  GraduationCap
} from 'lucide-react';
import BackButton from '@/components/ui/BackButton';

interface Lesson {
  id: string;
  title: string;
  description: string;
  youtubeUrl: string;
  duration: string;
  instructor: string;
  category: string;
  week: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  thumbnailUrl?: string;
  tags: string;
  showDate?: string;
  prerequisites?: string;
  objectives?: string;
  resources?: string;
  isActive?: boolean;
  order?: number;
}

interface Student {
  id: string;
  fullName: string;
  email: string;
  progress: number;
  lastActive: string;
  completedLessons: number;
  totalLessons: number;
}

interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  submissions: number;
  totalStudents: number;
}

interface Question {
  id: string;
  content: string;
  tags: string;
  createdAt: string;
  user: {
    fullName: string;
    email: string;
  };
  isAnswered: boolean;
}

const InstructorDashboard = () => {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [newLesson, setNewLesson] = useState({
    title: '',
    description: '',
    youtubeUrl: '',
    duration: '',
    instructor: user?.fullName || '',
    category: '',
    week: 1,
    tags: '',
    prerequisites: '',
    objectives: '',
    resources: ''
  });
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'MEDIUM',
    category: '',
    tags: '',
    estimatedHours: '',
    notes: ''
  });
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    content: '',
    category: 'GENEL'
  });
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [settings, setSettings] = useState({
    email: user?.email || '',
    fullName: user?.fullName || '',
    phone: '',
    university: '',
    department: ''
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }
    
    if (user && user.role !== 'INSTRUCTOR') {
      router.push('/dashboard');
      return;
    }
    
    if (isAuthenticated && user && user.role === 'INSTRUCTOR') {
      fetchDashboardData();
    }
  }, [user, isAuthenticated, authLoading, router]);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      // Fetch lessons, students, tasks, and questions data
      const [lessonsRes, studentsRes, tasksRes, questionsRes] = await Promise.all([
        fetch('/api/instructor/lessons'),
        fetch('/api/instructor/students'),
        fetch('/api/instructor/tasks'),
        fetch('/api/instructor/questions')
      ]);

      const [lessonsData, studentsData, tasksData, questionsData] = await Promise.all([
        lessonsRes.json(),
        studentsRes.json(),
        tasksRes.json(),
        questionsRes.json()
      ]);

      if (lessonsData.success) setLessons(lessonsData.lessons);
      if (studentsData.success) setStudents(studentsData.students);
      if (tasksData.success) setTasks(tasksData.tasks);
      if (questionsData.success) setQuestions(questionsData.questions);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateLesson = async () => {
    try {
      console.log('Creating lesson:', newLesson);
      
      const response = await fetch('/api/instructor/lessons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newLesson),
      });

      const data = await response.json();
      console.log('Lesson creation response:', data);

      if (data.success) {
        setLessons([data.lesson, ...lessons]);
        setShowLessonModal(false);
        setNewLesson({
          title: '',
          description: '',
          youtubeUrl: '',
          duration: '',
          instructor: user?.fullName || '',
          category: '',
          week: 1,
          tags: '',
          prerequisites: '',
          objectives: '',
          resources: ''
        });
        alert('Ders başarıyla oluşturuldu!');
      } else {
        alert('Ders oluşturulamadı: ' + data.error);
      }
    } catch (error) {
      console.error('Error creating lesson:', error);
      alert('Ders oluşturulamadı: ' + error);
    }
  };

  const handleCreateTask = async () => {
    try {
      console.log('Creating task:', newTask);
      
      const response = await fetch('/api/instructor/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTask),
      });

      const data = await response.json();
      console.log('Task creation response:', data);

      if (data.success) {
        setTasks([data.task, ...tasks]);
        setShowTaskModal(false);
        setNewTask({
          title: '',
          description: '',
          dueDate: '',
          priority: 'MEDIUM',
          category: '',
          tags: '',
          estimatedHours: '',
          notes: ''
        });
        alert('Görev başarıyla oluşturuldu!');
      } else {
        alert('Görev oluşturulamadı: ' + data.error);
      }
    } catch (error) {
      console.error('Error creating task:', error);
      alert('Görev oluşturulamadı: ' + error);
    }
  };

  const handleCreateAnnouncement = async () => {
    try {
      const response = await fetch('/api/admin/announcements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newAnnouncement.title,
          summary: newAnnouncement.content.substring(0, 100) + '...',
          content: newAnnouncement.content,
          category: newAnnouncement.category,
          date: new Date().toLocaleDateString('tr-TR'),
          time: new Date().toLocaleTimeString('tr-TR')
        }),
      });

      const data = await response.json();

      if (data.success) {
        setShowAnnouncementModal(false);
        setNewAnnouncement({
          title: '',
          content: '',
          category: 'GENEL'
        });
        alert('Duyuru başarıyla gönderildi!');
      } else {
        alert('Duyuru gönderilemedi: ' + data.error);
      }
    } catch (error) {
      console.error('Error creating announcement:', error);
      alert('Duyuru gönderilemedi');
    }
  };

  const handleUpdateSettings = async () => {
    try {
      const response = await fetch('/api/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: settings.fullName,
          phone: settings.phone,
          university: settings.university,
          department: settings.department
        }),
      });

      const data = await response.json();

      if (data.success) {
        setShowSettingsModal(false);
        alert('Ayarlar başarıyla güncellendi!');
        // Kullanıcı bilgilerini güncelle
        window.location.reload();
      } else {
        alert('Ayarlar güncellenemedi: ' + data.error);
      }
    } catch (error) {
      console.error('Error updating settings:', error);
      alert('Ayarlar güncellenemedi: ' + error);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user || user.role !== 'INSTRUCTOR') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Yetkisiz Erişim</h1>
          <p className="text-gray-600">Bu sayfaya erişim yetkiniz bulunmamaktadır.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <BackButton title="Eğitmen Paneli'nden Geri Dön" showHome={true} />
              
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Eğitmen Paneli</h1>
                <p className="text-gray-600">Hoş geldiniz, {user.fullName}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setShowAnnouncementModal(true)}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                <Send className="w-4 h-4 mr-2 inline" />
                Duyuru Gönder
              </button>
              <button 
                onClick={() => {
                  setSettings({
                    email: user?.email || '',
                    fullName: user?.fullName || '',
                    phone: user?.phone || '',
                    university: user?.university || '',
                    department: user?.department || ''
                  });
                  setShowSettingsModal(true);
                }}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Settings className="w-4 h-4 mr-2 inline" />
                Ayarlar
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Toplam Ders</p>
                <p className="text-2xl font-bold text-gray-900">{lessons.length}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Aktif Öğrenci</p>
                <p className="text-2xl font-bold text-gray-900">{students.length}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Target className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Aktif Görev</p>
                <p className="text-2xl font-bold text-gray-900">{tasks.filter(t => t.status === 'IN_PROGRESS').length}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Ortalama İlerleme</p>
                <p className="text-2xl font-bold text-gray-900">
                  {students.length > 0 ? Math.round(students.reduce((acc, s) => acc + s.progress, 0) / students.length) : 0}%
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lessons Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Derslerim</h3>
                  <button 
                    onClick={() => setShowLessonModal(true)}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <Plus className="w-4 h-4 mr-2 inline" />
                    Yeni Ders
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {lessons.map((lesson, index) => (
                    <motion.div
                      key={lesson.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                          <Video className="w-6 h-6 text-red-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{lesson.title}</h4>
                          <p className="text-sm text-gray-600">Hafta {lesson.week} • {lesson.duration}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          lesson.isPublished ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {lesson.isPublished ? 'Yayında' : 'Taslak'}
                        </span>
                        <button className="text-gray-400 hover:text-gray-600">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="text-gray-400 hover:text-gray-600">
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Students Section */}
          <div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Öğrenciler</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {students.slice(0, 5).map((student, index) => (
                    <motion.div
                      key={student.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <UserCheck className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{student.fullName}</p>
                          <p className="text-sm text-gray-600">{student.progress}% tamamlandı</p>
                        </div>
                      </div>
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${student.progress}%` }}
                        ></div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <button className="w-full mt-4 text-red-600 hover:text-red-700 font-medium">
                  Tümünü Gör
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Questions Section */}
        <div className="mt-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Eğitmene Sorulan Sorular</h3>
                <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                  {questions.filter(q => !q.isAnswered).length} cevaplanmamış
                </span>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {questions.slice(0, 5).map((question, index) => (
                  <motion.div
                    key={question.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <p className="text-gray-900 font-medium mb-2">{question.content}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>👤 {question.user.fullName}</span>
                          <span>📧 {question.user.email}</span>
                          <span>🕒 {new Date(question.createdAt).toLocaleDateString('tr-TR')}</span>
                        </div>
                        {question.tags && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {question.tags.split(',').map((tag: string, tagIndex: number) => (
                              <span
                                key={tagIndex}
                                className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs"
                              >
                                {tag.trim()}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          question.isAnswered ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {question.isAnswered ? 'Cevaplandı' : 'Bekliyor'}
                        </span>
                        {!question.isAnswered && (
                          <button className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors">
                            Cevapla
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              {questions.length > 5 && (
                <button className="w-full mt-4 text-red-600 hover:text-red-700 font-medium">
                  Tüm Soruları Gör ({questions.length})
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Tasks Section */}
        <div className="mt-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Görevler</h3>
                <button 
                  onClick={() => setShowTaskModal(true)}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2 inline" />
                  Yeni Görev
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tasks.map((task, index) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-medium text-gray-900">{task.title}</h4>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        task.priority === 'HIGH' ? 'bg-red-100 text-red-800' :
                        task.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {task.priority === 'HIGH' ? 'Yüksek' : task.priority === 'MEDIUM' ? 'Orta' : 'Düşük'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{task.description}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{task.submissions}/{task.totalStudents} teslim</span>
                      <span>{new Date(task.dueDate).toLocaleDateString('tr-TR')}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ders Ekleme Modal */}
      {showLessonModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Yeni Ders Ekle</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ders Başlığı</label>
                <input
                  type="text"
                  value={newLesson.title}
                  onChange={(e) => setNewLesson({...newLesson, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900 placeholder-gray-500 bg-white"
                  placeholder="Ders başlığını girin"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Açıklama</label>
                <textarea
                  value={newLesson.description}
                  onChange={(e) => setNewLesson({...newLesson, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900 placeholder-gray-500 bg-white"
                  rows={3}
                  placeholder="Ders açıklamasını girin"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">YouTube URL</label>
                <input
                  type="url"
                  value={newLesson.youtubeUrl}
                  onChange={(e) => setNewLesson({...newLesson, youtubeUrl: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900 placeholder-gray-500 bg-white"
                  placeholder="https://www.youtube.com/watch?v=..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Süre</label>
                  <input
                    type="text"
                    value={newLesson.duration}
                    onChange={(e) => setNewLesson({...newLesson, duration: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900 placeholder-gray-500 bg-white"
                    placeholder="00:00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hafta</label>
                  <input
                    type="number"
                    value={newLesson.week}
                    onChange={(e) => setNewLesson({...newLesson, week: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900 placeholder-gray-500 bg-white"
                    min="1"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
                <input
                  type="text"
                  value={newLesson.category}
                  onChange={(e) => setNewLesson({...newLesson, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900 placeholder-gray-500 bg-white"
                  placeholder="Kubernetes, Docker, Cloud..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Etiketler</label>
                <input
                  type="text"
                  value={newLesson.tags}
                  onChange={(e) => setNewLesson({...newLesson, tags: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900 placeholder-gray-500 bg-white"
                  placeholder="kubernetes, docker, cloud (virgülle ayırın)"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowLessonModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                İptal
              </button>
              <button
                onClick={handleCreateLesson}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Ders Oluştur
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Görev Ekleme Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Yeni Görev Ekle</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Görev Başlığı</label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900 placeholder-gray-500 bg-white"
                  placeholder="Görev başlığını girin"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Açıklama</label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900 placeholder-gray-500 bg-white"
                  rows={3}
                  placeholder="Görev açıklamasını girin"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bitiş Tarihi</label>
                  <input
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900 placeholder-gray-500 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Öncelik</label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900 bg-white"
                  >
                    <option value="LOW">Düşük</option>
                    <option value="MEDIUM">Orta</option>
                    <option value="HIGH">Yüksek</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
                <input
                  type="text"
                  value={newTask.category}
                  onChange={(e) => setNewTask({...newTask, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900 placeholder-gray-500 bg-white"
                  placeholder="Kubernetes, Docker, Cloud..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Etiketler</label>
                <input
                  type="text"
                  value={newTask.tags}
                  onChange={(e) => setNewTask({...newTask, tags: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900 placeholder-gray-500 bg-white"
                  placeholder="kubernetes, docker, cloud (virgülle ayırın)"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowTaskModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                İptal
              </button>
              <button
                onClick={handleCreateTask}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Görev Oluştur
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Duyuru Gönderme Modal */}
      {showAnnouncementModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Duyuru Gönder</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Duyuru Başlığı</label>
                <input
                  type="text"
                  value={newAnnouncement.title}
                  onChange={(e) => setNewAnnouncement({...newAnnouncement, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900 placeholder-gray-500 bg-white"
                  placeholder="Duyuru başlığını girin"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
                <select
                  value={newAnnouncement.category}
                  onChange={(e) => setNewAnnouncement({...newAnnouncement, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900 bg-white"
                >
                  <option value="GENEL">Genel</option>
                  <option value="DERS">Ders</option>
                  <option value="GOREV">Görev</option>
                  <option value="SINAV">Sınav</option>
                  <option value="ETKINLIK">Etkinlik</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Duyuru İçeriği</label>
                <textarea
                  value={newAnnouncement.content}
                  onChange={(e) => setNewAnnouncement({...newAnnouncement, content: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900 placeholder-gray-500 bg-white"
                  rows={6}
                  placeholder="Duyuru içeriğini girin"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAnnouncementModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                İptal
              </button>
              <button
                onClick={handleCreateAnnouncement}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Duyuru Gönder
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ayarlar Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Ayarlar</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">E-posta</label>
                <input
                  type="email"
                  value={settings.email}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500"
                />
                <p className="text-xs text-gray-500 mt-1">E-posta adresi değiştirilemez</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ad Soyad</label>
                <input
                  type="text"
                  value={settings.fullName}
                  onChange={(e) => setSettings({...settings, fullName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900 placeholder-gray-500 bg-white"
                  placeholder="Ad soyadınızı girin"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Telefon</label>
                <input
                  type="tel"
                  value={settings.phone}
                  onChange={(e) => setSettings({...settings, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900 placeholder-gray-500 bg-white"
                  placeholder="+90 555 123 4567"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Üniversite</label>
                <input
                  type="text"
                  value={settings.university}
                  onChange={(e) => setSettings({...settings, university: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900 placeholder-gray-500 bg-white"
                  placeholder="Üniversite adını girin"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bölüm</label>
                <input
                  type="text"
                  value={settings.department}
                  onChange={(e) => setSettings({...settings, department: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900 placeholder-gray-500 bg-white"
                  placeholder="Bölüm adını girin"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowSettingsModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                İptal
              </button>
              <button
                onClick={handleUpdateSettings}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Kaydet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstructorDashboard;
