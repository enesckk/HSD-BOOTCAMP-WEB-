'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/dashboard/AdminLayout';
import { 
  Send, 
  Upload, 
  FileText, 
  Image, 
  Users, 
  Mail, 
  CheckCircle,
  AlertCircle,
  X,
  Plus,
  Eye,
  Download,
  Trash2,
  Paperclip,
  Calendar,
  Clock
} from 'lucide-react';

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  type: 'ANNOUNCEMENT' | 'CERTIFICATE' | 'REMINDER' | 'CUSTOM';
  attachments: string[];
  createdAt: string;
}

interface Participant {
  id: string;
  fullName: string;
  email: string;
  isSelected: boolean;
}

const AdminBulkEmail = () => {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailContent, setEmailContent] = useState('');
  const [emailType, setEmailType] = useState<'ANNOUNCEMENT' | 'CERTIFICATE' | 'REMINDER' | 'CUSTOM'>('ANNOUNCEMENT');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [emailHistory, setEmailHistory] = useState<any[]>([]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }
    
    if (user && user.role !== 'ADMIN') {
      router.push('/dashboard');
      return;
    }
    
    if (isAuthenticated && user?.role === 'ADMIN') {
      fetchParticipants();
      fetchTemplates();
      fetchEmailHistory();
    }
  }, [user, isAuthenticated, authLoading, router]);


  const fetchParticipants = async () => {
    try {
      const response = await fetch('/api/admin/participants');
      const data = await response.json();
      if (data.success) {
        setParticipants(data.participants.map((p: any) => ({
          ...p,
          isSelected: false
        })));
      }
    } catch (error) {
      console.error('Error fetching participants:', error);
    }
  };

  const fetchTemplates = async () => {
    try {
      const response = await fetch('/api/admin/email-templates');
      const data = await response.json();
      if (data.success) {
        setTemplates(data.templates);
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
  };

  const fetchEmailHistory = async () => {
    try {
      const response = await fetch('/api/admin/email-history');
      const data = await response.json();
      if (data.success) {
        setEmailHistory(data.history);
      }
    } catch (error) {
      console.error('Error fetching email history:', error);
    }
  };

  const handleParticipantSelect = (participantId: string, isSelected: boolean) => {
    setParticipants(prev => 
      prev.map(p => 
        p.id === participantId ? { ...p, isSelected } : p
      )
    );
    
    if (isSelected) {
      setSelectedParticipants(prev => [...prev, participantId]);
    } else {
      setSelectedParticipants(prev => prev.filter(id => id !== participantId));
    }
  };

  const handleSelectAll = () => {
    const allSelected = participants.every(p => p.isSelected);
    setParticipants(prev => 
      prev.map(p => ({ ...p, isSelected: !allSelected }))
    );
    setSelectedParticipants(allSelected ? [] : participants.map(p => p.id));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setAttachments(prev => [...prev, ...files]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setEmailSubject(template.subject);
      setEmailContent(template.content);
      setEmailType(template.type);
    }
  };

  const handleSendEmail = async () => {
    if (!emailSubject || !emailContent || selectedParticipants.length === 0) {
      alert('Lütfen tüm alanları doldurun ve en az bir katılımcı seçin.');
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('subject', emailSubject);
      formData.append('content', emailContent);
      formData.append('type', emailType);
      formData.append('participants', JSON.stringify(selectedParticipants));
      
      attachments.forEach((file, index) => {
        formData.append(`attachment_${index}`, file);
      });

      const response = await fetch('/api/admin/bulk-email', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      
      if (data.success) {
        alert('E-postalar başarıyla gönderildi!');
        setEmailSubject('');
        setEmailContent('');
        setAttachments([]);
        setSelectedParticipants([]);
        setParticipants(prev => prev.map(p => ({ ...p, isSelected: false })));
        fetchEmailHistory();
      } else {
        alert('E-posta gönderilirken hata oluştu: ' + data.error);
      }
    } catch (error) {
      console.error('Error sending emails:', error);
      alert('E-posta gönderilirken hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <Image className="w-4 h-4" />;
    if (file.type === 'application/pdf') return <FileText className="w-4 h-4" />;
    return <Paperclip className="w-4 h-4" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'ADMIN') {
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
    <AdminLayout>
      <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Toplu Mail Gönderimi</h1>
          <p className="text-gray-600">Katılımcılara toplu e-posta gönderin ve dosya ekleyin</p>
        </div>
        <div className="flex space-x-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowPreview(!showPreview)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
          >
            <Eye className="w-5 h-5" />
            <span>Önizleme</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSendEmail}
            disabled={isLoading || selectedParticipants.length === 0}
            className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
            <span>{isLoading ? 'Gönderiliyor...' : 'E-posta Gönder'}</span>
          </motion.button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Email Composition */}
        <div className="lg:col-span-2 space-y-6">
          {/* Email Type & Template */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">E-posta Ayarları</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">E-posta Türü</label>
                <select
                  value={emailType}
                  onChange={(e) => setEmailType(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900 bg-white"
                >
                  <option value="ANNOUNCEMENT">Duyuru</option>
                  <option value="CERTIFICATE">Sertifika</option>
                  <option value="REMINDER">Hatırlatma</option>
                  <option value="CUSTOM">Özel</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Şablon Seç</label>
                <select
                  value={selectedTemplate}
                  onChange={(e) => handleTemplateSelect(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900 bg-white"
                >
                  <option value="">Şablon seçin...</option>
                  {templates.map(template => (
                    <option key={template.id} value={template.id}>
                      {template.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Konu</label>
              <input
                type="text"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                placeholder="E-posta konusu..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900 placeholder-gray-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">İçerik</label>
              <textarea
                value={emailContent}
                onChange={(e) => setEmailContent(e.target.value)}
                placeholder="E-posta içeriği..."
                rows={8}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900 placeholder-gray-500 bg-white"
              />
            </div>
          </div>

          {/* File Attachments */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Dosya Ekleri</h3>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">Dosyaları buraya sürükleyin veya seçin</p>
              <input
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
                accept=".pdf,.jpg,.jpeg,.png,.gif,.doc,.docx"
              />
              <label
                htmlFor="file-upload"
                className="bg-red-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-red-700 transition-colors"
              >
                Dosya Seç
              </label>
            </div>

            {attachments.length > 0 && (
              <div className="mt-4 space-y-2">
                <h4 className="font-medium text-gray-900">Eklenen Dosyalar:</h4>
                {attachments.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getFileIcon(file)}
                      <div>
                        <p className="text-sm font-medium text-gray-900">{file.name}</p>
                        <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeAttachment(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Participants Selection */}
        <div className="space-y-6">
          {/* Selection Summary */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Katılımcı Seçimi</h3>
            
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-600">
                {selectedParticipants.length} / {participants.length} seçildi
              </span>
              <button
                onClick={handleSelectAll}
                className="text-red-600 hover:text-red-700 text-sm font-medium"
              >
                {participants.every(p => p.isSelected) ? 'Tümünü Kaldır' : 'Tümünü Seç'}
              </button>
            </div>

            <div className="max-h-64 overflow-y-auto space-y-2">
              {participants.map((participant) => (
                <div key={participant.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
                  <input
                    type="checkbox"
                    checked={participant.isSelected}
                    onChange={(e) => handleParticipantSelect(participant.id, e.target.checked)}
                    className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {participant.fullName}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {participant.email}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Email History */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Gönderim Geçmişi</h3>
            
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {emailHistory.map((email, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{email.subject}</p>
                      <p className="text-xs text-gray-500">
                        {email.recipientCount} alıcı • {new Date(email.sentAt).toLocaleDateString('tr-TR')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      email.status === 'SENT' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {email.status === 'SENT' ? 'Gönderildi' : 'Beklemede'}
                    </span>
                    <button className="text-blue-600 hover:text-blue-700">
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Email Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">E-posta Önizleme</h3>
              <button
                onClick={() => setShowPreview(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Konu:</label>
                <p className="text-gray-900 font-medium">{emailSubject}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Alıcılar:</label>
                <p className="text-gray-900">{selectedParticipants.length} katılımcı</p>
              </div>

              {attachments.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ekler:</label>
                  <div className="flex flex-wrap gap-2">
                    {attachments.map((file, index) => (
                      <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm">
                        {file.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">İçerik:</label>
                <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                  <div dangerouslySetInnerHTML={{ __html: emailContent.replace(/\n/g, '<br>') }} />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowPreview(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Kapat
              </button>
              <button
                onClick={handleSendEmail}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Gönder
              </button>
            </div>
          </motion.div>
        </div>
      )}
      </div>
    </AdminLayout>
  );
};

export default AdminBulkEmail;
