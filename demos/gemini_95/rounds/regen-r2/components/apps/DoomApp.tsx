import React, { useState } from 'react';

const DOOM_SOURCES = {
  doszone: {
    label: 'DOS.Zone (Fast)',
    url: 'https://dos.zone/player/?bundleUrl=https%3A%2F%2Fcdn.dos.zone%2Fcustom%2Fdos%2Fdoom.jsdos?anonymous=1',
  },
  archive: {
    label: 'Archive.org Mirror',
    url: 'https://archive.org/embed/doom_dos',
  },
} as const;

type SourceKey = keyof typeof DOOM_SOURCES;

export const DoomApp: React.FC = () => {
  const [source, setSource] = useState<SourceKey>('doszone');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#111111' }}>
      {/* Mini Win95 Control Strip */}
      <div className="win95-toolbar" style={{ justifyContent: 'space-between', padding: '3px 6px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <span className="font-inter" style={{ fontSize: 11, fontWeight: 600 }}>
            Server:
          </span>
          {(Object.keys(DOOM_SOURCES) as SourceKey[]).map((key) => (
            <button
              key={key}
              type="button"
              className={`win95-btn ${source === key ? 'pressed' : ''}`}
              style={{ fontSize: 11, padding: '2px 7px' }}
              onClick={() => setSource(key)}
            >
              {DOOM_SOURCES[key].label}
            </button>
          ))}
        </div>
        <span className="font-courier" style={{ fontSize: 11, color: '#222222' }}>
          Click game to focus · Arrows: Move · Ctrl: Fire · Space: Use
        </span>
      </div>

      {/* Playable Doom Iframe */}
      <div style={{ flex: 1, minHeight: 0, position: 'relative', backgroundColor: '#000000' }}>
        <iframe
          key={source}
          title="Doom II Player"
          src={DOOM_SOURCES[source].url}
          allow="fullscreen; autoplay; gamepad"
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
    </div>
  );
};
