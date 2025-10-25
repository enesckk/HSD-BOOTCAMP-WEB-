'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Target, Plus, Calendar, Users, CheckCircle, Clock, Edit, Trash2, Eye, Upload, Download, FileText, Image, Video, Archive, Search, Filter, Star, MessageSquare, AlertCircle, ChevronDown, ChevronRight, ExternalLink, X, User } from 'lucide-react';
import InstructorLayout from '@/components/layout/InstructorLayout';
import { SuccessModal } from '@/components/ui/SuccessModal';
import { TaskCreateModal } from '@/components/ui/TaskCreateModal';
import { TabComponent } from '@/components/ui/TabComponent';
import { motion } from 'framer-motion';

interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  startDate?: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

interface Submission {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  taskTitle: string;
  taskDescription: string;
  submissionType: string;
  fileUrl?: string;
  linkUrl?: string;
  fileName?: string;
  fileSize?: number;
  fileType?: string;
  status: string;
  submittedAt: string;
  reviewedAt?: string;
  score?: number;
  feedback?: string;
  attachments?: string[];
}

const TasksPage = () => {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('tasks');
  const [groupedSubmissions, setGroupedSubmissions] = useState<any[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEvaluationModal, setShowEvaluationModal] = useState(false);
  const [evaluationData, setEvaluationData] = useState({
    status: 'PENDING' as 'APPROVED' | 'REJECTED' | 'NEEDS_REVISION',
    feedback: ''
  });
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [editFormData, setEditFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: ''
  });

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated || !user || user.role !== 'INSTRUCTOR') {
        router.push('/login');
        return;
      }
      setIsLoading(false);
      fetchTasks();
      fetchSubmissions();
    }
  }, [authLoading, isAuthenticated, user, router]);

    const fetchTasks = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('afet_maratonu_token');
      const response = await fetch('/api/instructor/tasks', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Tasks data:', data);
        if (data.tasks) {
          setTasks(data.tasks);
        }
      } else {
        const errorData = await response.json();
        console.error('Failed to fetch tasks:', response.status);
        console.error('Error details:', errorData);
      }
      } catch (error) {
        console.error('Error fetching tasks:', error);
      } finally {
        setLoading(false);
      }
    };

  const fetchSubmissions = async () => {
    try {
      console.log('=== FETCHING SUBMISSIONS ===');
      const response = await fetch('/api/admin/submissions');
      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('API Response:', data);
      if (data.success) {
        console.log('✅ Setting grouped submissions:', data.groupedSubmissions);
        setGroupedSubmissions(data.groupedSubmissions);
        console.log('✅ Grouped submissions state updated');
      } else {
        console.error('❌ API returned success: false');
      }
    } catch (error) {
      console.error('❌ Error fetching submissions:', error);
      }
    };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'Bitti';
      case 'IN_PROGRESS':
        return 'Devam Ediyor';
      default:
        return 'Beklemede';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return 'bg-red-100 text-red-800';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return 'Yüksek';
      case 'MEDIUM':
        return 'Orta';
      default:
        return 'Düşük';
    }
  };

  const openEvaluationModal = (submission: Submission) => {
    setSelectedSubmission(submission);
    setEvaluationData({
      status: 'APPROVED' as 'APPROVED' | 'REJECTED' | 'NEEDS_REVISION',
      feedback: submission.feedback || ''
    });
    setShowEvaluationModal(true);
  };

  const toggleTaskExpansion = (taskTitle: string) => {
    const newExpanded = new Set(expandedTasks);
    if (newExpanded.has(taskTitle)) {
      newExpanded.delete(taskTitle);
    } else {
      newExpanded.add(taskTitle);
    }
    setExpandedTasks(newExpanded);
  };

  const handleEvaluation = async () => {
    if (!selectedSubmission) return;

    try {
      setIsEvaluating(true);
      console.log('=== EVALUATION DEBUG ===');
      console.log('Selected submission:', selectedSubmission);
      console.log('Evaluation data:', evaluationData);
      
      const response = await fetch(`/api/admin/submissions/${selectedSubmission.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          status: evaluationData.status,
          feedback: evaluationData.feedback
        })
      });

      if (response.ok) {
        console.log('✅ Evaluation successful, refreshing submissions...');
        setShowEvaluationModal(false);
        setSelectedSubmission(null);
        await fetchSubmissions();
        console.log('✅ Submissions refreshed after evaluation');
        setSuccessMessage('Değerlendirme başarıyla kaydedildi!');
        setShowSuccessModal(true);
      } else {
        const errorData = await response.json();
        console.error('❌ Evaluation failed:', errorData);
        setSuccessMessage('Hata: ' + (errorData.error || 'Değerlendirme kaydedilemedi'));
        setShowSuccessModal(true);
      }
    } catch (error) {
      console.error('Error evaluating submission:', error);
      const errorMessage = error instanceof Error ? error.message : 'Bilinmeyen hata';
      setSuccessMessage('Bağlantı hatası: ' + errorMessage);
      setShowSuccessModal(true);
    } finally {
      setIsEvaluating(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'REJECTED':
        return <X className="w-5 h-5 text-red-600" />;
      case 'NEEDS_REVISION':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case 'SUBMITTED':
        return <Upload className="w-5 h-5 text-blue-600" />;
      case 'PENDING':
        return <Clock className="w-5 h-5 text-gray-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const getSubmissionStatusText = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'Onaylandı';
      case 'REJECTED':
        return 'Reddedildi';
      case 'NEEDS_REVISION':
        return 'Revizyon Gerekli';
      case 'SUBMITTED':
        return 'Teslim Edildi';
      case 'PENDING':
        return 'Bekliyor';
      default:
        return 'Bilinmeyen';
    }
  };

  const getSubmissionStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'REJECTED':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'NEEDS_REVISION':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'SUBMITTED':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'PENDING':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getFileIcon = (fileType?: string) => {
    if (!fileType) return <FileText className="w-4 h-4" />;
    
    if (fileType.startsWith('image/')) return <Image className="w-4 h-4" />;
    if (fileType.startsWith('video/')) return <Video className="w-4 h-4" />;
    if (fileType.includes('zip') || fileType.includes('rar')) return <Archive className="w-4 h-4" />;
    return <FileText className="w-4 h-4" />;
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleCreateSuccess = (message: string) => {
    setSuccessMessage(message);
    setShowSuccessModal(true);
    fetchTasks(); // Görevleri yenile
  };

  const handleStatusChange = async (taskId: string, newStatus: string) => {
    try {
      const now = new Date();
      const currentDate = now.toISOString().split('T')[0];
      const currentTime = now.toTimeString().split(' ')[0].substring(0, 5);
      
      // Görev bilgilerini al
      const task = tasks.find(t => t.id === taskId);
      if (!task) return;
      
      let updateData: any = { 
        status: newStatus,
        title: task.title,
        description: task.description,
        startDate: task.startDate,
        endDate: task.endDate,
        startTime: task.startTime,
        endTime: task.endTime,
        dueDate: task.dueDate
      };
      
      // Manuel başlatma durumunda
      if (newStatus === 'IN_PROGRESS') {
        updateData.startDate = currentDate;
        updateData.startTime = currentTime;
        // Eğer bitiş tarihi yoksa veya geçmişse, yeni bitiş tarihi ekle
        if (!task.endDate || new Date(task.endDate) <= now) {
          const newEndDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 gün sonra
          updateData.endDate = newEndDate.toISOString().split('T')[0];
          updateData.endTime = '23:59';
        }
      }
      
      // Manuel bitirme durumunda
      if (newStatus === 'COMPLETED') {
        updateData.endDate = currentDate;
        updateData.endTime = currentTime;
      }
      
      const token = localStorage.getItem('afet_maratonu_token');
      const response = await fetch(`/api/instructor/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        console.log('✅ Status update successful, refreshing tasks...');
        setSuccessMessage('Görev durumu başarıyla güncellendi!');
        setShowSuccessModal(true);
        // Görevleri yeniden yükle
        await fetchTasks();
        console.log('✅ Tasks refreshed after status update');
      } else {
        const errorData = await response.json();
        console.error('❌ Status update failed');
        setSuccessMessage('Görev durumu güncellenemedi: ' + (errorData.message || 'Bilinmeyen hata'));
        setShowSuccessModal(true);
      }
    } catch (error) {
      console.error('Error updating status:', error);
      setSuccessMessage('Görev durumu güncellenirken hata oluştu');
      setShowSuccessModal(true);
    }
  };

  const handleDelete = (taskId: string) => {
    setTaskToDelete(taskId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!taskToDelete) return;

    try {
      const token = localStorage.getItem('afet_maratonu_token');
      const response = await fetch(`/api/instructor/tasks/${taskToDelete}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setSuccessMessage('Görev başarıyla silindi!');
        setShowSuccessModal(true);
        fetchTasks(); // Görevleri yenile
      } else {
        const errorData = await response.json();
        setSuccessMessage('Görev silinemedi: ' + (errorData.message || 'Bilinmeyen hata'));
        setShowSuccessModal(true);
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      setSuccessMessage('Görev silinirken hata oluştu');
      setShowSuccessModal(true);
    } finally {
      setShowDeleteModal(false);
      setTaskToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setTaskToDelete(null);
  };

  const handleEdit = (task: Task) => {
    setSelectedTask(task);
    setEditFormData({
      title: task.title,
      description: task.description,
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
      startDate: task.startDate ? new Date(task.startDate).toISOString().split('T')[0] : '',
      endDate: task.endDate ? new Date(task.endDate).toISOString().split('T')[0] : '',
      startTime: task.startTime || '',
      endTime: task.endTime || ''
    });
    setShowEditModal(true);
  };

  const handleView = (task: Task) => {
    setSelectedTask(task);
    setShowViewModal(true);
  };

  const handleUpdateTask = async () => {
    if (!selectedTask) return;

    try {
      const token = localStorage.getItem('afet_maratonu_token');
      const response = await fetch(`/api/instructor/tasks/${selectedTask.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(editFormData),
      });

      if (response.ok) {
        setSuccessMessage('Görev başarıyla güncellendi!');
        setShowSuccessModal(true);
        setShowEditModal(false);
        fetchTasks();
      } else {
        const errorData = await response.json();
        setSuccessMessage('Görev güncellenemedi: ' + (errorData.message || 'Bilinmeyen hata'));
        setShowSuccessModal(true);
      }
    } catch (error) {
      console.error('Error updating task:', error);
      setSuccessMessage('Görev güncellenirken hata oluştu');
      setShowSuccessModal(true);
    }
  };

  const tabs = [
    { id: 'tasks', label: 'Görevler', count: tasks.length },
    { id: 'submissions', label: 'Görev Teslimleri', count: groupedSubmissions.reduce((total, group) => total + group.submissions.length, 0) }
  ];

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
    <InstructorLayout title="Görevler" subtitle="Bootcamp Görevleri">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
           
            <p className="text-gray-600 mt-1">Bootcamp görevlerini oluşturun, düzenleyin ve takip edin</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              Toplam: {tasks.length} görev
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex justify-end">
          <button 
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Yeni Görev
          </button>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4">
            <TabComponent
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'tasks' && (
          <>

            {/* Tasks List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100"
            >
              {loading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
          </div>
              ) : tasks.length === 0 ? (
                  <div className="p-12 text-center">
                  <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Henüz Görev Yok</h3>
                  <p className="text-gray-600 mb-6">İlk görevinizi oluşturmak için yukarıdaki butona tıklayın.</p>
                    <button 
                      onClick={() => setShowCreateModal(true)}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 transition-colors"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      İlk Görevi Oluştur
                    </button>
            </div>
          ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Görev</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Durum</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Başlama Tarihi</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Bitiş Tarihi</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Oluşturulma</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">İşlemler</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {tasks.map((task) => (
                        <tr key={task.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div>
                              <h3 className="font-semibold text-gray-900">{task.title}</h3>
                              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                {task.description}
                              </p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                                {getStatusText(task.status)}
                              </span>
                              <div className="flex space-x-1">
                                {task.status === 'PENDING' && (
                                  <button
                                    onClick={() => handleStatusChange(task.id, 'IN_PROGRESS')}
                                    className="px-2 py-1 text-xs font-medium text-blue-600 bg-blue-100 hover:bg-blue-200 rounded-full transition-colors"
                                  >
                                    Başlat
                                  </button>
                                )}
                                {task.status === 'IN_PROGRESS' && (
                                  <button
                                    onClick={() => handleStatusChange(task.id, 'COMPLETED')}
                                    className="px-2 py-1 text-xs font-medium text-green-600 bg-green-100 hover:bg-green-200 rounded-full transition-colors"
                                  >
                                    Bitir
                                  </button>
                                )}
                                {task.status === 'COMPLETED' && (
                                  <button
                                    onClick={() => handleStatusChange(task.id, 'IN_PROGRESS')}
                                    className="px-2 py-1 text-xs font-medium text-blue-600 bg-blue-100 hover:bg-blue-200 rounded-full transition-colors"
                                  >
                                    Tekrar Başlat
                                  </button>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {task.startDate ? (
                              <div>
                              <div className="flex items-center">
                                  <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                                  {new Date(task.startDate).toLocaleDateString('tr-TR')}
                                </div>
                                {task.startTime && (
                                  <div className="text-xs text-gray-500 mt-1">
                                    {task.startTime}
                              </div>
                            )}
                              </div>
                            ) : (
                              <span className="text-gray-400">Belirtilmemiş</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {task.endDate ? (
                              <div>
                        <div className="flex items-center">
                                  <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                                  {new Date(task.endDate).toLocaleDateString('tr-TR')}
                                </div>
                                {task.endTime && (
                                  <div className="text-xs text-gray-500 mt-1">
                                    {task.endTime}
                              </div>
                            )}
                            </div>
                            ) : task.dueDate ? (
                              <div>
                                <div className="flex items-center">
                                  <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                                  {new Date(task.dueDate).toLocaleDateString('tr-TR')}
                          </div>
                                <div className="text-xs text-gray-500 mt-1">
                                  Son tarih
                                </div>
                              </div>
                            ) : (
                              <span className="text-gray-400">Belirtilmemiş</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {new Date(task.createdAt).toLocaleDateString('tr-TR')}
                          </td>
                          <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <button 
                              onClick={() => handleView(task)}
                                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded hover:bg-gray-100" 
                              title="Detayları Görüntüle"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => handleEdit(task)}
                                className="text-gray-400 hover:text-blue-600 transition-colors p-1 rounded hover:bg-blue-50" 
                              title="Düzenle"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => handleDelete(task.id)}
                                className="text-gray-400 hover:text-red-600 transition-colors p-1 rounded hover:bg-red-50" 
                              title="Sil"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          </>
        )}

        {activeTab === 'submissions' && (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Katılımcıların teslim ettiği ödevleri görüntüleyin ve değerlendirin</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-600">
                  Toplam: {groupedSubmissions.reduce((total, group) => total + group.submissions.length, 0)} teslim
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Arama</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="İsim, email veya görev ara..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900 placeholder-gray-500 bg-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Durum</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900 bg-white"
                  >
                    <option value="ALL">Tümü</option>
                    <option value="SUBMITTED">Teslim Edildi</option>
                    <option value="APPROVED">Onaylandı</option>
                    <option value="REJECTED">Reddedildi</option>
                    <option value="NEEDS_REVISION">Revizyon Gerekli</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tür</label>
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900 bg-white"
                  >
                    <option value="ALL">Tümü</option>
                    <option value="FILE">Dosya</option>
                    <option value="LINK">Link</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button className="w-full bg-gray-100 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2">
                    <Filter className="w-4 h-4" />
                    <span>Filtrele</span>
                              </button>
                </div>
              </div>
            </div>

            {/* Submissions List */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
              {groupedSubmissions.length === 0 ? (
                <div className="p-12 text-center">
                  <Upload className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Henüz Teslim Yok</h3>
                  <p className="text-gray-600">Katılımcılar henüz görev teslim etmemiş.</p>
                </div>
              ) : (
                <div className="space-y-4 p-6">
                  {groupedSubmissions.map((taskGroup) => (
                    <div key={taskGroup.taskTitle} className="border border-gray-200 rounded-lg">
                      <div 
                        className="bg-gray-50 px-6 py-4 border-b border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => toggleTaskExpansion(taskGroup.taskTitle)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{taskGroup.taskTitle}</h3>
                            <p className="text-sm text-gray-600">{taskGroup.taskDescription}</p>
                            <p className="text-xs text-gray-500 mt-1">{taskGroup.submissions.length} teslim</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            {expandedTasks.has(taskGroup.taskTitle) ? (
                              <ChevronDown className="w-5 h-5 text-gray-500" />
                            ) : (
                              <ChevronRight className="w-5 h-5 text-gray-500" />
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {expandedTasks.has(taskGroup.taskTitle) && (
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                              <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                  Katılımcı
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                  Teslim
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                  Durum
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                  Tarih
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                  Değerlendirme
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                  İşlemler
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {taskGroup.submissions.map((submission: Submission) => (
                                <motion.tr
                                  key={submission.id}
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  className="hover:bg-gray-50"
                                >
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                      <div className="flex-shrink-0 h-10 w-10">
                                        <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                                          <User className="h-6 w-6 text-red-600" />
                                        </div>
                                      </div>
                                      <div className="ml-4">
                                        <div className="text-sm font-medium text-gray-900">{submission.userName}</div>
                                        <div className="text-sm text-gray-500">{submission.userEmail}</div>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                              <button
                                      onClick={() => {
                                        setSelectedSubmission(submission);
                                        setShowDetailModal(true);
                                      }}
                                      className={`flex items-center space-x-2 px-3 py-1 rounded-lg transition-colors ${
                                        submission.submissionType === 'FILE' 
                                          ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' 
                                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                                      }`}
                                    >
                                      {submission.submissionType === 'FILE' ? (
                                        <FileText className="w-4 h-4" />
                                      ) : (
                                        <ExternalLink className="w-4 h-4" />
                                      )}
                                      <span className="text-sm font-medium">
                                        {submission.submissionType === 'FILE' ? 'Dosya' : 'Link'}
                                      </span>
                              </button>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium border ${getSubmissionStatusColor(submission.status)}`}>
                                      {getStatusIcon(submission.status)}
                                      <span>{getSubmissionStatusText(submission.status)}</span>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {new Date(submission.submittedAt).toLocaleDateString('tr-TR')}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {submission.status === 'SUBMITTED' || submission.status === 'PENDING' ? (
                                      <span className="text-gray-400">Değerlendirilmedi</span>
                                    ) : (
                                      <div className="flex items-center space-x-1">
                                        <MessageSquare className="w-4 h-4 text-blue-500" />
                                        <span className="text-blue-600">Değerlendirildi</span>
                                      </div>
                                    )}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div className="flex items-center space-x-2">
                              <button
                                        onClick={() => {
                                          setSelectedSubmission(submission);
                                          setShowDetailModal(true);
                                        }}
                                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                                        title="Detayları Görüntüle"
                                      >
                                        <Eye className="w-4 h-4" />
                              </button>
                                      <button
                                        onClick={() => openEvaluationModal(submission)}
                                        className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
                                        title="Değerlendir"
                                      >
                                        <CheckCircle className="w-4 h-4" />
                                      </button>
                            </div>
                                  </td>
                                </motion.tr>
                              ))}
                            </tbody>
                          </table>
                            </div>
                )}
              </div>
                  ))}
            </div>
              )}
            </div>
            </div>
          )}
      </div>
      
      {/* Create Task Modal */}
      <TaskCreateModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleCreateSuccess}
      />
      
      {/* Edit Modal */}
      {showEditModal && selectedTask && (
        <div className="fixed inset-0 bg-transparent backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Görev Düzenle</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Görev Başlığı
                </label>
                <input
                  type="text"
                  value={editFormData.title}
                  onChange={(e) => setEditFormData({...editFormData, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                  placeholder="Görev başlığını girin"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Açıklama
                </label>
                <textarea
                  value={editFormData.description}
                  onChange={(e) => setEditFormData({...editFormData, description: e.target.value})}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                  placeholder="Görev açıklamasını girin"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Başlangıç Tarihi
                  </label>
                  <input
                    type="date"
                    value={editFormData.startDate}
                    onChange={(e) => setEditFormData({...editFormData, startDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Başlangıç Saati
                  </label>
                  <input
                    type="time"
                    value={editFormData.startTime}
                    onChange={(e) => setEditFormData({...editFormData, startTime: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bitiş Tarihi
                  </label>
                  <input
                    type="date"
                    value={editFormData.endDate}
                    onChange={(e) => setEditFormData({...editFormData, endDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bitiş Saati
                  </label>
                  <input
                    type="time"
                    value={editFormData.endTime}
                    onChange={(e) => setEditFormData({...editFormData, endTime: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Son Tarih (Opsiyonel)
                </label>
                <input
                  type="date"
                  value={editFormData.dueDate}
                  onChange={(e) => setEditFormData({...editFormData, dueDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                İptal
              </button>
              <button
                onClick={handleUpdateTask}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
              >
                Güncelle
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && selectedTask && (
        <div className="fixed inset-0 bg-transparent backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Görev Detayları</h3>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Görev Başlığı
                </label>
                <p className="text-gray-900">{selectedTask.title}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Açıklama
                </label>
                <p className="text-gray-900">{selectedTask.description}</p>
              </div>
              
              {selectedTask.startDate && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Başlangıç Tarihi ve Saati
                  </label>
                  <p className="text-gray-900">
                    {new Date(selectedTask.startDate).toLocaleDateString('tr-TR')}
                    {selectedTask.startTime && ` ${selectedTask.startTime}`}
                  </p>
                </div>
              )}
              
              {selectedTask.endDate && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bitiş Tarihi ve Saati
                  </label>
                  <p className="text-gray-900">
                    {new Date(selectedTask.endDate).toLocaleDateString('tr-TR')}
                    {selectedTask.endTime && ` ${selectedTask.endTime}`}
                  </p>
                </div>
              )}
              
              {selectedTask.dueDate && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Son Tarih
                  </label>
                  <p className="text-gray-900">
                    {new Date(selectedTask.dueDate).toLocaleDateString('tr-TR')}
                  </p>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Durum
                </label>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedTask.status)}`}>
                  {getStatusText(selectedTask.status)}
                </span>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Oluşturulma Tarihi
                </label>
                <p className="text-gray-900">
                  {new Date(selectedTask.createdAt).toLocaleDateString('tr-TR')}
                </p>
              </div>
            </div>
            
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowViewModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                Kapat
              </button>
            </div>
        </div>
      </div>
      )}

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Başarılı!"
        message={successMessage}
      />

      {/* Submission Detail Modal */}
      {selectedSubmission && (
        <div 
          className="fixed inset-0 bg-transparent backdrop-blur-md flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowDetailModal(false);
              setSelectedSubmission(null);
            }
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-200"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Teslim Detayları</h3>
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    setSelectedSubmission(null);
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Katılımcı Bilgileri */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Katılımcı Bilgileri</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <User className="w-5 h-5 text-red-600" />
                      <span className="text-gray-500">Ad Soyad:</span>
                      <span className="font-medium text-gray-900">{selectedSubmission.userName}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-500">Email:</span>
                      <span className="font-medium text-gray-900">{selectedSubmission.userEmail}</span>
                    </div>
                  </div>
                </div>

                {/* Görev Bilgileri */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Görev Bilgileri</h4>
                  <div>
                    <h5 className="font-medium text-gray-900 mb-1">{selectedSubmission.taskTitle}</h5>
                    <p className="text-gray-600">{selectedSubmission.taskDescription}</p>
                  </div>
                </div>

                {/* Teslim Bilgileri */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Teslim Bilgileri</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-500">Tür:</span>
                      <span className="font-medium text-gray-900">
                        {selectedSubmission.submissionType === 'FILE' ? 'Dosya' : 'Link'}
                      </span>
                    </div>

                    {selectedSubmission.submissionType === 'FILE' && selectedSubmission.fileUrl && (
                      <div className="flex items-center space-x-2">
                        <FileText className="w-5 h-5 text-blue-600" />
                        <span className="text-gray-500">Dosya:</span>
                        <a 
                          href={selectedSubmission.fileUrl} 
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 underline flex items-center space-x-1"
                        >
                          <Download className="w-4 h-4" />
                          <span>Dosyayı İndir</span>
                        </a>
                      </div>
                    )}

                    {selectedSubmission.submissionType === 'LINK' && selectedSubmission.linkUrl && (
                      <div className="flex items-center space-x-2">
                        <ExternalLink className="w-5 h-5 text-green-600" />
                        <span className="text-gray-500">Link:</span>
                        <a
                          href={selectedSubmission.linkUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-600 hover:text-green-800 underline flex items-center space-x-1"
                        >
                          <ExternalLink className="w-4 h-4" />
                          <span>Linki Aç</span>
                        </a>
                      </div>
                    )}
                    
                    {selectedSubmission.fileName && (
                      <div>
                        <span className="text-gray-500">Dosya Adı:</span>
                        <p className="text-gray-900 mt-1">{selectedSubmission.fileName}</p>
                      </div>
                    )}

                    {selectedSubmission.fileSize && (
                      <div>
                        <span className="text-gray-500">Dosya Boyutu:</span>
                        <p className="text-gray-900 mt-1">{formatFileSize(selectedSubmission.fileSize)}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Durum ve Değerlendirme */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Durum ve Değerlendirme</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-500">Durum:</span>
                      <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium border ${getSubmissionStatusColor(selectedSubmission.status)}`}>
                        {getStatusIcon(selectedSubmission.status)}
                        <span>{getSubmissionStatusText(selectedSubmission.status)}</span>
                      </div>
                    </div>

                    {selectedSubmission.score && (
                      <div className="flex items-center space-x-2">
                        <Star className="w-5 h-5 text-yellow-500" />
                        <span className="text-gray-500">Puan:</span>
                        <span className="font-medium text-gray-900">{selectedSubmission.score}/100</span>
                      </div>
                    )}
                      
                    {selectedSubmission.feedback && (
                      <div>
                        <span className="text-gray-500">Geri Bildirim:</span>
                        <p className="text-gray-900 mt-1">{selectedSubmission.feedback}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Tarih Bilgileri */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Tarih Bilgileri</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-500">Teslim Tarihi:</span>
                      <span className="text-gray-900">
                        {new Date(selectedSubmission.submittedAt).toLocaleString('tr-TR')}
                      </span>
                    </div>
                    {selectedSubmission.reviewedAt && (
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-500">Değerlendirme Tarihi:</span>
                        <span className="text-gray-900">
                          {new Date(selectedSubmission.reviewedAt).toLocaleString('tr-TR')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    setSelectedSubmission(null);
                  }}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Kapat
                </button>
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    openEvaluationModal(selectedSubmission);
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Değerlendir
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Evaluation Modal */}
      {showEvaluationModal && selectedSubmission && (
        <div 
          className="fixed inset-0 bg-transparent backdrop-blur-md flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowEvaluationModal(false);
              setSelectedSubmission(null);
            }
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-2xl max-w-lg w-full border border-gray-200"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Değerlendirme</h3>
                <button
                  onClick={() => {
                    setShowEvaluationModal(false);
                    setSelectedSubmission(null);
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Durum</label>
                  <select
                    value={evaluationData.status}
                    onChange={(e) => setEvaluationData({...evaluationData, status: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  >
                    <option value="APPROVED">Onaylandı</option>
                    <option value="REJECTED">Reddedildi</option>
                    <option value="NEEDS_REVISION">Revizyon Gerekli</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Geri Bildirim</label>
                  <textarea
                    value={evaluationData.feedback}
                    onChange={(e) => setEvaluationData({...evaluationData, feedback: e.target.value})}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="Değerlendirme notlarınızı yazın..."
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowEvaluationModal(false);
                    setSelectedSubmission(null);
                  }}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  İptal
                </button>
                <button
                  onClick={handleEvaluation}
                  disabled={isEvaluating}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {isEvaluating ? 'Kaydediliyor...' : 'Kaydet'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-transparent backdrop-blur-sm" onClick={cancelDelete}></div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4"
          >
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0 w-10 h-10 mx-auto flex items-center justify-center rounded-full bg-red-100">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
              </div>
              
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Görevi Sil
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  Bu görevi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
                </p>
              </div>

              <div className="flex items-center justify-center space-x-3">
                <button
                  onClick={cancelDelete}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  İptal
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  Sil
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </InstructorLayout>
  );
};

export default TasksPage;