import React, { useCallback, useEffect, useRef, useState } from 'react';

const PALETTE_COLORS = [
  '#000000', '#808080', '#800000', '#808000', '#008000', '#008080', '#000080', '#800080', '#ff6600',
  '#ffffff', '#c0c0c0', '#ff0000', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#ff00ff', '#ff99cc',
];

const BRUSH_SIZES = {
  S: 3,
  M: 8,
  L: 18,
} as const;

type BrushSizeKey = keyof typeof BRUSH_SIZES;
type ToolMode = 'brush' | 'eraser';

interface GemPaintProps {
  registerCanvasGetter: (
    getter: (() => { dataUrl: string; strokeCount: number }) | null
  ) => void;
  onStrokeComplete: () => void;
}

export const GemPaint: React.FC<GemPaintProps> = ({
  registerCanvasGetter,
  onStrokeComplete,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef<boolean>(false);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);
  const strokeCountRef = useRef<number>(0);

  const [color, setColor] = useState<string>('#000000');
  const [tool, setTool] = useState<ToolMode>('brush');
  const [brushSize, setBrushSize] = useState<BrushSizeKey>('M');

  const fillWhite = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  useEffect(() => {
    fillWhite();
  }, [fillWhite]);

  useEffect(() => {
    registerCanvasGetter(() => {
      const canvas = canvasRef.current;
      return {
        dataUrl: canvas ? canvas.toDataURL('image/png') : '',
        strokeCount: strokeCountRef.current,
      };
    });
    return () => registerCanvasGetter(null);
  }, [registerCanvasGetter]);

  const getCanvasPoint = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.setPointerCapture(e.pointerId);
    const pt = getCanvasPoint(e);
    isDrawingRef.current = true;
    lastPosRef.current = pt;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const size = BRUSH_SIZES[brushSize];
    ctx.fillStyle = tool === 'eraser' ? '#ffffff' : color;
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, size / 2, 0, Math.PI * 2);
    ctx.fill();
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const pt = getCanvasPoint(e);
    const prev = lastPosRef.current || pt;

    ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : color;
    ctx.lineWidth = BRUSH_SIZES[brushSize];
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(prev.x, prev.y);
    ctx.lineTo(pt.x, pt.y);
    ctx.stroke();

    lastPosRef.current = pt;
  };

  const handlePointerUp = () => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    lastPosRef.current = null;
    strokeCountRef.current += 1;
    onStrokeComplete();
  };

  const handleClear = () => {
    fillWhite();
    strokeCountRef.current = 0;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Main Paint Workspace: Left Tool Rail + Canvas */}
      <div style={{ display: 'flex', flex: 1, minHeight: 0, gap: 6 }}>
        {/* Left MS Paint Tool Rail */}
        <div
          style={{
            width: 74,
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
            padding: '4px 2px',
            flexShrink: 0,
          }}
        >
          {/* Tools: Brush / Eraser */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <button
              type="button"
              className={`win95-btn ${tool === 'brush' ? 'pressed' : ''}`}
              onClick={() => setTool('brush')}
              title="Brush Tool"
              style={{ width: '100%', padding: '5px 4px', fontSize: 11 }}
            >
              🖌 Brush
            </button>
            <button
              type="button"
              className={`win95-btn ${tool === 'eraser' ? 'pressed' : ''}`}
              onClick={() => setTool('eraser')}
              title="Eraser Tool"
              style={{ width: '100%', padding: '5px 4px', fontSize: 11 }}
            >
              🧽 Eraser
            </button>
          </div>

          {/* Brush Sizes: S / M / L */}
          <div
            className="win95-sunken-gray"
            style={{
              padding: 4,
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
              alignItems: 'center',
            }}
          >
            <span style={{ fontSize: 10, fontWeight: 700, color: '#222' }}>
              Size
            </span>
            <div style={{ display: 'flex', gap: 3, width: '100%' }}>
              {(['S', 'M', 'L'] as BrushSizeKey[]).map((sz) => (
                <button
                  key={sz}
                  type="button"
                  className={`win95-btn ${brushSize === sz ? 'pressed' : ''}`}
                  onClick={() => setBrushSize(sz)}
                  style={{
                    flex: 1,
                    padding: '3px 0',
                    fontSize: 11,
                    fontWeight: 700,
                  }}
                  title={`Brush Size ${sz}`}
                >
                  {sz}
                </button>
              ))}
            </div>
            {/* Visual dot preview */}
            <div
              style={{
                height: 22,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  width: BRUSH_SIZES[brushSize],
                  height: BRUSH_SIZES[brushSize],
                  borderRadius: '50%',
                  backgroundColor: tool === 'eraser' ? '#ffffff' : color,
                  border: '1px solid #000000',
                }}
              />
            </div>
          </div>

          <button
            type="button"
            className="win95-btn"
            onClick={handleClear}
            style={{
              width: '100%',
              marginTop: 'auto',
              padding: '5px 4px',
              fontSize: 11,
              fontWeight: 700,
            }}
          >
            Clear
          </button>
        </div>

        {/* Sunken Dark-Gray Canvas Desk */}
        <div
          className="win95-sunken"
          style={{
            flex: 1,
            backgroundColor: '#808080',
            padding: 8,
            overflow: 'auto',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
          }}
        >
          <canvas
            ref={canvasRef}
            width={560}
            height={340}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            style={{
              backgroundColor: '#ffffff',
              cursor: tool === 'eraser' ? 'cell' : 'crosshair',
              boxShadow: '2px 2px 0 #404040',
              touchAction: 'none',
              maxWidth: '100%',
              height: 'auto',
              display: 'block',
            }}
          />
        </div>
      </div>

      {/* Bottom Classic MS Paint Color Palette */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '6px 4px 2px',
          marginTop: 4,
          borderTop: '1px solid #808080',
          boxShadow: 'inset 0 1px 0 #ffffff',
        }}
      >
        {/* Active Swatch Preview */}
        <div
          className="win95-sunken"
          style={{
            width: 34,
            height: 34,
            backgroundColor: '#dfdfdf',
            position: 'relative',
            flexShrink: 0,
          }}
          title={`Active Color: ${color}`}
        >
          <div
            style={{
              position: 'absolute',
              right: 3,
              bottom: 3,
              width: 16,
              height: 16,
              backgroundColor: '#ffffff',
              border: '1px solid #808080',
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: 3,
              top: 3,
              width: 18,
              height: 18,
              backgroundColor: color,
              border: '1px solid #000000',
            }}
          />
        </div>

        {/* Two-row 18 Color Swatches */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(9, 20px)',
            gap: 3,
          }}
        >
          {PALETTE_COLORS.map((swatch) => (
            <button
              key={swatch}
              type="button"
              aria-label={`Color ${swatch}`}
              onClick={() => {
                setColor(swatch);
                setTool('brush');
              }}
              style={{
                width: 20,
                height: 16,
                backgroundColor: swatch,
                borderTop: '2px solid #808080',
                borderLeft: '2px solid #808080',
                borderRight: '2px solid #ffffff',
                borderBottom: '2px solid #ffffff',
                outline:
                  color === swatch && tool === 'brush'
                    ? '2px solid #000080'
                    : 'none',
                cursor: 'pointer',
                padding: 0,
              }}
            />
          ))}
        </div>

        <div
          style={{
            marginLeft: 'auto',
            fontSize: 11,
            color: '#404040',
            whiteSpace: 'nowrap',
          }}
        >
          {tool === 'eraser' ? 'Eraser' : 'Brush'} ({brushSize})
        </div>
      </div>
    </div>
  );
};
