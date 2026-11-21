import React, { useEffect, useState } from 'react';
import { AppId, DESKTOP_APPS, WindowState } from '../types';
import { AppIcon, GeminiStartIcon } from './PixelIcons';

interface TaskbarProps {
  windows: WindowState[];
  activeWindowId: AppId | null;
  isStartOpen: boolean;
  onToggleStart: () => void;
  onLaunchApp: (appId: Exclude<AppId, 'image-viewer'>) => void;
  onTaskbarWindowClick: (appId: AppId) => void;
}

function formatClock(date: Date): string {
  return date.toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  });
}

export const Taskbar: React.FC<TaskbarProps> = ({
  windows,
  activeWindowId,
  isStartOpen,
  onToggleStart,
  onLaunchApp,
  onTaskbarWindowClick,
}) => {
  const [timeStr, setTimeStr] = useState<string>(() => formatClock(new Date()));

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTimeStr(formatClock(new Date()));
    }, 15000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <>
      {/* Start Menu Popup */}
      {isStartOpen && (
        <div
          className="win95-start-menu win95-window-border"
          onMouseDown={(e) => e.stopPropagation()}
          role="menu"
          aria-label="Gemini Start Menu"
        >
          <div className="win95-start-sidebar">
            <div className="win95-start-sidebar-text">
              Gemini<span>95</span>
            </div>
          </div>
          <div className="win95-start-items">
            {DESKTOP_APPS.map((app) => (
              <button
                key={app.id}
                type="button"
                className="win95-start-item"
                role="menuitem"
                onClick={() => onLaunchApp(app.id)}
              >
                <AppIcon appId={app.id} size={22} />
                <span>{app.title}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Taskbar */}
      <div
        className="win95-taskbar"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className={`win95-btn win95-start-btn ${isStartOpen ? 'open' : ''}`}
          onClick={onToggleStart}
          aria-expanded={isStartOpen}
        >
          <GeminiStartIcon size={18} />
          <span>Gemini</span>
        </button>

        <div className="win95-taskbar-divider" />

        <div className="win95-taskbar-apps">
          {windows.map((win) => {
            const isPressed = !win.isMinimized && activeWindowId === win.id;
            return (
              <button
                key={win.id}
                type="button"
                className={`win95-btn win95-taskbar-app-btn ${
                  isPressed ? 'win95-btn-active-checkered' : ''
                }`}
                onClick={() => onTaskbarWindowClick(win.id)}
                title={win.title}
              >
                <AppIcon appId={win.id} size={16} />
                <span className="win95-taskbar-app-btn-label">{win.title}</span>
              </button>
            );
          })}
        </div>

        <div className="win95-tray win95-sunken-thin" title="Gemini 95 System Tray">
          <svg width="14" height="14" viewBox="0 0 16 16" shapeRendering="crispEdges">
            <rect x="2" y="6" width="3" height="4" fill="#404040" />
            <rect x="5" y="4" width="2" height="8" fill="#404040" />
            <rect x="7" y="2" width="2" height="12" fill="#000" />
            <rect x="11" y="5" width="1" height="6" fill="#008080" />
            <rect x="13" y="3" width="1" height="10" fill="#008080" />
          </svg>
          <span>{timeStr}</span>
        </div>
      </div>
    </>
  );
};
