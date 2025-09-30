'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, Clock, Tag, Users, Presentation, Upload, Target } from 'lucide-react';

type AgendaItem = {
  time: string; // HH:mm
  title: string;
  description?: string;
  category: 'Açılış' | 'Eğitim' | 'Mentorluk' | 'Çalışma' | 'Ara' | 'Yemek' | 'Teslim' | 'Sunum' | 'Ödül' | 'Kapanış' | 'Genel';
};

const day1Date = '2026-02-19';
const day2Date = '2026-02-20';

const day1: AgendaItem[] = [
  { time: '09:00', title: 'Kayıt & Karşılama', category: 'Genel', description: 'Kayıt masası, yaka kartları, salon yerleşimi' },
  { time: '09:30', title: 'Açılış Konuşmaları', category: 'Açılış', description: 'Organizasyon ve destekçi kurumlar' },
  { time: '10:00', title: 'Maraton Kuralları & Akış', category: 'Genel', description: 'Değerlendirme, teslim ve süreç' },
  { time: '10:30', title: 'Eğitim: Problem Tanımı ve Çözüm Tasarımı', category: 'Eğitim', description: 'Afet yönetiminde inovatif yaklaşımlar' },
  { time: '11:30', title: 'Takım Çalışması / İdeasyon', category: 'Çalışma', description: 'Mentor destekli fikir geliştirme' },
  { time: '12:30', title: 'Öğle Arası', category: 'Yemek' },
  { time: '13:30', title: 'Mentorluk Oturumları', category: 'Mentorluk', description: '10-15 dk slotlarla birebir görüşmeler' },
  { time: '15:30', title: 'Ara', category: 'Ara' },
  { time: '15:45', title: 'Prototipleme / Sunum Hazırlığı', category: 'Çalışma' },
  { time: '18:00', title: 'Gün Sonu Kontrol', category: 'Genel', description: 'Gün 1 kapanışı ve ertesi gün planı' }
];

const day2: AgendaItem[] = [
  { time: '09:00', title: 'Güne Başlangıç', category: 'Genel', description: 'Son kontrol ve mentorluk hatırlatmaları' },
  { time: '09:15', title: 'Mentorluk / Son Düzenlemeler', category: 'Mentorluk' },
  { time: '11:00', title: 'Sunum Provasi', category: 'Sunum' },
  { time: '12:00', title: 'Öğle Arası', category: 'Yemek' },
  { time: '13:00', title: 'Sunum Dosyası Teslimi', category: 'Teslim', description: 'Sunum dosyaları link/dosya teslimi (deadline 13:30)' },
  { time: '14:00', title: 'Final Sunumları (Jüri)', category: 'Sunum', description: 'Takımlar sırasıyla sahnede' },
  { time: '17:00', title: 'Jüri Değerlendirmesi', category: 'Genel' },
  { time: '17:30', title: 'Ödül Töreni & Kapanış', category: 'Ödül' }
];

const CalendarPage = () => {
  const [selected, setSelected] = useState<{ day: 'day1' | 'day2'; idx: number } | null>(null);
  const [activeDay, setActiveDay] = useState<'day1' | 'day2'>('day1');

  const iconByCategory = (c: EventItem['category']) => {
    switch (c) {
      case 'Eğitim':
        return <Target className="w-4 h-4" />;
      case 'Mentorluk':
        return <Users className="w-4 h-4" />;
      case 'Görev':
        return <Upload className="w-4 h-4" />;
      case 'Sunum':
        return <Presentation className="w-4 h-4" />;
      case 'Final':
        return <CalendarIcon className="w-4 h-4" />;
      default:
        return <Tag className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="sr-only">Program Akışı</h1>
          <p className="text-gray-600 mt-2">Maraton Günü 1 ve 2 için saatlik akış (19-20 Şubat 2026)</p>
        </div>
      </div>
      {/* Top segmented control */}
      <div className="flex items-center justify-center">
        <div className="inline-flex rounded-xl border border-red-200 bg-white overflow-hidden shadow-sm">
          <button
            onClick={() => setActiveDay('day1')}
            className={`px-5 py-3 text-sm font-semibold transition-colors ${
              activeDay === 'day1' ? 'bg-red-600 text-white' : 'text-red-700 hover:bg-red-50'
            }`}
          >
            Maraton Günü 1
          </button>
          <button
            onClick={() => setActiveDay('day2')}
            className={`px-5 py-3 text-sm font-semibold transition-colors border-l border-red-200 ${
              activeDay === 'day2' ? 'bg-red-600 text-white' : 'text-red-700 hover:bg-red-50'
            }`}
          >
            Maraton Günü 2
          </button>
        </div>
      </div>

      {/* Day timeline (single column, clean) */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
        <div className="px-6 py-5 border-b border-gray-200">
          {activeDay === 'day1' ? (
            <>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">19 Şubat 2026 • Perşembe</h2>
              <p className="text-sm text-gray-500 mt-1">Gün 1 program akışı</p>
            </>
          ) : (
            <>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">20 Şubat 2026 • Cuma</h2>
              <p className="text-sm text-gray-500 mt-1">Gün 2 program akışı</p>
            </>
          )}
        </div>
        <div className="p-6">
          <ol className="relative border-l-2 border-red-200 ml-4">
            {(activeDay === 'day1' ? day1 : day2).map((e, idx) => (
              <li key={idx} className="mb-8 ml-4">
                <span className="absolute -left-1.5 mt-1 w-3 h-3 bg-red-600 rounded-full" />
                <div className="flex items-start justify-between flex-wrap gap-3">
                  <div className="inline-flex items-center gap-2 text-red-700 font-semibold">
                    <Clock className="w-4 h-4" /> {e.time}
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-red-50 text-red-700 border border-red-200">
                    {iconByCategory(e.category)} <span>{e.category}</span>
                  </span>
                </div>
                <div className="mt-2 p-4 rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
                  <h3 className="text-base md:text-lg font-bold text-gray-900">{e.title}</h3>
                  {e.description && (
                    <p className="text-sm text-gray-600 mt-1">{e.description}</p>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Note: Single timeline above replaces separate long blocks to reduce clutter */}
    </div>
  );
};

export default CalendarPage;


