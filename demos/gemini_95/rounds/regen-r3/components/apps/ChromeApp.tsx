import React, { useEffect, useRef, useState } from 'react';
import { DialupHandle, playDialupAudio } from '../../services/dialupAudio';
import { generate1996Website } from '../../services/geminiService';

interface HistoryEntry {
  url: string;
  mode: 'google1999' | 'generated';
  html?: string;
}

const GOOGLE_HOME_URL = 'http://www.google.com/';

const QUICK_LINKS = [
  { label: 'Google 1999', url: GOOGLE_HOME_URL },
  { label: 'SpaceJam.com', url: 'http://www.spacejam.com/' },
  { label: 'GeoCities', url: 'http://www.geocities.com/SiliconValley/9595/' },
  { label: 'Yahoo!', url: 'http://www.yahoo.com/' },
  { label: 'GeminiZone', url: 'http://www.geminizone96.net/' },
];

export const ChromeApp: React.FC = () => {
  const [urlInput, setUrlInput] = useState(GOOGLE_HOME_URL);
  const [googleQuery, setGoogleQuery] = useState('');
  const [history, setHistory] = useState<HistoryEntry[]>([
    { url: GOOGLE_HOME_URL, mode: 'google1999' },
  ]);
  const [historyIdx, setHistoryIdx] = useState(0);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectStage, setConnectStage] = useState('');
  const [statusText, setStatusText] = useState('Done');

  const dialupRef = useRef<DialupHandle | null>(null);
  const reqIdRef = useRef(0);

  useEffect(() => {
    return () => {
      dialupRef.current?.stop();
    };
  }, []);

  const currentEntry = history[historyIdx];

  const navigateTo = async (rawUrl: string) => {
    const trimmed = rawUrl.trim();
    if (!trimmed) return;

    const normalized = /^https?:\/\//i.test(trimmed)
      ? trimmed
      : `http://${trimmed}`;

    setUrlInput(normalized);

    // Stop previous dial-up sound if still running
    dialupRef.current?.stop();
    const myReqId = ++reqIdRef.current;

    setIsConnecting(true);
    setStatusText(`Dialing ${normalized}...`);
    setConnectStage('Dialing 555-0195 via 56k U.S. Robotics Sportster...');

    dialupRef.current = playDialupAudio();

    const t1 = window.setTimeout(() => {
      if (reqIdRef.current === myReqId) {
        setConnectStage('Handshake detected! Negotiating 56,000 bps carrier...');
      }
    }, 650);

    const t2 = window.setTimeout(() => {
      if (reqIdRef.current === myReqId) {
        setConnectStage('Connected to Information Superhighway! Downloading 1996 HTML...');
      }
    }, 1350);

    // Wait at least ~2.1s so the user enjoys the dial-up modem nostalgia while Gemini generates
    const minWait = new Promise((r) => setTimeout(r, 2100));
    const [html] = await Promise.all([generate1996Website(normalized), minWait]);

    window.clearTimeout(t1);
    window.clearTimeout(t2);

    if (reqIdRef.current !== myReqId) return;

    dialupRef.current?.stop();
    dialupRef.current = null;

    const newEntry: HistoryEntry = {
      url: normalized,
      mode: 'generated',
      html,
    };

    setHistory((prev) => {
      const sliced = prev.slice(0, historyIdx + 1);
      return [...sliced, newEntry];
    });
    setHistoryIdx((prev) => prev + 1);
    setIsConnecting(false);
    setStatusText(`Done (${normalized})`);
  };

  const goHome = () => {
    dialupRef.current?.stop();
    reqIdRef.current++;
    setIsConnecting(false);
    setUrlInput(GOOGLE_HOME_URL);
    const homeEntry: HistoryEntry = { url: GOOGLE_HOME_URL, mode: 'google1999' };
    setHistory((prev) => [...prev.slice(0, historyIdx + 1), homeEntry]);
    setHistoryIdx((prev) => prev + 1);
    setStatusText('Done');
  };

  const goBack = () => {
    if (historyIdx <= 0) return;
    dialupRef.current?.stop();
    reqIdRef.current++;
    setIsConnecting(false);
    const nextIdx = historyIdx - 1;
    setHistoryIdx(nextIdx);
    setUrlInput(history[nextIdx].url);
    setStatusText('Done');
  };

  const goForward = () => {
    if (historyIdx >= history.length - 1) return;
    dialupRef.current?.stop();
    reqIdRef.current++;
    setIsConnecting(false);
    const nextIdx = historyIdx + 1;
    setHistoryIdx(nextIdx);
    setUrlInput(history[nextIdx].url);
    setStatusText('Done');
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigateTo(urlInput);
  };

  const handleGoogleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = googleQuery.trim() || 'gemini 95 retro web';
    navigateTo(`http://www.google.com/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
      {/* Times New Roman Browser Controls */}
      <form className="browser-controls" onSubmit={handleFormSubmit}>
        <button
          type="button"
          className="win95-btn browser-btn-times"
          onClick={goBack}
          disabled={historyIdx <= 0}
        >
          Back
        </button>
        <button
          type="button"
          className="win95-btn browser-btn-times"
          onClick={goForward}
          disabled={historyIdx >= history.length - 1}
        >
          Fwd
        </button>
        <button
          type="button"
          className="win95-btn browser-btn-times"
          onClick={goHome}
        >
          Home
        </button>
        <span style={{ fontSize: 13, fontWeight: 700 }}>Location:</span>
        <input
          type="text"
          className="browser-url-input win95-sunken"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          aria-label="URL Address"
        />
        <button type="submit" className="win95-btn browser-btn-times">
          Go!
        </button>
      </form>

      <div className="browser-bookmarks">
        <span style={{ fontWeight: 700, color: '#333' }}>Bookmarks:</span>
        {QUICK_LINKS.map((item) => (
          <button
            key={item.label}
            type="button"
            className="browser-bookmark-link"
            onClick={() =>
              item.url === GOOGLE_HOME_URL ? goHome() : navigateTo(item.url)
            }
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Viewport */}
      <div className="browser-viewport win95-sunken">
        {isConnecting ? (
          <div
            style={{
              flex: 1,
              backgroundColor: '#c0c0c0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 20,
            }}
          >
            <div
              className="win95-raised"
              style={{
                width: 360,
                padding: 16,
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  backgroundColor: '#000080',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: 12,
                  padding: '4px 8px',
                  marginBottom: 12,
                  textAlign: 'left',
                }}
              >
                Dial-Up Networking — Connecting...
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: 14,
                  marginBottom: 12,
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 32,
                    background: '#333',
                    border: '2px inset #fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 4,
                  }}
                >
                  <span
                    className="modem-led-blink"
                    style={{
                      width: 6,
                      height: 6,
                      background: '#00ff44',
                      display: 'inline-block',
                    }}
                  />
                  <span
                    className="modem-led-blink"
                    style={{
                      width: 6,
                      height: 6,
                      background: '#ff3333',
                      display: 'inline-block',
                      animationDelay: '0.18s',
                    }}
                  />
                  <span
                    className="modem-led-blink"
                    style={{
                      width: 6,
                      height: 6,
                      background: '#ffcc00',
                      display: 'inline-block',
                      animationDelay: '0.09s',
                    }}
                  />
                </div>
                <div className="font-courier" style={{ fontSize: 12, fontWeight: 700 }}>
                  56.6 KBPS MODEM
                </div>
              </div>
              <div style={{ fontSize: 12, color: '#000', marginBottom: 10 }}>
                {connectStage}
              </div>
              <div
                className="win95-sunken"
                style={{
                  height: 18,
                  background: '#ffffff',
                  padding: 2,
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: '68%',
                    background:
                      'repeating-linear-gradient(90deg, #000080 0 10px, transparent 10px 13px)',
                  }}
                />
              </div>
              <div className="font-times" style={{ fontSize: 11, color: '#444', marginTop: 8 }}>
                Generating chaotic 1996 page for {urlInput}...
              </div>
            </div>
          </div>
        ) : currentEntry.mode === 'google1999' ? (
          /* Authentic 1999 Google! BETA Homepage */
          <div
            className="font-times"
            style={{
              flex: 1,
              backgroundColor: '#ffffff',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px 16px',
              textAlign: 'center',
              color: '#000000',
            }}
          >
            <div style={{ position: 'relative', marginBottom: 14 }}>
              <span
                style={{
                  fontSize: 58,
                  fontWeight: 700,
                  letterSpacing: -2,
                  textShadow: '2px 2px 1px rgba(0,0,0,0.22)',
                }}
              >
                <span style={{ color: '#1849c6' }}>G</span>
                <span style={{ color: '#d62418' }}>o</span>
                <span style={{ color: '#e5b80b' }}>o</span>
                <span style={{ color: '#1849c6' }}>g</span>
                <span style={{ color: '#229933' }}>l</span>
                <span style={{ color: '#d62418' }}>e</span>
                <span style={{ color: '#1849c6' }}>!</span>
              </span>
              <span
                style={{
                  position: 'absolute',
                  right: -28,
                  bottom: 6,
                  fontSize: 12,
                  fontWeight: 700,
                  color: '#777777',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                BETA
              </span>
            </div>

            <form
              onSubmit={handleGoogleSearch}
              style={{
                width: '100%',
                maxWidth: 460,
                backgroundColor: '#eeeeee',
                padding: '12px 18px',
                border: '1px solid #cccccc',
              }}
            >
              <div style={{ fontSize: 15, marginBottom: 6 }}>
                Search the web using Google!
              </div>
              <input
                type="text"
                value={googleQuery}
                onChange={(e) => setGoogleQuery(e.target.value)}
                style={{
                  width: '88%',
                  height: 24,
                  padding: '0 6px',
                  fontSize: 14,
                  fontFamily: 'Times New Roman, Times, serif',
                  border: '2px inset #ffffff',
                  marginBottom: 8,
                  userSelect: 'text',
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
                <button type="submit" className="win95-btn browser-btn-times">
                  Google Search
                </button>
                <button
                  type="button"
                  className="win95-btn browser-btn-times"
                  onClick={() =>
                    navigateTo(
                      googleQuery.trim()
                        ? `http://www.${googleQuery.trim().replace(/\s+/g, '')}.com/`
                        : 'http://www.geocities.com/Area51/1996/'
                    )
                  }
                >
                  I&apos;m feeling lucky
                </button>
              </div>
            </form>

            <div style={{ marginTop: 14, fontSize: 13 }}>
              <button
                type="button"
                className="browser-bookmark-link"
                onClick={() => navigateTo('http://www.google.com/about1999.html')}
              >
                More Google!
              </button>
              {' • '}
              <button
                type="button"
                className="browser-bookmark-link"
                onClick={() => navigateTo('http://www.geocities.com/SiliconValley/9595/')}
              >
                Surf 1996 Web!
              </button>
            </div>

            <div style={{ marginTop: 18, fontSize: 12, color: '#444444' }}>
              Copyright &copy;1999 Google Inc.
            </div>
          </div>
        ) : (
          <iframe
            title="1996 Retro Page"
            srcDoc={currentEntry.html || ''}
            sandbox="allow-same-origin"
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              flex: 1,
              backgroundColor: '#000000',
            }}
          />
        )}
      </div>

      <div className="app-statusbar">
        <span>{statusText}</span>
        <span>56k Dial-Up</span>
      </div>
    </div>
  );
};
