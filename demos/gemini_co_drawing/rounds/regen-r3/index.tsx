import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleGenAI, Modality } from '@google/genai';

declare const process: { env: { API_KEY?: string } };

const CANVAS_WIDTH = 960;
const CANVAS_HEIGHT = 540;
const STROKE_WIDTH = 5;
const IMAGE_MODEL = 'gemini-2.0-flash-preview-image-generation';

interface Point {
  x: number;
  y: number;
}

function getApiKey(): string {
  try {
    return process.env.API_KEY || '';
  } catch {
    return '';
  }
}

function parseErrorMessage(error: unknown): string {
  const raw =
    error instanceof Error
      ? error.message
      : typeof error === 'string'
        ? error
        : 'An unexpected error occurred while generating the image.';

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
      // Fall through to raw message
    }
  }
  return raw;
}

function TrashIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
      <line x1="10" x2="10" y1="11" y2="17" />
      <line x1="14" x2="14" y1="11" y2="17" />
    </svg>
  );
}

function SendHorizontalIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3.714 3.048a.498.498 0 0 0-.683.627l2.843 7.627a2 2 0 0 1 0 1.396l-2.842 7.627a.498.498 0 0 0 .682.627l18-8.5a.5.5 0 0 0 0-.904z" />
      <path d="M6 12h16" />
    </svg>
  );
}

