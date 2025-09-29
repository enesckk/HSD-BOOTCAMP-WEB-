'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
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
  User,
  Calendar,
  Target,
  Award,
  X
} from 'lucide-react';

const TasksPage = () => {
  const [activeTab, setActiveTab] = useState('upload');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadType, setUploadType] = useState('file'); // 'file' or 'link'
  const [editingTask, setEditingTask] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    taskName: '',
    description: '',
    huaweiCloudAccount: '',
    file: null as File | null,
    fileLink: '',
    notes: ''
  });

  const tasks = [
    {
      id: 1,
      name: 'Proje Planı',
      description: 'Proje planı ve wireframe dosyaları',
      status: 'completed',
      uploadDate: '15 Eylül 2024',
      huaweiCloudAccount: 'ahmet_yilmaz',
      fileType: 'file',
      fileName: 'proje_plani.pdf',
      fileSize: '2.5 MB',
      notes: 'İlk versiyon tamamlandı'
    },
    {
      id: 2,
      name: 'Teknik Dokümantasyon',
      description: 'API dokümantasyonu ve teknik şartname',
      status: 'completed',
      uploadDate: '18 Eylül 2024',
      huaweiCloudAccount: 'fatma_demir',
      fileType: 'link',
      fileLink: 'https://docs.google.com/document/d/example',
      notes: 'Son güncelleme yapıldı'
    },
    {
      id: 3,
      name: 'UI/UX Tasarım',
      description: 'Kullanıcı arayüzü tasarım dosyaları',
      status: 'pending',
      uploadDate: null,
      huaweiCloudAccount: '',
      fileType: null,
      fileName: null,
      fileSize: null,
      notes: ''
    },
    {
      id: 4,
      name: 'Sunum Hazırlığı',
      description: 'Final sunumu için hazırlık dosyaları',
      status: 'pending',
      uploadDate: null,
      huaweiCloudAccount: '',
      fileType: null,
      fileName: null,
      fileSize: null,
      notes: ''
    }
  ];

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
    setIsUploading(true);
    
    // Simulate upload
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsUploading(false);
    // Reset form
    setFormData({
      taskName: '',
      description: '',
      huaweiCloudAccount: '',
      file: null,
      fileLink: '',
      notes: ''
    });
    setEditingTask(null);
  };

  const handleEdit = (taskId: number) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      setFormData({
        taskName: task.name,
        description: task.description,
        huaweiCloudAccount: task.huaweiCloudAccount || '',
        file: null,
        fileLink: task.fileLink || '',
        notes: task.notes || ''
      });
      setUploadType(task.fileType === 'link' ? 'link' : 'file');
      setEditingTask(taskId);
      setActiveTab('upload');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-400" />;
    }
  };


  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Görev Yönetimi</h1>
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
                  value={formData.taskName}
                  onChange={(e) => handleInputChange('taskName', e.target.value)}
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
                    <Cloud className="h-5 w-5 text-gray-400" />
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
                      <Upload className="w-5 h-5" />
                      <div className="text-left">
                        <p className="font-medium">Dosya Yükle</p>
                        <p className="text-sm text-gray-500">PDF, DOC, ZIP vb.</p>
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
                      <Link className="w-5 h-5" />
                      <div className="text-left">
                        <p className="font-medium">Link Paylaş</p>
                        <p className="text-sm text-gray-500">Google Drive, Dropbox vb.</p>
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
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">
                        {formData.file ? formData.file.name : 'Dosya seçmek için tıklayın'}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
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
                      <Link className="h-5 w-5 text-gray-400" />
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
                      taskName: '',
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
          {tasks.map((task, index) => (
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
                    <h3 className="text-xl font-bold text-gray-900">{task.name}</h3>
                    {getStatusIcon(task.status)}
                  </div>
                  
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
                      <span className="font-medium text-gray-900">{task.uploadDate || 'Henüz yüklenmedi'}</span>
                    </div>
                    {task.fileType === 'file' && task.fileName && (
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-red-600" />
                        <span className="text-gray-500">Dosya:</span>
                        <span className="font-medium text-gray-900">{task.fileName} ({task.fileSize})</span>
                      </div>
                    )}
                    {task.fileType === 'link' && task.fileLink && (
                      <div className="flex items-center space-x-2">
                        <Link className="w-4 h-4 text-red-600" />
                        <span className="text-gray-500">Link:</span>
                        <a href={task.fileLink} target="_blank" rel="noopener noreferrer" className="font-medium text-red-600 hover:text-red-700">
                          Dosyayı Görüntüle
                        </a>
                      </div>
                    )}
                  </div>
                  
                  {task.notes && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700">
                        <strong>Not:</strong> {task.notes}
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  {task.status === 'completed' && (
                    <>
                      <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Download className="w-4 h-4" />
                      </button>
                    </>
                  )}
                  <button 
                    onClick={() => handleEdit(task.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" 
                    title="Düzenle"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Sil">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

    </div>
  );
};

export default TasksPage;
