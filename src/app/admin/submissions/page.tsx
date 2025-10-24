'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AdminLayout from '@/components/dashboard/AdminLayout';
import { SuccessModal } from '@/components/ui/SuccessModal';
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
  AlertCircle,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  X
} from 'lucide-react';

interface Submission {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  taskTitle: string;
  taskDescription: string;
  submissionType: string;
  fileUrl?: string;
  linkUrl?: string;
  fileName?: string;
  fileSize?: number;
  fileType?: string;
  status: string;
  submittedAt: string;
  reviewedAt?: string;
  score?: number;
  feedback?: string;
  attachments?: string[];
}

const AdminSubmissions = () => {
  const [groupedSubmissions, setGroupedSubmissions] = useState<any[]>([]);
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
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());

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
        setGroupedSubmissions(data.groupedSubmissions);
        console.log('Grouped submissions set:', data.groupedSubmissions);
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

  const toggleTaskExpansion = (taskTitle: string) => {
    const newExpanded = new Set(expandedTasks);
    if (newExpanded.has(taskTitle)) {
      newExpanded.delete(taskTitle);
    } else {
      newExpanded.add(taskTitle);
    }
    setExpandedTasks(newExpanded);
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
        console.log('Evaluation successful, refreshing submissions...');
        setShowEvaluationModal(false);
        setSelectedSubmission(null);
        await fetchSubmissions(); // Listeyi yenile
        console.log('Submissions refreshed after evaluation');
        setSuccessMessage('Değerlendirme başarıyla kaydedildi!');
        setShowSuccessModal(true);
      } else {
        const errorData = await response.json();
        setSuccessMessage('Hata: ' + (errorData.error || 'Değerlendirme kaydedilemedi'));
        setShowSuccessModal(true);
      }
    } catch (error) {
      console.error('Error evaluating submission:', error);
      const errorMessage = error instanceof Error ? error.message : 'Bilinmeyen hata';
      setSuccessMessage('Bağlantı hatası: ' + errorMessage);
      setShowSuccessModal(true);
    } finally {
      setIsEvaluating(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'REJECTED':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'NEEDS_REVISION':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case 'SUBMITTED':
        return <Upload className="w-5 h-5 text-blue-600" />;
      case 'PENDING':
        return <Clock className="w-5 h-5 text-gray-600" />;
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
      case 'SUBMITTED':
        return 'Teslim Edildi';
      case 'PENDING':
        return 'Bekliyor';
      default:
        return 'Bilinmeyen';
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
      case 'SUBMITTED':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'PENDING':
        return 'bg-gray-100 text-gray-800 border-gray-200';
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
            Toplam: {groupedSubmissions.reduce((total, group) => total + group.submissions.length, 0)} teslim
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
              <option value="SUBMITTED">Teslim Edildi</option>
              <option value="APPROVED">Onaylandı</option>
              <option value="REJECTED">Reddedildi</option>
              <option value="NEEDS_REVISION">Revizyon Gerekli</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tür</label>
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
        ) : groupedSubmissions.length === 0 ? (
          <div className="p-12 text-center">
            <Upload className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Henüz Teslim Yok</h3>
            <p className="text-gray-600">Katılımcılar henüz görev teslim etmemiş.</p>
          </div>
        ) : (
          <div className="space-y-4 p-6">
            {groupedSubmissions.map((taskGroup) => (
              <div key={taskGroup.taskTitle} className="border border-gray-200 rounded-lg">
                <div 
                  className="bg-gray-50 px-6 py-4 border-b border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => toggleTaskExpansion(taskGroup.taskTitle)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{taskGroup.taskTitle}</h3>
                      <p className="text-sm text-gray-600">{taskGroup.taskDescription}</p>
                      <p className="text-xs text-gray-500 mt-1">{taskGroup.submissions.length} teslim</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {expandedTasks.has(taskGroup.taskTitle) ? (
                        <ChevronDown className="w-5 h-5 text-gray-500" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-gray-500" />
                      )}
                    </div>
                  </div>
                </div>
                
                {expandedTasks.has(taskGroup.taskTitle) && (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            Katılımcı
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
                        {taskGroup.submissions.map((submission: Submission) => (
                          <motion.tr
                            key={submission.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="hover:bg-gray-50"
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10">
                                  <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                                    <User className="h-6 w-6 text-red-600" />
                                  </div>
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">{submission.userName}</div>
                                  <div className="text-sm text-gray-500">{submission.userEmail}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <button
                                onClick={() => {
                                  setSelectedSubmission(submission);
                                  setShowDetailModal(true);
                                }}
                                className={`flex items-center space-x-2 px-3 py-1 rounded-lg transition-colors ${
                                  submission.submissionType === 'FILE' 
                                    ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' 
                                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                                }`}
                              >
                                {submission.submissionType === 'FILE' ? (
                                  <FileText className="w-4 h-4" />
                                ) : (
                                  <ExternalLink className="w-4 h-4" />
                                )}
                                <span className="text-sm font-medium">
                                  {submission.submissionType === 'FILE' ? 'Dosya' : 'Link'}
                                </span>
                              </button>
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
                              {submission.status === 'SUBMITTED' || submission.status === 'PENDING' ? (
                                <span className="text-gray-400">Değerlendirilmedi</span>
                              ) : (
                                <div className="flex items-center space-x-1">
                                  <MessageSquare className="w-4 h-4 text-blue-500" />
                                  <span className="text-blue-600">Değerlendirildi</span>
                                </div>
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
            ))}
          </div>
        )}
      </div>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        message={successMessage}
      />

      {/* Submission Detail Modal */}
      {selectedSubmission && (
        <div 
          className="fixed inset-0 bg-transparent backdrop-blur-md flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowDetailModal(false);
              setSelectedSubmission(null);
            }
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-200"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Teslim Detayları</h3>
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    setSelectedSubmission(null);
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Katılımcı Bilgileri */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Katılımcı Bilgileri</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <User className="w-5 h-5 text-red-600" />
                      <span className="text-gray-500">Ad Soyad:</span>
                      <span className="font-medium text-gray-900">{selectedSubmission.userName}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-500">Email:</span>
                      <span className="font-medium text-gray-900">{selectedSubmission.userEmail}</span>
                    </div>
                  </div>
                </div>
                
                {/* Görev Bilgileri */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Görev Bilgileri</h4>
                  <div>
                    <h5 className="font-medium text-gray-900 mb-1">{selectedSubmission.taskTitle}</h5>
                    <p className="text-gray-600">{selectedSubmission.taskDescription}</p>
                  </div>
                </div>
                
                {/* Teslim Bilgileri */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Teslim Bilgileri</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-500">Tür:</span>
                      <span className="font-medium text-gray-900">
                        {selectedSubmission.submissionType === 'FILE' ? 'Dosya' : 'Link'}
                      </span>
                    </div>
                    
                    {selectedSubmission.submissionType === 'FILE' && selectedSubmission.fileUrl && (
                      <div className="flex items-center space-x-2">
                        <FileText className="w-5 h-5 text-blue-600" />
                        <span className="text-gray-500">Dosya:</span>
                        <a 
                          href={selectedSubmission.fileUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 underline flex items-center space-x-1"
                        >
                          <Download className="w-4 h-4" />
                          <span>Dosyayı İndir</span>
                        </a>
                      </div>
                    )}
                    
                    {selectedSubmission.submissionType === 'LINK' && selectedSubmission.linkUrl && (
                      <div className="flex items-center space-x-2">
                        <ExternalLink className="w-5 h-5 text-green-600" />
                        <span className="text-gray-500">Link:</span>
                        <a 
                          href={selectedSubmission.linkUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-green-600 hover:text-green-800 underline flex items-center space-x-1"
                        >
                          <ExternalLink className="w-4 h-4" />
                          <span>Linki Aç</span>
                        </a>
                      </div>
                    )}
                    
                    {selectedSubmission.fileName && (
                      <div>
                        <span className="text-gray-500">Dosya Adı:</span>
                        <p className="text-gray-900 mt-1">{selectedSubmission.fileName}</p>
                      </div>
                    )}
                    
                    {selectedSubmission.fileSize && (
                      <div>
                        <span className="text-gray-500">Dosya Boyutu:</span>
                        <p className="text-gray-900 mt-1">{formatFileSize(selectedSubmission.fileSize)}</p>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Durum ve Değerlendirme */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Durum ve Değerlendirme</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-500">Durum:</span>
                      <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedSubmission.status)}`}>
                        {getStatusIcon(selectedSubmission.status)}
                        <span>{getStatusText(selectedSubmission.status)}</span>
                      </div>
                    </div>
                    
                    {selectedSubmission.score && (
                      <div className="flex items-center space-x-2">
                        <Star className="w-5 h-5 text-yellow-500" />
                        <span className="text-gray-500">Puan:</span>
                        <span className="font-medium text-gray-900">{selectedSubmission.score}/100</span>
                      </div>
                    )}
                    
                    {selectedSubmission.feedback && (
                      <div>
                        <span className="text-gray-500">Geri Bildirim:</span>
                        <p className="text-gray-900 mt-1">{selectedSubmission.feedback}</p>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Tarih Bilgileri */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Tarih Bilgileri</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-500">Teslim Tarihi:</span>
                      <span className="text-gray-900">
                        {new Date(selectedSubmission.submittedAt).toLocaleString('tr-TR')}
                      </span>
                    </div>
                    {selectedSubmission.reviewedAt && (
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-500">Değerlendirme Tarihi:</span>
                        <span className="text-gray-900">
                          {new Date(selectedSubmission.reviewedAt).toLocaleString('tr-TR')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    setSelectedSubmission(null);
                  }}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Kapat
                </button>
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    openEvaluationModal(selectedSubmission);
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Değerlendir
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Evaluation Modal */}
      {showEvaluationModal && selectedSubmission && (
        <div 
          className="fixed inset-0 bg-transparent backdrop-blur-md flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowEvaluationModal(false);
              setSelectedSubmission(null);
            }
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-2xl max-w-lg w-full border border-gray-200"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Değerlendirme</h3>
                <button
                  onClick={() => {
                    setShowEvaluationModal(false);
                    setSelectedSubmission(null);
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Durum</label>
                  <select
                    value={evaluationData.status}
                    onChange={(e) => setEvaluationData({...evaluationData, status: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  >
                    <option value="APPROVED">Onaylandı</option>
                    <option value="REJECTED">Reddedildi</option>
                    <option value="NEEDS_REVISION">Revizyon Gerekli</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Geri Bildirim</label>
                  <textarea
                    value={evaluationData.feedback}
                    onChange={(e) => setEvaluationData({...evaluationData, feedback: e.target.value})}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="Değerlendirme notlarınızı yazın..."
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowEvaluationModal(false);
                    setSelectedSubmission(null);
                  }}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  İptal
                </button>
                <button
                  onClick={handleEvaluation}
                  disabled={isEvaluating}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {isEvaluating ? 'Kaydediliyor...' : 'Kaydet'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      </div>
    </AdminLayout>
  );
};

export default AdminSubmissions;