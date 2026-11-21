import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleGenAI, Modality } from '@google/genai';
import { LoaderCircle, SendHorizontal, Trash2, X } from 'lucide-react';

declare const process: {
  env: {
    API_KEY?: string;
  };
};

interface Point {
  x: number;
  y: number;
}

const CANVAS_WIDTH = 960;
const CANVAS_HEIGHT = 540;
const STROKE_WIDTH = 5;
const IMAGE_MODEL = 'gemini-2.0-flash-preview-image-generation';

function getApiKey(): string {
  try {
    return process.env.API_KEY || '';
  } catch {
    return '';
  }
}

function parseErrorMessage(error: unknown): string {
  if (!error) {
    return 'An unexpected error occurred while generating the image.';
  }

  const raw =
    error instanceof Error
      ? error.message
      : typeof error === 'string'
        ? error
        : JSON.stringify(error);

  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      const parsed = JSON.parse(jsonMatch[0]);
      if (parsed?.error?.message) {
        return String(parsed.error.message);
      }
      if (parsed?.message) {
        return String(parsed.message);
      }
    } catch {
      // Fall back to raw message below
    }
  }

  return raw || 'An unexpected error occurred while generating the image.';
}

function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const colorInputRef = useRef<HTMLInputElement | null>(null);
  const isDrawingRef = useRef(false);
  const lastPointRef = useRef<Point | null>(null);
  const lastMidPointRef = useRef<Point | null>(null);

  const [penColor, setPenColor] = useState('#000000');
  const [prompt, setPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fillCanvasWhite = useCallback((canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  // Initialize canvas to crisp solid white on mount
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    fillCanvasWhite(canvas);
  }, [fillCanvasWhite]);

  // Prevent touch scrolling while sketching on touch devices
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleTouchMove = (e: TouchEvent) => {
      if (isDrawingRef.current) {
        e.preventDefault();
      }
    };

    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    return () => {
      canvas.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  // Draw returned generated image onto the canvas for continuous sketching on top
  useEffect(() => {
    if (!generatedImage) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    let cancelled = false;
    const img = new Image();
    img.onload = () => {
      if (cancelled) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
    img.src = generatedImage;

    return () => {
      cancelled = true;
    };
  }, [generatedImage]);

  // Allow dismissing the error modal with Escape
  useEffect(() => {
    if (!errorMessage) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setErrorMessage(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [errorMessage]);

  const getCanvasPoint = (
    e: React.PointerEvent<HTMLCanvasElement>,
  ): Point | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return null;
    return {
      x: ((e.clientX - rect.left) * canvas.width) / rect.width,
      y: ((e.clientY - rect.top) * canvas.height) / rect.height,
    };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const pt = getCanvasPoint(e);
    if (!canvas || !ctx || !pt) return;

    canvas.setPointerCapture(e.pointerId);
    isDrawingRef.current = true;
    lastPointRef.current = pt;
    lastMidPointRef.current = pt;

    // Draw an initial rounded dot so quick taps also register
    ctx.beginPath();
    ctx.fillStyle = penColor;
    ctx.arc(pt.x, pt.y, STROKE_WIDTH / 2, 0, Math.PI * 2);
    ctx.fill();
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const pt = getCanvasPoint(e);
    const lastPt = lastPointRef.current;
    const lastMid = lastMidPointRef.current;
    if (!canvas || !ctx || !pt || !lastPt || !lastMid) return;

    const midPt: Point = {
      x: (lastPt.x + pt.x) / 2,
      y: (lastPt.y + pt.y) / 2,
    };

    ctx.beginPath();
    ctx.lineWidth = STROKE_WIDTH;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = penColor;
    ctx.moveTo(lastMid.x, lastMid.y);
    ctx.quadraticCurveTo(lastPt.x, lastPt.y, midPt.x, midPt.y);
    ctx.stroke();

    lastPointRef.current = pt;
    lastMidPointRef.current = midPt;
  };

  const finishStroke = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const lastPt = lastPointRef.current;
    const lastMid = lastMidPointRef.current;

    if (ctx && lastPt && lastMid) {
      ctx.beginPath();
      ctx.lineWidth = STROKE_WIDTH;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = penColor;
      ctx.moveTo(lastMid.x, lastMid.y);
      ctx.lineTo(lastPt.x, lastPt.y);
      ctx.stroke();
    }

    if (canvas && canvas.hasPointerCapture(e.pointerId)) {
      canvas.releasePointerCapture(e.pointerId);
    }
    isDrawingRef.current = false;
    lastPointRef.current = null;
    lastMidPointRef.current = null;
  };

  const openColorPicker = () => {
    colorInputRef.current?.click();
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    isDrawingRef.current = false;
    lastPointRef.current = null;
    lastMidPointRef.current = null;
    setGeneratedImage(null);
    if (canvas) {
      fillCanvasWhite(canvas);
    }
  };

  const captureCanvasPngBase64 = (): string => {
    const canvas = canvasRef.current;
    if (!canvas) {
      throw new Error('Canvas is not available.');
    }

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) {
      throw new Error('Could not initialize canvas export context.');
    }

    tempCtx.fillStyle = '#FFFFFF';
    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
    tempCtx.drawImage(canvas, 0, 0);

    const dataUrl = tempCanvas.toDataURL('image/png');
    return dataUrl.split(',')[1] || '';
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedPrompt = prompt.trim();
    if (!trimmedPrompt || isLoading) return;

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const apiKey = getApiKey();
      if (!apiKey) {
        throw new Error(
          'Missing Gemini API key. Please set process.env.API_KEY to generate images.',
        );
      }

      const drawingBase64 = captureCanvasPngBase64();
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
          responseModalities: [Modality.TEXT, Modality.IMAGE],
        },
      });

      let returnedImageDataUrl: string | null = null;
      const candidates = response.candidates || [];
      for (const candidate of candidates) {
        const parts = candidate.content?.parts || [];
        for (const part of parts) {
          if (part.inlineData?.data) {
            const mimeType = part.inlineData.mimeType || 'image/png';
            returnedImageDataUrl = `data:${mimeType};base64,${part.inlineData.data}`;
            break;
          }
        }
        if (returnedImageDataUrl) break;
      }

      if (!returnedImageDataUrl) {
        throw new Error(
          'No image was returned by Gemini. Please try rephrasing your prompt.',
        );
      }

      setGeneratedImage(returnedImageDataUrl);
    } catch (err) {
      setErrorMessage(parseErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-page">
      <main className="app-container">
        <header className="app-header">
          <div className="header-text">
            <h1 className="app-title">Gemini Co-Drawing</h1>
            <div className="app-subtitles">
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
          </div>

          <div className="toolbar-pill" role="toolbar" aria-label="Canvas tools">
            <div className="color-picker-wrapper">
              <input
                ref={colorInputRef}
                type="color"
                className="native-color-input"
                value={penColor}
                onChange={(e) => setPenColor(e.target.value)}
                tabIndex={-1}
                aria-hidden="true"
              />
              <button
                type="button"
                className="tool-btn color-swatch-btn"
                style={{ backgroundColor: penColor }}
                onClick={openColorPicker}
                aria-label="Change pen color"
                title="Change pen color"
              />
            </div>

            <button
              type="button"
              className="tool-btn clear-btn"
              onClick={handleClear}
              aria-label="Clear canvas"
              title="Clear canvas"
            >
              <Trash2 size={20} strokeWidth={2} aria-hidden="true" />
            </button>
          </div>
        </header>

        <div className="canvas-wrapper">
          <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            className="drawing-canvas"
            aria-label="Collaborative drawing canvas"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={finishStroke}
            onPointerCancel={finishStroke}
          />
        </div>

        <form className="prompt-form" onSubmit={handleSubmit}>
          <input
            type="text"
            className="prompt-input"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Add your change..."
            aria-label="Prompt to edit or build on your sketch"
            required
          />
          <button
            type="submit"
            className="submit-btn"
            disabled={isLoading}
            aria-label={isLoading ? 'Generating image' : 'Submit prompt'}
            title={isLoading ? 'Generating...' : 'Submit'}
          >
            {isLoading ? (
              <LoaderCircle
                size={24}
                strokeWidth={2}
                className="spin"
                aria-hidden="true"
              />
            ) : (
              <SendHorizontal size={24} strokeWidth={2} aria-hidden="true" />
            )}
          </button>
        </form>
      </main>

      {errorMessage && (
        <div
          className="modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="error-modal-title"
          onClick={() => setErrorMessage(null)}
        >
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 id="error-modal-title" className="modal-title">
                Failed to generate
              </h2>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setErrorMessage(null)}
                aria-label="Close error modal"
              >
                <X size={20} strokeWidth={2} aria-hidden="true" />
              </button>
            </div>
            <p className="modal-message">{errorMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
}

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}
