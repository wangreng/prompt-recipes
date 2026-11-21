import React, { useCallback, useRef, useState } from 'react';
import { APP_MAP, APPS, AppId, WindowInstance } from './types';
import { AppPixelIcon } from './components/PixelIcons';
import { Taskbar } from './components/Taskbar';
import { WindowFrame } from './components/WindowFrame';
import { MyGemtopApp } from './components/apps/MyGemtopApp';
import { ImageViewerApp } from './components/apps/ImageViewerApp';
import { ChromeApp } from './components/apps/ChromeApp';
import { GemNotesApp } from './components/apps/GemNotesApp';
import { GemPaintApp } from './components/apps/GemPaintApp';
import { DoomApp } from './components/apps/DoomApp';
import { GeminiChatApp } from './components/apps/GeminiChatApp';
import { GemSweeperApp } from './components/apps/GemSweeperApp';

const DESKTOP_APPS = APPS.filter((a) => a.showOnDesktop);
const TASKBAR_HEIGHT = 36;

export const App: React.FC = () => {
  const [windows, setWindows] = useState<WindowInstance[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<AppId | null>(null);
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState<AppId | null>(null);
  const [isDraggingAny, setIsDraggingAny] = useState(false);

  const zCounterRef = useRef(10);
  const cascadeIndexRef = useRef(0);

  const bringToFront = useCallback((id: AppId) => {
    zCounterRef.current += 1;
    const nextZ = zCounterRef.current;
    setWindows((prev) =>
      prev.map((w) =>
        w.id === id ? { ...w, isMinimized: false, zIndex: nextZ } : w
      )
    );
    setActiveWindowId(id);
    setStartMenuOpen(false);
  }, []);

  const openApp = useCallback(
    (appId: AppId) => {
      setStartMenuOpen(false);
      setSelectedIcon(appId);

      setWindows((prev) => {
        const existing = prev.find((w) => w.id === appId);
        zCounterRef.current += 1;
        const nextZ = zCounterRef.current;

        if (existing) {
          return prev.map((w) =>
            w.id === appId ? { ...w, isMinimized: false, zIndex: nextZ } : w
          );
        }

        const def = APP_MAP[appId];
        const vw = typeof window !== 'undefined' ? window.innerWidth : 1280;
        const vh = typeof window !== 'undefined' ? window.innerHeight : 800;

        const width = Math.min(def.defaultWidth, vw - 40);
        const height = Math.min(def.defaultHeight, vh - TASKBAR_HEIGHT - 50);

        const step = cascadeIndexRef.current % 6;
        cascadeIndexRef.current += 1;

        const baseX = Math.max(40, Math.round((vw - width) / 2) - 40 + step * 28);
        const baseY = Math.max(
          42,
          Math.round((vh - TASKBAR_HEIGHT - height) / 2) - 20 + step * 24
        );

        const x = Math.min(Math.max(16, baseX), Math.max(16, vw - width - 16));
        const y = Math.min(
          Math.max(16, baseY),
          Math.max(16, vh - TASKBAR_HEIGHT - height - 12)
        );

        const created: WindowInstance = {
          id: appId,
          title: def.title,
          x,
          y,
          width,
          height,
          minWidth: def.minWidth,
          minHeight: def.minHeight,
          zIndex: nextZ,
          isMinimized: false,
        };

        return [...prev, created];
      });

      setActiveWindowId(appId);
    },
    []
  );

  const closeWindow = useCallback((id: AppId) => {
    setWindows((prev) => {
      const remaining = prev.filter((w) => w.id !== id);
      const visible = remaining.filter((w) => !w.isMinimized);
      if (visible.length === 0) {
        setActiveWindowId(null);
      } else {
        const top = visible.reduce((a, b) => (a.zIndex > b.zIndex ? a : b));
        setActiveWindowId(top.id);
      }
      return remaining;
    });
  }, []);

  const minimizeWindow = useCallback((id: AppId) => {
    setWindows((prev) => {
      const next = prev.map((w) =>
        w.id === id ? { ...w, isMinimized: true } : w
      );
      const visible = next.filter((w) => !w.isMinimized);
      if (visible.length === 0) {
        setActiveWindowId(null);
      } else {
        const top = visible.reduce((a, b) => (a.zIndex > b.zIndex ? a : b));
        setActiveWindowId(top.id);
      }
      return next;
    });
  }, []);

  const handleTaskbarWindowClick = useCallback(
    (id: AppId) => {
      setStartMenuOpen(false);
      const target = windows.find((w) => w.id === id);
      if (!target) return;
      if (activeWindowId === id && !target.isMinimized) {
        minimizeWindow(id);
      } else {
        bringToFront(id);
      }
    },
    [windows, activeWindowId, minimizeWindow, bringToFront]
  );

  const updateWindowRect = useCallback(
    (
      id: AppId,
      rect: { x: number; y: number; width: number; height: number }
    ) => {
      setWindows((prev) =>
        prev.map((w) => (w.id === id ? { ...w, ...rect } : w))
      );
    },
    []
  );

  const renderAppContent = (id: AppId) => {
    switch (id) {
      case 'my-gemtop':
        return <MyGemtopApp onOpenImageViewer={() => openApp('image-viewer')} />;
      case 'image-viewer':
        return <ImageViewerApp />;
      case 'chrome':
        return <ChromeApp />;
      case 'gemnotes':
        return <GemNotesApp />;
      case 'gempaint':
        return <GemPaintApp />;
      case 'doom-ii':
        return <DoomApp />;
      case 'gemini-chat':
        return <GeminiChatApp />;
      case 'gemsweeper':
        return <GemSweeperApp />;
    }
  };

  return (
    <div
      className="desktop"
      onMouseDown={() => {
        setStartMenuOpen(false);
        setSelectedIcon(null);
      }}
    >
      {/* Top-Left Single Row of 7 Desktop Icons */}
      <div
        className="desktop-icons"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {DESKTOP_APPS.map((app) => (
          <button
            key={app.id}
            type="button"
            className={`desktop-icon-btn ${
              selectedIcon === app.id ? 'selected' : ''
            }`}
            onClick={() => openApp(app.id)}
          >
            <span className="desktop-icon-glyph">
              <AppPixelIcon appId={app.id} size={52} isDesktop />
            </span>
            <span className="desktop-icon-label">{app.label}</span>
          </button>
        ))}
      </div>

      {/* Open Draggable, Resizable Windows */}
      {windows.map((win) => (
        <WindowFrame
          key={win.id}
          win={win}
          isActive={activeWindowId === win.id}
          onFocus={bringToFront}
          onClose={closeWindow}
          onMinimize={minimizeWindow}
          onUpdateRect={updateWindowRect}
          onDragStateChange={setIsDraggingAny}
        >
          {renderAppContent(win.id)}
        </WindowFrame>
      ))}

      {/* Prevent iframes from swallowing pointer events during drag/resize */}
      {isDraggingAny && <div className="iframe-drag-shield" />}

      {/* Fixed Bottom Win95 Taskbar */}
      <Taskbar
        windows={windows}
        activeWindowId={activeWindowId}
        startMenuOpen={startMenuOpen}
        onToggleStartMenu={() => setStartMenuOpen((o) => !o)}
        onLaunchApp={openApp}
        onTaskbarWindowClick={handleTaskbarWindowClick}
      />
    </div>
  );
};

export default App;
