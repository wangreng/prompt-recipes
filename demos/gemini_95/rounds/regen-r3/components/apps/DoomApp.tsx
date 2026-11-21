import React, { useState } from 'react';

const DOOM_SOURCES = [
  {
    name: 'DOS.Zone (Doom II)',
    url: 'https://dos.zone/player/?bundleUrl=https%3A%2F%2Fcdn.dos.zone%2Fcustom%2Fdos%2Fdoom2.jsdos?anonymous=1',
  },
  {
    name: 'Archive.org (Doom II)',
    url: 'https://archive.org/embed/msdos_DOOM_II_Hell_on_Earth_1994',
  },
];

export const DoomApp: React.FC = () => {
  const [sourceIdx, setSourceIdx] = useState(0);
  const [reloadKey, setReloadKey] = useState(0);

  const currentSource = DOOM_SOURCES[sourceIdx];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
      <div
        className="explorer-toolbar"
        style={{ justifyContent: 'space-between', paddingBottom: 4 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <button
            type="button"
            className="win95-btn"
            onClick={() => setReloadKey((k) => k + 1)}
          >
            Restart
          </button>
          <button
            type="button"
            className="win95-btn"
            onClick={() => setSourceIdx((i) => (i + 1) % DOOM_SOURCES.length)}
          >
            Switch Mirror
          </button>
        </div>
        <span className="font-courier" style={{ fontSize: 11, color: '#222' }}>
          Arrows: Move • Ctrl: Fire • Space: Open
        </span>
      </div>

      <div
        className="win95-sunken"
        style={{
          flex: 1,
          backgroundColor: '#000000',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <iframe
          key={`${sourceIdx}-${reloadKey}`}
          title="Doom II Playable"
          src={currentSource.url}
          allow="autoplay; fullscreen; gamepad; pointer-lock"
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

      <div className="app-statusbar">
        <span>MS-DOS Mode — {currentSource.name}</span>
        <span>IDDQD / IDKFA</span>
      </div>
    </div>
  );
};
