import React, { useState } from 'react';

export const ImageViewerApp: React.FC = () => {
  const [zoom, setZoom] = useState(1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
      <div className="explorer-toolbar" style={{ paddingBottom: 4 }}>
        <button
          type="button"
          className="win95-btn"
          onClick={() => setZoom((z) => Math.max(0.6, +(z - 0.2).toFixed(2)))}
        >
          Zoom -
        </button>
        <button
          type="button"
          className="win95-btn"
          onClick={() => setZoom(1)}
        >
          100%
        </button>
        <button
          type="button"
          className="win95-btn"
          onClick={() => setZoom((z) => Math.min(1.8, +(z + 0.2).toFixed(2)))}
        >
          Zoom +
        </button>
        <span style={{ marginLeft: 'auto', fontSize: 11, color: '#333' }}>
          {Math.round(zoom * 100)}%
        </span>
      </div>

      <div
        className="win95-sunken"
        style={{
          flex: 1,
          backgroundColor: '#262626',
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
            backgroundColor: '#f5f2e8',
            padding: '12px 12px 26px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.55)',
            border: '1px solid #d2ccbc',
            width: 340,
            flexShrink: 0,
          }}
        >
          {/* Vintage 1995 Candid Flash Photo Easter Egg */}
          <svg
            viewBox="0 0 320 230"
            width="316"
            height="227"
            style={{ display: 'block', border: '1px solid #222' }}
            role="img"
            aria-label="Classified 1995 easter egg photo of a sunglasses-wearing office cat hacking a beige CRT computer"
          >
            <defs>
              <radialGradient id="flashGlow" cx="50%" cy="42%" r="65%">
                <stop offset="0%" stopColor="#354d58" />
                <stop offset="55%" stopColor="#1e2a30" />
                <stop offset="100%" stopColor="#0f1518" />
              </radialGradient>
              <linearGradient id="crtGlow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1c7a5c" />
                <stop offset="100%" stopColor="#0a3b2c" />
              </linearGradient>
              <linearGradient id="catFur" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#df9f53" />
                <stop offset="100%" stopColor="#b57131" />
              </linearGradient>
            </defs>

            {/* Dimly lit 90s computer room */}
            <rect width="320" height="230" fill="url(#flashGlow)" />

            {/* Corkboard on wall */}
            <rect x="16" y="14" width="110" height="72" fill="#8b6844" stroke="#4a341e" strokeWidth="3" />
            <rect x="24" y="22" width="38" height="28" fill="#ffffaa" transform="rotate(-4 24 22)" />
            <text x="27" y="34" fontSize="6" fontFamily="Courier New, monospace" fill="#222" fontWeight="bold">
              SECRET:
            </text>
            <text x="27" y="42" fontSize="5.5" fontFamily="Courier New, monospace" fill="#b00">
              AI = CAT
            </text>
            <rect x="72" y="26" width="44" height="32" fill="#e8e8ff" transform="rotate(3 72 26)" />
            <text x="76" y="40" fontSize="6" fontFamily="Courier New, monospace" fill="#000080" fontWeight="bold">
              GEMINI 1.0
            </text>
            <text x="76" y="49" fontSize="5" fontFamily="Courier New, monospace" fill="#333">
              47 FLOPPIES
            </text>

            {/* Desk surface */}
            <rect x="0" y="164" width="320" height="66" fill="#6f5842" />
            <rect x="0" y="164" width="320" height="4" fill="#8c7157" />

            {/* Beige CRT Monitor on right */}
            <rect x="184" y="54" width="116" height="92" rx="5" fill="#cbc8bc" stroke="#525048" strokeWidth="2" />
            <rect x="195" y="65" width="94" height="66" rx="3" fill="url(#crtGlow)" stroke="#383834" strokeWidth="2" />
            <text x="202" y="81" fontSize="7.5" fontFamily="Courier New, monospace" fill="#6dffb8">
              C:\&gt; TRAIN_AI.EXE
            </text>
            <text x="202" y="93" fontSize="7" fontFamily="Courier New, monospace" fill="#6dffb8">
              LOADING TUNA...
            </text>
            <text x="202" y="105" fontSize="7" fontFamily="Courier New, monospace" fill="#ffff66">
              [##########] 99%
            </text>
            <text x="202" y="119" fontSize="6.5" fontFamily="Courier New, monospace" fill="#6dffb8">
              MEOW_NET READY_
            </text>
            <rect x="224" y="146" width="36" height="10" fill="#a8a599" />
            <rect x="196" y="155" width="92" height="12" fill="#bcb9ad" stroke="#525048" strokeWidth="1.5" />
            <circle cx="282" cy="139" r="2.5" fill="#44ee55" />

            {/* Stack of 3.5" floppy disks */}
            <rect x="22" y="156" width="44" height="8" fill="#2c488a" stroke="#111" strokeWidth="1" />
            <rect x="26" y="148" width="44" height="8" fill="#8a2c3a" stroke="#111" strokeWidth="1" />
            <rect x="23" y="140" width="44" height="8" fill="#2b7347" stroke="#111" strokeWidth="1" />
            <rect x="34" y="141" width="14" height="6" fill="#dcdcdc" />

            {/* Coffee mug */}
            <rect x="278" y="168" width="24" height="24" rx="2" fill="#e6e2d4" stroke="#333" strokeWidth="1.5" />
            <path d="M302 173 C310 173 310 186 302 186" fill="none" stroke="#e6e2d4" strokeWidth="3" />
            <text x="281" y="182" fontSize="6" fontFamily="Inter, sans-serif" fontWeight="bold" fill="#000080">
              #1 AI
            </text>

            {/* The Secret Mastermind: Orange Tabby Cat in 90s Sunglasses & Tie */}
            {/* Ears */}
            <polygon points="82,92 94,58 112,82" fill="url(#catFur)" stroke="#4a2c12" strokeWidth="2" />
            <polygon points="148,82 166,58 176,92" fill="url(#catFur)" stroke="#4a2c12" strokeWidth="2" />
            <polygon points="90,84 96,68 106,82" fill="#e8a4a4" />
            <polygon points="154,82 164,68 170,84" fill="#e8a4a4" />

            {/* Torso & Office Shirt */}
            <ellipse cx="130" cy="176" rx="46" ry="38" fill="#d8e4f0" stroke="#334455" strokeWidth="2" />
            {/* Retro 90s Tie */}
            <polygon points="124,148 136,148 139,198 130,208 121,198" fill="#9a2258" stroke="#3a0a22" strokeWidth="1.5" />
            <line x1="123" y1="164" x2="137" y2="158" stroke="#ffcc33" strokeWidth="2" />
            <line x1="122" y1="178" x2="138" y2="172" stroke="#33ddcc" strokeWidth="2" />
            <line x1="122" y1="192" x2="138" y2="186" stroke="#ffcc33" strokeWidth="2" />

            {/* Cat Head */}
            <ellipse cx="130" cy="112" rx="44" ry="36" fill="url(#catFur)" stroke="#4a2c12" strokeWidth="2" />
            {/* Forehead tabby stripes */}
            <path d="M122 80 L125 90 M130 78 L130 90 M138 80 L135 90" stroke="#7a4618" strokeWidth="2.5" strokeLinecap="round" />

            {/* Cool 90s Pixel-ish Shades */}
            <rect x="92" y="99" width="33" height="18" rx="3" fill="#111116" stroke="#c0c0c0" strokeWidth="1.5" />
            <rect x="135" y="99" width="33" height="18" rx="3" fill="#111116" stroke="#c0c0c0" strokeWidth="1.5" />
            <rect x="125" y="104" width="10" height="4" fill="#c0c0c0" />
            {/* Reflections on sunglasses */}
            <line x1="97" y1="103" x2="105" y2="112" stroke="#55ffaa" strokeWidth="2" opacity="0.65" />
            <line x1="140" y1="103" x2="148" y2="112" stroke="#55ffaa" strokeWidth="2" opacity="0.65" />

            {/* Nose & smug grin */}
            <polygon points="126,122 134,122 130,127" fill="#d9707a" />
            <path d="M120 131 Q130 138 140 131" fill="none" stroke="#4a2c12" strokeWidth="2" strokeLinecap="round" />
            {/* Whiskers */}
            <line x1="74" y1="118" x2="102" y2="122" stroke="#fff3e0" strokeWidth="1.2" />
            <line x1="72" y1="126" x2="102" y2="127" stroke="#fff3e0" strokeWidth="1.2" />
            <line x1="158" y1="122" x2="186" y2="118" stroke="#fff3e0" strokeWidth="1.2" />
            <line x1="158" y1="127" x2="188" y2="126" stroke="#fff3e0" strokeWidth="1.2" />

            {/* Keyboard & Paws */}
            <polygon points="94,186 220,186 232,208 82,208" fill="#d2cfc4" stroke="#525048" strokeWidth="1.5" />
            <rect x="98" y="191" width="114" height="12" fill="#9a988e" />
            <ellipse cx="114" cy="194" rx="13" ry="8" fill="url(#catFur)" stroke="#4a2c12" strokeWidth="1.5" />
            <ellipse cx="164" cy="194" rx="13" ry="8" fill="url(#catFur)" stroke="#4a2c12" strokeWidth="1.5" />

            {/* Authentic orange 90s disposable camera date stamp */}
            <text
              x="224"
              y="222"
              fontSize="11"
              fontFamily="Courier New, monospace"
              fontWeight="bold"
              fill="#ff7722"
              letterSpacing="1"
            >
              &apos;95 08 24
            </text>
          </svg>

          <div
            className="font-comic"
            style={{
              marginTop: 10,
              textAlign: 'center',
              fontSize: 12,
              color: '#2a2a2a',
            }}
          >
            &ldquo;TOP SECRET: Caught Mr. Whiskers running Gemini 95 on 47 floppy disks. DO NOT SHARE!!&rdquo;
          </div>
        </div>
      </div>

      <div className="app-statusbar">
        <span>dontshowthistoanyone.jpg</span>
        <span>320 × 230 • 256 Colors</span>
      </div>
    </div>
  );
};
