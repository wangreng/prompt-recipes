import React, { useCallback, useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleGenAI } from '@google/genai';
import { LoaderCircle, SendHorizontal, Trash2, X } from 'lucide-react';

declare const process: { env?: { API_KEY?: string } } | undefined;

interface Point {
  x: number;
  y: number;
}

const STROKE_WIDTH = 5;
const IMAGE_MODEL = 'gemini-2.0-flash-preview-image-generation';

function getApiKey(): string {
  try {
    return process?.env?.API_KEY || '';
  } catch {
    return '';
  }
}

function parseErrorMessage(error: unknown): string {
  if (!error) return 'An unexpected error occurred while generating the image.';
  const raw = error instanceof Error ? error.message : String(error);
  try {
    const jsonStart = raw.indexOf('{');
    if (jsonStart !== -1) {
      const parsed = JSON.parse(raw.slice(jsonStart));
      const nested = parsed?.error?.message || parsed?.message;
      if (typeof nested === 'string' && nested.trim()) {
        return nested.trim();
      }
    }
  } catch {
    // Fall back to the raw error message
  }
  return raw || 'An unexpected error occurred while generating the image.';
}

function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const colorInputRef = useRef<HTMLInputElement | null>(null);

  const isDrawingRef = useRef(false);
  const lastPointRef = useRef<Point | null>(null);
  const lastMidPointRef = useRef<Point | null>(null);
  const penColorRef = useRef('#000000');

  const [penColor, setPenColor] = useState('#000000');
  const [prompt, setPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    penColorRef.current = penColor;
  }, [penColor]);

  const fillCanvasWhite = useCallback((canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.save();
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
  }, []);

  // Initialize canvas to crisp 1:1 display aspect ratio and preserve strokes on resize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const syncCanvasSize = (preserveExisting: boolean) => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;

      const nextWidth = Math.round(rect.width);
      const nextHeight = Math.round(rect.height);

      if (
        preserveExisting &&
        Math.abs(nextWidth - canvas.width) <= 2 &&
        Math.abs(nextHeight - canvas.height) <= 2
      ) {
        return;
      }

      let snapshot: HTMLCanvasElement | null = null;
      if (preserveExisting && canvas.width > 0 && canvas.height > 0) {
        snapshot = document.createElement('canvas');
        snapshot.width = canvas.width;
        snapshot.height = canvas.height;
        const snapCtx = snapshot.getContext('2d');
        if (snapCtx) {
          snapCtx.drawImage(canvas, 0, 0);
        }
      }

      canvas.width = nextWidth;
      canvas.height = nextHeight;
      fillCanvasWhite(canvas);

      if (snapshot) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const scale = Math.min(
            nextWidth / snapshot.width,
            nextHeight / snapshot.height
          );
          const drawW = snapshot.width * scale;
          const drawH = snapshot.height * scale;
          const dx = (nextWidth - drawW) / 2;
          const dy = (nextHeight - drawH) / 2;
          ctx.drawImage(snapshot, dx, dy, drawW, drawH);
        }
      }
    };

    syncCanvasSize(false);

    const handleResize = () => syncCanvasSize(true);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [fillCanvasWhite]);

  // Draw generated image onto the canvas whenever a new image arrives
  useEffect(() => {
    if (!generatedImage) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let cancelled = false;
    const img = new Image();
    img.onload = () => {
      if (cancelled) return;
      ctx.save();
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const scale = Math.min(
        canvas.width / img.width,
        canvas.height / img.height
      );
      const drawWidth = img.width * scale;
      const drawHeight = img.height * scale;
      const offsetX = (canvas.width - drawWidth) / 2;
      const offsetY = (canvas.height - drawHeight) / 2;

      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
      ctx.restore();
    };
    img.src = generatedImage;

    return () => {
      cancelled = true;
    };
  }, [generatedImage]);

  const getCoordinatesFromClient = useCallback(
    (clientX: number, clientY: number): Point | null => {
      const canvas = canvasRef.current;
      if (!canvas) return null;
      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return null;
      return {
        x: ((clientX - rect.left) * canvas.width) / rect.width,
        y: ((clientY - rect.top) * canvas.height) / rect.height,
      };
    },
    []
  );

  const beginStroke = useCallback((point: Point) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    isDrawingRef.current = true;
    lastPointRef.current = point;
    lastMidPointRef.current = point;

    ctx.save();
    ctx.fillStyle = penColorRef.current;
    ctx.beginPath();
    ctx.arc(point.x, point.y, STROKE_WIDTH / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }, []);

  const continueStroke = useCallback((point: Point) => {
    if (!isDrawingRef.current || !lastPointRef.current || !lastMidPointRef.current) {
      return;
    }
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const lastPoint = lastPointRef.current;
    const lastMidPoint = lastMidPointRef.current;
    const midPoint: Point = {
      x: (lastPoint.x + point.x) / 2,
      y: (lastPoint.y + point.y) / 2,
    };

    ctx.save();
    ctx.strokeStyle = penColorRef.current;
    ctx.lineWidth = STROKE_WIDTH;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(lastMidPoint.x, lastMidPoint.y);
    ctx.quadraticCurveTo(lastPoint.x, lastPoint.y, midPoint.x, midPoint.y);
    ctx.stroke();
    ctx.restore();

    lastPointRef.current = point;
    lastMidPointRef.current = midPoint;
  }, []);

  const finishStroke = useCallback(() => {
    if (!isDrawingRef.current) return;
    const canvas = canvasRef.current;
    const lastPoint = lastPointRef.current;
    const lastMidPoint = lastMidPointRef.current;

    if (canvas && lastPoint && lastMidPoint) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.save();
        ctx.strokeStyle = penColorRef.current;
        ctx.lineWidth = STROKE_WIDTH;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(lastMidPoint.x, lastMidPoint.y);
        ctx.lineTo(lastPoint.x, lastPoint.y);
        ctx.stroke();
        ctx.restore();
      }
    }

    isDrawingRef.current = false;
    lastPointRef.current = null;
    lastMidPointRef.current = null;
  }, []);

  // Mouse handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (e.button !== 0) return;
    const point = getCoordinatesFromClient(e.clientX, e.clientY);
    if (point) beginStroke(point);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    const point = getCoordinatesFromClient(e.clientX, e.clientY);
    if (point) continueStroke(point);
  };

  // Non-passive touch listeners so scrolling is reliably blocked while sketching
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 0) return;
      e.preventDefault();
      const touch = e.touches[0];
      const point = getCoordinatesFromClient(touch.clientX, touch.clientY);
      if (point) beginStroke(point);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDrawingRef.current || e.touches.length === 0) return;
      e.preventDefault();
      const touch = e.touches[0];
      const point = getCoordinatesFromClient(touch.clientX, touch.clientY);
      if (point) continueStroke(point);
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (isDrawingRef.current) {
        e.preventDefault();
        finishStroke();
      }
    };

    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvas.addEventListener('touchend', handleTouchEnd, { passive: false });
    canvas.addEventListener('touchcancel', handleTouchEnd, { passive: false });

    return () => {
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);
      canvas.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [beginStroke, continueStroke, finishStroke, getCoordinatesFromClient]);

  // Global mouseup guard in case user releases mouse outside the canvas
  useEffect(() => {
    const handleWindowMouseUp = () => finishStroke();
    window.addEventListener('mouseup', handleWindowMouseUp);
    return () => window.removeEventListener('mouseup', handleWindowMouseUp);
  }, [finishStroke]);

  // Escape key closes error modal
  useEffect(() => {
    if (!showErrorModal) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowErrorModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showErrorModal]);

  const handleOpenColorPicker = () => {
    colorInputRef.current?.click();
  };

  const handleClearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      fillCanvasWhite(canvas);
    }
    setGeneratedImage(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedPrompt = prompt.trim();
    if (!trimmedPrompt || isLoading) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsLoading(true);
    setErrorMessage('');

    try {
      const apiKey = getApiKey();
      if (!apiKey) {
        throw new Error(
          'Missing Gemini API key. Please provide process.env.API_KEY to generate images.'
        );
      }

      // Composite current canvas onto a guaranteed solid white PNG
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      const tempCtx = tempCanvas.getContext('2d');
      if (!tempCtx) {
        throw new Error('Unable to capture canvas image.');
      }
      tempCtx.fillStyle = '#ffffff';
      tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
      tempCtx.drawImage(canvas, 0, 0);

      const drawingBase64 = tempCanvas.toDataURL('image/png').split(',')[1];
      const ai = new GoogleGenAI({ apiKey });

      const response = await ai.models.generateContent({
        model: IMAGE_MODEL,
        contents: [
          {
            role: 'user',
            parts: [
              {
                inlineData: {
                  data: drawingBase64,
                  mimeType: 'image/png',
                },
              },
              {
                text: `${trimmedPrompt}. Keep the same minimal line doodle style.`,
              },
            ],
          },
        ],
        config: {
          responseModalities: ['TEXT', 'IMAGE'],
        },
      });

      const parts = response.candidates?.[0]?.content?.parts ?? [];
      let returnedImageUrl: string | null = null;
      let returnedText = '';

      for (const part of parts) {
        if (part.inlineData?.data) {
          const mimeType = part.inlineData.mimeType || 'image/png';
          returnedImageUrl = `data:${mimeType};base64,${part.inlineData.data}`;
          break;
        }
        if (part.text) {
          returnedText += part.text;
        }
      }

      if (!returnedImageUrl) {
        throw new Error(
          returnedText.trim() ||
            'Gemini did not return an updated image. Please try a different prompt.'
        );
      }

      setGeneratedImage(returnedImageUrl);
      setPrompt('');
    } catch (err) {
      setErrorMessage(parseErrorMessage(err));
      setShowErrorModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-shell">
      <main className="app-container">
        <header className="app-header">
          <div className="header-text">
            <h1 className="app-title">Gemini Co-Drawing</h1>
            <p className="app-subtitle">
              Built with{' '}
              <a
                href="https://ai.google.dev/gemini-api/docs/image-generation"
                target="_blank"
                rel="noopener noreferrer"
              >
                Gemini 2.0 native image generation
              </a>
            </p>
            <p className="app-subtitle">
              by{' '}
              <a
                href="https://x.com/trudypainter"
                target="_blank"
                rel="noopener noreferrer"
              >
                @trudypainter
              </a>{' '}
              and{' '}
              <a
                href="https://x.com/alexanderchen"
                target="_blank"
                rel="noopener noreferrer"
              >
                @alexanderchen
              </a>
            </p>
          </div>

          <div className="toolbar-pill" role="toolbar" aria-label="Canvas tools">
            <div className="color-picker-wrapper">
              <button
                type="button"
                className="toolbar-btn color-swatch-btn"
                style={{ backgroundColor: penColor }}
                onClick={handleOpenColorPicker}
                aria-label="Choose pen color"
                title="Choose pen color"
              />
              <input
                ref={colorInputRef}
                type="color"
                value={penColor}
                onChange={(e) => setPenColor(e.target.value)}
                className="color-input-hidden"
                aria-label="Pen color"
                tabIndex={-1}
              />
            </div>

            <button
              type="button"
              className="toolbar-btn clear-btn"
              onClick={handleClearCanvas}
              aria-label="Clear canvas"
              title="Clear canvas"
            >
              <Trash2 size={18} strokeWidth={2} aria-hidden="true" />
            </button>
          </div>
        </header>

        <div className="canvas-wrapper">
          <canvas
            ref={canvasRef}
            width={960}
            height={540}
            className="drawing-canvas"
            aria-label="Collaborative drawing canvas"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={finishStroke}
            onMouseLeave={finishStroke}
          />
        </div>

        <form className="prompt-form" onSubmit={handleSubmit}>
          <input
            type="text"
            className="prompt-input"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Add your change..."
            aria-label="Add your change"
            required
            disabled={isLoading}
          />
          <button
            type="submit"
            className="submit-btn"
            disabled={isLoading}
            aria-label={isLoading ? 'Generating image' : 'Submit prompt'}
            title="Submit prompt"
          >
            {isLoading ? (
              <LoaderCircle
                size={18}
                strokeWidth={2}
                className="spin-icon"
                aria-hidden="true"
              />
            ) : (
              <SendHorizontal size={18} strokeWidth={2} aria-hidden="true" />
            )}
          </button>
        </form>
      </main>

      {showErrorModal && (
        <div
          className="modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="error-modal-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowErrorModal(false);
            }
          }}
        >
          <div className="modal-card">
            <div className="modal-header">
              <h2 id="error-modal-title" className="modal-title">
                Failed to generate
              </h2>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setShowErrorModal(false)}
                aria-label="Close error modal"
              >
                <X size={20} strokeWidth={2} aria-hidden="true" />
              </button>
            </div>
            <p className="modal-body">{errorMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
}

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
