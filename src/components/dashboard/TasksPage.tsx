'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { SuccessModal } from '@/components/ui/SuccessModal';
import ConfirmationModal from '@/components/ui/ConfirmationModal';
import { 
  Upload, 
  FileText, 
  Link, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Download,
  Eye,
  Plus,
  Cloud,
  Users,
  Calendar,
  Target,
  Award,
  X,
  ArrowLeft,
  RefreshCw,
  Edit,
  XCircle,
  Trash2
} from 'lucide-react';

const TasksPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('tasks');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadType, setUploadType] = useState('file'); // 'file' or 'link'
  const [editingTask, setEditingTask] = useState<any | null>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [availableTasks, setAvailableTasks] = useState<any[]>([]); // Yöneticinin oluşturduğu görevler
  const [selectedTaskForSubmission, setSelectedTaskForSubmission] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    huaweiCloudAccount: '',
    file: null as File | null,
    fileLink: '',
    notes: ''
  });

  // Fetch tasks from API
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setIsLoading(true);
        
        // localStorage'ı temizle ve sadece API'den veri al
        if (user) {
          console.log('=== PAGE LOAD ===');
          console.log('User ID:', user.id);
          
          // localStorage'ı temizle
          localStorage.removeItem(`user_tasks_${user.id}`);
          console.log('✅ localStorage cleared');
        }
        
        // Kullanıcının kendi görevlerini getir (sadece user varsa)
        if (user) {
          try {
          const userTasksRes = await fetch(`/api/tasks?userId=${user.id}`);
          const userTasksJson = await userTasksRes.json();
            console.log('API response:', userTasksJson);
            
            if (userTasksJson.success && userTasksJson.tasks && userTasksJson.tasks.length > 0) {
              const userTasksArray = userTasksJson.tasks;
              console.log('✅ API tasks found:', userTasksArray);
              
              // API'den veri gelirse, direkt set et
              setTasks(userTasksArray);
              console.log('✅ Tasks updated from API');
            } else {
              console.log('❌ No tasks from API');
              setTasks([]);
            }
          } catch (apiError) {
            console.error('❌ API error:', apiError);
            setTasks([]);
          }
        }
        
        // Yöneticinin oluşturduğu mevcut görevleri getir (her zaman)
        console.log('=== FETCHING AVAILABLE TASKS ===');
        const availableTasksRes = await fetch('/api/tasks/available');
        console.log('Available tasks response status:', availableTasksRes.status);
        console.log('Available tasks response ok:', availableTasksRes.ok);
        
        const availableTasksJson = await availableTasksRes.json();
        console.log('Available tasks response JSON:', availableTasksJson);
        console.log('Available tasks count:', availableTasksJson.tasks?.length || 0);
        
        const availableTasksArray = availableTasksJson.success ? 
                                   (availableTasksJson.tasks || []) : 
                                   [];
        setAvailableTasks(availableTasksArray);
        
        console.log('Available tasks array:', availableTasksArray);
        console.log('Available tasks length:', availableTasksArray.length);
        
        // Debug: Her görev için detay
        availableTasksArray.forEach((task: any, index: number) => {
          console.log(`Task ${index + 1}:`, {
            id: task.id,
            title: task.title,
            description: task.description,
            status: task.status,
            userId: task.userId
          });
        });
      } catch (e) {
        console.error('Tasks fetch error', e);
        setError('Görevler yüklenemedi');
        setTasks([]);
        setAvailableTasks([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTasks();
  }, [user]);

  // Sayfa focus olduğunda tasks'ları yenile
  useEffect(() => {
    const fetchTasks = async () => {
      if (!user) return;
      
      try {
        console.log('=== FETCHING TASKS ON FOCUS ===');
        const userTasksRes = await fetch(`/api/tasks?userId=${user.id}`);
        const userTasksJson = await userTasksRes.json();
        
        if (userTasksJson.success && userTasksJson.tasks) {
          setTasks(userTasksJson.tasks);
          console.log('✅ Tasks refreshed on focus');
        }
      } catch (error) {
        console.error('❌ Error refreshing tasks:', error);
      }
    };

    const handleFocus = () => {
      console.log('Page focused, refreshing tasks...');
      if (user) {
        fetchTasks();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [user]);

  const tabs = [
    { id: 'upload', label: 'Görev Yükle', icon: Upload },
    { id: 'tasks', label: 'Görevlerim', icon: FileText }
  ];

  const handleInputChange = (field: string, value: string | File | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('=== SUBMIT FORM START ===');
    
    if (!user) {
      console.log('No user found');
      return;
    }
    
    // Görev seçimi kontrolü
    if (!selectedTaskForSubmission) {
      console.log('No task selected');
      setError('Lütfen yükleme yapmadan önce bir görev seçiniz.');
      return;
    }
    
    console.log('Selected task:', selectedTaskForSubmission);
    console.log('Form data:', formData);
    console.log('Upload type:', uploadType);
    
    setIsUploading(true);
    setError('');
    setSuccessMessage('');
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('userId', user.id);
      formDataToSend.append('taskId', selectedTaskForSubmission.id);
      formDataToSend.append('huaweiCloudAccount', formData.huaweiCloudAccount);
      formDataToSend.append('uploadType', uploadType);
      
      // Güncelleme durumunda editingTask'ın ID'sini de ekle
      if (editingTask) {
        formDataToSend.append('editingTaskId', editingTask.id);
      }
      
      if (uploadType === 'file' && formData.file) {
        formDataToSend.append('file', formData.file);
        console.log('File added to form data:', formData.file.name);
      } else if (uploadType === 'link') {
        formDataToSend.append('fileUrl', formData.fileLink);
        console.log('Link added to form data:', formData.fileLink);
      }
      
      // Güncelleme mi yoksa yeni görev mi?
      const isUpdate = editingTask !== null;
      const endpoint = isUpdate ? '/api/tasks/update' : '/api/tasks/submit';
      const method = isUpdate ? 'PUT' : 'POST';
      
      console.log(`Sending request to ${endpoint} with method ${method}`);
      
      const res = await fetch(endpoint, {
        method: method,
        body: formDataToSend
      });
      
      console.log('Response status:', res.status);
      console.log('Response ok:', res.ok);
      
      if (!res.ok) {
        const errorData = await res.json();
        console.error('API Error:', errorData);
        throw new Error(errorData.error || 'Görev kaydedilemedi');
      }
      
      const newTask = await res.json();
      console.log('Task submitted successfully:', newTask);
      
      // Response kontrolü
      if (!newTask.success) {
        throw new Error(newTask.error || 'Görev kaydedilemedi');
      }
      
      if (editingTask) {
        console.log('=== UPDATING TASK ===');
        console.log('Editing task ID:', editingTask.id);
        console.log('New task from API:', newTask.task);
        console.log('Current tasks before update:', tasks);
        
        const updatedTasks = (tasks || []).map(t => {
          if (t.id === editingTask.id) {
            console.log('Replacing task:', t, 'with:', newTask.task);
            return newTask.task;
          }
          return t;
        });
        
        console.log('Updated tasks array:', updatedTasks);
        setTasks(updatedTasks);
        setSuccessMessage('Görev başarıyla güncellendi!');
        setShowSuccessModal(true);
        // Güncelleme sonrası editingTask'ı temizle
        setEditingTask(null);
      } else {
        const newTasks = [newTask.task, ...(tasks || [])];
        console.log('New tasks array:', newTasks);
        setTasks(newTasks);
        setSuccessMessage('Görev başarıyla yüklendi!');
        setShowSuccessModal(true);
        console.log('Task saved to localStorage:', newTask.task);
      }
      
      // Reset form
      setFormData({
        huaweiCloudAccount: '',
        file: null,
        fileLink: '',
        notes: ''
      });
      setSelectedTaskForSubmission(null);
      setEditingTask(null); // editingTask'ı da temizle
      setActiveTab('tasks');
      
      setTimeout(() => setSuccessMessage(''), 3000);
      
    } catch (e) {
      console.error('=== SUBMIT FORM ERROR ===');
      console.error('Error:', e);
      setError(e instanceof Error ? e.message : 'Görev kaydedilemedi');
    } finally {
      setIsUploading(false);
    }
  };

  // handleDelete fonksiyonu eklendi
  const handleDelete = (taskId: string) => {
    setTaskToDelete(taskId);
    setShowConfirmModal(true);
  };

  const confirmDelete = async () => {
    if (!user || !taskToDelete) return;
    
    console.log('=== DELETING TASK ===');
    console.log('Task ID to delete:', taskToDelete);
    console.log('Current tasks before delete:', tasks);
    
    try {
      const response = await fetch(`/api/tasks/${taskToDelete}`, {
        method: 'DELETE'
      });
      
      console.log('Delete response status:', response.status);
      console.log('Delete response ok:', response.ok);
      
      if (response.ok) {
        // Görev listesinden kaldır
        const filteredTasks = tasks.filter(task => task.id !== taskToDelete);
        console.log('Filtered tasks after delete:', filteredTasks);
        setTasks(filteredTasks);
        setSuccessMessage('Görev başarıyla silindi!');
        setShowSuccessModal(true);
      } else {
        const errorData = await response.json();
        console.error('Delete API error:', errorData);
        setError(errorData.error || 'Görev silinemedi');
      }
    } catch (error) {
      console.error('Delete error:', error);
      setError('Görev silinemedi');
    } finally {
      setTaskToDelete(null);
    }
  };

  const handleViewDetail = (task: any) => {
    setSelectedTask(task);
    setShowDetailModal(true);
  };

  // Görev yükleme yapılabilir mi kontrol et
  const canSubmitTask = (task: any) => {
    const now = new Date();
    
    // Görev durumu kontrolü - sadece IN_PROGRESS durumundaki görevlerde yükleme yapılabilir
    if (task.status !== 'IN_PROGRESS') {
      return false;
    }
    
    // Görev başlamamışsa yükleme yapılamaz
    if (task.startDate) {
      const startDate = new Date(task.startDate);
      if (task.startTime) {
        const [hours, minutes] = task.startTime.split(':').map(Number);
        startDate.setHours(hours, minutes, 0, 0);
      }
      if (startDate > now) {
        return false;
      }
    }
    
    // Görev bitmişse yükleme yapılamaz
    if (task.endDate) {
      const endDate = new Date(task.endDate);
      if (task.endTime) {
        const [hours, minutes] = task.endTime.split(':').map(Number);
        endDate.setHours(hours, minutes, 0, 0);
      }
      if (endDate < now) {
        return false;
      }
    }
    
    return true;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'SUBMITTED':
        return <Upload className="w-5 h-5 text-blue-600" />;
      case 'PENDING':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'REJECTED':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'NEEDS_REVISION':
        return <RefreshCw className="w-5 h-5 text-orange-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'Onaylandı';
      case 'SUBMITTED':
        return 'Teslim Edildi';
      case 'PENDING':
        return 'Bekliyor';
      case 'REJECTED':
        return 'Reddedildi';
      case 'NEEDS_REVISION':
        return 'Revizyon Gerekli';
      default:
        return 'Bilinmiyor';
    }
  };


  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="sr-only">Görev Yönetimi</h1>
          <p className="text-gray-600 mt-2">Görevlerinizi yükleyin ve takip edin</p>
        </div>
        <div className="flex items-center space-x-3">
          {/* Yeni Görev butonu kaldırıldı - Sadece admin görev oluşturabilir */}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <IconComponent className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'tasks' && (
        <div className="space-y-6">
          {/* Bilgilendirme */}
          <div className="flex justify-between items-center bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Görev Yükleme</h3>
              <p className="text-gray-600 text-sm">Admin tarafından oluşturulan görevleri seçip yükleme yapabilirsiniz</p>
            </div>
            <motion.button
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                // Form'u temizle
                setFormData({
                  huaweiCloudAccount: '',
                  file: null,
                  fileLink: '',
                  notes: ''
                });
                setSelectedTaskForSubmission(null);
                setEditingTask(null);
                setUploadType('file');
                setActiveTab('upload');
              }}
            >
              <Upload className="w-5 h-5" />
              <span>Görev Yükle</span>
            </motion.button>
          </div>


          {/* Görevler Listesi */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Kullanıcının Kendi Görevleri */}
              {tasks && tasks.length > 0 ? (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-blue-600" />
                    Yüklediğiniz Görevler ({tasks.length})
                  </h3>
                  <div className="space-y-4">
                    {tasks.map((task, index) => (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center space-x-3">
                              <h3 className="text-xl font-bold text-gray-900">{task.title}</h3>
                              {getStatusIcon(task.status)}
                              <span className="text-sm text-gray-500">{getStatusText(task.status)}</span>
                            </div>
                            
                            {/* Görev Durumu */}
                            <div className="flex items-center space-x-2">
                              <Target className="w-4 h-4 text-red-600" />
                              <span className="text-sm text-gray-500">Durum:</span>
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                task.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                                task.status === 'SUBMITTED' ? 'bg-blue-100 text-blue-700' :
                                task.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                                task.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                                task.status === 'NEEDS_REVISION' ? 'bg-orange-100 text-orange-700' :
                                'bg-gray-100 text-gray-700'
                              }`}>
                                {task.status === 'APPROVED' ? 'Onaylandı' :
                                 task.status === 'SUBMITTED' ? 'Teslim Edildi' :
                                 task.status === 'PENDING' ? 'Bekliyor' :
                                 task.status === 'REJECTED' ? 'Reddedildi' :
                                 task.status === 'NEEDS_REVISION' ? 'Revizyon Gerekli' :
                                 task.status}
                              </span>
                            </div>
                          </div>
                          
                          <p className="text-gray-600 mb-4">{task.description}</p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                            <div className="flex items-center space-x-2">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-500">Yükleme:</span>
                              <span className="text-gray-900">
                                {task.createdAt ? new Date(task.createdAt).toLocaleDateString('tr-TR') : 'Belirtilmemiş'}
                              </span>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-500">Güncelleme:</span>
                              <span className="text-gray-900">
                                {task.updatedAt ? new Date(task.updatedAt).toLocaleDateString('tr-TR') : 'Belirtilmemiş'}
                              </span>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <Cloud className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-500">Huawei Cloud:</span>
                              <span className="text-gray-900">{task.huaweiCloudAccount || 'Belirtilmemiş'}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2 mt-4">
                            <button 
                              onClick={() => handleViewDetail(task)}
                              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Detayları Görüntüle"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            
                            {/* Düzenleme Butonu - Sadece teslim edilen görevler için */}
                            {task.status === 'SUBMITTED' && (
                              <button 
                                onClick={() => {
                                  setEditingTask(task);
                                  setSelectedTaskForSubmission(task);
                                  setFormData({
                                    huaweiCloudAccount: task.huaweiCloudAccount || '',
                                    file: null,
                                    fileLink: task.linkUrl || '',
                                    notes: task.notes || ''
                                  });
                                  setUploadType(task.uploadType === 'LINK' ? 'link' : 'file');
                                  setActiveTab('upload');
                                }}
                                className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                title="Görevi Düzenle"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                            )}
                            
                            {/* Silme Butonu - Tüm görevler için */}
                            <button 
                              onClick={() => handleDelete(task.id)}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Görevi Sil"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-blue-600" />
                    Yüklediğiniz Görevler (0)
                  </h3>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200"
                  >
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FileText className="w-6 h-6 text-gray-400" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Henüz görev yok</h4>
                    <p className="text-gray-600 mb-4">Yüklediğiniz görevler burada görünecek.</p>
                    <motion.button
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 mx-auto"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        // Form'u temizle
                        setFormData({
                          huaweiCloudAccount: '',
                          file: null,
                          fileLink: '',
                          notes: ''
                        });
                        setSelectedTaskForSubmission(null);
                        setEditingTask(null);
                        setUploadType('file');
                        setActiveTab('upload');
                      }}
                    >
                      <Upload className="w-4 h-4" />
                      <span>Görev Yükle</span>
                    </motion.button>
                  </motion.div>
                </div>
              )}

              {/* Mevcut Görevler (Admin Tarafından Oluşturulan) */}
              {availableTasks && availableTasks.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Target className="w-5 h-5 mr-2 text-green-600" />
                    Mevcut Görevler ({availableTasks.length})
                  </h3>
                  <div className="space-y-4">
                     {availableTasks.map((task, index) => {
                       const canSubmit = canSubmitTask(task);
                       const now = new Date();
                       const startDate = task.startDate ? new Date(task.startDate) : null;
                       const endDate = task.endDate ? new Date(task.endDate) : null;
                       const isStarted = startDate ? startDate <= now : true;
                       const isEnded = endDate ? endDate < now : false;
                       
                       // Görev durumuna göre mesaj belirleme
                       let statusMessage = '';
                       if (task.status === 'PENDING') {
                         statusMessage = 'Görev henüz başlamamış';
                       } else if (task.status === 'COMPLETED') {
                         statusMessage = 'Görev tamamlanmış';
                       } else if (task.status === 'IN_PROGRESS') {
                         if (!isStarted) {
                           statusMessage = 'Görev henüz başlamamış';
                         } else if (isEnded) {
                           statusMessage = 'Görev süresi dolmuş';
                         }
                       }
                       
                       return (
                         <motion.div
                           key={task.id}
                           initial={{ opacity: 0, y: 20 }}
                           animate={{ opacity: 1, y: 0 }}
                           transition={{ delay: index * 0.1 }}
                           className={`rounded-xl shadow-sm ${
                             canSubmit ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'
                           }`}
                         >
                           <div className="p-6">
                             <div className="flex items-start justify-between mb-4">
                               <div className="flex items-center space-x-3">
                                 <h3 className="text-xl font-bold text-gray-900">{task.title}</h3>
                                 <span className={`text-xs px-2 py-1 rounded-full ${
                                   canSubmit ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                                 }`}>
                                   {canSubmit ? 'Aktif' : 'Pasif'}
                                 </span>
                               </div>
                             </div>
                             
                             <p className="text-gray-600 mb-4">{task.description}</p>
                             
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
                               <div className="flex items-center space-x-2">
                                 <Calendar className="w-4 h-4 text-blue-600" />
                                 <span className="text-gray-500">Başlama:</span>
                                 <span className="text-gray-900">
                                   {task.startDate ? new Date(task.startDate).toLocaleDateString('tr-TR') : 'Belirtilmemiş'}
                                   {task.startTime && ` ${task.startTime}`}
                                 </span>
                               </div>
                               
                               <div className="flex items-center space-x-2">
                                 <Calendar className="w-4 h-4 text-red-600" />
                                 <span className="text-gray-500">Bitiş:</span>
                                 <span className="text-gray-900">
                                   {task.endDate ? new Date(task.endDate).toLocaleDateString('tr-TR') : 'Belirtilmemiş'}
                                   {task.endTime && ` ${task.endTime}`}
                                 </span>
                               </div>
                             </div>
                             
                             {!canSubmit && (
                               <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                                 <div className="flex items-center space-x-2">
                                   <AlertCircle className="w-4 h-4 text-yellow-600" />
                                   <span className="text-sm text-yellow-800">
                                     {statusMessage}
                                   </span>
                                 </div>
                               </div>
                             )}
                             
                             <div className="mt-4">
                               <motion.button
                                 onClick={() => {
                                   if (canSubmit) {
                                     // Form'u temizle
                                     setFormData({
                                       huaweiCloudAccount: '',
                                       file: null,
                                       fileLink: '',
                                       notes: ''
                                     });
                                     setEditingTask(null);
                                     setUploadType('file');
                                     setSelectedTaskForSubmission(task);
                                     setActiveTab('upload');
                                   }
                                 }}
                                 disabled={!canSubmit}
                                 className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                                   canSubmit 
                                     ? 'bg-green-600 hover:bg-green-700 text-white cursor-pointer' 
                                     : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                 }`}
                                 whileHover={canSubmit ? { scale: 1.02 } : {}}
                                 whileTap={canSubmit ? { scale: 0.98 } : {}}
                               >
                                 <Upload className="w-4 h-4" />
                                 <span>{canSubmit ? 'Bu Görevi Seç ve Yükle' : 'Yükleme Yapılamaz'}</span>
                               </motion.button>
                             </div>
                           </div>
                         </motion.div>
                       );
                     })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Tab Content */}
      {activeTab === 'upload' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm"
        >
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <button
                onClick={() => setActiveTab('tasks')}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Görevlere Dön</span>
              </button>
              <div className="text-center flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {editingTask ? 'Görevi Düzenle' : 'Yeni Görev Oluştur'}
                </h2>
                <p className="text-gray-600">
                  {editingTask ? 'Görev bilgilerini güncelleyin' : 'Görev detaylarınızı girin ve dosyanızı yükleyin'}
                </p>
                {editingTask && (
                  <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-700">
                      <strong>Düzenlenen Görev:</strong> {editingTask.title}
                </p>
                  </div>
                )}
              </div>
              <div className="w-20"></div>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Huawei Cloud Account */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Huawei Cloud Kullanıcı Adı *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Cloud className="h-5 w-5 text-gray-900" />
                  </div>
                  <input
                    type="text"
                    value={formData.huaweiCloudAccount}
                    onChange={(e) => handleInputChange('huaweiCloudAccount', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 placeholder-gray-600"
                    placeholder="ornek_kullanici"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Huawei Cloud hesabınızın kullanıcı adını girin</p>
              </div>

              {/* Görev Seçimi - Sadece yeni görev oluştururken göster */}
              {!editingTask && (
              <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
                <label className="block text-sm font-bold text-red-800 mb-2">
                  ⚠️ Görev Seçin (Zorunlu) *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FileText className="h-5 w-5 text-red-600" />
                  </div>
                  <select
                    value={selectedTaskForSubmission?.id || ''}
                    onChange={(e) => {
                      const taskId = e.target.value;
                      const task = availableTasks.find(t => t.id === taskId);
                      setSelectedTaskForSubmission(task || null);
                    }}
                    className="w-full pl-10 pr-4 py-3 border-2 border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900 bg-white font-medium"
                    required
                  >
                    <option value="">🔴 Lütfen bir görev seçin...</option>
                    {availableTasks.length > 0 ? (
                      availableTasks.map((task) => {
                        const canSubmit = canSubmitTask(task);
                        return (
                          <option 
                            key={task.id} 
                            value={task.id}
                            disabled={!canSubmit}
                            className={!canSubmit ? 'text-gray-400' : ''}
                          >
                            {canSubmit ? `✅ ${task.title}` : `❌ ${task.title} (Pasif)`}
                          </option>
                        );
                      })
                    ) : (
                      <option value="" disabled>Görev bulunamadı</option>
                    )}
                  </select>
                </div>
                <p className="text-sm text-red-700 mt-2 font-medium">
                  ⚠️ Yönetici tarafından oluşturulan görevlerden birini seçmeden yükleme yapamazsınız!
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Debug: {availableTasks.length} görev mevcut
                </p>
                {availableTasks.length > 0 && (
                  <div className="mt-2 p-2 bg-blue-50 rounded text-xs">
                    <p className="font-semibold">Mevcut Görevler:</p>
                    {availableTasks.map((task, index) => (
                      <p key={task.id} className="text-blue-700">
                        {index + 1}. {task.title} (ID: {task.id})
                      </p>
                    ))}
              </div>
                )}
              </div>
              )}

              {/* Düzenleme Modunda Seçilen Görev Bilgisi */}
              {editingTask && (
                <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                  <label className="block text-sm font-bold text-blue-800 mb-2">
                    📝 Düzenlenen Görev
                  </label>
                  <div className="bg-white border border-blue-300 rounded-lg p-3">
                    <h3 className="font-semibold text-gray-900 mb-1">{editingTask.title}</h3>
                    <p className="text-sm text-gray-600">{editingTask.description}</p>
                    <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                      <span>Başlama: {editingTask.startDate ? new Date(editingTask.startDate).toLocaleDateString('tr-TR') : 'Belirtilmemiş'}</span>
                      <span>Bitiş: {editingTask.dueDate ? new Date(editingTask.dueDate).toLocaleDateString('tr-TR') : 'Belirtilmemiş'}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Upload Type - Sadece görev seçildikten sonra aktif */}
              <div className={!selectedTaskForSubmission ? 'opacity-50 pointer-events-none' : ''}>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Yükleme Türü *
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setUploadType('file')}
                    className={`p-4 border-2 rounded-lg transition-colors ${
                      uploadType === 'file'
                        ? 'border-red-500 bg-red-50 text-red-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Upload className={`w-5 h-5 ${uploadType === 'file' ? 'text-red-700' : 'text-gray-900'}`} />
                      <div className="text-left">
                        <p className={`font-medium ${uploadType === 'file' ? 'text-red-700' : 'text-gray-900'}`}>Dosya Yükle</p>
                        <p className={`text-sm ${uploadType === 'file' ? 'text-red-700' : 'text-gray-900'}`}>PDF, DOC, ZIP vb.</p>
                      </div>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setUploadType('link')}
                    className={`p-4 border-2 rounded-lg transition-colors ${
                      uploadType === 'link'
                        ? 'border-red-500 bg-red-50 text-red-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Link className={`w-5 h-5 ${uploadType === 'link' ? 'text-red-700' : 'text-gray-900'}`} />
                      <div className="text-left">
                        <p className={`font-medium ${uploadType === 'link' ? 'text-red-700' : 'text-gray-900'}`}>Link Paylaş</p>
                        <p className={`text-sm ${uploadType === 'link' ? 'text-red-700' : 'text-gray-900'}`}>Google Drive, Dropbox vb.</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* File Upload or Link - Sadece görev seçildikten sonra aktif */}
              {uploadType === 'file' ? (
                <div className={!selectedTaskForSubmission ? 'opacity-50 pointer-events-none' : ''}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dosya Seç *
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-red-400 transition-colors">
                    <input
                      type="file"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                      accept=".pdf,.doc,.docx,.zip,.rar"
                      required
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <Upload className="w-8 h-8 text-gray-900 mx-auto mb-2" />
                      <p className="text-sm text-gray-900">
                        {formData.file ? formData.file.name : 'Dosya seçmek için tıklayın'}
                      </p>
                      <p className="text-xs text-gray-900 mt-1">
                        PDF, DOC, DOCX, ZIP, RAR (Max 10MB)
                      </p>
                    </label>
                  </div>
                </div>
              ) : (
                <div className={!selectedTaskForSubmission ? 'opacity-50 pointer-events-none' : ''}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dosya Linki *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Link className="h-5 w-5 text-gray-900" />
                    </div>
                    <input
                      type="url"
                      value={formData.fileLink}
                      onChange={(e) => handleInputChange('fileLink', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 placeholder-gray-600"
                      placeholder="https://drive.google.com/file/..."
                      required
                    />
                  </div>
                </div>
              )}

              {/* Notes - Sadece görev seçildikten sonra aktif */}
              <div className={!selectedTaskForSubmission ? 'opacity-50 pointer-events-none' : ''}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notlar
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 placeholder-gray-600"
                  placeholder="Ek notlar veya açıklamalar..."
                  rows={2}
                />
              </div>

              {/* Görev Seçilmediğinde Uyarı */}
              {!selectedTaskForSubmission && (
                <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="w-5 h-5 text-yellow-600" />
                    <p className="text-yellow-800 font-medium">
                      ⚠️ Lütfen önce yukarıdan bir görev seçin, sonra yükleme yapabilirsiniz.
                    </p>
                  </div>
                </div>
              )}

              {/* Submit Button - Sadece görev seçildikten sonra aktif */}
              <div className={`flex items-center justify-end space-x-4 ${!selectedTaskForSubmission ? 'opacity-50 pointer-events-none' : ''}`}>
                <button
                  type="button"
                  onClick={() => {
                    setFormData({
                      huaweiCloudAccount: '',
                      file: null,
                      fileLink: '',
                      notes: ''
                    });
                    setSelectedTaskForSubmission(null);
                    setEditingTask(null);
                  }}
                  className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Temizle
                </button>
                <motion.button
                  type="submit"
                  disabled={isUploading}
                  className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isUploading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Yükleniyor...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      <span>{editingTask ? 'Görevi Güncelle' : 'Görev Yükle'}</span>
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </div>
        </motion.div>
      )}

      {/* Success/Error Messages */}
      {(successMessage || error) && (
        <div className="space-y-4">
          {successMessage && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 text-sm">{successMessage}</p>
            </div>
          )}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedTask && (
        <div className="fixed inset-0 bg-transparent backdrop-blur-md flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
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
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">{selectedTask.title}</h4>
                <p className="text-gray-600">{selectedTask.description}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Cloud className="w-5 h-5 text-red-600" />
                  <span className="text-gray-500">Huawei Cloud:</span>
                  <span className="font-medium text-gray-900">{selectedTask.huaweiCloudAccount || 'Belirtilmemiş'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-red-600" />
                  <span className="text-gray-500">Yükleme:</span>
                  <span className="font-medium text-gray-900">{new Date(selectedTask.createdAt).toLocaleDateString('tr-TR')} {new Date(selectedTask.createdAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Target className="w-5 h-5 text-red-600" />
                  <span className="text-gray-500">Durum:</span>
                  <span className="font-medium text-gray-900">{getStatusText(selectedTask.status)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Upload className="w-5 h-5 text-red-600" />
                  <span className="text-gray-500">Tür:</span>
                  <span className="font-medium text-gray-900">{selectedTask.uploadType === 'FILE' ? 'Dosya' : 'Link'}</span>
                </div>
              </div>
              
              {(selectedTask.fileUrl || selectedTask.linkUrl) && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h5 className="font-medium text-gray-900 mb-2">
                    {selectedTask.uploadType === 'FILE' ? 'Dosya' : 'Link'}
                  </h5>
                  {selectedTask.uploadType === 'FILE' ? (
                    <a 
                      href={`/api/files/${encodeURIComponent(selectedTask.fileUrl.split('/').pop() || '')}`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      download={selectedTask.fileUrl.split('/').pop()}
                      className="text-red-600 hover:text-red-700 underline"
                    >
                      Dosyayı İndir
                    </a>
                  ) : (
                    <a 
                      href={selectedTask.linkUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-red-600 hover:text-red-700 break-all"
                    >
                      {selectedTask.linkUrl}
                    </a>
                  )}
                </div>
              )}
              
              <div className="flex items-center justify-end space-x-3">
                {/* Düzenleme butonu kaldırıldı - Sadece admin görevleri düzenleyebilir */}
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Kapat
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        message={successMessage}
      />

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={confirmDelete}
        title="Görev Silme Onayı"
        message="Bu görevi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz."
        confirmText="Evet, Sil"
        cancelText="İptal"
        type="danger"
      />

    </div>
  );
};

export default TasksPage;
