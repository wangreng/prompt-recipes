import React, { useEffect, useRef } from 'react';
import { AppDefinition, AppId, WindowState } from '../types';
import { AppIcon, GeminiStartLogo } from './Icons';

interface TaskbarProps {
  apps: AppDefinition[];
  openWindows: WindowState[];
  activeWindowId: AppId | null;
  startOpen: boolean;
  onToggleStart: () => void;
  onCloseStart: () => void;
  onLaunchApp: (id: AppId) => void;
  onTaskbarWindowClick: (id: AppId) => void;
}

export const Taskbar: React.FC<TaskbarProps> = ({
  apps,
  openWindows,
  activeWindowId,
  startOpen,
  onToggleStart,
  onCloseStart,
  onLaunchApp,
  onTaskbarWindowClick,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const startBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!startOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        menuRef.current &&
        !menuRef.current.contains(target) &&
        startBtnRef.current &&
        !startBtnRef.current.contains(target)
      ) {
        onCloseStart();
      }
    };
    window.addEventListener('mousedown', handleClickOutside);
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, [startOpen, onCloseStart]);

  const desktopApps = apps.filter((a) => a.showOnDesktop);

  return (
    <>
      {startOpen && (
        <div ref={menuRef} className="start-menu" role="menu">
          <div className="start-menu-sidebar">
            <div className="start-menu-sidebar-text">
              Gemini <span>95</span>
            </div>
          </div>
          <div className="start-menu-items">
            {desktopApps.map((app) => (
              <button
                key={app.id}
                type="button"
                className="start-menu-item"
                role="menuitem"
                onClick={() => {
                  onLaunchApp(app.id);
                  onCloseStart();
                }}
              >
                <span style={{ width: 22, height: 22, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <AppIcon appId={app.id} size={22} />
                </span>
                <span>{app.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Light-gray bottom taskbar with white top edge, completely bare right side */}
      <footer className="taskbar">
        <button
          ref={startBtnRef}
          type="button"
          className={`start-button ${startOpen ? 'open' : ''}`}
          onClick={onToggleStart}
          aria-expanded={startOpen}
          aria-label="Gemini Start Menu"
        >
          <GeminiStartLogo />
        </button>

        <div className="taskbar-windows">
          {openWindows.map((win) => {
            const isPressed = !win.isMinimized && activeWindowId === win.id;
            return (
              <button
                key={win.id}
                type="button"
                className={`taskbar-win-btn ${isPressed ? 'active' : ''}`}
                onClick={() => onTaskbarWindowClick(win.id)}
                title={win.title}
              >
                <span style={{ width: 16, height: 16, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <AppIcon appId={win.id} size={16} />
                </span>
                <span className="taskbar-win-label">{win.title}</span>
              </button>
            );
          })}
        </div>
      </footer>
    </>
  );
};
