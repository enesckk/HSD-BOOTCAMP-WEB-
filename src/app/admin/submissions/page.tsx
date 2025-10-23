'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AdminLayout from '@/components/dashboard/AdminLayout';
import { 
  Upload, 
  Download, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock, 
  User, 
  Calendar,
  FileText,
  Image,
  Video,
  Archive,
  Search,
  Filter,
  Star,
  MessageSquare,
  AlertCircle
} from 'lucide-react';

interface Submission {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  taskTitle: string;
  taskDescription: string;
  submissionType: 'FILE' | 'LINK';
  fileUrl?: string;
  linkUrl?: string;
  fileName?: string;
  fileSize?: number;
  fileType?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'NEEDS_REVISION';
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  score?: number;
  feedback?: string;
  attachments?: string[];
}

const AdminSubmissions = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEvaluationModal, setShowEvaluationModal] = useState(false);
  const [evaluationData, setEvaluationData] = useState({
    status: 'PENDING' as 'APPROVED' | 'REJECTED' | 'NEEDS_REVISION',
    feedback: ''
  });
  const [isEvaluating, setIsEvaluating] = useState(false);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      console.log('Fetching submissions...');
      const response = await fetch('/api/admin/submissions');
      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('API Response:', data);
      if (data.success) {
        setSubmissions(data.submissions);
        console.log('Submissions set:', data.submissions);
      } else {
        console.error('API returned success: false');
      }
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      console.log('Setting isLoading to false');
      setIsLoading(false);
    }
  };

  const openEvaluationModal = (submission: Submission) => {
    setSelectedSubmission(submission);
    setEvaluationData({
      status: submission.status as 'APPROVED' | 'REJECTED' | 'NEEDS_REVISION',
      feedback: submission.feedback || ''
    });
    setShowEvaluationModal(true);
  };

  const handleEvaluation = async () => {
    if (!selectedSubmission) return;

    try {
      setIsEvaluating(true);
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
        setShowEvaluationModal(false);
        setSelectedSubmission(null);
        fetchSubmissions(); // Listeyi yenile
        alert('Değerlendirme başarıyla kaydedildi!');
      } else {
        const errorData = await response.json();
        alert('Hata: ' + (errorData.error || 'Değerlendirme kaydedilemedi'));
      }
    } catch (error) {
      console.error('Error evaluating submission:', error);
      const errorMessage = error instanceof Error ? error.message : 'Bilinmeyen hata';
      alert('Bağlantı hatası: ' + errorMessage);
    } finally {
      setIsEvaluating(false);
    }
  };


  const filteredSubmissions = submissions.filter(submission => {
    const matchesSearch = submission.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        submission.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        submission.taskTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || submission.status === statusFilter;
    const matchesType = typeFilter === 'ALL' || submission.submissionType === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'REJECTED':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'NEEDS_REVISION':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case 'PENDING':
        return <Clock className="w-5 h-5 text-blue-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'Onaylandı';
      case 'REJECTED':
        return 'Reddedildi';
      case 'NEEDS_REVISION':
        return 'Revizyon Gerekli';
      case 'PENDING':
        return 'Beklemede';
      default:
        return 'Bilinmiyor';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'REJECTED':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'NEEDS_REVISION':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'PENDING':
        return 'bg-blue-100 text-blue-800 border-blue-200';
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

  return (
    <AdminLayout>
      <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600">Katılımcıların teslim ettiği ödevleri görüntüleyin ve değerlendirin</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-600">
            Toplam: {submissions.length} teslim
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
              <option value="PENDING">Beklemede</option>
              <option value="APPROVED">Onaylandı</option>
              <option value="REJECTED">Reddedildi</option>
              <option value="NEEDS_REVISION">Revizyon Gerekli</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Teslim Türü</label>
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
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Teslimler yükleniyor...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Katılımcı
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Görev
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
                {filteredSubmissions.map((submission) => (
                  <motion.tr
                    key={submission.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-red-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {submission.userName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {submission.userEmail}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {submission.taskTitle}
                      </div>
                      <div className="text-sm text-gray-500 line-clamp-2">
                        {submission.taskDescription}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${
                          submission.submissionType === 'FILE' ? 'bg-blue-500' : 'bg-green-500'
                        }`}></div>
                        <div>
                          <div className="text-sm font-medium text-gray-900 flex items-center space-x-1">
                            <span>{submission.submissionType === 'FILE' ? '📁' : '🔗'}</span>
                            <span>{submission.submissionType === 'FILE' ? (submission.fileName || 'Dosya') : 'Link'}</span>
                          </div>
                          {submission.fileSize && (
                            <div className="text-xs text-gray-500">
                              {formatFileSize(submission.fileSize)}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(submission.status)}`}>
                        {getStatusIcon(submission.status)}
                        <span>{getStatusText(submission.status)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(submission.submittedAt).toLocaleDateString('tr-TR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {submission.feedback ? (
                        <div className="flex items-center space-x-1">
                          <MessageSquare className="w-4 h-4 text-blue-500" />
                          <span className="text-blue-600">Değerlendirildi</span>
                        </div>
                      ) : (
                        <span className="text-gray-400">Değerlendirilmedi</span>
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

      {/* Submission Detail Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Teslim Detayları</h3>
              <button
                onClick={() => setSelectedSubmission(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Submission Info */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Katılımcı</label>
                  <p className="text-sm text-gray-900">{selectedSubmission.userName}</p>
                  <p className="text-xs text-gray-500">{selectedSubmission.userEmail}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Görev</label>
                  <p className="text-sm text-gray-900 font-medium">{selectedSubmission.taskTitle}</p>
                  <p className="text-sm text-gray-600 mt-1">{selectedSubmission.taskDescription}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Teslim Türü</label>
                  <p className="text-sm text-gray-900">
                    {selectedSubmission.submissionType === 'FILE' ? 'Dosya' : 'Link'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Durum</label>
                  <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedSubmission.status)}`}>
                    {getStatusIcon(selectedSubmission.status)}
                    <span>{getStatusText(selectedSubmission.status)}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Teslim Tarihi</label>
                  <p className="text-sm text-gray-900">
                    {new Date(selectedSubmission.submittedAt).toLocaleString('tr-TR')}
                  </p>
                </div>

                {selectedSubmission.score && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Puan</label>
                    <div className="flex items-center space-x-2">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm text-gray-900">{selectedSubmission.score}/100</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Submission Content */}
              <div className="space-y-4">
                {selectedSubmission.submissionType === 'FILE' && selectedSubmission.fileUrl && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Dosya</label>
                    <div className="border border-gray-300 rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        {getFileIcon(selectedSubmission.fileType)}
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{selectedSubmission.fileName}</p>
                          {selectedSubmission.fileSize && (
                            <p className="text-xs text-gray-500">{formatFileSize(selectedSubmission.fileSize)}</p>
                          )}
                        </div>
                        <a
                          href={selectedSubmission.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-red-600 hover:text-red-700"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                )}

                {selectedSubmission.submissionType === 'LINK' && selectedSubmission.linkUrl && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Link</label>
                    <div className="border border-gray-300 rounded-lg p-4">
                      <a
                        href={selectedSubmission.linkUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 break-all"
                      >
                        {selectedSubmission.linkUrl}
                      </a>
                    </div>
                  </div>
                )}

                {selectedSubmission.feedback && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Geri Bildirim</label>
                    <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                      <p className="text-sm text-gray-900">{selectedSubmission.feedback}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setSelectedSubmission(null)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Kapat
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900">Ödev Detayları</h3>
              <button
                onClick={() => setShowDetailModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Kullanıcı Bilgileri */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Kullanıcı Bilgileri</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Ad Soyad</label>
                    <p className="text-gray-900">{selectedSubmission.userName}</p>
                  </div>
              <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="text-gray-900">{selectedSubmission.userEmail}</p>
                  </div>
                </div>
              </div>

              {/* Görev Bilgileri */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Görev Bilgileri</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Görev Başlığı</label>
                    <p className="text-gray-900 font-semibold">{selectedSubmission.taskTitle}</p>
                  </div>
              <div>
                    <label className="block text-sm font-medium text-gray-700">Görev Açıklaması</label>
                    <p className="text-gray-900 whitespace-pre-wrap">{selectedSubmission.taskDescription}</p>
                  </div>
                </div>
              </div>

                {/* Teslim Bilgileri */}
                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Teslim Bilgileri</h4>
                  <div className="space-y-4">
                    <div className="bg-white rounded-lg p-4 border">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className={`w-3 h-3 rounded-full ${
                          selectedSubmission.submissionType === 'FILE' ? 'bg-blue-500' : 'bg-green-500'
                        }`}></div>
                        <span className="font-semibold text-gray-900">
                          {selectedSubmission.submissionType === 'FILE' ? '📁 Dosya Yükleme' : '🔗 Link Paylaşımı'}
                        </span>
                      </div>
                      
                      {selectedSubmission.submissionType === 'FILE' && selectedSubmission.fileUrl && (
                        <div className="bg-blue-50 rounded-lg p-3">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Yüklenen Dosya</label>
                          <div className="flex items-center justify-between bg-white rounded-lg p-3 border">
                            <div className="flex items-center space-x-3">
                              <FileText className="w-5 h-5 text-blue-500" />
                              <span className="text-gray-900 font-medium">{selectedSubmission.fileName || 'Dosya'}</span>
                            </div>
                            <a
                              href={selectedSubmission.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                            >
                              📥 İndir
                            </a>
                          </div>
                        </div>
                      )}
                      
                      {selectedSubmission.submissionType === 'LINK' && selectedSubmission.linkUrl && (
                        <div className="bg-green-50 rounded-lg p-3">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Paylaşılan Link</label>
                          <div className="bg-white rounded-lg p-3 border">
                            <div className="flex items-center space-x-3">
                              <a
                                href={selectedSubmission.linkUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 underline font-medium break-all"
                              >
                                {selectedSubmission.linkUrl}
                              </a>
                            </div>
                            <div className="mt-2">
                              <a
                                href={selectedSubmission.linkUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                              >
                                🔗 Linki Aç
                              </a>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="bg-white rounded-lg p-3 border">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Teslim Tarihi</label>
                      <p className="text-gray-900 font-medium">{new Date(selectedSubmission.submittedAt).toLocaleString('tr-TR')}</p>
                    </div>
                  </div>
                </div>

              {/* Durum Bilgileri */}
              <div className="bg-yellow-50 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Durum Bilgileri</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Mevcut Durum</label>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      selectedSubmission.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                      selectedSubmission.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                      selectedSubmission.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                      'bg-orange-100 text-orange-800'
                    }`}>
                      {selectedSubmission.status === 'PENDING' ? 'Beklemede' :
                       selectedSubmission.status === 'APPROVED' ? 'Onaylandı' :
                       selectedSubmission.status === 'REJECTED' ? 'Reddedildi' :
                       'Revizyon Gerekli'}
                    </span>
                  </div>
                  
                  {selectedSubmission.feedback && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Geri Bildirim</label>
                      <p className="text-gray-900 whitespace-pre-wrap bg-white p-3 rounded-lg border">
                        {selectedSubmission.feedback}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Kapat
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Evaluation Modal */}
      {showEvaluationModal && selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl w-full"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900">Ödev Değerlendirme</h3>
              <button
                onClick={() => setShowEvaluationModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Ödev Bilgileri */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Ödev Bilgileri</h4>
                <div className="space-y-2">
                  <div>
                    <span className="font-medium text-gray-700">Katılımcı:</span>
                    <span className="ml-2 text-gray-900">{selectedSubmission.userName}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Görev:</span>
                    <span className="ml-2 text-gray-900">{selectedSubmission.taskTitle}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Teslim Türü:</span>
                    <span className="ml-2 text-gray-900">
                      {selectedSubmission.submissionType === 'FILE' ? 'Dosya' : 'Link'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Değerlendirme Formu */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Değerlendirme Durumu
                  </label>
                  <select
                    value={evaluationData.status}
                    onChange={(e) => setEvaluationData(prev => ({ 
                      ...prev, 
                      status: e.target.value as 'APPROVED' | 'REJECTED' | 'NEEDS_REVISION' 
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  >
                    <option value="APPROVED">✅ Onaylandı</option>
                    <option value="REJECTED">❌ Reddedildi</option>
                    <option value="NEEDS_REVISION">🔄 Revizyon Gerekli</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Değerlendirme Notu
                  </label>
                  <textarea
                    value={evaluationData.feedback}
                    onChange={(e) => setEvaluationData(prev => ({ ...prev, feedback: e.target.value }))}
                    placeholder="Ödev hakkında detaylı değerlendirme notunuzu yazın..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 h-32 resize-none"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowEvaluationModal(false)}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                İptal
              </button>
              <button
                onClick={handleEvaluation}
                disabled={isEvaluating}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
              >
                {isEvaluating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Değerlendiriliyor...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span>Değerlendirmeyi Kaydet</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      </div>
    </AdminLayout>
  );
};

export default AdminSubmissions;