function LoaderIcon() {
  return (
    <svg
      className="spin"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const colorInputRef = useRef<HTMLInputElement | null>(null);

  const isDrawingRef = useRef(false);
  const lastPointRef = useRef<Point | null>(null);
  const lastMidPointRef = useRef<Point | null>(null);

  const [penColor, setPenColor] = useState('#000000');
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fillCanvasWhite = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  useEffect(() => {
    fillCanvasWhite();
  }, [fillCanvasWhite]);

  // Block touch scrolling while drawing on the canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const preventTouchScroll = (event: TouchEvent) => {
      if (event.cancelable) {
        event.preventDefault();
      }
    };

    canvas.addEventListener('touchstart', preventTouchScroll, { passive: false });
    canvas.addEventListener('touchmove', preventTouchScroll, { passive: false });

    return () => {
      canvas.removeEventListener('touchstart', preventTouchScroll);
      canvas.removeEventListener('touchmove', preventTouchScroll);
    };
  }, []);

  // Close error modal on Escape
  useEffect(() => {
    if (!errorMessage) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setErrorMessage(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [errorMessage]);

  const getCanvasPoint = useCallback(
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
    [],
  );

  const startStroke = useCallback(
    (point: Point) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      isDrawingRef.current = true;
      lastPointRef.current = point;
      lastMidPointRef.current = point;

      ctx.strokeStyle = penColor;
      ctx.lineWidth = STROKE_WIDTH;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.beginPath();
      ctx.moveTo(point.x, point.y);
      ctx.lineTo(point.x + 0.01, point.y + 0.01);
      ctx.stroke();
    },
    [penColor],
  );

  const continueStroke = useCallback(
    (point: Point) => {
      if (!isDrawingRef.current) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const lastPoint = lastPointRef.current;
      const lastMidPoint = lastMidPointRef.current;
      if (!lastPoint || !lastMidPoint) return;

      const midPoint: Point = {
        x: (lastPoint.x + point.x) / 2,
        y: (lastPoint.y + point.y) / 2,
      };

      ctx.strokeStyle = penColor;
      ctx.lineWidth = STROKE_WIDTH;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.beginPath();
      ctx.moveTo(lastMidPoint.x, lastMidPoint.y);
      ctx.quadraticCurveTo(lastPoint.x, lastPoint.y, midPoint.x, midPoint.y);
      ctx.stroke();

      lastPointRef.current = point;
      lastMidPointRef.current = midPoint;
    },
    [penColor],
  );

  const endStroke = useCallback(() => {
    if (!isDrawingRef.current) return;
    const canvas = canvasRef.current;
    const lastPoint = lastPointRef.current;
    const lastMidPoint = lastMidPointRef.current;

    if (canvas && lastPoint && lastMidPoint) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = penColor;
        ctx.lineWidth = STROKE_WIDTH;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(lastMidPoint.x, lastMidPoint.y);
        ctx.lineTo(lastPoint.x, lastPoint.y);
        ctx.stroke();
      }
    }

    isDrawingRef.current = false;
    lastPointRef.current = null;
    lastMidPointRef.current = null;
  }, [penColor]);

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (event.button !== 0) return;
    const point = getCanvasPoint(event.clientX, event.clientY);
    if (point) startStroke(point);
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    const point = getCanvasPoint(event.clientX, event.clientY);
    if (point) continueStroke(point);
  };

  const handleTouchStart = (event: React.TouchEvent<HTMLCanvasElement>) => {
    const touch = event.touches[0];
    if (!touch) return;
    const point = getCanvasPoint(touch.clientX, touch.clientY);
    if (point) startStroke(point);
  };

  const handleTouchMove = (event: React.TouchEvent<HTMLCanvasElement>) => {
    const touch = event.touches[0];
    if (!touch) return;
    const point = getCanvasPoint(touch.clientX, touch.clientY);
    if (point) continueStroke(point);
  };

  const handleOpenColorPicker = () => {
    colorInputRef.current?.click();
  };

  const handleClear = () => {
    fillCanvasWhite();
  };

  const exportCanvasPngBase64 = (): string => {
    const canvas = canvasRef.current;
    if (!canvas) {
      throw new Error('Canvas is not available.');
    }
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) {
      throw new Error('Unable to export canvas image.');
    }
    tempCtx.fillStyle = '#FFFFFF';
    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
    tempCtx.drawImage(canvas, 0, 0);
    const dataUrl = tempCanvas.toDataURL('image/png');
    return dataUrl.split(',')[1];
  };

  const drawImageOnCanvas = (dataUrl: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) {
          reject(new Error('Canvas is not available.'));
          return;
        }
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Unable to render returned image.'));
          return;
        }
        const scale = Math.min(
          canvas.width / img.width,
          canvas.height / img.height,
        );
        const drawWidth = img.width * scale;
        const drawHeight = img.height * scale;
        const offsetX = (canvas.width - drawWidth) / 2;
        const offsetY = (canvas.height - drawHeight) / 2;

        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
        resolve();
      };
      img.onerror = () => {
        reject(new Error('Failed to load the generated image.'));
      };
      img.src = dataUrl;
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedPrompt = prompt.trim();
    if (!trimmedPrompt || isLoading) return;

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const apiKey = getApiKey();
      if (!apiKey) {
        throw new Error(
          'Missing Gemini API key. Configure process.env.API_KEY to generate images.',
        );
      }

      const drawingBase64 = exportCanvasPngBase64();
      const ai = new GoogleGenAI({ apiKey });

      const response = await ai.models.generateContent({
        model: IMAGE_MODEL,
        contents: [
          {
            role: 'user',
            parts: [
              {
                inlineData: {
                  mimeType: 'image/png',
                  data: drawingBase64,
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

      const parts = response.candidates?.[0]?.content?.parts ?? [];
      let generatedImageUrl: string | null = null;
      let textResponse = '';

      for (const part of parts) {
        if (part.inlineData?.data) {
          const mimeType = part.inlineData.mimeType || 'image/png';
          generatedImageUrl = `data:${mimeType};base64,${part.inlineData.data}`;
          break;
        }
        if (part.text) {
          textResponse += part.text;
        }
      }

      if (!generatedImageUrl) {
        throw new Error(
          textResponse.trim() ||
            'Gemini did not return an image. Please try a different prompt.',
        );
      }

      await drawImageOnCanvas(generatedImageUrl);
      setPrompt('');
    } catch (error) {
      setErrorMessage(parseErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page">
      <main className="container">
        <header className="header">
          <div className="header-text">
            <h1 className="title">Gemini Co-Drawing</h1>
            <p className="subtitle">
              Built with{' '}
              <a
                href="https://ai.google.dev/gemini-api/docs/image-generation"
                target="_blank"
                rel="noopener noreferrer"
              >
                Gemini 2.0 native image generation
              </a>
            </p>
            <p className="subtitle">
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

          <div className="toolbar" role="toolbar" aria-label="Drawing tools">
            <div className="color-picker-wrap">
              <button
                type="button"
                className="toolbar-btn color-swatch-btn"
                style={{ backgroundColor: penColor }}
                onClick={handleOpenColorPicker}
                aria-label="Open color picker"
                title="Change pen color"
              />
              <input
                ref={colorInputRef}
                type="color"
                value={penColor}
                onChange={(e) => setPenColor(e.target.value)}
                className="sr-only-input"
                tabIndex={-1}
                aria-hidden="true"
              />
            </div>

            <button
              type="button"
              className="toolbar-btn clear-btn"
              onClick={handleClear}
              aria-label="Clear canvas"
              title="Clear canvas"
            >
              <TrashIcon />
            </button>
          </div>
        </header>

        <div className="canvas-wrapper">
          <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            className="drawing-canvas"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={endStroke}
            onMouseLeave={endStroke}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={endStroke}
            onTouchCancel={endStroke}
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
            aria-label={isLoading ? 'Generating' : 'Submit prompt'}
          >
            {isLoading ? <LoaderIcon /> : <SendHorizontalIcon />}
          </button>
        </form>
      </main>

      {errorMessage && (
        <div
          className="modal-backdrop"
          role="presentation"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setErrorMessage(null);
            }
          }}
        >
          <div
            className="modal-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="error-modal-title"
          >
            <div className="modal-header">
              <h2 id="error-modal-title" className="modal-title">
                Failed to generate
              </h2>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setErrorMessage(null)}
                aria-label="Close error dialog"
              >
                <CloseIcon />
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
  createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}
