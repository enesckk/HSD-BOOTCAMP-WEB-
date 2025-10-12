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
} from 'lucide-react';

interface Participant {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  university: string;
  department: string;
  teamRole?: string;
  teamId?: string;
  isActive: boolean;
  createdAt: string;
}

export default function AdminParticipantsPage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

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
                  <th className="px-4 py-3 text-left">Rol</th>
                  <th className="px-4 py-3 text-left">Rolü Değiştir</th>
                  <th className="px-4 py-3 text-left">Kayıt Tarihi</th>
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
                    <td className="px-4 py-3">{p.teamRole || '-'}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        {['LIDER','TEKNIK_SORUMLU','TASARIMCI'].map(r => (
                          <button
                            key={r}
                            onClick={async () => {
                              await fetch('/api/users', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId: p.id, teamRole: r }) });
                              fetchParticipants();
                            }}
                            className={`px-2 py-1 text-xs rounded border ${p.teamRole===r? 'bg-red-600 text-white border-red-600':'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                          >
                            {r==='LIDER'?'Lider':r==='TEKNIK_SORUMLU'?'Teknik':'Tasarımcı'}
                          </button>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3">{new Date(p.createdAt).toLocaleDateString('tr-TR')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
