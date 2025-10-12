'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Bell,
  Filter,
  Search,
  Calendar,
  Clock,
  Tag,
  ChevronRight,
  AlertCircle
} from 'lucide-react';

type Announcement = {
  id: number;
  title: string;
  summary: string;
  content: string;
  category: 'Genel' | 'Takvim' | 'Kural' | 'Duyuru';
  date: string; // ISO
  time?: string;
  pinned?: boolean;
};

const initialAnnouncements: Announcement[] = [
  {
    id: 1,
    title: 'Final Sunumu Tarihi Güncellendi',
    summary: 'Final sunum tarihimiz 20 Ekim 2024 saat 14:00 olarak güncellendi.',
    content:
      'Değerli katılımcılar, final sunum tarihimiz 20 Ekim 2024 saat 14:00 olarak güncellenmiştir. Sunum dosyalarınızı ve gerekli materyalleri en geç 18 Ekim 23:59’a kadar yüklemeniz rica olunur.',
    category: 'Takvim',
    date: '2024-10-20',
    time: '14:00',
    pinned: true
  },
  {
    id: 2,
    title: 'Sunum Formatı Hakkında',
    summary: 'Sunum formatı: 10-12 slayt, maksimum 8 dakika.',
    content:
      'Sunumlar 10-12 slaytı geçmemeli ve maksimum 8 dakika olmalıdır. Dosya formatı tercihen PPTX/PDF, link paylaşımı da kabul edilmektedir.',
    category: 'Kural',
    date: '2024-10-10'
  },
  {
    id: 3,
    title: 'Mentorluk Oturumları',
    summary: 'Mentorlarla birebir görüşmeler 12-15 Ekim tarihleri arasında yapılacaktır.',
    content:
      'Mentorluk oturumları 12-15 Ekim arasında planlanmıştır. Randevu takviminden uygun saatleri seçerek kaydolabilirsiniz.',
    category: 'Genel',
    date: '2024-10-12',
    time: '10:00'
  }
];

const categories = ['Tümü', 'Genel', 'Takvim', 'Kural', 'Duyuru'] as const;

const AnnouncementsPage = () => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<(typeof categories)[number]>('Tümü');
  const [onlyPinned, setOnlyPinned] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const [items, setItems] = useState(initialAnnouncements);
  useEffect(() => {
    fetch('/api/announcements')
      .then(r => r.json())
      .then(d => setItems(d.items))
      .catch(() => setItems(initialAnnouncements));
  }, []);

  const filtered = useMemo(() => {
    return items
      .filter(a => (category === 'Tümü' ? true : a.category === category))
      .filter(a => (onlyPinned ? a.pinned : true))
      .filter(a =>
        [a.title, a.summary, a.content].some(text =>
          text.toLowerCase().includes(query.toLowerCase())
        )
      )
      .sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0) || b.date.localeCompare(a.date));
  }, [items, category, onlyPinned, query]);

  const selected = filtered.find(a => a.id === selectedId) || filtered[0] || null;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="sr-only">Duyurular</h1>
          <p className="text-gray-600 mt-2">Güncel duyurular, takvim ve kurallar</p>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Search */}
          <div className="relative max-w-xl w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 placeholder-gray-600"
              placeholder="Duyuru ara..."
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={category}
                onChange={e => setCategory(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900"
              >
                {categories.map(c => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <label className="inline-flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={onlyPinned}
                onChange={e => setOnlyPinned(e.target.checked)}
                className="form-checkbox h-4 w-4 text-red-600 rounded"
              />
              <span className="text-sm text-gray-700">Sabitlenenler</span>
            </label>
          </div>
        </div>
      </div>

      {/* Content: Accordion List */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm divide-y divide-gray-100">
        {filtered.length === 0 && (
          <div className="p-12 text-center">
            <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {items.length === 0 ? 'Henüz Duyuru Yok' : 'Sonuç Bulunamadı'}
            </h3>
            <p className="text-gray-600">
              {items.length === 0 
                ? 'Henüz duyuru eklenmemiş. Duyurular burada görüntülenecek.'
                : 'Arama kriterlerinize uygun duyuru bulunamadı.'
              }
            </p>
          </div>
        )}

        {filtered.map((a, idx) => {
          const open = selectedId === a.id;
          return (
            <div key={a.id} className="px-4">
              <motion.button
                onClick={() => setSelectedId(open ? null : a.id)}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03 }}
                className={`w-full text-left py-4 flex items-start justify-between gap-3 group ${
                  open ? 'text-red-700' : 'text-gray-900'
                }`}
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-red-600 flex-shrink-0" />
                    <span className="text-base md:text-lg font-semibold tracking-tight truncate">
                      {a.title}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2 md:line-clamp-1">
                    {a.summary}
                  </p>
                  <div className="flex items-center flex-wrap gap-3 text-xs text-gray-500 mt-2">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> {new Date(a.date).toLocaleDateString('tr-TR')}
                    </span>
                    {a.time && (
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {a.time}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1">
                      <Tag className="w-3.5 h-3.5" /> {a.category}
                    </span>
                  </div>
                </div>
                <ChevronRight
                  className={`w-4 h-4 text-gray-400 mt-1 transition-transform ${open ? 'rotate-90' : ''}`}
                />
              </motion.button>

              <motion.div
                initial={false}
                animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="pb-5 pr-2 pl-6 md:pl-8">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {a.content}
                  </p>
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AnnouncementsPage;


