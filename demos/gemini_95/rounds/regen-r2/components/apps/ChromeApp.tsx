import React, { useState, useEffect, useRef, useCallback } from 'react';
import { generateRetroPage } from '../../services/geminiService';
import { dialupAudio } from '../../services/dialupAudio';

interface PageEntry {
  url: string;
  mode: 'google1999' | 'retro1996';
  html?: string;
}

const GOOGLE_HOME_URL = 'http://www.google.com';

function injectLinkInterceptor(rawHtml: string): string {
  const helperScript = `
<style>
  @keyframes blink { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0; } }
  blink, .blink { animation: blink 0.85s step-end infinite; }
</style>
<script>
  document.addEventListener('click', function(e) {
    var link = e.target && e.target.closest ? e.target.closest('a') : null;
    if (link && link.getAttribute('href')) {
      e.preventDefault();
      window.parent.postMessage({ type: 'gemini95-chrome-nav', url: link.getAttribute('href') }, '*');
    }
  });
</script>`;
  if (rawHtml.includes('</body>')) {
    return rawHtml.replace('</body>', `${helperScript}</body>`);
  }
  return `${rawHtml}${helperScript}`;
}

export const ChromeApp: React.FC = () => {
  const [history, setHistory] = useState<PageEntry[]>([
    { url: GOOGLE_HOME_URL, mode: 'google1999' },
  ]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);
  const [urlInput, setUrlInput] = useState<string>(GOOGLE_HOME_URL);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [connectingUrl, setConnectingUrl] = useState<string>('');
  const [statusStep, setStatusStep] = useState<string>('Dialing 1-800-GEMINI-95...');
  const [progressBlocks, setProgressBlocks] = useState<number>(3);
  const requestIdRef = useRef<number>(0);

  const currentPage = history[historyIndex];

  useEffect(() => {
    return () => {
      dialupAudio.stop();
    };
  }, []);

  useEffect(() => {
    if (!isConnecting) return;
    const steps = [
      'Dialing 1-800-GEMINI-95...',
      'Negotiating V.90 56k handshake...',
      'Authenticating with 1996 GeoCities Gateway...',
      'Downloading neon tables & animated GIFs...',
    ];
    let stepIdx = 0;
    const stepTimer = window.setInterval(() => {
      stepIdx = (stepIdx + 1) % steps.length;
      setStatusStep(steps[stepIdx]);
    }, 950);

    const progTimer = window.setInterval(() => {
      setProgressBlocks((b) => (b >= 22 ? 2 : b + 1));
    }, 160);

    return () => {
      clearInterval(stepTimer);
      clearInterval(progTimer);
    };
  }, [isConnecting]);

  const navigateTo = useCallback(
    async (rawTarget: string) => {
      const trimmed = rawTarget.trim();
      if (!trimmed) return;

      const normalized = /^https?:\/\//i.test(trimmed) ? trimmed : `http://${trimmed}`;
      setUrlInput(normalized);

      const reqId = ++requestIdRef.current;
      setConnectingUrl(normalized);
      setIsConnecting(true);
      setStatusStep('Dialing 1-800-GEMINI-95...');
      setProgressBlocks(2);
      dialupAudio.play();

      const html = await generateRetroPage(normalized);
      if (requestIdRef.current !== reqId) return;

      dialupAudio.stop();
      setIsConnecting(false);

      const nextEntry: PageEntry = {
        url: normalized,
        mode: 'retro1996',
        html: injectLinkInterceptor(html),
      };

      setHistory((prev) => {
        const sliced = prev.slice(0, historyIndex + 1);
        return [...sliced, nextEntry];
      });
      setHistoryIndex((idx) => idx + 1);
    },
    [historyIndex]
  );

  // Listen for link clicks inside the generated 1996 page iframe
  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.data && e.data.type === 'gemini95-chrome-nav' && typeof e.data.url === 'string') {
        navigateTo(e.data.url);
      }
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [navigateTo]);

  const handleGoHome = () => {
    requestIdRef.current++;
    dialupAudio.stop();
    setIsConnecting(false);
    setUrlInput(GOOGLE_HOME_URL);
    const homeEntry: PageEntry = { url: GOOGLE_HOME_URL, mode: 'google1999' };
    setHistory((prev) => [...prev.slice(0, historyIndex + 1), homeEntry]);
    setHistoryIndex((idx) => idx + 1);
  };

  const handleBack = () => {
    if (historyIndex <= 0) return;
    requestIdRef.current++;
    dialupAudio.stop();
    setIsConnecting(false);
    const nextIdx = historyIndex - 1;
    setHistoryIndex(nextIdx);
    setUrlInput(history[nextIdx].url);
  };

  const handleForward = () => {
    if (historyIndex >= history.length - 1) return;
    requestIdRef.current++;
    dialupAudio.stop();
    setIsConnecting(false);
    const nextIdx = historyIndex + 1;
    setHistoryIndex(nextIdx);
    setUrlInput(history[nextIdx].url);
  };

  const handleGoogleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) {
      navigateTo('http://www.geocities.com/siliconvalley/95');
      return;
    }
    const slug = q.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    navigateTo(`http://www.${slug || 'cyber'}.com`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#c0c0c0' }}>
      {/* Times New Roman Browser Controls */}
      <div className="chrome-toolbar">
        <button
          type="button"
          className="win95-btn"
          onClick={handleBack}
          disabled={historyIndex <= 0}
          title="Back"
        >
          ◀ Back
        </button>
        <button
          type="button"
          className="win95-btn"
          onClick={handleForward}
          disabled={historyIndex >= history.length - 1}
          title="Forward"
        >
          Fwd ▶
        </button>
        <button type="button" className="win95-btn" onClick={handleGoHome} title="1999 Google Home">
          Home
        </button>

        <span className="font-times" style={{ fontSize: 14, fontWeight: 700, marginLeft: 4 }}>
          Location:
        </span>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            navigateTo(urlInput);
          }}
          style={{ display: 'flex', flex: 1, gap: 5, alignItems: 'center' }}
        >
          <input
            type="text"
            className="win95-input chrome-url-input"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            aria-label="URL Address Bar"
          />
          <button type="submit" className="win95-btn">
            Go!
          </button>
        </form>
      </div>

      {/* Main Browser Viewport */}
      <div className="chrome-viewport">
        {isConnecting ? (
          <div className="dialup-screen">
            <div className="dialup-box win95-raised">
              <div
                style={{
                  backgroundColor: '#000080',
                  color: '#ffffff',
                  padding: '4px 8px',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: 12,
                  fontWeight: 700,
                  marginBottom: 12,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span>Dial-Up Networking — 56k Modem</span>
                <span style={{ display: 'inline-flex', gap: 5, alignItems: 'center' }}>
                  <span className="modem-led tx" title="TX" />
                  <span className="modem-led rx" title="RX" />
                  <span className="modem-led cd" title="CD" />
                </span>
              </div>

              <div className="font-times" style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>
                Connecting to {connectingUrl}
              </div>
              <div className="font-courier" style={{ fontSize: 12, color: '#333333', marginBottom: 12 }}>
                {statusStep}
              </div>

              <div className="win95-progress-track win95-sunken" style={{ marginBottom: 12 }}>
                {Array.from({ length: progressBlocks }).map((_, i) => (
                  <div key={i} className="win95-progress-block" />
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="font-courier" style={{ fontSize: 11, color: '#555' }}>
                  Speed: 28,800 bps · Audio: ON
                </span>
                <button
                  type="button"
                  className="win95-btn font-times"
                  onClick={() => {
                    requestIdRef.current++;
                    dialupAudio.stop();
                    setIsConnecting(false);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        ) : currentPage.mode === 'google1999' ? (
          /* Authentic 1999 Google Start Page */
          <div
            className="font-times"
            style={{
              minHeight: '100%',
              backgroundColor: '#ffffff',
              color: '#000000',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '28px 18px',
              textAlign: 'center',
            }}
          >
            {/* Classic 1999 Google! Serif Logo with Exclamation Mark */}
            <div
              style={{
                fontSize: 64,
                fontWeight: 700,
                letterSpacing: '-2px',
                lineHeight: 1,
                marginBottom: 4,
                textShadow: '2px 2px 3px rgba(0,0,0,0.22)',
                userSelect: 'text',
              }}
            >
              <span style={{ color: '#1849c6' }}>G</span>
              <span style={{ color: '#d62d20' }}>o</span>
              <span style={{ color: '#e6b800' }}>o</span>
              <span style={{ color: '#1849c6' }}>g</span>
              <span style={{ color: '#008744' }}>l</span>
              <span style={{ color: '#d62d20' }}>e</span>
              <span style={{ color: '#1849c6' }}>!</span>
            </div>
            <div style={{ fontSize: 11, letterSpacing: 2, color: '#666666', marginBottom: 18 }}>
              BETA
            </div>

            <div
              style={{
                backgroundColor: '#eeeeee',
                width: '100%',
                maxWidth: 500,
                padding: '14px 18px',
                border: '1px solid #cccccc',
              }}
            >
              <div style={{ fontSize: 14, marginBottom: 8 }}>
                Search the web using Google!
              </div>
              <form onSubmit={handleGoogleSearch}>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Try typing any topic or enter any URL above..."
                  style={{
                    width: '88%',
                    padding: '4px 6px',
                    fontFamily: 'Times New Roman, Times, serif',
                    fontSize: 14,
                    border: '2px inset #cccccc',
                    marginBottom: 10,
                  }}
                />
                <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
                  <button type="submit" className="win95-btn font-times" style={{ fontSize: 13 }}>
                    Google Search
                  </button>
                  <button
                    type="button"
                    className="win95-btn font-times"
                    style={{ fontSize: 13 }}
                    onClick={() => navigateTo('http://www.geocities.com/area51/96')}
                  >
                    I&apos;m Feeling Lucky
                  </button>
                </div>
              </form>
            </div>

            <div
              style={{
                marginTop: 18,
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: 14,
                fontSize: 13,
              }}
            >
              {[
                { label: 'GeoCities 1996', url: 'http://www.geocities.com/cyberzone' },
                { label: 'Space Jam', url: 'http://www.spacejam.com' },
                { label: 'Hamster Dance', url: 'http://www.hamsterdance.com' },
                { label: 'About Google!', url: 'http://www.google.com/about99' },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.url}
                  onClick={(e) => {
                    e.preventDefault();
                    navigateTo(item.url);
                  }}
                  style={{ color: '#0000ee', textDecoration: 'underline', cursor: 'pointer' }}
                >
                  {item.label}
                </a>
              ))}
            </div>

            <div style={{ marginTop: 22, fontSize: 12, color: '#444444' }}>
              Copyright ©1999 Google Inc. — Powered by Gemini 95 Time-Warp Modem
            </div>
          </div>
        ) : (
          <iframe
            title="Retro 1996 Webpage"
            srcDoc={currentPage.html || ''}
            sandbox="allow-scripts"
            style={{ width: '100%', height: '100%', border: 'none', display: 'block', background: '#000022' }}
          />
        )}
      </div>

      {/* Browser Status Bar */}
      <div className="win95-statusbar font-times">
        <div className="win95-statusbar-cell">
          {isConnecting ? `Dialing ${connectingUrl}...` : `Done — ${currentPage.url}`}
        </div>
        <div className="win95-statusbar-cell" style={{ flex: 0.35 }}>
          Internet Zone
        </div>
      </div>
    </div>
  );
};
