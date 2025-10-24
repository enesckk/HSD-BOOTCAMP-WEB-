'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Target, Plus, Calendar, Users, CheckCircle, Clock, Edit, Trash2, Eye } from 'lucide-react';
import InstructorLayout from '@/components/layout/InstructorLayout';
import { SuccessModal } from '@/components/ui/SuccessModal';
import { TaskCreateModal } from '@/components/ui/TaskCreateModal';
import { TabComponent } from '@/components/ui/TabComponent';

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

const TasksPage = () => {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [activeTab, setActiveTab] = useState('tasks');
  const [taskSubmissions, setTaskSubmissions] = useState<any[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
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
    }
  }, [authLoading, isAuthenticated, user, router]);

    const fetchTasks = async () => {
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

  const handleCreateSuccess = (message: string) => {
    setSuccessMessage(message);
    setShowSuccessModal(true);
    fetchTasks(); // Görevleri yenile
  };

  const handleStatusChange = async (taskId: string, newStatus: string) => {
    try {
      const token = localStorage.getItem('afet_maratonu_token');
      const response = await fetch('/api/instructor/tasks', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ taskId, status: newStatus }),
      });

      if (response.ok) {
        setSuccessMessage('Görev durumu başarıyla güncellendi!');
        setShowSuccessModal(true);
        fetchTasks(); // Görevleri yenile
      } else {
        const errorData = await response.json();
        setSuccessMessage('Görev durumu güncellenemedi: ' + (errorData.message || 'Bilinmeyen hata'));
        setShowSuccessModal(true);
      }
    } catch (error) {
      console.error('Error updating task status:', error);
      setSuccessMessage('Görev durumu güncellenirken hata oluştu');
      setShowSuccessModal(true);
    }
  };

  const handleDelete = async (taskId: string) => {
    if (!confirm('Bu görevi silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      const token = localStorage.getItem('afet_maratonu_token');
      const response = await fetch('/api/instructor/tasks', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ taskId }),
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
    }
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
    { id: 'submissions', label: 'Görev Teslimleri', count: taskSubmissions.length }
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
        {/* Description */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            Bootcamp görevlerini düzenleyin ve yönetin. Yeni görevler oluşturun, mevcut görevleri takip edin.
          </p>
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
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Görevler ({tasks.length})
                </h2>
          </div>
          
              <div className="divide-y divide-gray-200">
          {tasks.length === 0 ? (
                  <div className="p-12 text-center">
                    <Target className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Henüz oluşturulan görev yok</h3>
                    <p className="text-gray-500 mb-6">
                      İlk görevinizi oluşturmak için "Yeni Görev" butonuna tıklayın.
                    </p>
                    <button 
                      onClick={() => setShowCreateModal(true)}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 transition-colors"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      İlk Görevi Oluştur
                    </button>
            </div>
          ) : (
                  tasks.map((task) => (
                    <div key={task.id} className="p-6 hover:bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-gray-900 mb-2">
                            {task.title}
                          </h3>
                          <p className="text-gray-600 mb-4">{task.description}</p>
                          
                          <div className="flex items-center space-x-6 text-sm text-gray-500">
                            {task.startDate && (
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-2" />
                                Başlangıç: {new Date(task.startDate).toLocaleDateString('tr-TR')}
                                {task.startTime && ` ${task.startTime}`}
                              </div>
                            )}
                            {task.endDate && (
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-2" />
                                Bitiş: {new Date(task.endDate).toLocaleDateString('tr-TR')}
                                {task.endTime && ` ${task.endTime}`}
                              </div>
                            )}
                            {!task.startDate && !task.endDate && task.dueDate && (
                        <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-2" />
                                Bitiş: {new Date(task.dueDate).toLocaleDateString('tr-TR')}
                              </div>
                            )}
                            </div>
                          </div>
                        
                        <div className="ml-4 flex items-center space-x-3">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                            {getStatusText(task.status)}
                          </span>
                          <div className="flex items-center space-x-2">
                            <button 
                              onClick={() => handleView(task)}
                              className="text-gray-400 hover:text-gray-600 transition-colors" 
                              title="Detayları Görüntüle"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => handleEdit(task)}
                              className="text-gray-400 hover:text-blue-600 transition-colors" 
                              title="Düzenle"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => handleDelete(task.id)}
                              className="text-gray-400 hover:text-red-600 transition-colors" 
                              title="Sil"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                          
                          {/* Status Change Buttons */}
                          <div className="flex items-center space-x-2 ml-4">
                            {task.status === 'PENDING' && (
                              <button
                                onClick={() => handleStatusChange(task.id, 'IN_PROGRESS')}
                                className="px-3 py-1 text-xs font-medium text-blue-600 bg-blue-100 hover:bg-blue-200 rounded-full transition-colors"
                              >
                                Başlat
                              </button>
                            )}
                            {task.status === 'IN_PROGRESS' && (
                              <button
                                onClick={() => handleStatusChange(task.id, 'COMPLETED')}
                                className="px-3 py-1 text-xs font-medium text-green-600 bg-green-100 hover:bg-green-200 rounded-full transition-colors"
                              >
                                Bitir
                              </button>
                            )}
                            {task.status === 'COMPLETED' && (
                              <button
                                onClick={() => handleStatusChange(task.id, 'IN_PROGRESS')}
                                className="px-3 py-1 text-xs font-medium text-blue-600 bg-blue-100 hover:bg-blue-200 rounded-full transition-colors"
                              >
                                Tekrar Başlat
                              </button>
                            )}
                          </div>
                            </div>
                          </div>
                        </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}

        {activeTab === 'submissions' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Görev Teslimleri ({taskSubmissions.length})
              </h2>
            </div>
            
            <div className="p-6">
              <div className="text-center py-12">
                <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Henüz teslim yok</h3>
                <p className="text-gray-500">
                  Katılımcılar görevlerini tamamladığında burada görünecek.
                </p>
              </div>
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
    </InstructorLayout>
  );
};

export default TasksPage;