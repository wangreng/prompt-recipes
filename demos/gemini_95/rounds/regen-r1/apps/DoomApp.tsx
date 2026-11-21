import React, { useState } from 'react';

const DOOM_SOURCES = [
  {
    id: 'archive',
    label: 'Internet Archive',
    url: 'https://archive.org/embed/doom_dos',
  },
  {
    id: 'js-dos',
    label: 'js-dos Classic',
    url: 'https://js-dos.com/games/doom.exe.html',
  },
  {
    id: 'wasm',
    label: 'WASM Doom',
    url: 'https://diekmann.github.io/wasm-fizzbuzz/doom/',
  },
] as const;

export const DoomApp: React.FC = () => {
  const [sourceIdx, setSourceIdx] = useState<number>(0);
  const current = DOOM_SOURCES[sourceIdx];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Top Info & Mirror Switcher Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 8,
          padding: '3px 6px 5px',
          fontSize: 11,
        }}
      >
        <span>
          <b>Controls:</b> Click game screen to focus • Arrows Move • Ctrl Fire • Space Open
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {DOOM_SOURCES.map((src, idx) => (
            <button
              key={src.id}
              type="button"
              className={`win95-btn ${idx === sourceIdx ? 'pressed' : ''}`}
              onClick={() => setSourceIdx(idx)}
              style={{ fontSize: 11, padding: '2px 6px' }}
            >
              {src.label}
            </button>
          ))}
        </div>
      </div>

      {/* Playable Doom Embedded Iframe */}
      <div
        className="win95-sunken"
        style={{
          flex: 1,
          minHeight: 0,
          backgroundColor: '#000000',
          position: 'relative',
        }}
      >
        <iframe
          key={current.url}
          src={current.url}
          title="Playable Doom II"
          allow="autoplay; fullscreen; gamepad; keyboard-map"
          allowFullScreen
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            display: 'block',
            backgroundColor: '#000000',
          }}
        />
      </div>

      <div
        className="win95-sunken-thin"
        style={{ marginTop: 4, padding: '2px 6px', fontSize: 11 }}
      >
        Running MS-DOS Subsystem — Source: {current.label} (Tip: Type IDDQD for god mode!)
      </div>
    </div>
  );
};
