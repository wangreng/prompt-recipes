import React, { useState } from 'react';

export const ImageViewerApp: React.FC = () => {
  const [zoom, setZoom] = useState<number>(1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#c0c0c0' }}>
      <div className="win95-toolbar" style={{ justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <button
            type="button"
            className="win95-btn"
            onClick={() => setZoom((z) => Math.max(0.6, +(z - 0.2).toFixed(1)))}
          >
            − Zoom Out
          </button>
          <button
            type="button"
            className="win95-btn"
            onClick={() => setZoom(1)}
          >
            {Math.round(zoom * 100)}%
          </button>
          <button
            type="button"
            className="win95-btn"
            onClick={() => setZoom((z) => Math.min(1.8, +(z + 0.2).toFixed(1)))}
          >
            + Zoom In
          </button>
        </div>
        <span className="font-inter" style={{ fontSize: 11, color: '#333' }}>
          C:\dontshowthistoanyone.jpg
        </span>
      </div>

      {/* Dark viewer canvas */}
      <div
        className="win95-sunken"
        style={{
          flex: 1,
          margin: 4,
          backgroundColor: '#242424',
          overflow: 'auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 14,
        }}
      >
        <div
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: 'center center',
            transition: 'transform 0.12s ease',
            backgroundColor: '#f7f4ec',
            padding: '14px 14px 36px 14px',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.55)',
            border: '1px solid #d5cfc0',
          }}
        >
          {/* Nostalgic 1995 Polaroid / Webcam Easter-Egg Snapshot */}
          <svg
            width="380"
            height="270"
            viewBox="0 0 380 270"
            xmlns="http://www.w3.org/2000/svg"
            style={{ display: 'block', border: '2px solid #2a2a2a' }}
          >
            <defs>
              <linearGradient id="woodWall" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6b4423" />
                <stop offset="100%" stopColor="#4a2e16" />
              </linearGradient>
              <linearGradient id="crtGlow" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#6366f1" />
              </linearGradient>
              <radialGradient id="flashVignette" cx="50%" cy="45%" r="65%">
                <stop offset="50%" stopColor="rgba(255,250,220,0.06)" />
                <stop offset="100%" stopColor="rgba(0,0,0,0.38)" />
              </radialGradient>
            </defs>

            {/* 90s Wood-paneled basement wall */}
            <rect width="380" height="270" fill="url(#woodWall)" />
            {[38, 76, 114, 152, 190, 228, 266, 304, 342].map((x) => (
              <line key={x} x1={x} y1="0" x2={x} y2="210" stroke="#361f0d" strokeWidth="2" opacity="0.65" />
            ))}

            {/* Corkboard / Poster on wall */}
            <rect x="20" y="22" width="106" height="72" fill="#fde047" stroke="#1e1e1e" strokeWidth="2" transform="rotate(-3 73 58)" />
            <text x="73" y="47" textAnchor="middle" fontFamily="Comic Sans MS, cursive" fontSize="11" fontWeight="700" fill="#dc2626" transform="rotate(-3 73 58)">
              TOP SECRET!!
            </text>
            <text x="73" y="64" textAnchor="middle" fontFamily="Courier New, monospace" fontSize="9.5" fontWeight="700" fill="#1e1e1e" transform="rotate(-3 73 58)">
              Project Gemini 95
            </text>
            <text x="73" y="79" textAnchor="middle" fontFamily="Courier New, monospace" fontSize="8.5" fill="#1e3a8a" transform="rotate(-3 73 58)">
              16MB RAM EDITION
            </text>
            <circle cx="73" cy="25" r="3.5" fill="#ef4444" stroke="#1e1e1e" strokeWidth="1" />

            {/* Retro Lava Lamp on right */}
            <polygon points="328,185 344,185 349,205 323,205" fill="#9ca3af" stroke="#1e1e1e" strokeWidth="1.5" />
            <path d="M328,185 L324,132 L336,112 L348,132 L344,185 Z" fill="#581c87" stroke="#1e1e1e" strokeWidth="1.5" />
            <ellipse cx="336" cy="166" rx="7" ry="10" fill="#ec4899" />
            <circle cx="334" cy="144" r="5" fill="#f472b6" />
            <polygon points="331,112 341,112 339,104 333,104" fill="#9ca3af" stroke="#1e1e1e" strokeWidth="1.4" />

            {/* Desk surface */}
            <rect x="0" y="200" width="380" height="70" fill="#9c7a54" stroke="#1e1e1e" strokeWidth="2" />

            {/* Stack of 3.5" Floppy Disks on left */}
            <rect x="26" y="208" width="52" height="10" fill="#2563eb" stroke="#1e1e1e" strokeWidth="1.4" />
            <rect x="30" y="199" width="52" height="10" fill="#ef4444" stroke="#1e1e1e" strokeWidth="1.4" />
            <rect x="28" y="190" width="52" height="10" fill="#16a34a" stroke="#1e1e1e" strokeWidth="1.4" />
            <rect x="44" y="191" width="16" height="8" fill="#e5e7eb" />

            {/* Coffee Mug ("WORLD'S OKAYEST AI") */}
            <rect x="268" y="176" width="32" height="36" rx="3" fill="#ffffff" stroke="#1e1e1e" strokeWidth="1.8" />
            <path d="M300,183 C312,183 312,204 300,204" fill="none" stroke="#1e1e1e" strokeWidth="3" />
            <text x="284" y="193" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="6.2" fontWeight="800" fill="#000080">
              I ♥ 56K
            </text>
            <text x="284" y="202" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="5.5" fontWeight="700" fill="#dc2626">
              MODEMS
            </text>

            {/* The Easter-Egg Star: A goofy 1995 CRT-Head Prototype Robot wearing cool 90s shades & peace sign */}
            <g transform="translate(115, 58)">
              {/* Body (90s windbreaker jacket in teal/purple/magenta) */}
              <path d="M30,115 L120,115 L136,162 L14,162 Z" fill="#0d9488" stroke="#1e1e1e" strokeWidth="2" />
              <polygon points="30,115 75,146 120,115 120,128 75,160 30,128" fill="#9333ea" />
              <polygon points="56,115 75,134 94,115" fill="#ec4899" />

              {/* Antenna with Gemini sparkle */}
              <line x1="75" y1="8" x2="75" y2="-16" stroke="#1e1e1e" strokeWidth="3" />
              <path
                d="M75 -31 L77.5 -21 L87 -18.5 L77.5 -16 L75 -6 L72.5 -16 L63 -18.5 L72.5 -21 Z"
                fill="#38bdf8"
                stroke="#1e1e1e"
                strokeWidth="1.4"
              />

              {/* CRT Monitor Head */}
              <rect x="20" y="8" width="110" height="92" rx="10" fill="#d8d4c8" stroke="#1e1e1e" strokeWidth="2.4" />
              <rect x="31" y="19" width="88" height="65" rx="6" fill="url(#crtGlow)" stroke="#1e1e1e" strokeWidth="2" />

              {/* Cool 90s Pixel Sunglasses */}
              <rect x="39" y="34" width="31" height="16" rx="2" fill="#111827" stroke="#ffffff" strokeWidth="1.4" />
              <rect x="80" y="34" width="31" height="16" rx="2" fill="#111827" stroke="#ffffff" strokeWidth="1.4" />
              <line x1="70" y1="40" x2="80" y2="40" stroke="#111827" strokeWidth="4" />
              {/* Glossy glare stripes on shades */}
              <line x1="44" y1="37" x2="50" y2="47" stroke="#38bdf8" strokeWidth="2.5" />
              <line x1="85" y1="37" x2="91" y2="47" stroke="#38bdf8" strokeWidth="2.5" />

              {/* Huge cheeky grin */}
              <path d="M52 60 Q75 78 98 60" fill="none" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" />

              {/* Bezel LED */}
              <circle cx="114" cy="92" r="2.6" fill="#22c55e" stroke="#1e1e1e" strokeWidth="0.9" />
              <text x="75" y="95" textAnchor="middle" fontFamily="Courier New, monospace" fontSize="8" fontWeight="700" fill="#333333">
                GEMINI-0.1 ALPHA
              </text>

              {/* Sticky note slapped on monitor corner */}
              <g transform="translate(106, 2) rotate(12)">
                <rect width="38" height="32" fill="#fef08a" stroke="#1e1e1e" strokeWidth="1.2" />
                <text x="19" y="13" textAnchor="middle" fontFamily="Comic Sans MS, cursive" fontSize="6.8" fill="#1e1e1e">
                  DO NOT
                </text>
                <text x="19" y="23" textAnchor="middle" fontFamily="Comic Sans MS, cursive" fontSize="6.8" fill="#dc2626" fontWeight="700">
                  UPLOAD!!
                </text>
              </g>
            </g>

            {/* Camera Flash & Vintage Vignette */}
            <rect width="380" height="270" fill="url(#flashVignette)" />

            {/* Classic 1995 Orange Camera Date Stamp */}
            <text
              x="252"
              y="255"
              fontFamily="Courier New, monospace"
              fontSize="15"
              fontWeight="700"
              fill="#ff7b00"
              stroke="#000000"
              strokeWidth="0.6"
            >
              95 11 21
            </text>
          </svg>

          <div
            className="font-comic"
            style={{
              marginTop: 10,
              textAlign: 'center',
              fontSize: 13,
              color: '#2b2b2b',
            }}
          >
            "Leaked prototype photo from Basement Lab #4 — seriously, delete this!!"
          </div>
        </div>
      </div>

      <div className="win95-statusbar">
        <div className="win95-statusbar-cell">dontshowthistoanyone.jpg — 380 × 270 px</div>
        <div className="win95-statusbar-cell" style={{ flex: 0.5 }}>Zoom: {Math.round(zoom * 100)}%</div>
      </div>
    </div>
  );
};
