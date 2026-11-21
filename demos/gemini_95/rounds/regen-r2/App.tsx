import React, { useState, useCallback } from 'react';
import { AppDefinition, AppId, WindowState } from './types';
import { AppIcon } from './components/Icons';
import { Window } from './components/Window';
import { Taskbar } from './components/Taskbar';
import { MyGemtopApp } from './components/apps/MyGemtopApp';
import { ImageViewerApp } from './components/apps/ImageViewerApp';
import { ChromeApp } from './components/apps/ChromeApp';
import { GemNotesApp } from './components/apps/GemNotesApp';
import { GemPaintApp } from './components/apps/GemPaintApp';
import { DoomApp } from './components/apps/DoomApp';
import { GeminiChatApp } from './components/apps/GeminiChatApp';
import { GemSweeperApp } from './components/apps/GemSweeperApp';

const APP_DEFINITIONS: AppDefinition[] = [
  {
    id: 'my-gemtop',
    label: 'My Gemtop',
    title: 'My Gemtop',
    defaultWidth: 520,
    defaultHeight: 370,
    minWidth: 340,
    minHeight: 240,
    defaultX: 90,
    defaultY: 108,
    showOnDesktop: true,
  },
  {
    id: 'chrome',
    label: 'Chrome',
    title: 'Chrome - Retro Browser',
    defaultWidth: 740,
    defaultHeight: 520,
    minWidth: 460,
    minHeight: 340,
    defaultX: 135,
    defaultY: 64,
    showOnDesktop: true,
  },
  {
    id: 'gemnotes',
    label: 'GemNotes',
    title: 'GemNotes - Untitled',
    defaultWidth: 540,
    defaultHeight: 400,
    minWidth: 340,
    minHeight: 250,
    defaultX: 190,
    defaultY: 96,
    showOnDesktop: true,
  },
  {
    id: 'gempaint',
    label: 'GemPaint',
    title: 'GemPaint',
    defaultWidth: 720,
    defaultHeight: 520,
    minWidth: 460,
    minHeight: 360,
    defaultX: 160,
    defaultY: 72,
    showOnDesktop: true,
  },
  {
    id: 'doom',
    label: 'Doom II',
    title: 'Doom II',
    defaultWidth: 720,
    defaultHeight: 510,
    minWidth: 480,
    minHeight: 360,
    defaultX: 180,
    defaultY: 68,
    showOnDesktop: true,
  },
  {
    id: 'gemini-chat',
    label: 'Gemini Chat',
    title: 'Gemini Chat',
    defaultWidth: 480,
    defaultHeight: 430,
    minWidth: 340,
    minHeight: 280,
    defaultX: 250,
    defaultY: 92,
    showOnDesktop: true,
  },
  {
    id: 'gemsweeper',
    label: 'GemSweeper',
    title: 'GemSweeper',
    defaultWidth: 318,
    defaultHeight: 472,
    minWidth: 306,
    minHeight: 430,
    defaultX: 330,
    defaultY: 76,
    showOnDesktop: true,
  },
  {
    id: 'image-viewer',
    label: 'Image Viewer',
    title: 'dontshowthistoanyone.jpg - Image Viewer',
    defaultWidth: 510,
    defaultHeight: 465,
    minWidth: 380,
    minHeight: 340,
    defaultX: 220,
    defaultY: 82,
    showOnDesktop: false,
  },
];

function createInitialWindows(): Record<AppId, WindowState> {
  const map = {} as Record<AppId, WindowState>;
  APP_DEFINITIONS.forEach((def) => {
    map[def.id] = {
      id: def.id,
      title: def.title,
      isOpen: false,
      isMinimized: false,
      zIndex: 10,
      x: def.defaultX,
      y: def.defaultY,
      width: def.defaultWidth,
      height: def.defaultHeight,
      minWidth: def.minWidth,
      minHeight: def.minHeight,
    };
  });
  return map;
}

