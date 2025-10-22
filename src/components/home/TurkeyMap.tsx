'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ACTIVE_CITY_POINTS, CityPoint, getTotalsFromCities } from '@/utils/constants';

type TurkeyMapProps = {
  cities?: CityPoint[];
  className?: string;
};

const TurkeyMap: React.FC<TurkeyMapProps> = ({ cities = ACTIVE_CITY_POINTS, className }) => {
  const [selected, setSelected] = useState<CityPoint | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [imgBox, setImgBox] = useState<{ left: number; top: number; width: number; height: number }>({ left: 0, top: 0, width: 0, height: 0 });
  const [naturalSize, setNaturalSize] = useState<{ width: number; height: number }>({ width: 883, height: 467 });

  const measure = () => {
    if (!containerRef.current) return;
    const W = containerRef.current.clientWidth;
    const H = containerRef.current.clientHeight;
    const { width: natW, height: natH } = naturalSize;
    const scale = Math.min(W / natW, H / natH);
    const contentW = natW * scale;
    const contentH = natH * scale;
    const left = (W - contentW) / 2;
    const top = (H - contentH) / 2;
    setImgBox({ left, top, width: contentW, height: contentH });
  };

  useEffect(() => {
    measure();
    const onResize = () => measure();
    window.addEventListener('resize', onResize);
    const id = setInterval(measure, 100);
    setTimeout(() => clearInterval(id), 1000);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Türkiye şeklinin harita görseli içindeki yaklaşık sınırları (yüzde)
  // Kullanıcının paylaştığı ayarlara göre sabitlenmiş varsayılanlar:
  // Sol: 12.0, Sağ: 91.8, Üst: 20.0, Alt: 88.6, X: -5.0, Y: -1.4
  const DEFAULT_BOUNDS = { left: 12.0, right: 91.8, top: 20.0, bottom: 88.6 };
  const [shapeBounds, setShapeBounds] = useState(DEFAULT_BOUNDS);
  const [shift, setShift] = useState({ x: -5.0, y: -1.4 });
  const [calibOpen, setCalibOpen] = useState(false);

  // Kalibrasyon değerlerini sakla/oku
  useEffect(() => {
    try {
      const raw = localStorage.getItem('hsd_map_calib_v1');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.bounds && parsed.shift) {
          setShapeBounds(parsed.bounds);
          setShift(parsed.shift);
        }
      }
    } catch {}
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem('hsd_map_calib_v1', JSON.stringify({ bounds: shapeBounds, shift }));
    } catch {}
  }, [shapeBounds, shift]);

  const totals = useMemo(() => getTotalsFromCities(cities), [cities]);
  const bounds = useMemo(() => {
    const xs = cities.map((c) => c.x);
    const ys = cities.map((c) => c.y);
    return {
      minX: Math.min(...xs),
      maxX: Math.max(...xs),
      minY: Math.min(...ys),
      maxY: Math.max(...ys),
    };
  }, [cities]);

  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <div className={"flex flex-col items-center gap-4 " + (className ?? '')}>
      {/* Harita Alanı */}
      <div ref={containerRef} className="relative w-[600px] h-[600px] select-none">
        {/* Üstte istatistik - harita üzerinde overlay */}
        <div className="absolute top-12 left-1/2 -translate-x-1/2 z-20 pointer-events-none text-center">
          <div className="text-[#0B0F19] font-extrabold text-[15px] sm:text-base md:text-lg">
            Toplam <span className="text-[#E31B23]">{totals.cityCount}</span> şehirde, <span className="text-[#E31B23]">{totals.totalUniversities}</span> farklı üniversitede aktifiz
          </div>
        </div>
        <Image
          src="/tr.png"
          alt="Türkiye Haritası"
          width={600}
          height={600}
          className="w-full h-full object-contain pointer-events-none"
          priority
          onLoadingComplete={(img) => {
            setNaturalSize({ width: img.naturalWidth, height: img.naturalHeight });
            setTimeout(measure, 0);
          }}
        />

        {/* Markerlar */}
        {cities.map((c, idx) => {
          const normX = (c.x - bounds.minX) / (bounds.maxX - bounds.minX);
          const normY = (c.y - bounds.minY) / (bounds.maxY - bounds.minY);
          const xPct = shapeBounds.left + normX * (shapeBounds.right - shapeBounds.left) + shift.x;
          const yPct = shapeBounds.top + normY * (shapeBounds.bottom - shapeBounds.top) + shift.y;
          const leftPx = imgBox.left + (xPct / 100) * imgBox.width;
          const topPx = imgBox.top + (yPct / 100) * imgBox.height;
          return (
          <div
            key={c.key}
            className="absolute z-10"
            style={{ left: `${leftPx}px`, top: `${topPx}px`, transform: 'translate(-50%, -100%)' }}
          >
            <button
              onClick={() => setSelected(c)}
              className="relative pointer-events-auto"
              aria-label={`${c.name} - ${c.bootcamps} bootcamp, ${c.universities} üniversite`}
            >
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.4, delay: idx * 0.02 }}
                whileTap={{ scale: 0.9 }}
                className="relative"
              >
                {/* Sürekli hafif ping animasyonu */}
                <motion.span
                  className="absolute -inset-2 rounded-full border-2 border-red-500/40"
                  style={{ zIndex: -1 }}
                  animate={{ scale: [1, 1.6], opacity: [0.5, 0] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut', delay: idx * 0.02 }}
                />
                {/* Konum pini */}
                <svg width={20} height={24} viewBox="0 0 24 24" className="drop-shadow-[0_0_6px_rgba(239,68,68,0.7)]">
                  <path d="M12 2C7.582 2 4 5.582 4 10c0 5.25 6.5 11 8 12 1.5-1 8-6.75 8-12 0-4.418-3.582-8-8-8z" fill="#ef4444"/>
                  <circle cx="12" cy="10" r="3" fill="white"/>
                </svg>
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-[2px] bg-black/40 rounded-full" />
              </motion.div>
            </button>
          </div>
          );
        })}

        {/* Tıklanınca açılan kart */}
        <AnimatePresence>
          {selected && (() => {
            const normX = (selected.x - bounds.minX) / (bounds.maxX - bounds.minX);
            const normY = (selected.y - bounds.minY) / (bounds.maxY - bounds.minY);
            const xPct = shapeBounds.left + normX * (shapeBounds.right - shapeBounds.left) + shift.x;
            const yPct = shapeBounds.top + normY * (shapeBounds.bottom - shapeBounds.top) + shift.y;
            const anchorX = imgBox.left + (xPct / 100) * imgBox.width;
            const anchorY = imgBox.top + (yPct / 100) * imgBox.height;
            const contW = containerRef.current?.clientWidth ?? 600;
            const contH = containerRef.current?.clientHeight ?? 600;
            const gap = 12;
            const rectW = 256; // yaklaşık genişlik (w-64)
            const rectH = 140; // yaklaşık yükseklik
            const placeRight = anchorX + gap + rectW <= contW;
            const left = placeRight ? anchorX + gap : anchorX - gap - rectW;
            const topRaw = anchorY - rectH / 2;
            const margin = 8;
            const top = Math.max(margin, Math.min(contH - rectH - margin, topRaw));
            const styleObj = { left: `${left}px`, top: `${top}px` } as React.CSSProperties;
            return (
            <motion.div
              initial={{ opacity: 0, x: 6, y: -4 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              exit={{ opacity: 0, x: 6, y: -4 }}
              transition={{ duration: 0.15 }}
              className="absolute z-20 bg-white text-gray-900 rounded-xl shadow-2xl overflow-hidden w-64"
              role="dialog"
              aria-modal="true"
              style={styleObj}
            >
              <div className="px-4 py-3 bg-red-600 text-white flex items-center justify-between">
                <div className="font-bold">{selected.name}</div>
                <button
                  onClick={() => setSelected(null)}
                  className="/outline-none focus:outline-none hover:opacity-90"
                  aria-label="Kapat"
                >
                  ✕
                </button>
              </div>
              <div className="p-4 text-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">Bootcamp sayısı</span>
                  <span className="font-semibold">{selected.bootcamps}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Üniversite sayısı</span>
                  <span className="font-semibold">{selected.universities}</span>
                </div>
              </div>
            </motion.div>
            );
          })()}
        </AnimatePresence>
        
      </div>
    </div>
  );
};

export default TurkeyMap;


