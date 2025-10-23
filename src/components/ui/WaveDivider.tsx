'use client';

import React from 'react';

type WaveDividerProps = {
  topColor?: string;
  accentColor?: string;
  bottomColor?: string;
  height?: { mobile: number; desktop: number };
  className?: string;
  variant?: 'smooth' | 'sharp';
  animated?: boolean;
  flow?: boolean;
  flowSpeed?: number; // saniye cinsinden baz hız
  direction?: 'left' | 'right';
  colorCycle?: boolean;
  cycleSpeed?: number; // saniye
};

const WaveDivider: React.FC<WaveDividerProps> = ({
  topColor = '#EEF2FF',
  accentColor = 'var(--accent)',
  bottomColor = '#F8FAFC',
  height = { mobile: 260, desktop: 400 },
  className = '',
  variant = 'smooth',
  animated = false,
  flow = false,
  flowSpeed = 12,
  direction = 'left',
  colorCycle = false,
  cycleSpeed = 8
}) => {
  return (
    <div aria-hidden className={`relative w-full overflow-hidden leading-[0] ${className}`}>
      <svg
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        className="block w-[calc(100%+1.5px)] wave-divider"
        style={{ height: `${height.mobile}px` }}
      >
        {/* Üst kaplama: Hero alt tonu ile aynı renk (dikişsiz geçiş) */}
        {variant === 'sharp' ? (
          <path d="M0,36 L120,20 C 240,4 360,84 480,64 C 600,44 720,108 840,86 C 960,66 1080,128 1200,106 C 1320,88 1440,132 1440,320 L0,320 Z" fill={topColor as string} />
        ) : (
          <path d="M0,28 C 240,58 480,18 720,40 C 960,62 1200,26 1440,50 L1440,320 L0,320 Z" fill={topColor as string} />
        )}

        {/* Lacivert accent katmanları (derinlik) + akış */}
        {flow ? (
          <>
            <g>
              <g>
                <path d="M0,80 C 180,60 360,100 540,80 S 900,100 1080,80 S 1260,60 1440,80 L1440,320 L0,320 Z" fill={accentColor as string} fillOpacity={0.12}>
                  {colorCycle && (<animate attributeName="fill-opacity" values="0.10;0.16;0.10" dur={`${cycleSpeed}s`} repeatCount="indefinite" />)}
                </path>
                <path d="M0,80 C 180,60 360,100 540,80 S 900,100 1080,80 S 1260,60 1440,80 L1440,320 L0,320 Z" transform="translate(1440,0)" fill={accentColor as string} fillOpacity={0.12}>
                  {colorCycle && (<animate attributeName="fill-opacity" values="0.10;0.16;0.10" dur={`${cycleSpeed}s`} repeatCount="indefinite" />)}
                </path>
              </g>
              <animateTransform attributeName="transform" type="translate" dur={`${flowSpeed}s`} repeatCount="indefinite" from={`${direction==='left' ? '0 0' : '-1440 0'}`} to={`${direction==='left' ? '-1440 0' : '0 0'}`} />
            </g>
            <g>
              <g>
                <path d="M0,120 C 180,100 360,140 540,120 S 900,140 1080,120 S 1260,100 1440,120 L1440,320 L0,320 Z" fill={accentColor as string} fillOpacity={0.20}>
                  {colorCycle && (<animate attributeName="fill-opacity" values="0.18;0.26;0.18" dur={`${cycleSpeed*1.2}s`} repeatCount="indefinite" />)}
                </path>
                <path d="M0,120 C 180,100 360,140 540,120 S 900,140 1080,120 S 1260,100 1440,120 L1440,320 L0,320 Z" transform="translate(1440,0)" fill={accentColor as string} fillOpacity={0.20}>
                  {colorCycle && (<animate attributeName="fill-opacity" values="0.18;0.26;0.18" dur={`${cycleSpeed*1.2}s`} repeatCount="indefinite" />)}
                </path>
              </g>
              <animateTransform attributeName="transform" type="translate" dur={`${flowSpeed*1.4}s`} repeatCount="indefinite" from={`${direction==='left' ? '0 0' : '-1440 0'}`} to={`${direction==='left' ? '-1440 0' : '0 0'}`} />
            </g>
            <g>
              <g>
                <path d="M0,160 C 180,140 360,180 540,160 S 900,180 1080,160 S 1260,140 1440,160 L1440,320 L0,320 Z" fill={accentColor as string} fillOpacity={0.28}>
                  {colorCycle && (<animate attributeName="fill-opacity" values="0.24;0.32;0.24" dur={`${cycleSpeed*1.5}s`} repeatCount="indefinite" />)}
                </path>
                <path d="M0,160 C 180,140 360,180 540,160 S 900,180 1080,160 S 1260,140 1440,160 L1440,320 L0,320 Z" transform="translate(1440,0)" fill={accentColor as string} fillOpacity={0.28}>
                  {colorCycle && (<animate attributeName="fill-opacity" values="0.24;0.32;0.24" dur={`${cycleSpeed*1.5}s`} repeatCount="indefinite" />)}
                </path>
              </g>
              <animateTransform attributeName="transform" type="translate" dur={`${flowSpeed*2}s`} repeatCount="indefinite" from={`${direction==='left' ? '0 0' : '-1440 0'}`} to={`${direction==='left' ? '-1440 0' : '0 0'}`} />
            </g>
            <g>
              <g>
                <path d="M0,200 C 180,180 360,220 540,200 S 900,220 1080,200 S 1260,180 1440,200 L1440,320 L0,320 Z" fill={accentColor as string} fillOpacity={0.36}>
                  {colorCycle && (<animate attributeName="fill-opacity" values="0.32;0.40;0.32" dur={`${cycleSpeed*1.8}s`} repeatCount="indefinite" />)}
                </path>
                <path d="M0,200 C 180,180 360,220 540,200 S 900,220 1080,200 S 1260,180 1440,200 L1440,320 L0,320 Z" transform="translate(1440,0)" fill={accentColor as string} fillOpacity={0.36}>
                  {colorCycle && (<animate attributeName="fill-opacity" values="0.32;0.40;0.32" dur={`${cycleSpeed*1.8}s`} repeatCount="indefinite" />)}
                </path>
              </g>
              <animateTransform attributeName="transform" type="translate" dur={`${flowSpeed*2.5}s`} repeatCount="indefinite" from={`${direction==='left' ? '0 0' : '-1440 0'}`} to={`${direction==='left' ? '-1440 0' : '0 0'}`} />
            </g>
          </>
        ) : (
          <g className={animated ? 'wave-bob-slow' : ''}>
            {variant === 'sharp' ? (
              <>
                <path d="M0,68 L120,48 C 240,28 360,88 480,68 C 600,48 720,108 840,88 C 960,68 1080,128 1200,108 C 1320,88 1440,128 1440,320 L0,320 Z" fill={accentColor as string} fillOpacity={0.18} />
                <path d="M0,108 L120,88 C 240,68 360,128 480,108 C 600,88 720,148 840,128 C 960,108 1080,168 1200,148 C 1320,128 1440,168 1440,320 L0,320 Z" fill={accentColor as string} fillOpacity={0.26} />
                <path d="M0,148 L120,128 C 240,108 360,168 480,148 C 600,128 720,188 840,168 C 960,148 1080,208 1200,188 C 1320,168 1440,208 1440,320 L0,320 Z" fill={accentColor as string} fillOpacity={0.34} />
                <path d="M0,188 L120,168 C 240,148 360,208 480,188 C 600,168 720,228 840,208 C 960,188 1080,248 1200,228 C 1320,208 1440,248 1440,320 L0,320 Z" fill={accentColor as string} fillOpacity={0.42} />
              </>
            ) : (
              <>
                <path d="M0,56 C 240,88 480,24 720,56 C 960,88 1200,44 1440,76 L1440,320 L0,320 Z" fill={accentColor as string} fillOpacity={0.14} />
                <path d="M0,96 C 240,128 480,64 720,96 C 960,128 1200,84 1440,116 L1440,320 L0,320 Z" fill={accentColor as string} fillOpacity={0.20} />
                <path d="M0,136 C 240,168 480,104 720,136 C 960,168 1200,124 1440,156 L1440,320 L0,320 Z" fill={accentColor as string} fillOpacity={0.26} />
                <path d="M0,176 C 240,208 480,144 720,176 C 960,208 1200,164 1440,196 L1440,320 L0,320 Z" fill={accentColor as string} fillOpacity={0.32} />
              </>
            )}
          </g>
        )}

        {/* Alt taban: About arka plan rengine maskelenir */}
        {variant === 'sharp' ? (
          <path d="M0,218 L120,188 C 240,160 360,208 480,188 C 600,170 720,216 840,196 C 960,178 1080,228 1200,210 C 1320,194 1440,232 1440,320 L0,320 Z" fill={bottomColor as string} />
        ) : (
          <path d="M0,208 C 240,238 480,160 720,200 C 960,236 1200,176 1440,216 L1440,320 L0,320 Z" fill={bottomColor as string} />
        )}
      </svg>
      <style>{`
        @media (min-width: 768px){ .wave-divider{ height: ${height.desktop}px; } }
        @keyframes wave-bob { 0% { transform: translateY(0px);} 50% { transform: translateY(6px);} 100% { transform: translateY(0px);} }
        .wave-bob-slow { animation: wave-bob 8s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default WaveDivider;


