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
  Users,
  Calendar,
  Target,
  Award,
  X,
  Presentation,
  Video,
  Image,
  File
} from 'lucide-react';

const PresentationPage = () => {
  const [activeTab, setActiveTab] = useState('upload');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadType, setUploadType] = useState('file'); // 'file' or 'link'
  const [editingPresentation, setEditingPresentation] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    presentationTitle: '',
    description: '',
    file: null as File | null,
    fileLink: '',
    notes: '',
    teamName: 'Afet Teknoloji Takımı',
    teamMembers: ['Ahmet Yılmaz', 'Fatma Demir', 'Mehmet Kaya']
  });

  const presentations = [
    {
      id: 1,
      title: 'Final Sunumu - Proje Tanıtımı',
      description: 'Afet yönetimi projesinin final sunumu',
      status: 'completed',
      uploadDate: '20 Eylül 2024',
      fileType: 'file',
      fileName: 'final_sunum.pptx',
      fileSize: '15.2 MB',
      notes: 'Final sunum hazırlandı',
      teamName: 'Afet Teknoloji Takımı',
      teamMembers: ['Ahmet Yılmaz', 'Fatma Demir', 'Mehmet Kaya']
    },
    {
      id: 2,
      title: 'Ara Sunum - Proje İlerlemesi',
      description: 'Proje ilerlemesi ve teknik detaylar',
      status: 'completed',
      uploadDate: '15 Eylül 2024',
      fileType: 'link',
      fileLink: 'https://docs.google.com/presentation/d/example',
      notes: 'Ara sunum tamamlandı',
      teamName: 'Afet Teknoloji Takımı',
      teamMembers: ['Ahmet Yılmaz', 'Fatma Demir', 'Mehmet Kaya']
    },
    {
      id: 3,
      title: 'Demo Sunumu',
      description: 'Proje demo ve canlı gösterim',
      status: 'pending',
      uploadDate: null,
      fileType: null,
      fileName: null,
      fileSize: null,
      notes: '',
      teamName: 'Afet Teknoloji Takımı',
      teamMembers: ['Ahmet Yılmaz', 'Fatma Demir', 'Mehmet Kaya']
    }
  ];

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
    setIsUploading(true);
    
    // Simulate upload
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsUploading(false);
    // Reset form
    setFormData(prev => ({
      ...prev,
      presentationTitle: '',
      description: '',
      file: null,
      fileLink: '',
      notes: ''
    }));
    setEditingPresentation(null);
  };

  const handleEdit = (presentationId: number) => {
    const presentation = presentations.find(p => p.id === presentationId);
    if (presentation) {
      setFormData(prev => ({
        ...prev,
        presentationTitle: presentation.title,
        description: presentation.description,
        file: null,
        fileLink: presentation.fileLink || '',
        notes: presentation.notes || ''
      }));
      setUploadType(presentation.fileType === 'link' ? 'link' : 'file');
      setEditingPresentation(presentationId);
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
          <h1 className="text-3xl font-bold text-gray-900">Sunum Yönetimi</h1>
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
            <h2 className="text-xl font-bold text-gray-900">{formData.teamName}</h2>
            <p className="text-gray-600">Takım Üyeleri: {formData.teamMembers.join(', ')}</p>
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
                  value={formData.presentationTitle}
                  onChange={(e) => handleInputChange('presentationTitle', e.target.value)}
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
                      <Upload className="w-5 h-5" />
                      <div className="text-left">
                        <p className="font-medium">Dosya Yükle</p>
                        <p className="text-sm text-gray-500">PPTX, PDF, MP4 vb.</p>
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
                        <p className="text-sm text-gray-500">Google Slides, YouTube vb.</p>
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
                      required
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <Presentation className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">
                        {formData.file ? formData.file.name : 'Sunum dosyası seçmek için tıklayın'}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
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
                      <Link className="h-5 w-5 text-gray-400" />
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
                  onClick={() => setFormData(prev => ({
                    ...prev,
                    presentationTitle: '',
                    description: '',
                    file: null,
                    fileLink: '',
                    notes: ''
                  }))}
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
          {presentations.map((presentation, index) => (
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
                  </div>
                  
                  <p className="text-gray-600 mb-4">{presentation.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-red-600" />
                      <span className="text-gray-500">Yükleme:</span>
                      <span className="font-medium text-gray-900">{presentation.uploadDate || 'Henüz yüklenmedi'}</span>
                    </div>
                    {presentation.fileType === 'file' && presentation.fileName && (
                      <div className="flex items-center space-x-2">
                        {getFileIcon(presentation.fileName)}
                        <span className="text-gray-500">Dosya:</span>
                        <span className="font-medium text-gray-900">{presentation.fileName} ({presentation.fileSize})</span>
                      </div>
                    )}
                    {presentation.fileType === 'link' && presentation.fileLink && (
                      <div className="flex items-center space-x-2">
                        <Link className="w-4 h-4 text-red-600" />
                        <span className="text-gray-500">Link:</span>
                        <a href={presentation.fileLink} target="_blank" rel="noopener noreferrer" className="font-medium text-red-600 hover:text-red-700">
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
                      <strong>Üyeler:</strong> {presentation.teamMembers.join(', ')}
                    </p>
                  </div>
                  
                  {presentation.notes && (
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700">
                        <strong>Not:</strong> {presentation.notes}
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  {presentation.status === 'completed' && (
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
                    onClick={() => handleEdit(presentation.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Düzenle"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
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

export default PresentationPage;
