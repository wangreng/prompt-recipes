import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AppId, DESKTOP_APPS, WindowState } from './types';
import { AppIcon } from './components/PixelIcons';
import { Window } from './components/Window';
import { Taskbar } from './components/Taskbar';
import { ClippyCritic } from './components/ClippyCritic';
import { MyGemtop } from './apps/MyGemtop';
import { ImageViewer } from './apps/ImageViewer';
import { ChromeBrowser } from './apps/ChromeBrowser';
import { GemNotes } from './apps/GemNotes';
import { GemPaint } from './apps/GemPaint';
import { DoomApp } from './apps/DoomApp';
import { GeminiChat } from './apps/GeminiChat';
import { GemSweeper } from './apps/GemSweeper';
import { critiquePainting } from './services/geminiService';

const TASKBAR_HEIGHT = 38;

export const App: React.FC = () => {
  // Starts with NO open windows on the classic teal desktop
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<AppId | null>(null);
  const [selectedIconId, setSelectedIconId] = useState<AppId | null>(null);
  const [isStartOpen, setIsStartOpen] = useState<boolean>(false);

  const zCounterRef = useRef<number>(10);
  const cascadeIndexRef = useRef<number>(0);

  // GemPaint Clippy Critic state
  const paintCanvasGetterRef = useRef<
    (() => { dataUrl: string; strokeCount: number }) | null
  >(null);
  const hasNewPaintStrokeRef = useRef<boolean>(false);
  const [clippyMessage, setClippyMessage] = useState<string>(
    "It looks like you're trying to make 'art'! Draw something and I'll give you my totally unbiased critique."
  );
  const [clippyThinking, setClippyThinking] = useState<boolean>(false);

  const registerPaintGetter = useCallback(
    (getter: (() => { dataUrl: string; strokeCount: number }) | null) => {
      paintCanvasGetterRef.current = getter;
    },
    []
  );

  const triggerClippyCritique = useCallback(async () => {
    const getter = paintCanvasGetterRef.current;
    if (!getter || clippyThinking) return;
    const { dataUrl, strokeCount } = getter();
    if (!dataUrl) return;

    setClippyThinking(true);
    hasNewPaintStrokeRef.current = false;
    try {
      const roast = await critiquePainting(dataUrl, strokeCount);
      setClippyMessage(roast);
    } catch {
      setClippyMessage(
        "My art-critic circuits just overloaded! That's either a compliment or a warning."
      );
    } finally {
      setClippyThinking(false);
    }
  }, [clippyThinking]);

  const paintWindow = windows.find((w) => w.id === 'gempaint');
  const isPaintVisible = Boolean(paintWindow && !paintWindow.isMinimized);

  // Periodically critique GemPaint canvas when open and user has drawn new strokes
  useEffect(() => {
    if (!isPaintVisible) return;
    const interval = window.setInterval(() => {
      if (hasNewPaintStrokeRef.current) {
        triggerClippyCritique();
      }
    }, 12000);
    return () => window.clearInterval(interval);
  }, [isPaintVisible, triggerClippyCritique]);

  const computeSpawnPosition = (width: number, height: number) => {
    const step = cascadeIndexRef.current % 6;
    cascadeIndexRef.current += 1;
    const maxW = Math.max(320, window.innerWidth);
    const maxH = Math.max(300, window.innerHeight - TASKBAR_HEIGHT);
    const x = Math.min(Math.max(24, 90 + step * 34), Math.max(16, maxW - width - 16));
    const y = Math.min(Math.max(24, 118 + step * 26), Math.max(16, maxH - height - 16));
    return {
      x,
      y,
      width: Math.min(width, maxW - 24),
      height: Math.min(height, maxH - 24),
    };
  };

  const focusWindow = useCallback((id: AppId) => {
    const nextZ = ++zCounterRef.current;
    setWindows((prev) =>
      prev.map((w) =>
        w.id === id ? { ...w, isMinimized: false, zIndex: nextZ } : w
      )
    );
    setActiveWindowId(id);
    setIsStartOpen(false);
  }, []);

  const openApp = useCallback((appId: Exclude<AppId, 'image-viewer'>) => {
    setIsStartOpen(false);
    setSelectedIconId(appId);
    const nextZ = ++zCounterRef.current;

    setWindows((prev) => {
      const existing = prev.find((w) => w.id === appId);
      if (existing) {
        return prev.map((w) =>
          w.id === appId ? { ...w, isMinimized: false, zIndex: nextZ } : w
        );
      }

      const def = DESKTOP_APPS.find((a) => a.id === appId)!;
      const pos = computeSpawnPosition(def.defaultWidth, def.defaultHeight);
      const created: WindowState = {
        id: appId,
        title: def.windowTitle,
        x: pos.x,
        y: pos.y,
        width: pos.width,
        height: pos.height,
        minWidth: def.minWidth,
        minHeight: def.minHeight,
        isMinimized: false,
        zIndex: nextZ,
      };
      return [...prev, created];
    });

    setActiveWindowId(appId);
  }, []);

  const openSecretImageViewer = useCallback(() => {
    const nextZ = ++zCounterRef.current;
    setWindows((prev) => {
      const existing = prev.find((w) => w.id === 'image-viewer');
      if (existing) {
        return prev.map((w) =>
          w.id === 'image-viewer'
            ? { ...w, isMinimized: false, zIndex: nextZ }
            : w
        );
      }
      const pos = computeSpawnPosition(580, 460);
      const created: WindowState = {
        id: 'image-viewer',
        title: 'dontshowthistoanyone.jpg - Image Viewer',
        x: pos.x,
        y: pos.y,
        width: pos.width,
        height: pos.height,
        minWidth: 360,
        minHeight: 300,
        isMinimized: false,
        zIndex: nextZ,
        payload: { fileName: 'dontshowthistoanyone.jpg' },
      };
      return [...prev, created];
    });
    setActiveWindowId('image-viewer');
  }, []);

  const minimizeWindow = useCallback((id: AppId) => {
    setWindows((prev) => {
      const updated = prev.map((w) =>
        w.id === id ? { ...w, isMinimized: true } : w
      );
      const topVisible = updated
        .filter((w) => !w.isMinimized)
        .sort((a, b) => b.zIndex - a.zIndex)[0];
      setActiveWindowId(topVisible ? topVisible.id : null);
      return updated;
    });
  }, []);

  const closeWindow = useCallback((id: AppId) => {
    setWindows((prev) => {
      const remaining = prev.filter((w) => w.id !== id);
      const topVisible = remaining
        .filter((w) => !w.isMinimized)
        .sort((a, b) => b.zIndex - a.zIndex)[0];
      setActiveWindowId(topVisible ? topVisible.id : null);
      return remaining;
    });
  }, []);

  const handleTaskbarWindowClick = useCallback(
    (id: AppId) => {
      setIsStartOpen(false);
      const target = windows.find((w) => w.id === id);
      if (!target) return;
      if (!target.isMinimized && activeWindowId === id) {
        minimizeWindow(id);
      } else {
        focusWindow(id);
      }
    },
    [windows, activeWindowId, minimizeWindow, focusWindow]
  );

  const moveWindow = useCallback((id: AppId, x: number, y: number) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, x, y } : w))
    );
  }, []);

  const resizeWindow = useCallback(
    (id: AppId, x: number, y: number, width: number, height: number) => {
      setWindows((prev) =>
        prev.map((w) => (w.id === id ? { ...w, x, y, width, height } : w))
      );
    },
    []
  );

  const renderAppContent = (win: WindowState) => {
    switch (win.id) {
      case 'my-gemtop':
        return <MyGemtop onOpenSecretImage={openSecretImageViewer} />;
      case 'image-viewer':
        return <ImageViewer fileName={win.payload?.fileName} />;
      case 'chrome':
        return <ChromeBrowser />;
      case 'gemnotes':
        return <GemNotes />;
      case 'gempaint':
        return (
          <GemPaint
            registerCanvasGetter={registerPaintGetter}
            onStrokeComplete={() => {
              hasNewPaintStrokeRef.current = true;
            }}
          />
        );
      case 'doom-ii':
        return <DoomApp />;
      case 'gemini-chat':
        return <GeminiChat />;
      case 'gemsweeper':
        return <GemSweeper />;
    }
  };

  return (
    <div
      className="desktop-root"
      onMouseDown={() => {
        setSelectedIconId(null);
        setIsStartOpen(false);
      }}
    >
      {/* Top-Left Horizontal Row of 7 Retro Pixel-Art Icons */}
      <div className="desktop-icons-row" role="list" aria-label="Desktop Icons">
        {DESKTOP_APPS.map((app) => (
          <button
            key={app.id}
            type="button"
            role="listitem"
            className={`desktop-icon ${
              selectedIconId === app.id ? 'selected' : ''
            }`}
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              openApp(app.id);
            }}
          >
            <div className="desktop-icon-img">
              <AppIcon appId={app.id} size={48} />
            </div>
            <span className="desktop-icon-label">{app.title}</span>
          </button>
        ))}
      </div>

      {/* Open Windows */}
      {windows.map((win) => (
        <Window
          key={win.id}
          win={win}
          isActive={activeWindowId === win.id}
          onFocus={() => focusWindow(win.id)}
          onMinimize={() => minimizeWindow(win.id)}
          onClose={() => closeWindow(win.id)}
          onMove={(x, y) => moveWindow(win.id, x, y)}
          onResize={(x, y, w, h) => resizeWindow(win.id, x, y, w, h)}
        >
          {renderAppContent(win)}
        </Window>
      ))}

      {/* Clippy-Style Robot Art Critic (visible while GemPaint is open) */}
      {isPaintVisible && (
        <ClippyCritic
          message={clippyMessage}
          isThinking={clippyThinking}
          onRequestCritique={triggerClippyCritique}
        />
      )}

      {/* Classic Light-Gray Bottom Taskbar & Start Menu */}
      <Taskbar
        windows={windows}
        activeWindowId={activeWindowId}
        isStartOpen={isStartOpen}
        onToggleStart={() => setIsStartOpen((open) => !open)}
        onLaunchApp={openApp}
        onTaskbarWindowClick={handleTaskbarWindowClick}
      />
    </div>
  );
};

export default App;
