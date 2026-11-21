import React, { useEffect, useRef, useState } from 'react';
import { critiquePainting } from '../../services/geminiService';
import { ClippyRobotSprite } from '../PixelIcons';

const SWATCHES = [
  '#000000',
  '#808080',
  '#800000',
  '#808000',
  '#008000',
  '#008080',
  '#000080',
  '#800080',
  '#ffffff',
  '#c0c0c0',
  '#ff0000',
  '#ffff00',
  '#00ff00',
  '#00ffff',
  '#0000ff',
  '#ff00ff',
  '#ff8800',
  '#8b4513',
];

type BrushSizeKey = 'S' | 'M' | 'L';

const BRUSH_SIZES: Record<BrushSizeKey, number> = {
  S: 3,
  M: 8,
  L: 18,
};

export const GemPaintApp: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef(false);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);

  const [tool, setTool] = useState<'brush' | 'eraser'>('brush');
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState<BrushSizeKey>('M');
  const [quip, setQuip] = useState(
    "It looks like you're trying to make 'art'! Draw something and click me for a brutally honest Gemini critique."
  );
  const [isCritiquing, setIsCritiquing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const getCanvasPoint = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * canvas.width,
      y: ((e.clientY - rect.top) / rect.height) * canvas.height,
    };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.setPointerCapture(e.pointerId);
    const pos = getCanvasPoint(e);
    isDrawingRef.current = true;
    lastPosRef.current = pos;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const strokeColor = tool === 'eraser' ? '#ffffff' : color;
    const radius = BRUSH_SIZES[brushSize] / 2;
    ctx.fillStyle = strokeColor;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
    ctx.fill();
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current || !lastPosRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const pos = getCanvasPoint(e);
    ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : color;
    ctx.lineWidth = BRUSH_SIZES[brushSize];
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(lastPosRef.current.x, lastPosRef.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    lastPosRef.current = pos;
  };

  const handlePointerUp = () => {
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
    setQuip('Fresh canvas! Surely THIS time it will belong in the Louvre.');
  };

  const analyzeCanvasFallback = (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return { inkRatio: 0, dominantColor: 'mystery' };
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let nonWhite = 0;
    let rSum = 0;
    let gSum = 0;
    let bSum = 0;
    const total = canvas.width * canvas.height;
    for (let i = 0; i < data.length; i += 16) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      if (r < 245 || g < 245 || b < 245) {
        nonWhite++;
        rSum += r;
        gSum += g;
        bSum += b;
      }
    }
    const sampledTotal = Math.max(1, Math.floor(total / 4));
    const inkRatio = nonWhite / sampledTotal;
    let dominantColor = 'charcoal black';
    if (nonWhite > 0) {
      const avgR = rSum / nonWhite;
      const avgG = gSum / nonWhite;
      const avgB = bSum / nonWhite;
      if (avgR > 160 && avgG < 110 && avgB < 110) dominantColor = 'dramatic red';
      else if (avgG > 140 && avgR < 110) dominantColor = 'radioactive green';
      else if (avgB > 140 && avgR < 110) dominantColor = 'Windows-blue';
      else if (avgR > 170 && avgG > 150 && avgB < 100) dominantColor = 'mustard yellow';
      else if (avgR > 120 && avgB > 120) dominantColor = '90s neon purple';
    }
    return { inkRatio, dominantColor };
  };

  const handleCritique = async () => {
    const canvas = canvasRef.current;
    if (!canvas || isCritiquing) return;
    setIsCritiquing(true);
    setQuip('Squinting my optical sensors at your masterpiece...');
    try {
      const pngDataUrl = canvas.toDataURL('image/png');
      const stats = analyzeCanvasFallback(canvas);
      const reply = await critiquePainting(pngDataUrl, stats);
      setQuip(reply);
    } catch {
      setQuip('My art-critic circuits overloaded! Too much raw talent (probably).');
    } finally {
      setIsCritiquing(false);
    }
  };

  return (
    <div className="paint-layout">
      <div className="paint-topbar">
        {/* Brush / Eraser */}
        <div className="paint-group">
          <button
            type="button"
            className={`win95-btn ${tool === 'brush' ? 'pressed' : ''}`}
            onClick={() => setTool('brush')}
            title="Brush"
          >
            Brush
          </button>
          <button
            type="button"
            className={`win95-btn ${tool === 'eraser' ? 'pressed' : ''}`}
            onClick={() => setTool('eraser')}
            title="Eraser"
          >
            Eraser
          </button>
        </div>

        <div className="paint-divider" />

        {/* S / M / L Brush Sizes */}
        <div className="paint-group">
          {(['S', 'M', 'L'] as BrushSizeKey[]).map((sz) => (
            <button
              key={sz}
              type="button"
              className={`win95-btn ${brushSize === sz ? 'pressed' : ''}`}
              onClick={() => setBrushSize(sz)}
              style={{ minWidth: 28, padding: '3px 7px', fontWeight: 700 }}
              title={`Brush size ${sz}`}
            >
              {sz}
            </button>
          ))}
        </div>

        <div className="paint-divider" />

        {/* Clear */}
        <button type="button" className="win95-btn" onClick={handleClear}>
          Clear
        </button>

        <div className="paint-divider" />

        {/* Swatches */}
        <div className="paint-swatches win95-sunken" aria-label="Color palette">
          {SWATCHES.map((swatch) => (
            <button
              key={swatch}
              type="button"
              className={`paint-swatch ${
                tool === 'brush' && color === swatch ? 'selected' : ''
              }`}
              style={{ backgroundColor: swatch }}
              aria-label={`Color ${swatch}`}
              onClick={() => {
                setColor(swatch);
                setTool('brush');
              }}
            />
          ))}
        </div>
      </div>

      {/* Canvas Area */}
      <div className="paint-canvas-wrap win95-sunken">
        <canvas
          ref={canvasRef}
          width={620}
          height={360}
          className="paint-canvas"
          style={{ maxWidth: '100%', maxHeight: '100%', touchAction: 'none' }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        />

        {/* Bottom-right Clippy-style Robot Assistant */}
        <div className="paint-clippy-dock">
          <div className="paint-bubble">
            <div>{quip}</div>
            <div style={{ marginTop: 6, textAlign: 'right' }}>
              <button
                type="button"
                className="win95-btn"
                onClick={handleCritique}
                disabled={isCritiquing}
                style={{ fontSize: 11, padding: '2px 7px' }}
              >
                {isCritiquing ? 'Judging...' : 'Critique My Art'}
              </button>
            </div>
          </div>

          <button
            type="button"
            className="paint-robot-btn"
            onClick={handleCritique}
            title="Click PaintBot for a Gemini art critique"
            aria-label="Ask PaintBot to critique your drawing"
          >
            <ClippyRobotSprite size={56} />
          </button>
        </div>
      </div>

      <div className="app-statusbar">
        <span>
          Tool: {tool === 'brush' ? `Brush (${brushSize})` : `Eraser (${brushSize})`}
        </span>
        <span>Click PaintBot for Gemini Vision Critique</span>
      </div>
    </div>
  );
};
