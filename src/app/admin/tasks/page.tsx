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
  CheckCircle, 
  Clock, 
  Users, 
  Calendar,
  FileText,
  Target,
  AlertCircle,
  Save,
  X,
  ChevronDown,
  ChevronRight,
  Eye,
  Download,
  ExternalLink
} from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'REJECTED';
  startDate?: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminTasksPage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    dueDate: '',
    status: 'PENDING' as 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'REJECTED'
  });
  const [editingField, setEditingField] = useState<{ taskId: string; field: string } | null>(null);
  const [editValue, setEditValue] = useState('');
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !user || user.role !== 'ADMIN')) {
      router.push('/login');
      return;
    }
  }, [isLoading, isAuthenticated, user, router]);

  useEffect(() => {
    fetchTasks();
    
    // Her 30 saniyede bir otomatik kontrol yap
    const intervalId = setInterval(async () => {
      try {
        console.log('=== RUNNING PERIODIC AUTO CHECK ===');
        const response = await fetch('/api/tasks/auto-schedule', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log('Periodic auto check completed:', data);
          // Görevleri yenile
          await fetchTasks();
        }
      } catch (error) {
        console.error('Periodic auto check error:', error);
      }
    }, 30000); // 30 saniyede bir kontrol et
    
    // Cleanup
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const fetchTasks = async () => {
    try {
      console.log('=== FRONTEND: FETCHING TASKS START ===');
      
      const response = await fetch('/api/admin/tasks');
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      
      const data = await response.json();
      console.log('Response data:', data);
      
      if (data.success) {
        console.log('Success: Setting tasks:', data.tasks?.length || 0, 'tasks');
        const tasksData = data.tasks || [];
        console.log('Tasks data before setting:', tasksData);
        setTasks(tasksData);
        console.log('✅ Tasks state updated with', tasksData.length, 'tasks');
        
        // Görevleri kullanıcıya göre grupla
      } else {
        console.error('API Error:', data.error);
        console.error('API Detail:', data.detail);
        console.error('API Error Type:', data.errorType);
        setTasks([]);
      }
      
      console.log('=== FRONTEND: FETCHING TASKS SUCCESS ===');
    } catch (error) {
      console.error('=== FRONTEND: FETCHING TASKS ERROR ===');
      console.error('Error type:', typeof error);
      console.error('Error message:', error instanceof Error ? error.message : 'Unknown error');
      console.error('Full error:', error);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const createTask = async () => {
    // Form validasyonu
    if (!formData.title.trim()) {
      alert('Görev başlığı gereklidir!');
      return;
    }
    if (!formData.description.trim()) {
      alert('Görev açıklaması gereklidir!');
      return;
    }
    if (!formData.startDate) {
      alert('Başlama tarihi gereklidir!');
      return;
    }
    if (!formData.dueDate) {
      alert('Bitiş tarihi gereklidir!');
      return;
    }
    if (new Date(formData.startDate) >= new Date(formData.dueDate)) {
      alert('Bitiş tarihi başlama tarihinden sonra olmalıdır!');
      return;
    }

    try {
      const response = await fetch('/api/admin/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Create task response:', result);
        
        if (result.success) {
          console.log('Task created successfully, adding to list...');
          
          // Oluşturulan görevi doğrudan state'e ekle
          if (result.task) {
            setTasks(prevTasks => [result.task, ...prevTasks]);
            console.log('Task added to state:', result.task);
          }
          
          setShowCreateModal(false);
          resetForm();
          alert('Görev başarıyla oluşturuldu!');
        } else {
          alert('Hata: ' + (result.error || 'Görev oluşturulamadı'));
        }
      } else {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        alert('Hata: ' + (errorData.error || 'Sunucu hatası'));
      }
    } catch (error) {
      console.error('Error creating task:', error);
      alert('Bağlantı hatası: ' + (error instanceof Error ? error.message : 'Bilinmeyen hata'));
    }
  };

  const updateTask = async () => {
    if (!editingTask) return;

    try {
      const response = await fetch(`/api/admin/tasks/${editingTask.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        await fetchTasks();
        setShowEditModal(false);
        setEditingTask(null);
        resetForm();
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const deleteTask = async (taskId: string) => {
    if (!confirm('Bu görevi silmek istediğinizden emin misiniz?')) return;

    try {
      const response = await fetch(`/api/admin/tasks/${taskId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await fetchTasks();
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      startDate: '',
      endDate: '',
      startTime: '',
      endTime: '',
      dueDate: '',
      status: 'PENDING'
    });
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
      
      const response = await fetch(`/api/admin/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        console.log('✅ Status update successful, refreshing tasks...');
        // Görevleri yeniden yükle
        await fetchTasks();
        console.log('✅ Tasks refreshed after status update');
      } else {
        console.error('❌ Status update failed');
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description,
      startDate: task.startDate ? task.startDate.split('T')[0] : '',
      endDate: task.endDate ? task.endDate.split('T')[0] : '',
      startTime: task.startTime || '',
      endTime: task.endTime || '',
      dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
      status: task.status
    });
    setShowEditModal(true);
  };

  const startEditing = (taskId: string, field: string, currentValue: string) => {
    setEditingField({ taskId, field });
    setEditValue(currentValue);
  };

  const cancelEditing = () => {
    setEditingField(null);
    setEditValue('');
  };

  const toggleTaskExpansion = (taskId: string) => {
    const newExpanded = new Set(expandedTasks);
    if (newExpanded.has(taskId)) {
      newExpanded.delete(taskId);
    } else {
      newExpanded.add(taskId);
    }
    setExpandedTasks(newExpanded);
  };

  const handleViewDetails = (task: Task) => {
    setSelectedTask(task);
    setShowDetailModal(true);
  };

  const saveEdit = async (taskId: string, field: string) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      if (!task) return;

      const updateData: any = { id: taskId };
      updateData[field] = editValue;

      const response = await fetch('/api/admin/tasks', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData)
      });

      const result = await response.json();

      if (result.success) {
        // Local state'i güncelle
        setTasks(tasks.map(t => 
          t.id === taskId 
            ? { ...t, [field]: editValue, updatedAt: new Date().toISOString() }
            : t
        ));
        setEditingField(null);
        setEditValue('');
      } else {
        alert('Güncelleme başarısız: ' + result.error);
      }
    } catch (error) {
      console.error('Error updating task:', error);
      alert('Güncelleme sırasında hata oluştu');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'Beklemede';
      case 'IN_PROGRESS':
        return 'Devam Ediyor';
      case 'COMPLETED':
        return 'Tamamlandı';
      case 'REJECTED':
        return 'Reddedildi';
      default:
        return 'Beklemede';
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

  if (!isAuthenticated || !user || user.role !== 'ADMIN') {
    return <div></div>;
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600">Bootcamp görevlerini oluşturun ve yönetin</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Yeni Görev</span>
          </button>
        </div>

        {/* Otomatik Sistem Kontrolü */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Otomatik Görev Yönetimi</h3>
              <p className="text-sm text-gray-600">Görevlerin otomatik başlatılması ve bitirilmesi</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                Otomatik Aktif
              </span>
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-green-50 rounded-lg">
            <h4 className="font-medium text-green-900 mb-2">Sistem Bilgisi</h4>
            <div className="text-sm text-green-800">
              <p>• Görevlerinizde başlangıç ve bitiş tarihi belirlediğinizde otomatik olarak başlatılır ve bitirilir.</p>
              <p>• Sistem 5 dakikada bir otomatik kontrol yapar.</p>
              <p>• Görev oluşturma/güncelleme sonrası anlık kontrol yapılır.</p>
            </div>
            
          </div>
        </div>

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
                          {editingField?.taskId === task.id && editingField?.field === 'title' ? (
                            <div className="flex items-center space-x-2">
                              <input
                                type="text"
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                autoFocus
                              />
                              <button
                                onClick={() => saveEdit(task.id, 'title')}
                                className="p-1 text-green-600 hover:bg-green-50 rounded"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                              <button
                                onClick={cancelEditing}
                                className="p-1 text-red-600 hover:bg-red-50 rounded"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <h3 
                              className="font-semibold text-gray-900 cursor-pointer hover:bg-gray-100 p-2 rounded"
                              onClick={() => startEditing(task.id, 'title', task.title)}
                            >
                              {task.title}
                            </h3>
                          )}
                          {editingField?.taskId === task.id && editingField?.field === 'description' ? (
                            <div className="flex items-center space-x-2 mt-1">
                              <textarea
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                rows={2}
                                autoFocus
                              />
                              <button
                                onClick={() => saveEdit(task.id, 'description')}
                                className="p-1 text-green-600 hover:bg-green-50 rounded"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                              <button
                                onClick={cancelEditing}
                                className="p-1 text-red-600 hover:bg-red-50 rounded"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <p 
                              className="text-sm text-gray-600 mt-1 line-clamp-2 cursor-pointer hover:bg-gray-100 p-2 rounded"
                              onClick={() => startEditing(task.id, 'description', task.description)}
                            >
                              {task.description}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {editingField?.taskId === task.id && editingField?.field === 'status' ? (
                          <div className="flex items-center space-x-2">
                            <select
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              className="px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                              autoFocus
                            >
                              <option value="PENDING">Beklemede</option>
                              <option value="COMPLETED">Tamamlandı</option>
                              <option value="REJECTED">Reddedildi</option>
                            </select>
                            <button
                              onClick={() => saveEdit(task.id, 'status')}
                              className="p-1 text-green-600 hover:bg-green-50 rounded"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={cancelEditing}
                              className="p-1 text-red-600 hover:bg-red-50 rounded"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(task.status)}`}>
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
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {editingField?.taskId === task.id && editingField?.field === 'startDate' ? (
                          <div className="flex items-center space-x-2">
                            <input
                              type="date"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              className="px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                              autoFocus
                            />
                            <button
                              onClick={() => saveEdit(task.id, 'startDate')}
                              className="p-1 text-green-600 hover:bg-green-50 rounded"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={cancelEditing}
                              className="p-1 text-red-600 hover:bg-red-50 rounded"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <span 
                            className="cursor-pointer hover:bg-gray-100 p-2 rounded"
                            onClick={() => startEditing(task.id, 'startDate', task.startDate ? task.startDate.split('T')[0] : '')}
                          >
                            {task.startDate ? new Date(task.startDate).toLocaleDateString('tr-TR') : '-'}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {editingField?.taskId === task.id && editingField?.field === 'dueDate' ? (
                          <div className="flex items-center space-x-2">
                            <input
                              type="date"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              className="px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                              autoFocus
                            />
                            <button
                              onClick={() => saveEdit(task.id, 'dueDate')}
                              className="p-1 text-green-600 hover:bg-green-50 rounded"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={cancelEditing}
                              className="p-1 text-red-600 hover:bg-red-50 rounded"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <span 
                            className="cursor-pointer hover:bg-gray-100 p-2 rounded"
                            onClick={() => startEditing(task.id, 'dueDate', task.dueDate ? task.dueDate.split('T')[0] : '')}
                          >
                            {task.dueDate ? new Date(task.dueDate).toLocaleDateString('tr-TR') : '-'}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(task.createdAt).toLocaleDateString('tr-TR')}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => openEditModal(task)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Düzenle"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteTask(task.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Sil"
                          >
                            <Trash2 className="w-4 h-4" />
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

        {/* Create Task Modal */}
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
                  <h3 className="text-xl font-bold text-gray-900">Yeni Görev Oluştur</h3>
                  <button
                    onClick={() => {
                      setShowCreateModal(false);
                      resetForm();
                    }}
                    className="p-2 rounded-lg hover:bg-gray-100"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
                
                <div className="p-6 space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Görev Başlığı *</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 placeholder-gray-500 bg-white"
                      placeholder="Görev başlığını girin"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Açıklama *</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 placeholder-gray-500 bg-white"
                      placeholder="Görev açıklamasını girin"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Başlangıç Tarihi</label>
                      <input
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 bg-white"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Bitiş Tarihi</label>
                      <input
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 bg-white"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Başlangıç Saati</label>
                      <input
                        type="time"
                        value={formData.startTime}
                        onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 bg-white"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Bitiş Saati</label>
                      <input
                        type="time"
                        value={formData.endTime}
                        onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 bg-white"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Son Teslim Tarihi</label>
                    <input
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 bg-white"
                    />
                  </div>
                </div>
                
                <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
                  <button
                    onClick={() => {
                      setShowCreateModal(false);
                      resetForm();
                    }}
                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium"
                  >
                    İptal
                  </button>
                  <button
                    onClick={createTask}
                    className="px-6 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg font-medium flex items-center space-x-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Oluştur</span>
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Edit Task Modal */}
        <AnimatePresence>
          {showEditModal && editingTask && (
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
                  <h3 className="text-xl font-bold text-gray-900">Görevi Düzenle</h3>
                  <button
                    onClick={() => {
                      setShowEditModal(false);
                      setEditingTask(null);
                      resetForm();
                    }}
                    className="p-2 rounded-lg hover:bg-gray-100"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
                
                <div className="p-6 space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Görev Başlığı</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 placeholder-gray-500 bg-white"
                      placeholder="Görev başlığını girin"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Açıklama</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 placeholder-gray-500 bg-white"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Başlangıç Tarihi</label>
                      <input
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 bg-white"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Bitiş Tarihi</label>
                      <input
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 bg-white"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Başlangıç Saati</label>
                      <input
                        type="time"
                        value={formData.startTime}
                        onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 bg-white"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Bitiş Saati</label>
                      <input
                        type="time"
                        value={formData.endTime}
                        onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 bg-white"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Son Teslim Tarihi</label>
                    <input
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 bg-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Durum</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 bg-white"
                    >
                      <option value="PENDING">Beklemede</option>
                      <option value="COMPLETED">Tamamlandı</option>
                      <option value="REJECTED">Reddedildi</option>
                    </select>
                  </div>
                </div>
                
                <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
                  <button
                    onClick={() => {
                      setShowEditModal(false);
                      setEditingTask(null);
                      resetForm();
                    }}
                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium"
                  >
                    İptal
                  </button>
                  <button
                    onClick={updateTask}
                    className="px-6 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg font-medium flex items-center space-x-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Güncelle</span>
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Detail Modal */}
        {showDetailModal && selectedTask && (
          <div className="fixed inset-0 bg-transparent backdrop-blur-md flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-200"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">Görev Detayları</h3>
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="space-y-6">
                  {/* Görev Bilgileri */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">{selectedTask.title}</h4>
                    <p className="text-gray-600">{selectedTask.description}</p>
                  </div>
                  
                  {/* Görev Bilgileri */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Target className="w-5 h-5 text-red-600" />
                      <span className="text-gray-500">Durum:</span>
                      <span className="font-medium text-gray-900">{getStatusText(selectedTask.status)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-5 h-5 text-red-600" />
                      <span className="text-gray-500">Son Teslim:</span>
                      <span className="font-medium text-gray-900">
                        {selectedTask.dueDate ? new Date(selectedTask.dueDate).toLocaleDateString('tr-TR') : 'Belirtilmemiş'}
                      </span>
                    </div>
                  </div>
                  
                  {/* Tarih Bilgileri */}
                  <div className="border-t border-gray-200 pt-4">
                    <h5 className="font-medium text-gray-900 mb-3">Tarih Bilgileri</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-500">Oluşturulma:</span>
                        <span className="text-gray-900">
                          {new Date(selectedTask.createdAt).toLocaleString('tr-TR')}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-500">Güncelleme:</span>
                        <span className="text-gray-900">
                          {new Date(selectedTask.updatedAt).toLocaleString('tr-TR')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Kapat
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}