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
  X,
  Presentation,
  Video,
  Image,
  File,
  User
} from 'lucide-react';

const PresentationPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('upload');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadType, setUploadType] = useState('file'); // 'file' or 'link'
  const [editingPresentation, setEditingPresentation] = useState<any | null>(null);
  const [presentations, setPresentations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedPresentation, setSelectedPresentation] = useState<any | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [presentationToDelete, setPresentationToDelete] = useState<any | null>(null);
  const [teamInfo, setTeamInfo] = useState({ name: '', members: [] as string[] });
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    file: null as File | null,
    fileLink: '',
    notes: ''
  });

  // Fetch presentations and team info from API
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        setIsLoading(true);
        
        // Fetch presentations
        const presentationsRes = await fetch(`/api/presentations?userId=${user.id}`);
        const presentationsData = await presentationsRes.json();
        console.log('Presentations API response:', presentationsData);
        
        const presentationsArray = Array.isArray(presentationsData) ? presentationsData : 
                                  Array.isArray(presentationsData.items) ? presentationsData.items : 
                                  Array.isArray(presentationsData.presentations) ? presentationsData.presentations : [];
        
        setPresentations(presentationsArray);
        
        // Fetch team info
        const teamRes = await fetch(`/api/teams?userId=${user.id}`);
        const teamData = await teamRes.json();
        console.log('Team API response:', teamData);
        
        const team = Array.isArray(teamData) ? teamData[0] : 
                    Array.isArray(teamData.items) ? teamData.items[0] : 
                    teamData.team || null;
        
        if (team) {
          setTeamInfo({
            name: team.name || 'Takım Adı',
            members: (team.members || []).map((m: any) => m.fullName || m.name || 'Üye')
          });
        }
        
      } catch (e) {
        console.error('Data fetch error', e);
        setError('Veriler yüklenemedi');
        setPresentations([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const tabs = [
    { id: 'upload', label: 'Sunum Yükle', icon: Upload },
    { id: 'presentations', label: 'Sunumlarım', icon: Presentation }
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
    
    // Form validation
    if (!formData.title.trim()) {
      setError('Sunum başlığı gereklidir');
      return;
    }
    if (!formData.description.trim()) {
      setError('Sunum açıklaması gereklidir');
      return;
    }
    if (uploadType === 'file' && !formData.file) {
      setError('Sunum dosyası seçmelisiniz');
      return;
    }
    if (uploadType === 'link' && !formData.fileLink.trim()) {
      setError('Sunum linki gereklidir');
      return;
    }
    
    setIsUploading(true);
    setError('');
    setSuccessMessage('');
    
    try {
      console.log('User ID:', user.id);
      const formDataToSend = new FormData();
      formDataToSend.append('userId', user.id);
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('teamName', teamInfo.name);
      formDataToSend.append('memberNames', teamInfo.members.join(', '));
      formDataToSend.append('uploadType', uploadType);
      
      if (uploadType === 'file' && formData.file) {
        formDataToSend.append('file', formData.file);
      } else if (uploadType === 'link') {
        formDataToSend.append('fileUrl', formData.fileLink);
      }
      
      const url = editingPresentation ? `/api/presentations/${editingPresentation.id}` : '/api/presentations';
      const method = editingPresentation ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        body: formDataToSend
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Sunum kaydedilemedi');
      }
      
      const newPresentation = await res.json();
      
      if (editingPresentation) {
        setPresentations(prev => (prev || []).map(p => p.id === editingPresentation.id ? newPresentation : p));
        setSuccessMessage('Sunum başarıyla güncellendi!');
      } else {
        setPresentations(prev => [newPresentation, ...(prev || [])]);
        setSuccessMessage('Sunum başarıyla yüklendi!');
      }
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        file: null,
        fileLink: '',
        notes: ''
      });
      setEditingPresentation(null);
      setActiveTab('presentations');
      
      setTimeout(() => setSuccessMessage(''), 3000);
      
    } catch (e) {
      console.error('Presentation save error', e);
      setError(e instanceof Error ? e.message : 'Sunum kaydedilemedi');
    } finally {
      setIsUploading(false);
    }
  };

  const handleEdit = (presentation: any) => {
    if (!presentation) return;
    setFormData({
      title: presentation.title || '',
      description: presentation.description || '',
      file: null,
      fileLink: presentation.fileUrl || '',
      notes: ''
    });
    setUploadType(presentation.uploadType === 'LINK' ? 'link' : 'file');
    setEditingPresentation(presentation);
    setActiveTab('upload');
  };

  const handleDeleteClick = (presentation: any) => {
    setPresentationToDelete(presentation);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!presentationToDelete) return;
    
    try {
      const res = await fetch(`/api/presentations/${presentationToDelete.id}`, {
        method: 'DELETE'
      });
      
      if (!res.ok) throw new Error('Sunum silinemedi');
      
      setPresentations(prev => (prev || []).filter(p => p.id !== presentationToDelete.id));
      setSuccessMessage('Sunum başarıyla silindi!');
      setTimeout(() => setSuccessMessage(''), 3000);
      setShowDeleteModal(false);
      setPresentationToDelete(null);
    } catch (e) {
      console.error('Delete error', e);
      setError('Sunum silinemedi');
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setPresentationToDelete(null);
  };

  const handleViewDetail = (presentation: any) => {
    setSelectedPresentation(presentation);
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


  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pptx':
      case 'ppt':
        return <Presentation className="w-5 h-5 text-red-600" />;
      case 'mp4':
      case 'avi':
      case 'mov':
        return <Video className="w-5 h-5 text-red-600" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return <Image className="w-5 h-5 text-red-600" />;
      default:
        return <File className="w-5 h-5 text-red-600" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="sr-only">Sunum Yönetimi</h1>
          <p className="text-gray-600 mt-2">Sunumlarınızı yükleyin ve takip edin</p>
        </div>
        <div className="flex items-center space-x-3">
          <motion.button
            className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab('upload')}
          >
            <Plus className="w-4 h-4" />
            <span>Yeni Sunum</span>
          </motion.button>
        </div>
      </div>

      {/* Team Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm"
      >
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
            <Users className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{teamInfo.name || 'Takım Adı'}</h2>
            <p className="text-gray-600">Takım Üyeleri: {teamInfo.members.join(', ') || 'Üye bilgisi yükleniyor...'}</p>
          </div>
        </div>
      </motion.div>

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
              {editingPresentation ? 'Sunumu Düzenle' : 'Sunum Yükle'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Presentation Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sunum Başlığı *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 placeholder-gray-600"
                  placeholder="Örn: Final Sunumu - Proje Tanıtımı"
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
                  placeholder="Sunum hakkında detaylı açıklama..."
                  rows={3}
                  required
                />
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
                        <p className={`text-sm ${uploadType === 'file' ? 'text-red-700' : 'text-gray-900'}`}>PPTX, PDF, MP4 vb.</p>
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
                        <p className={`text-sm ${uploadType === 'link' ? 'text-red-700' : 'text-gray-900'}`}>Google Slides, YouTube vb.</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* File Upload or Link */}
              {uploadType === 'file' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sunum Dosyası Seç *
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-red-400 transition-colors">
                    <input
                      type="file"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                      accept=".pptx,.ppt,.pdf,.mp4,.avi,.mov,.jpg,.jpeg,.png"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <Presentation className="w-8 h-8 text-gray-900 mx-auto mb-2" />
                      <p className="text-sm text-gray-900">
                        {formData.file ? formData.file.name : 'Sunum dosyası seçmek için tıklayın'}
                      </p>
                      <p className="text-xs text-gray-900 mt-1">
                        PPTX, PPT, PDF, MP4, AVI, MOV, JPG, PNG (Max 50MB)
                      </p>
                    </label>
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sunum Linki *
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
                      placeholder="https://docs.google.com/presentation/d/..."
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
                  onClick={() => setFormData({
                    title: '',
                    description: '',
                    file: null,
                    fileLink: '',
                    notes: ''
                  })}
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
                      <span>{editingPresentation ? 'Sunumu Güncelle' : 'Sunum Yükle'}</span>
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </div>
        </motion.div>
      )}

      {activeTab === 'presentations' && (
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
              <span className="ml-3 text-gray-600">Sunumlar yükleniyor...</span>
            </div>
          ) : (presentations || []).length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm text-center"
            >
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Presentation className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Henüz sunum yok</h3>
              <p className="text-gray-600">İlk sunumunuzu yüklemek için "Sunum Yükle" sekmesini kullanın.</p>
            </motion.div>
          ) : (
            (presentations || []).map((presentation, index) => (
            <motion.div
              key={presentation.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <h3 className="text-xl font-bold text-gray-900">{presentation.title}</h3>
                    {getStatusIcon(presentation.status)}
                    <span className="text-sm text-gray-500">{getStatusText(presentation.status)}</span>
                  </div>
                  
                  {/* Sunum Sahibi */}
                  {presentation.user && (
                    <div className="flex items-center space-x-2 mb-3">
                      <Users className="w-4 h-4 text-red-600" />
                      <span className="text-sm text-gray-500">Sunum Sahibi:</span>
                      <span className="font-medium text-gray-900">{presentation.user.fullName}</span>
                      {presentation.user.teamRole && (
                        <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
                          {presentation.user.teamRole === 'LIDER' ? 'Lider' : 
                           presentation.user.teamRole === 'TEKNIK_SORUMLU' ? 'Teknik Sorumlu' : 
                           presentation.user.teamRole === 'TASARIMCI' ? 'Tasarımcı' : 'Üye'}
                        </span>
                      )}
                    </div>
                  )}
                  
                  <p className="text-gray-600 mb-4">{presentation.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-red-600" />
                      <span className="text-gray-500">Yükleme:</span>
                      <span className="font-medium text-gray-900">{new Date(presentation.createdAt).toLocaleDateString('tr-TR')} {new Date(presentation.createdAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    {presentation.uploadType === 'FILE' && presentation.fileUrl && (
                      <div className="flex items-center space-x-2">
                        {getFileIcon(presentation.fileUrl.split('/').pop() || '')}
                        <span className="text-gray-500">Dosya:</span>
                        <a href={presentation.fileUrl} target="_blank" rel="noopener noreferrer" className="font-medium text-red-600 hover:text-red-700">
                          Dosyayı Görüntüle
                        </a>
                      </div>
                    )}
                    {presentation.uploadType === 'LINK' && presentation.fileUrl && (
                      <div className="flex items-center space-x-2">
                        <Link className="w-4 h-4 text-red-600" />
                        <span className="text-gray-500">Link:</span>
                        <a href={presentation.fileUrl} target="_blank" rel="noopener noreferrer" className="font-medium text-red-600 hover:text-red-700">
                          Sunumu Görüntüle
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Team Info */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Users className="w-4 h-4 text-red-600" />
                      <span className="text-sm font-medium text-gray-700">Takım Bilgileri</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">
                      <strong>Takım:</strong> {presentation.teamName}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Üyeler:</strong> {presentation.memberNames}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <button 
                    onClick={() => handleViewDetail(presentation)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Detayları Görüntüle"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleEdit(presentation)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" 
                    title="Düzenle"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDeleteClick(presentation)}
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
      {showDetailModal && selectedPresentation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30" onClick={() => setShowDetailModal(false)} />
          <div className="relative bg-white rounded-xl border border-gray-200 shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Sunum Detayları</h3>
              <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
                <span>Sunum: {selectedPresentation.title}</span>
                <span>Durum: {getStatusText(selectedPresentation.status)}</span>
                <span>Tür: {selectedPresentation.uploadType === 'FILE' ? 'Dosya' : 'Link'}</span>
              </div>
            </div>
            <div className="p-6">
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">{selectedPresentation.title}</h4>
                <p className="text-gray-600">{selectedPresentation.description}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-red-600" />
                  <span className="text-gray-500">Yükleme:</span>
                  <span className="font-medium text-gray-900">{new Date(selectedPresentation.createdAt).toLocaleDateString('tr-TR')} {new Date(selectedPresentation.createdAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Target className="w-5 h-5 text-red-600" />
                  <span className="text-gray-500">Durum:</span>
                  <span className="font-medium text-gray-900">{getStatusText(selectedPresentation.status)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Upload className="w-5 h-5 text-red-600" />
                  <span className="text-gray-500">Tür:</span>
                  <span className="font-medium text-gray-900">{selectedPresentation.uploadType === 'FILE' ? 'Dosya' : 'Link'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-red-600" />
                  <span className="text-gray-500">Takım:</span>
                  <span className="font-medium text-gray-900">{selectedPresentation.teamName}</span>
                </div>
              </div>
              
              {selectedPresentation.fileUrl && (
                <div className="p-4 bg-gray-50 rounded-lg mb-4">
                  <h5 className="font-medium text-gray-900 mb-2">Dosya/Link</h5>
                  <a 
                    href={selectedPresentation.fileUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-red-600 hover:text-red-700 break-all"
                  >
                    {selectedPresentation.fileUrl}
                  </a>
                </div>
              )}
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <h5 className="font-medium text-gray-900 mb-2">Takım Üyeleri</h5>
                <p className="text-gray-600">{selectedPresentation.memberNames}</p>
              </div>
            </div>
            <div className="p-4 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDetailModal(false);
                  handleEdit(selectedPresentation);
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
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && presentationToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30" onClick={handleDeleteCancel} />
          <div className="relative bg-white rounded-xl border border-gray-200 shadow-2xl w-full max-w-md mx-4">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Sunumu Sil</h3>
              <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
                <span>Sunum: {presentationToDelete.title}</span>
                <span>Durum: {getStatusText(presentationToDelete.status)}</span>
              </div>
            </div>
            <div className="p-6">
              <div className="p-4 bg-red-50 rounded-lg mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <Trash2 className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{presentationToDelete.title}</h4>
                    <p className="text-sm text-gray-600">Bu sunumu silmek istediğinizden emin misiniz?</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-yellow-800">
                      <strong>Uyarı:</strong> Bu işlem geri alınamaz. Sunum kalıcı olarak silinecektir.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={handleDeleteCancel}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                İptal
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Evet, Sil
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default PresentationPage;
