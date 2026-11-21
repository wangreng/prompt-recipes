import React, { useRef, useState, useEffect, useCallback } from 'react';
import { critiqueDrawing } from '../../services/geminiService';

const SWATCHES = [
  '#000000', '#808080', '#800000', '#808000', '#008000', '#008080', '#000080', '#800080',
  '#ffffff', '#c0c0c0', '#ff0000', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#ff00ff',
  '#ff8000', '#795548',
];

type BrushSize = 'S' | 'M' | 'L';

const SIZE_PX: Record<BrushSize, number> = {
  S: 3,
  M: 8,
  L: 18,
};

export const GemPaintApp: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [color, setColor] = useState<string>('#000000');
  const [tool, setTool] = useState<'brush' | 'eraser'>('brush');
  const [brushSize, setBrushSize] = useState<BrushSize>('M');
  const [quip, setQuip] = useState<string>(
    "Hi! I'm GemBot. Doodle something and I'll deliver unsolicited, mildly sarcastic art critiques!"
  );
  const [isThinking, setIsThinking] = useState<boolean>(false);

  const isDrawingRef = useRef<boolean>(false);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);
  const strokesVersionRef = useRef<number>(0);
  const lastCritiquedVersionRef = useRef<number>(0);

  // Initialize crisp white canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const triggerCritique = useCallback(async (force = false) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (!force && strokesVersionRef.current === lastCritiquedVersionRef.current) return;
    if (!force && strokesVersionRef.current === 0) return;

    lastCritiquedVersionRef.current = strokesVersionRef.current;
    setIsThinking(true);
    try {
      const dataUrl = canvas.toDataURL('image/png');
      const reply = await critiqueDrawing(dataUrl);
      setQuip(reply);
    } finally {
      setIsThinking(false);
    }
  }, []);

  // Periodic sarcastic vision critique every 12 seconds when user has drawn something new
  useEffect(() => {
    const timer = window.setInterval(() => {
      if (strokesVersionRef.current > lastCritiquedVersionRef.current && !isDrawingRef.current) {
        triggerCritique(false);
      }
    }, 12000);
    return () => clearInterval(timer);
  }, [triggerCritique]);

  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (e.button !== 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const pos = getCanvasCoords(e);
    isDrawingRef.current = true;
    lastPosRef.current = pos;

    const strokeColor = tool === 'eraser' ? '#ffffff' : color;
    const width = SIZE_PX[brushSize] * (tool === 'eraser' ? 1.5 : 1);

    ctx.beginPath();
    ctx.arc(pos.x, pos.y, width / 2, 0, Math.PI * 2);
    ctx.fillStyle = strokeColor;
    ctx.fill();
    strokesVersionRef.current++;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current || !lastPosRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const pos = getCanvasCoords(e);
    const strokeColor = tool === 'eraser' ? '#ffffff' : color;
    const width = SIZE_PX[brushSize] * (tool === 'eraser' ? 1.5 : 1);

    ctx.beginPath();
    ctx.moveTo(lastPosRef.current.x, lastPosRef.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = width;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();

    lastPosRef.current = pos;
  };

  const stopDrawing = () => {
    isDrawingRef.current = false;
    lastPosRef.current = null;
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    strokesVersionRef.current = 0;
    lastCritiquedVersionRef.current = 0;
    setQuip('A fresh blank canvas! Honestly, your strongest work yet.');
  };

  return (
    <div className="paint-layout">
      {/* Toolbar: Tools, S/M/L Brushes, Clear */}
      <div className="win95-toolbar">
        <button
          type="button"
          className={`win95-btn ${tool === 'brush' ? 'pressed' : ''}`}
          onClick={() => setTool('brush')}
        >
          🖌 Brush
        </button>
        <button
          type="button"
          className={`win95-btn ${tool === 'eraser' ? 'pressed' : ''}`}
          onClick={() => setTool('eraser')}
        >
          🧽 Eraser
        </button>

        <span style={{ width: 1, height: 18, background: '#808080', margin: '0 2px' }} />

        {(['S', 'M', 'L'] as BrushSize[]).map((sz) => (
          <button
            key={sz}
            type="button"
            className={`win95-btn ${brushSize === sz ? 'pressed' : ''}`}
            style={{ minWidth: 28, padding: '3px 7px', fontWeight: 700 }}
            onClick={() => setBrushSize(sz)}
            title={`Brush size ${sz}`}
          >
            {sz}
          </button>
        ))}

        <span style={{ width: 1, height: 18, background: '#808080', margin: '0 2px' }} />

        <button type="button" className="win95-btn" onClick={handleClear}>
          Clear
        </button>
        <button
          type="button"
          className="win95-btn"
          disabled={isThinking}
          onClick={() => triggerCritique(true)}
          title="Ask GemBot to critique your art right now"
        >
          🤖 Critique
        </button>
      </div>

      {/* Color Swatches Bar */}
      <div
        className="win95-toolbar"
        style={{ gap: 4, padding: '4px 6px', borderBottom: '1px solid #808080' }}
      >
        <div
          title={`Active color: ${color}`}
          style={{
            width: 24,
            height: 24,
            backgroundColor: tool === 'eraser' ? '#ffffff' : color,
            border: '2px inset #808080',
            marginRight: 6,
            flexShrink: 0,
          }}
        />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          {SWATCHES.map((swatch) => (
            <button
              key={swatch}
              type="button"
              className={`paint-swatch ${tool === 'brush' && color === swatch ? 'active' : ''}`}
              style={{ backgroundColor: swatch }}
              onClick={() => {
                setColor(swatch);
                setTool('brush');
              }}
              aria-label={`Color ${swatch}`}
            />
          ))}
        </div>
      </div>

      {/* Sunken Drawing Canvas + Bottom-Right Clippy-style Robot */}
      <div className="paint-canvas-wrap">
        <canvas
          ref={canvasRef}
          width={760}
          height={440}
          className="paint-canvas win95-sunken"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
        />

        {/* Clippy-Style Robot Assistant with Pale-Yellow Comic Sans Speech Bubble */}
        <div className="gembot-container">
          <div className="gembot-bubble">
            {isThinking ? 'Squinting closely at your masterpiece...' : quip}
          </div>
          <button
            type="button"
            className="gembot-avatar-btn"
            onClick={() => triggerCritique(true)}
            title="Click GemBot for an instant art critique!"
            aria-label="GemBot Art Critic"
          >
            <svg width="58" height="64" viewBox="0 0 60 66" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Antenna with Gemini sparkle */}
              <line x1="30" y1="15" x2="30" y2="7" stroke="#1e1e1e" strokeWidth="2.2" />
              <path
                d="M30 0.5 L31.6 4.8 L36 6.4 L31.6 8 L30 12.3 L28.4 8 L24 6.4 L28.4 4.8 Z"
                fill="#38bdf8"
                stroke="#1e1e1e"
                strokeWidth="1.2"
              />
              {/* Paperclip-inspired metallic spring body */}
              <path
                d="M21 44 C17 52 20 62 30 62 C40 62 43 52 39 44"
                stroke="#64748b"
                strokeWidth="5"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M21 44 C17 52 20 62 30 62 C40 62 43 52 39 44"
                stroke="#cbd5e1"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
              />
              {/* Robot Head */}
              <rect x="11" y="15" width="38" height="30" rx="8" fill="#d4d4d8" stroke="#1e1e1e" strokeWidth="2" />
              {/* Side ear bolts */}
              <rect x="6.5" y="25" width="4.5" height="9" rx="1.5" fill="#94a3b8" stroke="#1e1e1e" strokeWidth="1.5" />
              <rect x="49" y="25" width="4.5" height="9" rx="1.5" fill="#94a3b8" stroke="#1e1e1e" strokeWidth="1.5" />
              {/* Visor screen */}
              <rect x="16" y="20" width="28" height="17" rx="4" fill="#0f172a" stroke="#1e1e1e" strokeWidth="1.5" />
              {/* Expressive Clippy eyebrows + glowing eyes */}
              <path d="M19.5 24 L26 26" stroke="#38bdf8" strokeWidth="1.8" strokeLinecap="round" />
              <path d="M40.5 24 L34 26" stroke="#38bdf8" strokeWidth="1.8" strokeLinecap="round" />
              <circle cx="23.5" cy="29.5" r="2.8" fill="#38bdf8" />
              <circle cx="36.5" cy="29.5" r="2.8" fill="#38bdf8" />
              <circle cx="24.2" cy="28.7" r="1" fill="#ffffff" />
              <circle cx="37.2" cy="28.7" r="1" fill="#ffffff" />
              {/* Smug little smirk */}
              <path d="M26 40.5 Q31 42.8 35 39.5" stroke="#1e1e1e" strokeWidth="1.8" strokeLinecap="round" fill="none" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
