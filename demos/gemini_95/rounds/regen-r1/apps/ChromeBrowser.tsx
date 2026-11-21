import React, { useEffect, useRef, useState } from 'react';
import { playDialUpSound, stopDialUpSound } from '../services/audioService';
import { generate1996Webpage } from '../services/geminiService';

interface HistoryEntry {
  url: string;
  type: 'google1999' | 'generated';
  html?: string;
}

const HOME_URL = 'http://www.google.com';

const DIALUP_STEPS = [
  'Initializing 56K USRobotics Sportster Modem...',
  'Dialing 555-0195 (GeminiNet ISP)...',
  'Negotiating 28.8k / 56k handshake...',
  'Authenticating cyber-credentials...',
  'Time-warping page to 1996 with Gemini AI...',
];

export const ChromeBrowser: React.FC = () => {
  const [urlInput, setUrlInput] = useState<string>(HOME_URL);
  const [googleQuery, setGoogleQuery] = useState<string>('');
  const [history, setHistory] = useState<HistoryEntry[]>([
    { url: HOME_URL, type: 'google1999' },
  ]);
  const [historyIdx, setHistoryIdx] = useState<number>(0);

  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [connectStep, setConnectStep] = useState<number>(0);
  const [connectProgress, setConnectProgress] = useState<number>(0);
  const [statusText, setStatusText] = useState<string>(
    'Done — Viewing Google! (1999 Archive)'
  );

  const navTokenRef = useRef<number>(0);

  useEffect(() => {
    return () => {
      stopDialUpSound();
    };
  }, []);

  const currentEntry = history[historyIdx];

  const navigateTo = async (rawTarget: string) => {
    const trimmed = rawTarget.trim();
    if (!trimmed) return;

    const normalized =
      trimmed.startsWith('http://') || trimmed.startsWith('https://')
        ? trimmed
        : `http://${trimmed}`;

    setUrlInput(normalized);

    // Return to archived 1999 Google home if exact root google.com requested
    if (
      normalized.toLowerCase() === 'http://www.google.com' ||
      normalized.toLowerCase() === 'http://google.com' ||
      normalized.toLowerCase() === 'https://www.google.com'
    ) {
      stopDialUpSound();
      setIsConnecting(false);
      const nextHist = history.slice(0, historyIdx + 1);
      nextHist.push({ url: HOME_URL, type: 'google1999' });
      setHistory(nextHist);
      setHistoryIdx(nextHist.length - 1);
      setUrlInput(HOME_URL);
      setStatusText('Done — Viewing Google! (1999 Archive)');
      return;
    }

    const token = ++navTokenRef.current;
    setIsConnecting(true);
    setConnectStep(0);
    setConnectProgress(10);
    setStatusText(`Dialing ${normalized}...`);
    playDialUpSound();

    // Animate dial-up progress while Gemini generates the 1996 page + retro logo
    const progressTimer = window.setInterval(() => {
      setConnectProgress((p) => (p < 92 ? p + 7 : p));
      setConnectStep((s) => (s < DIALUP_STEPS.length - 1 ? s + 1 : s));
    }, 550);

    try {
      const [html] = await Promise.all([
        generate1996Webpage(normalized),
        // Ensure dial-up connecting screen is visible long enough for retro magic
        new Promise((r) => setTimeout(r, 2600)),
      ]);

      if (navTokenRef.current !== token) return;

      window.clearInterval(progressTimer);
      setConnectProgress(100);
      setIsConnecting(false);

      const nextHist = history.slice(0, historyIdx + 1);
      nextHist.push({ url: normalized, type: 'generated', html });
      setHistory(nextHist);
      setHistoryIdx(nextHist.length - 1);
      setStatusText(`Connected at 56,000 bps — ${normalized}`);
    } catch {
      if (navTokenRef.current !== token) return;
      window.clearInterval(progressTimer);
      setIsConnecting(false);
      setStatusText('Connection interrupted. Please try dialing again.');
    }
  };

  const handleGoBack = () => {
    if (historyIdx <= 0) return;
    stopDialUpSound();
    navTokenRef.current++;
    setIsConnecting(false);
    const nextIdx = historyIdx - 1;
    setHistoryIdx(nextIdx);
    setUrlInput(history[nextIdx].url);
    setStatusText(`Loaded ${history[nextIdx].url}`);
  };

  const handleGoHome = () => {
    navigateTo(HOME_URL);
  };

  const handleGoogleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = googleQuery.trim() || 'geocities-cool-sites-1996';
    const slug = encodeURIComponent(q.toLowerCase().replace(/\s+/g, '-'));
    navigateTo(`http://www.${slug}.com`);
  };

  return (
    <div
      className="font-browser-95"
      style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
    >
      {/* Browser Navigation & URL Bar (Times New Roman) */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          navigateTo(urlInput);
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '5px 6px 6px',
          backgroundColor: '#c0c0c0',
        }}
      >
        <button
          type="button"
          className="win95-btn font-browser-95"
          disabled={historyIdx <= 0}
          onClick={handleGoBack}
          style={{ fontFamily: 'var(--font-browser)', fontSize: 13 }}
        >
          ◄ Back
        </button>
        <button
          type="button"
          className="win95-btn font-browser-95"
          onClick={handleGoHome}
          style={{ fontFamily: 'var(--font-browser)', fontSize: 13 }}
        >
          Home
        </button>

        <label
          htmlFor="chrome-url-input"
          style={{
            fontFamily: 'var(--font-browser)',
            fontSize: 14,
            fontWeight: 700,
            marginLeft: 2,
          }}
        >
          Address:
        </label>

        <input
          id="chrome-url-input"
          type="text"
          className="win95-sunken font-browser-95"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          placeholder="http://www.geocities.com/awesome"
          style={{
            flex: 1,
            minWidth: 120,
            height: 26,
            padding: '2px 7px',
            fontFamily: 'var(--font-browser)',
            fontSize: 14,
            color: '#000000',
            outline: 'none',
          }}
        />

        <button
          type="submit"
          className="win95-btn font-browser-95"
          style={{
            fontFamily: 'var(--font-browser)',
            fontSize: 14,
            fontWeight: 700,
            padding: '2px 14px',
          }}
        >
          Go!
        </button>
      </form>

      {/* Main Viewport */}
      <div
        className="win95-sunken"
        style={{
          flex: 1,
          minHeight: 0,
          position: 'relative',
          overflow: 'hidden',
          backgroundColor: '#ffffff',
        }}
      >
        {isConnecting ? (
          /* Classic 90s Dial-Up Connecting Screen */
          <div
            style={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#000040',
              color: '#ffffff',
              padding: 24,
              textAlign: 'center',
            }}
          >
            <div
              className="win95-window-border"
              style={{
                width: '100%',
                maxWidth: 420,
                padding: 16,
                color: '#000000',
                fontFamily: 'var(--font-ui)',
                textAlign: 'left',
              }}
            >
              <div
                style={{
                  background: '#000080',
                  color: '#ffffff',
                  fontWeight: 700,
                  padding: '4px 8px',
                  marginBottom: 12,
                  fontSize: 12,
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <span>Dial-Up Networking — Connecting...</span>
                <span>56K</span>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  marginBottom: 14,
                }}
              >
                {/* Pixel Modem Box with Blinking LEDs */}
                <svg
                  width="64"
                  height="46"
                  viewBox="0 0 32 23"
                  shapeRendering="crispEdges"
                >
                  <rect x="2" y="6" width="28" height="12" fill="#000" />
                  <rect x="3" y="7" width="26" height="10" fill="#d0d0c0" />
                  <rect x="4" y="10" width="24" height="5" fill="#202020" />
                  <rect
                    x="6"
                    y="12"
                    width="3"
                    height="2"
                    fill="#00ff00"
                    className="modem-led-blink"
                  />
                  <rect
                    x="11"
                    y="12"
                    width="3"
                    height="2"
                    fill="#ff3300"
                    className="modem-led-blink"
                  />
                  <rect x="16" y="12" width="3" height="2" fill="#ffff00" />
                  <rect x="23" y="11" width="4" height="3" fill="#606060" />
                </svg>

                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 4 }}>
                    Connecting to {urlInput}
                  </div>
                  <div style={{ fontSize: 12, color: '#333333' }}>
                    {DIALUP_STEPS[connectStep]}
                  </div>
                </div>
              </div>

              {/* Classic Chunky Blue Progress Bar */}
              <div
                className="win95-sunken"
                style={{
                  height: 20,
                  padding: 2,
                  backgroundColor: '#ffffff',
                  marginBottom: 8,
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${connectProgress}%`,
                    background:
                      'repeating-linear-gradient(90deg, #000080 0px, #000080 12px, #ffffff 12px, #ffffff 15px)',
                    transition: 'width 0.35s ease',
                  }}
                />
              </div>

              <div
                style={{
                  fontSize: 11,
                  color: '#555',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                MODEM: ATDT 555-0195 ... CARRIER 56000 ... GENERATING 1996 HTML
              </div>
            </div>
          </div>
        ) : currentEntry.type === 'google1999' ? (
          /* Authentic Archived 1999 Google! Homepage */
          <div
            className="win95-scroll font-browser-95"
            style={{
              height: '100%',
              backgroundColor: '#ffffff',
              color: '#000000',
              padding: '28px 20px 24px',
              textAlign: 'center',
              fontFamily: 'var(--font-browser)',
            }}
          >
            {/* Classic 1999 Google! BETA Logo */}
            <div
              style={{
                fontSize: 64,
                fontWeight: 700,
                letterSpacing: -2,
                lineHeight: 1,
                marginBottom: 4,
                textShadow: '3px 3px 0 rgba(0, 0, 0, 0.22)',
                userSelect: 'none',
              }}
            >
              <span style={{ color: '#1a4fd6' }}>G</span>
              <span style={{ color: '#d9261c' }}>o</span>
              <span style={{ color: '#e6b800' }}>o</span>
              <span style={{ color: '#1a4fd6' }}>g</span>
              <span style={{ color: '#1f9933' }}>l</span>
              <span style={{ color: '#d9261c' }}>e</span>
              <span style={{ color: '#1a4fd6' }}>!</span>
            </div>
            <div
              style={{
                fontSize: 12,
                letterSpacing: 3,
                color: '#666666',
                fontWeight: 700,
                marginBottom: 18,
              }}
            >
              BETA
            </div>

            {/* Classic Gray Search Panel */}
            <div
              style={{
                backgroundColor: '#eeeeee',
                padding: '16px 20px',
                maxWidth: 540,
                margin: '0 auto 10px',
              }}
            >
              <div style={{ fontSize: 15, marginBottom: 8 }}>
                Search the web using Google!
              </div>
              <form onSubmit={handleGoogleSearch}>
                <input
                  type="text"
                  value={googleQuery}
                  onChange={(e) => setGoogleQuery(e.target.value)}
                  style={{
                    width: '82%',
                    maxWidth: 340,
                    padding: '3px 6px',
                    fontSize: 15,
                    fontFamily: 'var(--font-browser)',
                    border: '2px inset #c0c0c0',
                    marginBottom: 10,
                  }}
                />
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: 10,
                  }}
                >
                  <button
                    type="submit"
                    className="win95-btn"
                    style={{
                      fontFamily: 'var(--font-browser)',
                      fontSize: 14,
                      padding: '3px 12px',
                    }}
                  >
                    Google Search
                  </button>
                  <button
                    type="button"
                    className="win95-btn"
                    style={{
                      fontFamily: 'var(--font-browser)',
                      fontSize: 14,
                      padding: '3px 12px',
                    }}
                    onClick={() =>
                      navigateTo('http://www.hamsterdance-1996.net')
                    }
                  >
                    I&apos;m feeling lucky
                  </button>
                </div>
              </form>
            </div>

            {/* Classic 1999 Cyan Three-Column Footer Table */}
            <div
              style={{
                maxWidth: 540,
                margin: '0 auto 14px',
                display: 'grid',
                gridTemplateColumns: '1.1fr 0.9fr 1.3fr',
                gap: 3,
                fontSize: 13,
              }}
            >
              <div style={{ backgroundColor: '#7ee5da', padding: '8px 6px' }}>
                <div>Special Searches</div>
                <div>
                  <a
                    href="#stanford"
                    onClick={(e) => {
                      e.preventDefault();
                      navigateTo('http://www.stanford-cs-1996.edu');
                    }}
                    style={{ color: '#0000ee' }}
                  >
                    Stanford Search
                  </a>
                </div>
                <div>
                  <a
                    href="#linux"
                    onClick={(e) => {
                      e.preventDefault();
                      navigateTo('http://www.linux-kernel-1996.org');
                    }}
                    style={{ color: '#0000ee' }}
                  >
                    Linux Search
                  </a>
                </div>
              </div>

              <div style={{ backgroundColor: '#70ccc2', padding: '8px 6px' }}>
                <div>
                  <a
                    href="#help"
                    onClick={(e) => {
                      e.preventDefault();
                      navigateTo('http://www.geocities-help-1996.com');
                    }}
                    style={{ color: '#0000ee' }}
                  >
                    Help!
                  </a>
                </div>
                <div>
                  <a
                    href="#about"
                    onClick={(e) => {
                      e.preventDefault();
                      navigateTo('http://www.about-google-1996.com');
                    }}
                    style={{ color: '#0000ee' }}
                  >
                    About Google!
                  </a>
                </div>
                <div>
                  <a
                    href="#logos"
                    onClick={(e) => {
                      e.preventDefault();
                      navigateTo('http://www.cool-90s-gifs.net');
                    }}
                    style={{ color: '#0000ee' }}
                  >
                    Cool 90s Sites!
                  </a>
                </div>
              </div>

              <div style={{ backgroundColor: '#62b3aa', padding: '8px 6px' }}>
                <div>Get Google! updates monthly:</div>
                <input
                  type="text"
                  defaultValue="your e-mail"
                  style={{
                    width: '88%',
                    margin: '4px 0',
                    fontSize: 12,
                    fontFamily: 'var(--font-browser)',
                  }}
                />
                <div>
                  <button
                    type="button"
                    className="win95-btn"
                    style={{ fontFamily: 'var(--font-browser)', fontSize: 12 }}
                    onClick={() =>
                      navigateTo('http://www.gemini95-newsletter.org')
                    }
                  >
                    Subscribe
                  </button>
                </div>
              </div>
            </div>

            <div style={{ fontSize: 12, color: '#333333' }}>
              Copyright &copy;1999 Google Inc. — Type any URL above and click{' '}
              <b>Go!</b> to surf 1996!
            </div>
          </div>
        ) : (
          /* Sandboxed Generated 1996 Chaotic Webpage */
          <iframe
            title="1996 Generated Webpage"
            srcDoc={currentEntry.html || ''}
            sandbox="allow-same-origin"
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              display: 'block',
              backgroundColor: '#000033',
            }}
          />
        )}
      </div>

      {/* Browser Status Bar (Times New Roman) */}
      <div
        className="font-browser-95"
        style={{
          display: 'flex',
          gap: 4,
          marginTop: 4,
          fontSize: 12,
          fontFamily: 'var(--font-browser)',
        }}
      >
        <div
          className="win95-sunken-thin"
          style={{
            flex: 1,
            padding: '2px 6px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {statusText}
        </div>
        <div
          className="win95-sunken-thin"
          style={{ width: 112, padding: '2px 6px', textAlign: 'center' }}
        >
          Internet Zone
        </div>
      </div>
    </div>
  );
};
