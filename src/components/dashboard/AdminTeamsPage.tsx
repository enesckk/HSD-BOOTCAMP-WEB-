'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Search, Crown, CalendarDays, ChevronDown, ChevronRight, Loader2, Mail, Phone } from 'lucide-react';

interface TeamItem {
  id: string;
  name: string;
  createdAt: string;
  leader: { id: string; fullName: string; email: string };
  members: Array<{ id: string; fullName: string; email: string; phone?: string; teamRole?: 'LIDER' | 'TEKNIK_SORUMLU' | 'TASARIMCI' }>;
}

export default function AdminTeamsPage() {
  const [teams, setTeams] = useState<TeamItem[]>([]);
  const [filtered, setFiltered] = useState<TeamItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/teams?all=true');
        const data = await res.json();
        const items: TeamItem[] = data.items || data || [];
        setTeams(items);
        setFiltered(items);
      } catch (e) {
        console.error('Teams fetch error', e);
      } finally {
        setLoading(false);
      }
    };
    fetchTeams();
  }, []);

  useEffect(() => {
    const term = search.toLowerCase();
    const f = teams.filter(t =>
      t.name.toLowerCase().includes(term) ||
      t.leader?.fullName?.toLowerCase().includes(term) ||
      t.members?.some(m => m.fullName?.toLowerCase().includes(term))
    );
    setFiltered(f);
  }, [search, teams]);

  const stats = useMemo(() => ({ totalTeams: teams.length }), [teams]);

  const formatDate = (iso: string) => {
    try {
      const d = new Date(iso);
      return d.toLocaleDateString('tr-TR', { year: 'numeric', month: '2-digit', day: '2-digit' });
    } catch {
      return iso;
    }
  };

  return (
    <div className="space-y-6">

      {/* Filters */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-900" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 placeholder-gray-500"
            placeholder="Takım veya üye ara..."
          />
        </div>
      </motion.div>

      {/* İçerik: Liste görünüm */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-red-600" />
          <span className="ml-3 text-gray-600">Yükleniyor...</span>
        </div>
      ) : filtered.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-xl p-12 border border-gray-200 shadow-sm text-center">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Takım bulunamadı</p>
        </motion.div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="divide-y divide-gray-200">
            {filtered.map((t, index) => {
              const isOpen = expandedId === t.id;
              return (
                <motion.div key={t.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.02 * (index % 20) }}>
                  {/* Row */}
                  <button
                    className="w-full text-left px-6 py-5 hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => setExpandedId(isOpen ? null : t.id)}
                    aria-expanded={isOpen}
                    aria-controls={`team-${t.id}-members`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-5 min-w-0">
                        <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                          <Users className="w-6 h-6 text-white" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-base font-semibold text-gray-900 truncate">{t.name}</p>
                          <div className="mt-1 flex items-center text-sm text-gray-500">
                            <Crown className="w-4 h-4 text-red-600 mr-1" />
                            <span className="truncate">
                              {t.members?.find(m => m.teamRole === 'LIDER')?.fullName || 'Lider belirlenmemiş'}
                            </span>
                            <span className="mx-2">•</span>
                            <CalendarDays className="w-4 h-4 text-gray-900 mr-1" />
                            <span>{formatDate(t.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                      {isOpen ? (
                        <ChevronDown className="w-6 h-6 text-gray-500" />
                      ) : (
                        <ChevronRight className="w-6 h-6 text-gray-500" />
                      )}
                    </div>
                  </button>

                  {/* Expanded members */}
                  {isOpen && (
                    <div id={`team-${t.id}-members`} className="px-6 pb-6 -mt-1">
                      {t.members && t.members.length > 0 ? (
                        <div className="mt-3 divide-y divide-gray-200 rounded-xl border border-gray-200 bg-white shadow-sm">
                          {t.members.map((m) => {
                            const isLeader = m.teamRole === 'LIDER';
                            const roleLabel = m.teamRole === 'LIDER'
                              ? 'Lider'
                              : m.teamRole === 'TEKNIK_SORUMLU'
                                ? 'Teknik Sorumlu'
                                : m.teamRole === 'TASARIMCI'
                                  ? 'Tasarımcı'
                                  : 'Üye';
                            return (
                              <div key={m.id} className="px-5 py-4">
                                <div className="flex items-start gap-4">
                                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-red-600 text-white flex items-center justify-center font-semibold flex-shrink-0 shadow-sm">
                                    {(m.fullName || 'U').charAt(0).toUpperCase()}
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2 min-w-0">
                                      <p className="text-base font-semibold text-gray-900 truncate">{m.fullName}</p>
                                      <span className={`px-2.5 py-0.5 rounded-full text-[12px] font-semibold border ${
                                        isLeader
                                          ? 'bg-red-50 text-red-700 border-red-200'
                                          : 'bg-gray-50 text-gray-700 border-gray-200'
                                      }`}>
                                        {roleLabel}
                                      </span>
                                    </div>
                                    <div className="mt-1.5 flex items-center gap-6 text-sm text-gray-600">
                                      <span className="inline-flex items-center gap-1.5 min-w-0">
                                        <Mail className="w-4 h-4 text-red-600" />
                                        <span className="truncate">{m.email}</span>
                                      </span>
                                      {m.phone && (
                                        <span className="inline-flex items-center gap-1.5">
                                          <Phone className="w-4 h-4 text-red-600" />
                                          <span>{m.phone}</span>
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500">Üye yok</div>
                      )}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}


