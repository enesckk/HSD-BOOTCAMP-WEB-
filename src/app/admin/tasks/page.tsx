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
  X
} from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'PENDING' | 'COMPLETED' | 'REJECTED';
  startDate?: string;
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
    dueDate: '',
    status: 'PENDING' as 'PENDING' | 'COMPLETED' | 'REJECTED'
  });

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !user || user.role !== 'ADMIN')) {
      router.push('/login');
      return;
    }
  }, [isLoading, isAuthenticated, user, router]);

  useEffect(() => {
    fetchTasks();
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
        setTasks(data.tasks || []);
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
      dueDate: '',
      status: 'PENDING'
    });
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description,
      startDate: task.startDate ? task.startDate.split('T')[0] : '',
      dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
      status: task.status
    });
    setShowEditModal(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-8 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Görev Yönetimi</h1>
              <p className="text-red-100 text-lg">Bootcamp görevlerini oluşturun ve yönetin</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-white text-red-600 px-6 py-3 rounded-xl font-semibold hover:bg-red-50 transition-colors flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Yeni Görev</span>
            </button>
          </div>
        </motion.div>

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
                          <h3 className="font-semibold text-gray-900">{task.title}</h3>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{task.description}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(task.status)}`}>
                          {getStatusText(task.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {task.startDate ? new Date(task.startDate).toLocaleDateString('tr-TR') : '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {task.dueDate ? new Date(task.dueDate).toLocaleDateString('tr-TR') : '-'}
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
                      <label className="block text-sm font-medium text-gray-700 mb-2">Başlama Tarihi *</label>
                      <input
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 bg-white"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Bitiş Tarihi *</label>
                      <input
                        type="date"
                        value={formData.dueDate}
                        onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 bg-white"
                        required
                      />
                    </div>
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
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Başlama Tarihi</label>
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
      </div>
    </AdminLayout>
  );
}