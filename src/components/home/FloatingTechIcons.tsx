'use client';

import React from 'react';
import { Brain, Cloud, Cpu, Network, Bot, Shield } from 'lucide-react';

type FloatingTechIconsProps = {
  density?: 'low' | 'medium' | 'high';
  color?: string; // default accent
};

const ICONS = [Brain, Cloud, Cpu, Network, Bot, Shield];

const FloatingTechIcons: React.FC<FloatingTechIconsProps> = ({ density = 'medium', color = 'var(--accent)' }) => {
  const count = density === 'high' ? 14 : density === 'low' ? 6 : 10;
  const items = Array.from({ length: count }).map((_, i) => {
    const Icon = ICONS[i % ICONS.length];
    const top = Math.random() * 70 + 10; // % olarak
    const left = Math.random() * 80 + 10; // % olarak
    const size = Math.random() * 18 + 16; // px
    const delay = Math.random() * 4;
    const duration = 6 + Math.random() * 6;
    const opacity = 0.08 + Math.random() * 0.12;
    return { i, Icon, top, left, size, delay, duration, opacity };
  });

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
      <style>{`
        @keyframes floatY { 0%{ transform: translateY(0px);} 50%{ transform: translateY(-8px);} 100%{ transform: translateY(0px);} }
        @keyframes floatX { 0%{ transform: translateX(0px);} 50%{ transform: translateX(8px);} 100%{ transform: translateX(0px);} }
        @media (prefers-reduced-motion: reduce) {
          .float-anim { animation: none !important; }
        }
      `}</style>
      {items.map(({ i, Icon, top, left, size, delay, duration, opacity }) => (
        <Icon
          key={i}
          className="float-anim"
          style={{
            position: 'absolute',
            top: `${top}%`,
            left: `${left}%`,
            width: `${size}px`,
            height: `${size}px`,
            color: color as string,
            opacity,
            animation: `floatY ${duration}s ease-in-out ${delay}s infinite, floatX ${duration * 1.2}s ease-in-out ${delay / 2}s infinite`,
          }}
        />
      ))}
    </div>
  );
};

export default FloatingTechIcons;


