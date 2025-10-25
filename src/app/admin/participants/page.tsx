'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import AdminLayout from '@/components/dashboard/AdminLayout';
import {
  Users,
  Mail,
  Phone,
  GraduationCap,
  UserCheck,
  Loader2,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  X,
  CheckCircle2,
} from 'lucide-react';

interface Participant {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  university: string;
  department: string;
  teamRole?: string;
  isActive: boolean;
  createdAt: string;
}

export default function AdminParticipantsPage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    university: '',
    department: ''
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Yönlendirme yapmadan, yalnızca yetkiliyse veri çek
  useEffect(() => {
    if (isAuthenticated && user?.role === 'ADMIN') {
      fetchParticipants();
    }
  }, [isAuthenticated, user]);

  const fetchParticipants = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/users');
      const data = await response.json();
      setParticipants(data.users || []);
    } catch (error) {
      console.error('Error fetching participants:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredParticipants = participants.filter(p =>
    p.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.university.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditUser = (currentUser: Participant) => {
    setEditForm({
      fullName: currentUser.fullName,
      email: currentUser.email,
      phone: currentUser.phone,
      university: currentUser.university,
      department: currentUser.department
    });
    setIsEditing(true);
  };

  const handleUpdateUser = async () => {
    if (!selectedParticipant) return;
    
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/users/${selectedParticipant.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm),
      });

      if (response.ok) {
        setIsEditing(false);
        setShowDetailModal(false);
        fetchParticipants(); // Listeyi yenile
        // Başarı modal'ı göster
        setSuccessMessage('Kullanıcı başarıyla güncellendi!');
        setShowSuccessModal(true);
      } else {
        const error = await response.json();
        alert(`Hata: ${error.message || 'Kullanıcı güncellenemedi'}`);
      }
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Kullanıcı güncellenirken bir hata oluştu!');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (confirm(`${userName} kullanıcısını silmek istediğinizden emin misiniz? Bu işlem geri alınamaz!`)) {
      try {
        const response = await fetch(`/api/users/${userId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          alert('Kullanıcı başarıyla silindi!');
          fetchParticipants(); // Listeyi yenile
        } else {
          const error = await response.json();
          alert(`Hata: ${error.message || 'Kullanıcı silinemedi'}`);
        }
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Kullanıcı silinirken bir hata oluştu!');
      }
    }
  };

  const handleViewDetails = (participant: Participant) => {
    setSelectedParticipant(participant);
    setShowDetailModal(true);
  };

  const closeDetailModal = () => {
    setShowDetailModal(false);
    setSelectedParticipant(null);
    setIsEditing(false);
    setEditForm({
      fullName: '',
      email: '',
      phone: '',
      university: '',
      department: ''
    });
  };

  const cancelEdit = () => {
    setIsEditing(false);
    if (selectedParticipant) {
      setEditForm({
        fullName: selectedParticipant.fullName,
        email: selectedParticipant.email,
        phone: selectedParticipant.phone,
        university: selectedParticipant.university,
        department: selectedParticipant.department
      });
    }
  };

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
              <p className="text-sm text-red-700">Bu sayfada sadece başvurusu onaylanan ve sisteme kayıtlı kullanıcılar görüntülenir. Yeni başvuruları değerlendirmek için Başvurular sayfasını ziyaret edin.</p>
            </div>
          </div>
        </div>

        {/* Search + Count */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Katılımcı ara (ad, email, üniversite)..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 placeholder-gray-500"
              />
            </div>
            <div className="shrink-0 inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm font-semibold">
              <Users className="w-4 h-4" />
              <span>Toplam: {participants.length}</span>
            </div>
          </div>
        </div>


        {/* Participants Table */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-red-600 animate-spin" />
          </div>
        ) : filteredParticipants.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchTerm ? 'Katılımcı Bulunamadı' : 'Henüz Katılımcı Yok'}
            </h3>
            <p className="text-gray-600">
              {searchTerm 
                ? 'Arama kriterlerinize uygun katılımcı bulunamadı.' 
                : 'Henüz hiçbir başvuru onaylanmamış. Başvuruları incelemek için Başvurular sayfasına gidin.'}
            </p>
            {!searchTerm && (
              <a
                href="/admin/applications"
                className="inline-block mt-4 px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all"
              >
                Başvuruları İncele
              </a>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-700">
                  <th className="px-4 py-3 text-left w-16">#</th>
                  <th className="px-4 py-3 text-left">Ad Soyad</th>
                  <th className="px-4 py-3 text-left">E-posta</th>
                  <th className="px-4 py-3 text-left">Telefon</th>
                  <th className="px-4 py-3 text-left">Üniversite</th>
                  <th className="px-4 py-3 text-left">Bölüm</th>
                  <th className="px-4 py-3 text-left">Kayıt Tarihi</th>
                  <th className="px-4 py-3 text-left">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-gray-800">
                {filteredParticipants.map((p, idx) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">{idx + 1}</td>
                    <td className="px-4 py-3 font-medium">{p.fullName}</td>
                    <td className="px-4 py-3">{p.email}</td>
                    <td className="px-4 py-3">{p.phone}</td>
                    <td className="px-4 py-3">{p.university}</td>
                    <td className="px-4 py-3">{p.department}</td>
                    <td className="px-4 py-3">{new Date(p.createdAt).toLocaleDateString('tr-TR')}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewDetails(p)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="Detayları Görüntüle"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(p.id, p.fullName)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Sil"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detay Modal */}
      {showDetailModal && selectedParticipant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Şeffaf arka plan */}
          <div 
            className="absolute inset-0 bg-transparent backdrop-blur-sm"
            onClick={closeDetailModal}
          />
          
          {/* Modal içeriği */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto"
          >
            {/* Modal başlığı */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">
                Katılımcı Detayları
              </h3>
              <button
                onClick={closeDetailModal}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal içeriği */}
            <div className="p-6 space-y-4">
              {/* Profil bilgileri */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                  {(isEditing ? editForm.fullName : selectedParticipant.fullName).split(' ').map(n => n[0]).join('').toUpperCase()}
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">
                    {isEditing ? editForm.fullName : selectedParticipant.fullName}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {isEditing ? editForm.email : selectedParticipant.email}
                  </p>
                </div>
              </div>

              {/* Detay bilgileri */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">E-posta</p>
                    {isEditing ? (
                      <input
                        type="email"
                        value={editForm.email}
                        onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-900">{selectedParticipant.email}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Telefon</p>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={editForm.phone}
                        onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-900">{selectedParticipant.phone}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <GraduationCap className="w-5 h-5 text-gray-400" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Üniversite</p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editForm.university}
                        onChange={(e) => setEditForm({...editForm, university: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-900">{selectedParticipant.university}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <UserCheck className="w-5 h-5 text-gray-400" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Bölüm</p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editForm.department}
                        onChange={(e) => setEditForm({...editForm, department: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-900">{selectedParticipant.department}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 text-gray-400 flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Kayıt Tarihi</p>
                    <p className="text-gray-900">
                      {new Date(selectedParticipant.createdAt).toLocaleDateString('tr-TR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 text-gray-400 flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Durum</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      selectedParticipant.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {selectedParticipant.isActive ? 'Aktif' : 'Pasif'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal alt kısmı */}
            <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
              {!isEditing ? (
                <>
                  <button
                    onClick={closeDetailModal}
                    className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Kapat
                  </button>
                  <button
                    onClick={() => handleEditUser(selectedParticipant)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Düzenle
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={cancelEdit}
                    className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    disabled={isUpdating}
                  >
                    İptal
                  </button>
                  <button
                    onClick={handleUpdateUser}
                    disabled={isUpdating}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isUpdating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Güncelleniyor...
                      </>
                    ) : (
                      'Güncelle'
                    )}
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* Başarı Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-2xl max-w-md w-full"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Başarılı</h3>
                </div>
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <p className="text-gray-700 mb-6">{successMessage}</p>
              
              <div className="flex items-center justify-end">
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Tamam
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AdminLayout>
  );
}

