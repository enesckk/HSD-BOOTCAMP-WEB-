'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { 
  Upload, 
  FileText, 
  Link, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Edit3,
  Trash2,
  Download,
  Eye,
  Plus,
  Cloud,
  Users,
  Calendar,
  Target,
  Award,
  X
} from 'lucide-react';

const TasksPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('upload');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadType, setUploadType] = useState('file'); // 'file' or 'link'
  const [editingTask, setEditingTask] = useState<any | null>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    huaweiCloudAccount: '',
    file: null as File | null,
    fileLink: '',
    notes: ''
  });

  // Fetch tasks from API
  useEffect(() => {
    const fetchTasks = async () => {
      if (!user) return;
      try {
        setIsLoading(true);
        const res = await fetch(`/api/tasks?userId=${user.id}&includeTeam=true`);
        const json = await res.json();
        console.log('Tasks API response:', json);
        
        // Ensure we always have an array
        const tasksArray = Array.isArray(json) ? json : 
                          Array.isArray(json.items) ? json.items : 
                          Array.isArray(json.tasks) ? json.tasks : [];
        
        console.log('Tasks array:', tasksArray);
        setTasks(tasksArray);
      } catch (e) {
        console.error('Tasks fetch error', e);
        setError('Görevler yüklenemedi');
        setTasks([]); // Ensure tasks is always an array
      } finally {
        setIsLoading(false);
      }
    };
    fetchTasks();
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
    if (!user) return;
    
    setIsUploading(true);
    setError('');
    setSuccessMessage('');
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('userId', user.id);
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('huaweiCloudAccount', formData.huaweiCloudAccount);
      formDataToSend.append('uploadType', uploadType);
      
      if (uploadType === 'file' && formData.file) {
        formDataToSend.append('file', formData.file);
      } else if (uploadType === 'link') {
        formDataToSend.append('fileUrl', formData.fileLink);
      }
      
      const url = editingTask ? `/api/tasks/${editingTask.id}` : '/api/tasks';
      const method = editingTask ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        body: formDataToSend
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Görev kaydedilemedi');
      }
      
      const newTask = await res.json();
      
      if (editingTask) {
        setTasks(prev => (prev || []).map(t => t.id === editingTask.id ? newTask : t));
        setSuccessMessage('Görev başarıyla güncellendi!');
      } else {
        setTasks(prev => [newTask, ...(prev || [])]);
        setSuccessMessage('Görev başarıyla yüklendi!');
      }
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        huaweiCloudAccount: '',
        file: null,
        fileLink: '',
        notes: ''
      });
      setEditingTask(null);
      setActiveTab('tasks');
      
      setTimeout(() => setSuccessMessage(''), 3000);
      
    } catch (e) {
      console.error('Task save error', e);
      setError(e instanceof Error ? e.message : 'Görev kaydedilemedi');
    } finally {
      setIsUploading(false);
    }
  };

  const handleEdit = (task: any) => {
    if (!task) return;
    setFormData({
      title: task.title || '',
      description: task.description || '',
      huaweiCloudAccount: task.huaweiCloudAccount || '',
      file: null,
      fileLink: task.fileUrl || '',
      notes: ''
    });
    setUploadType(task.uploadType === 'LINK' ? 'link' : 'file');
    setEditingTask(task);
    setActiveTab('upload');
  };

  const handleDelete = async (taskId: string) => {
    if (!taskId || !confirm('Bu görevi silmek istediğinizden emin misiniz?')) return;
    
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE'
      });
      
      if (!res.ok) throw new Error('Görev silinemedi');
      
      setTasks(prev => (prev || []).filter(t => t.id !== taskId));
      setSuccessMessage('Görev başarıyla silindi!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (e) {
      console.error('Delete error', e);
      setError('Görev silinemedi');
    }
  };

  const handleViewDetail = (task: any) => {
    setSelectedTask(task);
    setShowDetailModal(true);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'PENDING':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'Tamamlandı';
      case 'PENDING':
        return 'Bekliyor';
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
          <motion.button
            className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab('upload')}
          >
            <Plus className="w-4 h-4" />
            <span>Yeni Görev</span>
          </motion.button>
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
      {activeTab === 'upload' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm"
        >
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {editingTask ? 'Görevi Düzenle' : 'Görev Yükle'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Task Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Görev Adı *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 placeholder-gray-600"
                  placeholder="Örn: Proje Planı"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Açıklama *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 placeholder-gray-600"
                  placeholder="Görev hakkında detaylı açıklama..."
                  rows={3}
                  required
                />
              </div>

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

              {/* Upload Type */}
              <div>
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

              {/* File Upload or Link */}
              {uploadType === 'file' ? (
                <div>
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
                <div>
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

              {/* Notes */}
              <div>
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

              {/* Submit Button */}
              <div className="flex items-center justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setFormData({
                      title: '',
                      description: '',
                      huaweiCloudAccount: '',
                      file: null,
                      fileLink: '',
                      notes: ''
                    });
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

      {activeTab === 'tasks' && (
        <div className="space-y-6">
          {/* Success/Error Messages */}
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
          
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
              <span className="ml-3 text-gray-600">Görevler yükleniyor...</span>
            </div>
          ) : (tasks || []).length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm text-center"
            >
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Henüz görev yok</h3>
              <p className="text-gray-600">İlk görevinizi yüklemek için "Görev Yükle" sekmesini kullanın.</p>
            </motion.div>
          ) : (
            (tasks || []).map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <h3 className="text-xl font-bold text-gray-900">{task.title}</h3>
                      {getStatusIcon(task.status)}
                      <span className="text-sm text-gray-500">{getStatusText(task.status)}</span>
                    </div>
                    
                    {/* Görev Sahibi */}
                    {task.user && (
                      <div className="flex items-center space-x-2 mb-3">
                        <Users className="w-4 h-4 text-red-600" />
                        <span className="text-sm text-gray-500">Görev Sahibi:</span>
                        <span className="font-medium text-gray-900">{task.user.fullName}</span>
                        {task.user.teamRole && (
                          <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
                            {task.user.teamRole === 'LIDER' ? 'Lider' : 
                             task.user.teamRole === 'TEKNIK_SORUMLU' ? 'Teknik Sorumlu' : 
                             task.user.teamRole === 'TASARIMCI' ? 'Tasarımcı' : 'Üye'}
                          </span>
                        )}
                      </div>
                    )}
                    
                    <p className="text-gray-600 mb-4">{task.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <Cloud className="w-4 h-4 text-red-600" />
                        <span className="text-gray-500">Huawei Cloud:</span>
                        <span className="font-medium text-gray-900">{task.huaweiCloudAccount || 'Belirtilmemiş'}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-red-600" />
                        <span className="text-gray-500">Yükleme:</span>
                        <span className="font-medium text-gray-900">{new Date(task.createdAt).toLocaleDateString('tr-TR')} {new Date(task.createdAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      {task.uploadType === 'FILE' && task.fileUrl && (
                        <div className="flex items-center space-x-2">
                          <FileText className="w-4 h-4 text-red-600" />
                          <span className="text-gray-500">Dosya:</span>
                          <a 
                            href={`/api/files/${encodeURIComponent(task.fileUrl.split('/').pop() || '')}`} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            download={task.fileUrl.split('/').pop()}
                            className="font-medium text-red-600 hover:text-red-700 underline"
                          >
                            Dosyayı İndir
                          </a>
                        </div>
                      )}
                      {task.uploadType === 'LINK' && task.fileUrl && (
                        <div className="flex items-center space-x-2">
                          <Link className="w-4 h-4 text-red-600" />
                          <span className="text-gray-500">Link:</span>
                          <a href={task.fileUrl} target="_blank" rel="noopener noreferrer" className="font-medium text-red-600 hover:text-red-700">
                            Dosyayı Görüntüle
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <button 
                      onClick={() => handleViewDetail(task)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Detayları Görüntüle"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleEdit(task)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" 
                      title="Düzenle"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(task.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" 
                      title="Sil"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedTask && (
        <div className="fixed inset-0 bg-white/10 flex items-center justify-center z-50 p-4">
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
              
              {selectedTask.fileUrl && (
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
                      href={selectedTask.fileUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-red-600 hover:text-red-700 break-all"
                    >
                      {selectedTask.fileUrl}
                    </a>
                  )}
                </div>
              )}
              
              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    handleEdit(selectedTask);
                    setActiveTab('upload');
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Düzenle
                </button>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Kapat
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
};

export default TasksPage;