export const App: React.FC = () => {
  const [windows, setWindows] = useState<Record<AppId, WindowState>>(createInitialWindows);
  const [openOrder, setOpenOrder] = useState<AppId[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<AppId | null>(null);
  const [topZ, setTopZ] = useState<number>(20);
  const [startOpen, setStartOpen] = useState<boolean>(false);
  const [selectedIcon, setSelectedIcon] = useState<AppId | null>(null);

  const focusWindow = useCallback(
    (id: AppId) => {
      setTopZ((z) => {
        const nextZ = z + 1;
        setWindows((prev) => ({
          ...prev,
          [id]: { ...prev[id], zIndex: nextZ, isMinimized: false },
        }));
        return nextZ;
      });
      setActiveWindowId(id);
    },
    []
  );

  const launchApp = useCallback((id: AppId) => {
    setStartOpen(false);
    setSelectedIcon(id);

    setTopZ((z) => {
      const nextZ = z + 1;
      setWindows((prev) => {
        const cur = prev[id];
        const maxW = Math.max(320, window.innerWidth - 24);
        const maxH = Math.max(240, window.innerHeight - 60);
        const clampedW = Math.min(cur.width, maxW);
        const clampedH = Math.min(cur.height, maxH);
        const clampedX = Math.max(8, Math.min(cur.x, window.innerWidth - clampedW - 8));
        const clampedY = Math.max(8, Math.min(cur.y, window.innerHeight - 40 - clampedH - 8));

        return {
          ...prev,
          [id]: {
            ...cur,
            isOpen: true,
            isMinimized: false,
            zIndex: nextZ,
            x: cur.isOpen ? cur.x : clampedX,
            y: cur.isOpen ? cur.y : clampedY,
            width: cur.isOpen ? cur.width : clampedW,
            height: cur.isOpen ? cur.height : clampedH,
          },
        };
      });
      return nextZ;
    });

    setOpenOrder((prev) => (prev.includes(id) ? prev : [...prev, id]));
    setActiveWindowId(id);
  }, []);

  const closeWindow = useCallback((id: AppId) => {
    setWindows((prev) => ({
      ...prev,
      [id]: { ...prev[id], isOpen: false, isMinimized: false },
    }));
    setOpenOrder((prev) => prev.filter((item) => item !== id));
    setActiveWindowId((cur) => (cur === id ? null : cur));
  }, []);

  const minimizeWindow = useCallback((id: AppId) => {
    setWindows((prev) => ({
      ...prev,
      [id]: { ...prev[id], isMinimized: true },
    }));
    setActiveWindowId((cur) => (cur === id ? null : cur));
  }, []);

  const handleTaskbarWindowClick = useCallback(
    (id: AppId) => {
      setStartOpen(false);
      const win = windows[id];
      if (!win || !win.isOpen) return;
      if (win.isMinimized) {
        focusWindow(id);
      } else if (activeWindowId === id) {
        minimizeWindow(id);
      } else {
        focusWindow(id);
      }
    },
    [windows, activeWindowId, focusWindow, minimizeWindow]
  );

  const updateBounds = useCallback(
    (id: AppId) => (bounds: { x: number; y: number; width: number; height: number }) => {
      setWindows((prev) => ({
        ...prev,
        [id]: { ...prev[id], ...bounds },
      }));
    },
    []
  );

  const renderAppContent = (id: AppId) => {
    switch (id) {
      case 'my-gemtop':
        return <MyGemtopApp onOpenEasterEggImage={() => launchApp('image-viewer')} />;
      case 'image-viewer':
        return <ImageViewerApp />;
      case 'chrome':
        return <ChromeApp />;
      case 'gemnotes':
        return <GemNotesApp />;
      case 'gempaint':
        return <GemPaintApp />;
      case 'doom':
        return <DoomApp />;
      case 'gemini-chat':
        return <GeminiChatApp />;
      case 'gemsweeper':
        return <GemSweeperApp />;
    }
  };

  const desktopApps = APP_DEFINITIONS.filter((app) => app.showOnDesktop);
  const openWindowsList = openOrder
    .map((id) => windows[id])
    .filter((w) => w && w.isOpen);

  return (
    <main
      className="desktop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          setSelectedIcon(null);
          setActiveWindowId(null);
          setStartOpen(false);
        }
      }}
    >
      {/* Seven evenly spaced desktop icons in one horizontal row near top-left */}
      <nav className="desktop-icons-row" aria-label="Desktop Applications">
        {desktopApps.map((app) => (
          <button
            key={app.id}
            type="button"
            className={`desktop-icon-btn ${selectedIcon === app.id ? 'selected' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              launchApp(app.id);
            }}
          >
            <span className="desktop-icon-graphic">
              <AppIcon appId={app.id} size={48} />
            </span>
            <span className="desktop-icon-label">{app.label}</span>
          </button>
        ))}
      </nav>

      {/* Open Application Windows */}
      {APP_DEFINITIONS.map((app) => {
        const win = windows[app.id];
        if (!win.isOpen) return null;
        return (
          <Window
            key={app.id}
            win={win}
            isActive={activeWindowId === app.id}
            onFocus={() => focusWindow(app.id)}
            onClose={() => closeWindow(app.id)}
            onMinimize={() => minimizeWindow(app.id)}
            onUpdateBounds={updateBounds(app.id)}
          >
            {renderAppContent(app.id)}
          </Window>
        );
      })}

      {/* Bottom Taskbar & Start Menu */}
      <Taskbar
        apps={APP_DEFINITIONS}
        openWindows={openWindowsList}
        activeWindowId={activeWindowId}
        startOpen={startOpen}
        onToggleStart={() => setStartOpen((s) => !s)}
        onCloseStart={() => setStartOpen(false)}
        onLaunchApp={launchApp}
        onTaskbarWindowClick={handleTaskbarWindowClick}
      />
    </main>
  );
};

export default App;
