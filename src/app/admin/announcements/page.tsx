 'use client';

import { useEffect, useMemo, useState } from 'react';
import AdminLayout from '@/components/dashboard/AdminLayout';
import { Loader2, Pin, PinOff, Plus, Edit3, Trash2, Megaphone, Search } from 'lucide-react';

interface Announcement {
  id: string;
  title: string;
  summary?: string;
  content?: string;
  category?: string;
  date?: string | null;
  time?: string | null;
  pinned: boolean;
  createdAt: string;
}

export default function AdminAnnouncementsPage() {
  const [items, setItems] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState<Announcement | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [form, setForm] = useState({
    title: '',
    summary: '',
    content: '',
    category: '',
    date: '',
    time: '',
    pinned: false,
  });
  const [errors, setErrors] = useState<{ title?: string }>({});

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/announcements');
      const data = await res.json();
      setItems(data.items || []);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = useMemo(() => {
    if (!searchTerm) return items;
    return items.filter(item => 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.summary?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.content.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [items, searchTerm]);

  useEffect(() => {
    load();
  }, []);

  const resetForm = () => {
    setEditing(null);
    setForm({ title: '', summary: '', content: '', category: '', date: '', time: '', pinned: false });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: typeof errors = {};
    if (!form.title.trim()) nextErrors.title = 'Başlık zorunludur';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    const body = {
      ...form,
      date: form.date || new Date().toISOString().split('T')[0],
      time: form.time || new Date().toTimeString().split(' ')[0],
    };
    if (editing) {
      await fetch(`/api/announcements/${editing.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    } else {
      await fetch('/api/announcements', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    }
    resetForm();
    setOpenForm(false);
    await load();
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/announcements/${id}`, { method: 'DELETE' });
      const result = await response.json();
      
      if (result.success) {
        // Local state'i güncelle - API'yi tekrar çağırmadan
        setItems(items.filter(item => item.id !== id));
      } else {
        console.error('Delete failed:', result.error);
        // Hata durumunda sayfayı yenile
        await load();
      }
    } catch (error) {
      console.error('Delete error:', error);
      // Hata durumunda sayfayı yenile
      await load();
    }
  };

  const togglePin = async (item: Announcement) => {
    await fetch(`/api/announcements/${item.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...item, pinned: !item.pinned }) });
    await load();
  };

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
              <p className="text-sm text-red-700">Katılımcılara duyuru oluşturabilir, sabitleyebilir ve yönetebilirsiniz. Duyurular tüm katılımcılara otomatik olarak ulaşır.</p>
            </div>
          </div>
        </div>
        {/* Arama + Hızlı Aksiyon */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Duyuru ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900"
            />
          </div>
          <button
            onClick={() => { resetForm(); setOpenForm(true); }}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-semibold shadow hover:opacity-95"
          >
            <Plus className="w-4 h-4" /> Yeni Duyuru
          </button>
        </div>

        {/* Liste */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 text-red-600 animate-spin" />
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <Megaphone className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Henüz Duyuru Yok</h3>
              <p className="text-gray-600">Henüz duyuru eklenmemiş. Yeni duyuru oluşturmak için yukarıdaki butonu kullanın.</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {filteredItems.map((a) => (
                <li key={a.id} className="p-4 flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      {a.pinned && <span className="text-xs px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-200">Sabit</span>}
                      <p className="font-semibold text-gray-900">{a.title}</p>
                    </div>
                    {a.summary && <p className="text-gray-900 text-sm mt-1">{a.summary}</p>}
                    <div className="text-xs text-gray-900 mt-1">
                      {a.category ? <span>{a.category}</span> : null}
                      {(a.date || a.time) ? <span className="ml-2">{a.date || ''} {a.time || ''}</span> : null}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => togglePin(a)} className="px-2.5 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-sm inline-flex items-center gap-1 text-gray-900">
                      {a.pinned ? (<><PinOff className="w-4 h-4" /> Kaldır</>) : (<><Pin className="w-4 h-4" /> Sabitle</>)}
                    </button>
                    <button onClick={() => { setEditing(a); setForm({ title: a.title, summary: a.summary || '', content: a.content || '', category: a.category || '', date: a.date || '', time: a.time || '', pinned: a.pinned }); setOpenForm(true); }} className="px-2.5 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-sm inline-flex items-center gap-1 text-gray-900">
                      <Edit3 className="w-4 h-4" /> Düzenle
                    </button>
                    <button onClick={() => handleDelete(a.id)} className="px-2.5 py-1.5 rounded-lg border border-red-200 text-red-700 hover:bg-red-50 text-sm inline-flex items-center gap-1">
                      <Trash2 className="w-4 h-4" /> Sil
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Form Modal (basit inline) */}
        {openForm && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 flex items-center justify-center" role="dialog" aria-modal="true">
            <div className="bg-white rounded-xl shadow-xl border border-gray-200 w-full max-w-2xl p-0 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{editing ? 'Duyuruyu Düzenle' : 'Yeni Duyuru'}</h3>
                  <p className="text-xs text-gray-900">Zorunlu alanlar: Başlık</p>
                </div>
                <button onClick={() => { setOpenForm(false); resetForm(); }} className="text-gray-900 hover:opacity-80">Kapat</button>
              </div>
              <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-1">Başlık <span className="text-red-600">*</span></label>
                    <input
                      value={form.title}
                      onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                      placeholder="Örn: Final Sunumu Yükleme Takvimi"
                      className={`w-full rounded-lg border ${errors.title ? 'border-red-300' : 'border-gray-300'} focus:ring-red-500 focus:border-red-500 text-gray-900`}
                    />
                    {errors.title && <p className="text-xs text-red-600 mt-1">{errors.title}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-1">Kategori</label>
                    <input
                      value={form.category}
                      onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                      placeholder="Örn: Duyuru, Sunum, Program"
                      className="w-full rounded-lg border border-gray-300 focus:ring-red-500 focus:border-red-500 text-gray-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-1">Tarih</label>
                    <input type="date" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} className="w-full rounded-lg border border-gray-300 focus:ring-red-500 focus:border-red-500 text-gray-900" />
                    <p className="text-xs text-gray-900 mt-1">Etkinlik/sunum tarihi (opsiyonel)</p>
                  </div>
        <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-1">Saat</label>
                    <input type="time" value={form.time} onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))} className="w-full rounded-lg border border-gray-300 focus:ring-red-500 focus:border-red-500 text-gray-900" />
                    <p className="text-xs text-gray-900 mt-1">Etkinlik/sunum saati (opsiyonel)</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-900 mb-1">Özet</label>
                    <input
                      value={form.summary}
                      onChange={(e) => setForm((f) => ({ ...f, summary: e.target.value }))}
                      placeholder="Kısa açıklama (liste görünümünde gösterilir)"
                      className="w-full rounded-lg border border-gray-300 focus:ring-red-500 focus:border-red-500 text-gray-900"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-900 mb-1">İçerik</label>
                    <textarea
                      value={form.content}
                      onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                      placeholder="Duyurunun detaylarını yazın..."
                      className="w-full rounded-lg border border-gray-300 focus:ring-red-500 focus:border-red-500 min-h-[120px] text-gray-900"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="inline-flex items-center gap-2">
                    <input id="pinned" type="checkbox" checked={form.pinned} onChange={(e) => setForm((f) => ({ ...f, pinned: e.target.checked }))} className="rounded border-gray-300 text-red-600 focus:ring-red-500" />
                    <span className="text-sm text-gray-900">Sabitlensin</span>
                  </label>
                  <div className="text-xs text-gray-900">Kaydetmeden önce bilgileri kontrol edin</div>
        </div>
        
              </form>
              <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-2 bg-gray-50/50">
                <button type="button" onClick={() => { setOpenForm(false); resetForm(); }} className="px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 text-sm text-gray-900">Vazgeç</button>
                <button onClick={handleSubmit as any} className="px-3 py-2 rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-semibold">Kaydet</button>
              </div>
        </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

