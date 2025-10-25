'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/dashboard/AdminLayout';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { 
  Award, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Edit, 
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Calendar,
  FileText,
  Users,
  Target,
  Star,
  TrendingUp,
  X,
  Upload,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

interface Certificate {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  programName: string;
  completionDate: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  score?: number;
  notes?: string;
  issuedAt?: string;
  downloadUrl?: string;
  approvedTasks?: number;
  fileUrl?: string;
  linkUrl?: string;
}

interface EligibleParticipant {
  id: string;
  fullName: string;
  email: string;
  approvedTasks: number;
  totalTasks: number;
  completionRate: number;
  lastActivity: string;
  isEligible: boolean;
}

const AdminCertificates = () => {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  
  // Yeni state'ler
  const [eligibleParticipants, setEligibleParticipants] = useState<EligibleParticipant[]>([]);
  const [showEligibleModal, setShowEligibleModal] = useState(false);
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);
  const [criteria, setCriteria] = useState({
    minApprovedTasks: 1,
    minCompletionRate: 0,
    programName: 'HSD Bootcamp Sertifikası'
  });
  const [isCreatingBulk, setIsCreatingBulk] = useState(false);
  
  // Sertifika yükleme state'leri
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadData, setUploadData] = useState({
    uploadType: 'FILE' as 'FILE' | 'LINK',
    file: null as File | null,
    linkUrl: '',
    notes: ''
  });
  const [isUploading, setIsUploading] = useState(false);
  
  // Sertifika detayları modal state'leri
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailCertificate, setDetailCertificate] = useState<Certificate | null>(null);
  
  // Modal uyarı mesajları state'leri
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'success' | 'error' | 'warning' | 'info'>('info');
  const [alertTitle, setAlertTitle] = useState('');
  
  // Export state'leri
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || !user || user.role !== 'ADMIN')) {
      router.push('/login');
      return;
    }
  }, [authLoading, isAuthenticated, user, router]);

  useEffect(() => {
    if (isAuthenticated && user?.role === 'ADMIN') {
      fetchCertificates();
    }
  }, [isAuthenticated, user]);

  const fetchCertificates = async () => {
    try {
      const response = await fetch('/api/admin/certificates');
      const data = await response.json();
      if (data.success) {
        setCertificates(data.certificates);
      }
    } catch (error) {
      console.error('Error fetching certificates:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEligibleParticipants = async () => {
    try {
      const response = await fetch('/api/admin/certificates/eligible');
      const data = await response.json();
      if (data.success) {
        setEligibleParticipants(data.participants);
      }
    } catch (error) {
      console.error('Error fetching eligible participants:', error);
    }
  };

  const handleBulkCreate = async () => {
    if (selectedParticipants.length === 0) {
      alert('Lütfen en az bir katılımcı seçin');
      return;
    }

    setIsCreatingBulk(true);
    try {
      const response = await fetch('/api/admin/certificates/eligible', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          participantIds: selectedParticipants,
          programName: criteria.programName,
          criteria: `En az ${criteria.minApprovedTasks} onaylanmış görev`
        }),
      });

      const data = await response.json();
      if (data.success) {
        showAlert('Başarılı', data.message, 'success');
        setShowEligibleModal(false);
        setSelectedParticipants([]);
        fetchCertificates();
      } else {
        showAlert('Hata', data.error, 'error');
      }
    } catch (error) {
      console.error('Error creating bulk certificates:', error);
      showAlert('Hata', 'Sertifikalar oluşturulamadı', 'error');
    } finally {
      setIsCreatingBulk(false);
    }
  };

  const toggleParticipantSelection = (participantId: string) => {
    setSelectedParticipants(prev => 
      prev.includes(participantId) 
        ? prev.filter(id => id !== participantId)
        : [...prev, participantId]
    );
  };

  const handleUploadClick = (certificate: Certificate) => {
    setSelectedCertificate(certificate);
    setUploadData({
      uploadType: 'FILE',
      file: null,
      linkUrl: '',
      notes: ''
    });
    setShowUploadModal(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setUploadData(prev => ({ ...prev, file }));
  };

  const handleUpload = async () => {
    if (!selectedCertificate) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('certificateId', selectedCertificate.id);
      formData.append('uploadType', uploadData.uploadType);
      formData.append('notes', uploadData.notes);

      if (uploadData.uploadType === 'FILE' && uploadData.file) {
        formData.append('file', uploadData.file);
      } else if (uploadData.uploadType === 'LINK') {
        formData.append('linkUrl', uploadData.linkUrl);
      }

      const response = await fetch('/api/admin/certificates/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        showAlert('Başarılı', 'Sertifika başarıyla yüklendi!', 'success');
        setShowUploadModal(false);
        setSelectedCertificate(null);
        fetchCertificates();
      } else {
        showAlert('Hata', data.error, 'error');
      }
    } catch (error) {
      console.error('Error uploading certificate:', error);
      showAlert('Hata', 'Sertifika yüklenemedi', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDetailClick = (certificate: Certificate) => {
    setDetailCertificate(certificate);
    setShowDetailModal(true);
  };

  const handleOpenFile = (certificate: Certificate) => {
    if (certificate.fileUrl) {
      window.open(certificate.fileUrl, '_blank');
    } else if (certificate.linkUrl) {
      window.open(certificate.linkUrl, '_blank');
    }
  };

  const handleStatusChange = async (certificateId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/certificates/${certificateId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        fetchCertificates();
      }
    } catch (error) {
      console.error('Error updating certificate status:', error);
    }
  };

  const handleDelete = async (certificateId: string) => {
    setAlertTitle('Sertifika Silme Onayı');
    setAlertMessage('Bu sertifikayı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.');
    setAlertType('warning');
    setShowAlertModal(true);
    
    // Onay için global bir state kullanabiliriz
    const confirmed = await new Promise<boolean>((resolve) => {
      const handleConfirm = () => {
        setShowAlertModal(false);
        resolve(true);
      };
      const handleCancel = () => {
        setShowAlertModal(false);
        resolve(false);
      };
      
      // Bu fonksiyonları modal içinde kullanacağız
      (window as any).handleDeleteConfirm = handleConfirm;
      (window as any).handleDeleteCancel = handleCancel;
    });
    
    if (confirmed) {
      try {
        const response = await fetch(`/api/admin/certificates/${certificateId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          showAlert('Başarılı', 'Sertifika başarıyla silindi.', 'success');
          fetchCertificates();
        } else {
          showAlert('Hata', 'Sertifika silinirken bir hata oluştu.', 'error');
        }
      } catch (error) {
        console.error('Error deleting certificate:', error);
        showAlert('Hata', 'Sertifika silinirken bir hata oluştu.', 'error');
      }
    }
  };

  const showAlert = (title: string, message: string, type: 'success' | 'error' | 'warning' | 'info') => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertType(type);
    setShowAlertModal(true);
  };

  const handleExportPDF = () => {
    try {
      const doc = new jsPDF();
      
      // Türkçe karakter desteği için font ayarları
      doc.setFont('helvetica');
      
      // Başlık
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('HSD Bootcamp Sertifika Listesi', 14, 22);
      
      // Tarih
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Rapor Tarihi: ${new Date().toLocaleDateString('tr-TR')}`, 14, 30);
      doc.text(`Toplam Sertifika: ${filteredCertificates.length}`, 14, 35);
      
      if (filteredCertificates.length === 0) {
        doc.setFontSize(12);
        doc.text('Kayitli sertifika bulunmuyor.', 14, 50);
      } else {
        // Tablo oluştur
        const tableData = filteredCertificates.map((cert, index) => [
          index + 1,
          cert.userName,
          cert.userEmail,
          cert.programName,
          getStatusText(cert.status),
          new Date(cert.completionDate).toLocaleDateString('tr-TR'),
          (cert as any).approvedTasks || 0
        ]);

        autoTable(doc, {
          head: [['#', 'Katılımcı', 'Email', 'Program', 'Durum', 'Tamamlanma Tarihi', 'Onaylanan Görev']],
          body: tableData,
          startY: 50,
          styles: {
            fontSize: 8,
            cellPadding: 3,
          },
          headStyles: {
            fillColor: [220, 38, 38],
            textColor: [255, 255, 255],
            fontStyle: 'bold',
          },
          alternateRowStyles: {
            fillColor: [249, 250, 251],
          },
        });
      }
      
      const fileName = `sertifikalar_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);
      showAlert('Başarılı', 'PDF dosyası başarıyla indirildi.', 'success');
    } catch (error) {
      console.error('PDF export error:', error);
      showAlert('Hata', 'PDF oluşturulurken bir hata oluştu.', 'error');
    }
  };

  const handleExportExcel = () => {
    try {
      const data = filteredCertificates.map(cert => ({
        'Sıra': filteredCertificates.indexOf(cert) + 1,
        'Katılımcı': cert.userName,
        'Email': cert.userEmail,
        'Program': cert.programName,
        'Durum': getStatusText(cert.status),
        'Tamamlanma Tarihi': new Date(cert.completionDate).toLocaleDateString('tr-TR'),
        'Onaylanan Görev': (cert as any).approvedTasks || 0,
        'Notlar': cert.notes || ''
      }));

      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sertifikalar');
      
      const fileName = `sertifikalar_${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(workbook, fileName);
      showAlert('Başarılı', 'Excel dosyası başarıyla indirildi.', 'success');
    } catch (error) {
      console.error('Excel export error:', error);
      showAlert('Hata', 'Excel oluşturulurken bir hata oluştu.', 'error');
    }
  };

  const filteredCertificates = certificates.filter(cert => {
    const matchesSearch = cert.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        cert.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        cert.programName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || cert.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'REJECTED':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'PENDING':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'UPLOADED':
        return <Upload className="w-5 h-5 text-blue-600" />;
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
      case 'PENDING':
        return 'Beklemede';
      case 'UPLOADED':
        return 'Yüklendi';
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
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'UPLOADED':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
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

  if (!isAuthenticated || !user || user.role !== 'ADMIN') {
    return <div></div>;
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600">Katılımcı sertifikalarını yönetin ve takip edin</p>
        </div>
        <div className="flex items-center space-x-4">
          {/* Export Butonları */}
          <div className="flex items-center space-x-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleExportPDF}
              disabled={filteredCertificates.length === 0}
              className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FileText className="w-5 h-5" />
              <span>PDF İndir</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleExportExcel}
              disabled={filteredCertificates.length === 0}
              className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FileSpreadsheet className="w-5 h-5" />
              <span>Excel İndir</span>
            </motion.button>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              fetchEligibleParticipants();
              setShowEligibleModal(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
          >
            <Users className="w-5 h-5" />
            <span>Başarılı Katılımcılar</span>
          </motion.button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Arama</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="İsim, email veya program ara..."
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
              <option value="UPLOADED">Yüklendi</option>
            </select>
          </div>
        </div>
        
        {/* Toplam Sertifika Sayısı */}
        <div className="mt-3 inline-flex items-center space-x-2 px-4 py-2 bg-red-50 border border-red-200 rounded-lg">
          <Award className="w-4 h-4 text-red-600" />
          <span className="text-sm font-medium text-red-800">Toplam Sertifika:</span>
          <span className="text-lg font-bold text-red-600">{certificates.length}</span>
        </div>
      </div>

      {/* Certificates List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Sertifikalar yükleniyor...</p>
          </div>
        ) : filteredCertificates.length === 0 ? (
          <div className="p-8 text-center">
            <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Sertifika Bulunamadı</h3>
            <p className="text-gray-600 mb-4">Henüz hiç sertifika oluşturulmamış.</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2 mx-auto"
            >
              <Plus className="w-4 h-4" />
              <span>İlk Sertifikayı Oluştur</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                    #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Katılımcı
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Program
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Durum
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tamamlanma Tarihi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Onaylanan Görev
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCertificates.map((certificate, index) => (
                  <motion.tr
                    key={certificate.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-center text-gray-500 font-medium">
                      {index + 1}.
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-red-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {certificate.userName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {certificate.userEmail}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {certificate.programName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(certificate.status)}`}>
                        {getStatusIcon(certificate.status)}
                        <span>{getStatusText(certificate.status)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(certificate.completionDate).toLocaleDateString('tr-TR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {(certificate as any).approvedTasks || 0} görev
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleDetailClick(certificate)}
                          className="text-gray-600 hover:text-gray-900 p-1 rounded hover:bg-gray-50 transition-colors"
                          title="Detayları Görüntüle"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleUploadClick(certificate)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                          title="Sertifika Yükle"
                        >
                          <Upload className="w-4 h-4" />
                        </button>
                        {(certificate.fileUrl || certificate.linkUrl) && (
                            <button
                            onClick={() => handleOpenFile(certificate)}
                              className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50 transition-colors"
                            title="Dosya/Link Aç"
                          >
                            <Download className="w-4 h-4" />
                            </button>
                        )}
                        <button
                          onClick={() => handleDelete(certificate.id)}
                          className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors"
                          title="Sil"
                        >
                          <Trash2 className="w-4 h-4" />
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

      {/* Certificate Detail Modal */}
      {selectedCertificate && (
        <div className="fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Sertifika Detayları</h3>
              <button
                onClick={() => setSelectedCertificate(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Katılımcı</label>
                  <p className="text-sm text-gray-900">{selectedCertificate.userName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="text-sm text-gray-900">{selectedCertificate.userEmail}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Program</label>
                  <p className="text-sm text-gray-900">{selectedCertificate.programName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Durum</label>
                  <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedCertificate.status)}`}>
                    {getStatusIcon(selectedCertificate.status)}
                    <span>{getStatusText(selectedCertificate.status)}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tamamlanma Tarihi</label>
                  <p className="text-sm text-gray-900">
                    {new Date(selectedCertificate.completionDate).toLocaleDateString('tr-TR')}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Puan</label>
                  <p className="text-sm text-gray-900">
                    {selectedCertificate.score ? `${selectedCertificate.score}/100` : 'Belirtilmemiş'}
                  </p>
                </div>
              </div>

              {selectedCertificate.notes && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Notlar</label>
                  <p className="text-sm text-gray-900">{selectedCertificate.notes}</p>
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setSelectedCertificate(null)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Kapat
                </button>
                {selectedCertificate.downloadUrl && (
                  <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2">
                    <Download className="w-4 h-4" />
                    <span>İndir</span>
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Başarılı Katılımcılar Modal */}
      {showEligibleModal && (
        <div className="fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Başarılı Katılımcılar</h3>
                <button
                  onClick={() => setShowEligibleModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Kriterler */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Değerlendirme Kriterleri</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Program Adı</label>
                    <input
                      type="text"
                      value={criteria.programName}
                      onChange={(e) => setCriteria({...criteria, programName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Min. Onaylanmış Görev</label>
                    <input
                      type="number"
                      min="1"
                      value={criteria.minApprovedTasks}
                      onChange={(e) => setCriteria({...criteria, minApprovedTasks: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Min. Tamamlanma Oranı (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={criteria.minCompletionRate}
                      onChange={(e) => setCriteria({...criteria, minCompletionRate: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Katılımcı Listesi */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-semibold text-gray-900">
                    Hak Kazanan Katılımcılar ({eligibleParticipants.length})
                  </h4>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setSelectedParticipants(eligibleParticipants.map(p => p.id))}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Tümünü Seç
                    </button>
                    <span className="text-gray-400">|</span>
                    <button
                      onClick={() => setSelectedParticipants([])}
                      className="text-gray-600 hover:text-gray-800 text-sm font-medium"
                    >
                      Seçimi Temizle
                    </button>
                  </div>
                </div>

                <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg">
                  {eligibleParticipants.map((participant) => (
                    <div
                      key={participant.id}
                      className={`p-4 border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors ${
                        selectedParticipants.includes(participant.id) ? 'bg-blue-50 border-blue-200' : ''
                      }`}
                      onClick={() => toggleParticipantSelection(participant.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <input
                            type="checkbox"
                            checked={selectedParticipants.includes(participant.id)}
                            onChange={() => toggleParticipantSelection(participant.id)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <div>
                            <h5 className="font-medium text-gray-900">{participant.fullName}</h5>
                            <p className="text-sm text-gray-600">{participant.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-6 text-sm">
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="text-gray-600">{participant.approvedTasks} onaylanmış</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <TrendingUp className="w-4 h-4 text-blue-600" />
                            <span className="text-gray-600">%{participant.completionRate.toFixed(1)}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">
                              {new Date(participant.lastActivity).toLocaleDateString('tr-TR')}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Alt Butonlar */}
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  {selectedParticipants.length} katılımcı seçildi
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setShowEligibleModal(false)}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    İptal
                  </button>
                  <button
                    onClick={handleBulkCreate}
                    disabled={selectedParticipants.length === 0 || isCreatingBulk}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    {isCreatingBulk ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Oluşturuluyor...</span>
                      </>
                    ) : (
                      <>
                        <Award className="w-4 h-4" />
                        <span>Sertifika Oluştur ({selectedParticipants.length})</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Sertifika Yükleme Modal */}
      {showUploadModal && selectedCertificate && (
        <div className="fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-2xl max-w-2xl w-full"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Sertifika Yükle</h3>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Katılımcı Bilgileri */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Katılımcı Bilgileri</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-gray-500">Ad Soyad:</span>
                      <p className="font-medium text-gray-900">{selectedCertificate.userName}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Email:</span>
                      <p className="font-medium text-gray-900">{selectedCertificate.userEmail}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Program:</span>
                      <p className="font-medium text-gray-900">{selectedCertificate.programName}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Onaylanan Görev:</span>
                      <p className="font-medium text-gray-900">{(selectedCertificate as any).approvedTasks || 0} görev</p>
                    </div>
                  </div>
                </div>

                {/* Yükleme Türü */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Yükleme Türü</label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="FILE"
                        checked={uploadData.uploadType === 'FILE'}
                        onChange={(e) => setUploadData({...uploadData, uploadType: e.target.value as 'FILE' | 'LINK'})}
                        className="mr-2"
                      />
                      <span>Dosya</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="LINK"
                        checked={uploadData.uploadType === 'LINK'}
                        onChange={(e) => setUploadData({...uploadData, uploadType: e.target.value as 'FILE' | 'LINK'})}
                        className="mr-2"
                      />
                      <span>Link</span>
                    </label>
                  </div>
                </div>

                {/* Dosya Yükleme */}
                {uploadData.uploadType === 'FILE' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sertifika Dosyası</label>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <p className="text-sm text-gray-500 mt-1">PDF, JPG, PNG formatları desteklenir</p>
                  </div>
                )}

                {/* Link Yükleme */}
                {uploadData.uploadType === 'LINK' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sertifika Linki</label>
                    <input
                      type="url"
                      value={uploadData.linkUrl}
                      onChange={(e) => setUploadData({...uploadData, linkUrl: e.target.value})}
                      placeholder="https://example.com/certificate.pdf"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                )}

                {/* Notlar */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notlar</label>
                  <textarea
                    value={uploadData.notes}
                    onChange={(e) => setUploadData({...uploadData, notes: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Sertifika ile ilgili notlar..."
                  />
                </div>
              </div>

              {/* Alt Butonlar */}
              <div className="flex items-center justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  İptal
                </button>
                <button
                  onClick={handleUpload}
                  disabled={isUploading || (uploadData.uploadType === 'FILE' && !uploadData.file) || (uploadData.uploadType === 'LINK' && !uploadData.linkUrl)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {isUploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Yükleniyor...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      <span>Sertifika Yükle</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Sertifika Detayları Modal */}
      {showDetailModal && detailCertificate && (
        <div className="fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Sertifika Detayları</h3>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Katılımcı Bilgileri */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Katılımcı Bilgileri</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-gray-500">Ad Soyad:</span>
                      <p className="font-medium text-gray-900">{detailCertificate.userName}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Email:</span>
                      <p className="font-medium text-gray-900">{detailCertificate.userEmail}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Program:</span>
                      <p className="font-medium text-gray-900">{detailCertificate.programName}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Tamamlanma Tarihi:</span>
                      <p className="font-medium text-gray-900">
                        {new Date(detailCertificate.completionDate).toLocaleDateString('tr-TR')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Başarı Bilgileri */}
                <div className="bg-blue-50 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Başarı Bilgileri</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-gray-500">Onaylanan Görevler:</span>
                      <p className="font-medium text-gray-900">{(detailCertificate as any).approvedTasks || 0} görev</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Durum:</span>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(detailCertificate.status)}
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(detailCertificate.status)}`}>
                          {getStatusText(detailCertificate.status)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sertifika Bilgileri */}
                {(detailCertificate.fileUrl || detailCertificate.linkUrl) && (
                  <div className="bg-green-50 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Sertifika Dosyası</h4>
                    <div className="space-y-3">
                      {detailCertificate.fileUrl && (
                        <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                          <div className="flex items-center space-x-3">
                            <FileText className="w-5 h-5 text-blue-600" />
                            <span className="text-gray-900">Dosya: {detailCertificate.fileUrl.split('/').pop()}</span>
                          </div>
                          <button
                            onClick={() => handleOpenFile(detailCertificate)}
                            className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50 transition-colors"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                      {detailCertificate.linkUrl && (
                        <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                          <div className="flex items-center space-x-3">
                            <FileText className="w-5 h-5 text-green-600" />
                            <span className="text-gray-900">Link: {detailCertificate.linkUrl}</span>
                          </div>
                          <button
                            onClick={() => handleOpenFile(detailCertificate)}
                            className="text-green-600 hover:text-green-800 p-1 rounded hover:bg-green-50 transition-colors"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Notlar */}
                {detailCertificate.notes && (
                  <div className="bg-yellow-50 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Notlar</h4>
                    <p className="text-gray-700">{detailCertificate.notes}</p>
                  </div>
                )}
              </div>

              {/* Alt Butonlar */}
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Kapat
                  </button>
                  <button
                    onClick={() => handleDelete(detailCertificate.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Sertifikayı Sil</span>
                  </button>
                </div>
                {(detailCertificate.fileUrl || detailCertificate.linkUrl) && (
                  <button
                    onClick={() => handleOpenFile(detailCertificate)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Dosya/Link Aç</span>
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Modal Uyarı Mesajları */}
      {showAlertModal && (
        <div className="fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-2xl max-w-md w-full"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {alertType === 'success' && <CheckCircle2 className="w-6 h-6 text-green-600" />}
                  {alertType === 'error' && <XCircle className="w-6 h-6 text-red-600" />}
                  {alertType === 'warning' && <AlertCircle className="w-6 h-6 text-yellow-600" />}
                  {alertType === 'info' && <AlertCircle className="w-6 h-6 text-blue-600" />}
                  <h3 className="text-lg font-semibold text-gray-900">{alertTitle}</h3>
                </div>
                <button
                  onClick={() => setShowAlertModal(false)}
                  className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <p className="text-gray-700 mb-6">{alertMessage}</p>
              
              <div className="flex items-center justify-end space-x-3">
                {alertType === 'warning' && (
                  <>
                    <button
                      onClick={() => (window as any).handleDeleteCancel?.()}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      İptal
                    </button>
                    <button
                      onClick={() => (window as any).handleDeleteConfirm?.()}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Onayla
                    </button>
                  </>
                )}
                {alertType !== 'warning' && (
                  <button
                    onClick={() => setShowAlertModal(false)}
                    className={`px-4 py-2 text-white rounded-lg transition-colors ${
                      alertType === 'success' ? 'bg-green-600 hover:bg-green-700' :
                      alertType === 'error' ? 'bg-red-600 hover:bg-red-700' :
                      alertType === 'info' ? 'bg-blue-600 hover:bg-blue-700' :
                      'bg-gray-600 hover:bg-gray-700'
                    }`}
                  >
                    Tamam
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
      </div>
    </AdminLayout>
  );
};

export default AdminCertificates;
