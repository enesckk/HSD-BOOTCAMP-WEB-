'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import AdminLayout from '@/components/dashboard/AdminLayout';
import {
  CheckCircle,
  XCircle,
  Clock,
  Mail,
  Phone,
  GraduationCap,
  Eye,
  Loader2,
  AlertCircle,
  FileText,
  Search,
  User,
  Calendar,
} from 'lucide-react';

interface Application {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  university: string;
  department: string;
  projectIdea: string;
  youtubeVideo: string;
  logicQuestion1: string;
  logicQuestion2: string;
  teamRole?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'WAITLIST';
  createdAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  notes?: string;
  initialPasswordEnc?: string;
  initialPassword?: string;
}

export default function AdminApplicationsPage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  // Rol yazımını düzelt
  const getRoleDisplayName = (role: string | undefined) => {
    if (!role) return 'Belirtilmemiş';
    switch (role) {
      case 'LIDER':
        return 'Lider';
      case 'TEKNIK_SORUMLU':
        return 'Teknik Sorumlu';
      case 'TASARIMCI':
        return 'Tasarımcı';
      default:
        return role;
    }
  };
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'approve' | 'reject' | 'view'>('view');
  const [password, setPassword] = useState('');
  const [notes, setNotes] = useState('');
  const [processing, setProcessing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [approvedPasswords, setApprovedPasswords] = useState<Record<string, string>>({});

  // Kalıcı depolama anahtarı
  const APPROVED_PW_STORAGE_KEY = 'approved_passwords_map_v1';

  // API'den gelen initialPassword'u state'e yansıt
  useEffect(() => {
    setApprovedPasswords((prev) => {
      const next = { ...prev };
      applications.forEach((app) => {
        // @ts-ignore
        if ((app as any).initialPassword && !next[app.id]) {
          // @ts-ignore
          next[app.id] = (app as any).initialPassword as string;
        }
      });
      return next;
    });
  }, [applications]);

  // Harita değiştikçe kaydet
  useEffect(() => {
    try {
      localStorage.setItem(APPROVED_PW_STORAGE_KEY, JSON.stringify(approvedPasswords));
    } catch {}
  }, [approvedPasswords]);

  // Authentication kontrolü ile yönlendirme kaldırıldı; sadece veri koşullu çekilecek
  useEffect(() => {
    if (isAuthenticated && user?.role === 'ADMIN') {
      fetchApplications();
    }
  }, [filter, isAuthenticated, user]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/applications');
      const data = await response.json();
      setApplications(data.applications || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let pass = '';
    for (let i = 0; i < 12; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(pass);
  };

  const handleApprove = async () => {
    if (!selectedApp || !password) {
      alert('Lütfen şifre belirleyin');
      return;
    }

    setProcessing(true);
    try {
      const response = await fetch(`/api/applications/${selectedApp.id}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password,
          notes,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Başvuru onaylanamadı');
      }

      // Bu kullanıcı için oluşturulan şifreyi sabitle (diğer kullanıcıları etkilemez)
      setApprovedPasswords((prev) => {
        const next = { ...prev, [selectedApp.id]: password };
        try { localStorage.setItem(APPROVED_PW_STORAGE_KEY, JSON.stringify(next)); } catch {}
        return next;
      });
      // Detay görünümüne geç
      setSelectedApp({ ...selectedApp, status: 'APPROVED' } as any);
      setModalType('view');
      // Inputları temizle (haritadaki şifre korunur)
      setPassword('');
      setNotes('');
      fetchApplications();
    } catch (error: any) {
      alert(error.message || 'Bir hata oluştu');
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!selectedApp) return;

    setProcessing(true);
    try {
      const response = await fetch(`/api/applications/${selectedApp.id}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          notes,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Başvuru reddedilemedi');
      }

      alert('Başvuru reddedildi');
      setShowModal(false);
      setNotes('');
      fetchApplications();
    } catch (error: any) {
      alert(error.message || 'Bir hata oluştu');
    } finally {
      setProcessing(false);
    }
  };

  const openModal = (app: Application, type: 'approve' | 'reject' | 'view') => {
    setSelectedApp(app);
    setModalType(type);
    setShowModal(true);
    if (type === 'approve') {
      generatePassword();
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      APPROVED: 'bg-red-100 text-red-800',
      REJECTED: 'bg-red-100 text-red-800',
      WAITLIST: 'bg-red-100 text-red-800',
    };
    const labels: Record<string, string> = {
      PENDING: 'Beklemede',
      APPROVED: 'Onaylandı',
      REJECTED: 'Reddedildi',
      WAITLIST: 'Bekleme Listesi',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status as keyof typeof styles]}`}>
        {labels[status] || status}
      </span>
    );
  };

  const filteredApps = filter === 'all' 
    ? applications 
    : applications.filter(app => app.status === filter.toUpperCase());

  const searchFilteredApps = searchTerm 
    ? filteredApps.filter(app => 
        app.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.university.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.department.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : filteredApps;

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

  if (!isAuthenticated || !user || user.role !== 'ADMIN') {
    return <div></div>;
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Bilgi */}
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 text-red-600 mt-0.5">
              <svg fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-red-700">Gelen başvuruları inceleyebilir, onaylayabilir veya reddedebilirsiniz. Onaylanan başvurular otomatik olarak katılımcı listesine eklenir.</p>
            </div>
          </div>
        </div>

        {/* Arama + Filter Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Başvuru ara (ad, email, üniversite)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 placeholder-gray-500"
              />
            </div>
          </div>
          <div className="flex space-x-2 bg-gray-50 p-1 rounded-lg">
          {[
            { key: 'all', label: 'Tümü', icon: <FileText className="w-4 h-4" /> },
            { key: 'PENDING', label: 'Bekleyen', icon: <Clock className="w-4 h-4" /> },
            { key: 'APPROVED', label: 'Onaylanan', icon: <CheckCircle className="w-4 h-4" /> },
            { key: 'REJECTED', label: 'Reddedilen', icon: <XCircle className="w-4 h-4" /> },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                filter === tab.key
                  ? 'bg-red-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
        </div>

        {/* Applications List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-red-600 animate-spin" />
          </div>
        ) : searchFilteredApps.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">Henüz başvuru bulunmuyor</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {searchFilteredApps.map((app, index) => (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-bold text-gray-900">{app.fullName}</h3>
                      {getStatusBadge(app.status)}
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Mail className="w-4 h-4" />
                        <span>{app.email}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Phone className="w-4 h-4" />
                        <span>{app.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <GraduationCap className="w-4 h-4" />
                        <span>{app.university}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <span className="w-4 h-4 flex items-center justify-center text-gray-400">•</span>
                        <span>{app.department}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <User className="w-4 h-4 text-gray-900" />
                        <span>{getRoleDisplayName(app.teamRole)}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Calendar className="w-4 h-4 text-gray-900" />
                        <span>{new Date(app.createdAt).toLocaleString('tr-TR')}</span>
                      </div>
                    </div>

                    <p className="text-gray-700 text-sm line-clamp-2">
                      <strong>Proje Fikri:</strong> {app.projectIdea}
                    </p>
                  </div>

                  <div className="flex flex-col space-y-2 ml-4">
                    <button
                      onClick={() => openModal(app, 'view')}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-all flex items-center space-x-2"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Detay</span>
                    </button>
                    
                    {app.status === 'PENDING' && (
                      <>
                        <button
                          onClick={() => openModal(app, 'approve')}
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-all flex items-center space-x-2"
                        >
                          <CheckCircle className="w-4 h-4" />
                          <span>Onayla</span>
                        </button>
                        <button
                          onClick={() => openModal(app, 'reject')}
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all flex items-center space-x-2"
                        >
                          <XCircle className="w-4 h-4" />
                          <span>Reddet</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Modal */}
        {showModal && selectedApp && (
          <div className="fixed inset-0 bg-white/10 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-xl border border-gray-200"
            >
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">
                  {modalType === 'approve' && 'Başvuruyu Onayla'}
                  {modalType === 'reject' && 'Başvuruyu Reddet'}
                  {modalType === 'view' && 'Başvuru Detayları'}
                </h2>
              </div>

              <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                {/* Onay sonrası şifre bilgisi - kalıcı */}
                {modalType === 'view' && selectedApp.status === 'APPROVED' && (selectedApp.initialPassword || approvedPasswords[selectedApp.id]) && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-sm text-red-700 font-medium">Oluşturulan Şifre</p>
                    <div className="mt-2 flex items-center gap-2">
                      <code className="px-2 py-1 bg-white border border-red-200 rounded text-red-700 font-semibold">
                        {selectedApp.initialPassword || approvedPasswords[selectedApp.id]}
                      </code>
                      <button
                        onClick={() => navigator.clipboard.writeText(selectedApp.initialPassword || approvedPasswords[selectedApp.id])}
                        className="px-2 py-1 text-xs bg-red-600 hover:bg-red-700 text-white rounded"
                      >
                        Kopyala
                      </button>
                    </div>
                  </div>
                )}

                <div>
                  <strong className="text-gray-900">Ad Soyad:</strong> <span className="text-gray-800">{selectedApp.fullName}</span>
                </div>
                <div>
                  <strong className="text-gray-900">E-posta:</strong> <span className="text-gray-800">{selectedApp.email}</span>
                </div>
                <div>
                  <strong className="text-gray-900">Telefon:</strong> <span className="text-gray-800">{selectedApp.phone}</span>
                </div>
                <div>
                  <strong className="text-gray-900">Üniversite:</strong> <span className="text-gray-800">{selectedApp.university}</span>
                </div>
                <div>
                  <strong className="text-gray-900">Bölüm:</strong> <span className="text-gray-800">{selectedApp.department}</span>
                </div>
                <div>
                  <strong className="text-gray-900">Tercih Edilen Rol:</strong> <span className="text-gray-800">{getRoleDisplayName(selectedApp.teamRole)}</span>
                </div>
                <div>
                  <strong className="text-gray-900">Başvuru Tarihi:</strong> <span className="text-gray-800">{new Date(selectedApp.createdAt).toLocaleString('tr-TR')}</span>
                </div>
                <div>
                  <strong className="text-gray-900">Proje Fikri:</strong>
                  <p className="mt-1 text-gray-900">{selectedApp.projectIdea}</p>
                </div>
                <div>
                  <strong className="text-gray-900">YouTube Video:</strong>
                  <a 
                    href={selectedApp.youtubeVideo} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-red-600 hover:underline ml-2"
                  >
                    {selectedApp.youtubeVideo}
                  </a>
                </div>
                <div>
                  <strong className="text-gray-900">Mantık Sorusu 1:</strong>
                  <p className="mt-1 text-gray-900">{selectedApp.logicQuestion1}</p>
                </div>
                <div>
                  <strong className="text-gray-900">Mantık Sorusu 2:</strong>
                  <p className="mt-1 text-gray-900">{selectedApp.logicQuestion2}</p>
                </div>

                {modalType === 'approve' && (
                  <div className="space-y-4 pt-4 border-t">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Kullanıcı Şifresi
                      </label>
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-gray-900 placeholder-gray-500"
                          placeholder="Şifre girin veya oluştur"
                        />
                        <button
                          onClick={generatePassword}
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium"
                        >
                          Oluştur
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Notlar (Opsiyonel)
                      </label>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-gray-900 placeholder-gray-500"
                        rows={3}
                        placeholder="Ek notlar..."
                      />
                    </div>
                  </div>
                )}

                {modalType === 'reject' && (
                  <div className="space-y-4 pt-4 border-t">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Red Nedeni
                      </label>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-gray-900 placeholder-gray-500"
                        rows={4}
                        placeholder="Neden reddedildi?"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
                <button
                  onClick={() => setShowModal(false)}
                  disabled={processing}
                  className="px-6 py-2 border border-gray-300 text-gray-900 rounded-lg font-medium hover:bg-gray-100 transition-all"
                >
                  İptal
                </button>
                {modalType === 'approve' && (
                  <button
                    onClick={handleApprove}
                    disabled={processing || !password}
                    className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {processing && <Loader2 className="w-4 h-4 animate-spin" />}
                    <span>Onayla ve Kullanıcı Oluştur</span>
                  </button>
                )}
                {modalType === 'reject' && (
                  <button
                    onClick={handleReject}
                    disabled={processing}
                    className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all"
                  >
                    Reddet
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

