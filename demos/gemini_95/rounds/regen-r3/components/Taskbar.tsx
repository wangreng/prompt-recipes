import React from 'react';
import { APPS, AppId, WindowInstance } from '../types';
import { AppPixelIcon, GeminiWordmark, StartBlueStar } from './PixelIcons';

interface TaskbarProps {
  windows: WindowInstance[];
  activeWindowId: AppId | null;
  startMenuOpen: boolean;
  onToggleStartMenu: () => void;
  onLaunchApp: (appId: AppId) => void;
  onTaskbarWindowClick: (appId: AppId) => void;
}

const START_MENU_APPS = APPS.filter((a) => a.showInStartMenu);

export const Taskbar: React.FC<TaskbarProps> = ({
  windows,
  activeWindowId,
  startMenuOpen,
  onToggleStartMenu,
  onLaunchApp,
  onTaskbarWindowClick,
}) => {
  return (
    <>
      {startMenuOpen && (
        <div
          className="start-menu"
          role="menu"
          aria-label="Gemini 95 Start Menu"
          onMouseDown={(e) => e.stopPropagation()}
        >
          <div className="start-menu-sidebar">
            <span className="start-menu-sidebar-text">
              Gemini <span>95</span>
            </span>
          </div>
          <div className="start-menu-items">
            {START_MENU_APPS.map((app) => (
              <button
                key={app.id}
                type="button"
                role="menuitem"
                className="start-menu-item"
                onClick={() => onLaunchApp(app.id)}
              >
                <AppPixelIcon appId={app.id} size={20} />
                <span>{app.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div
        className="taskbar"
        role="toolbar"
        aria-label="Taskbar"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className={`start-btn ${startMenuOpen ? 'open' : ''}`}
          aria-label="Start"
          aria-expanded={startMenuOpen}
          onClick={onToggleStartMenu}
        >
          <span className="start-btn-star">
            <StartBlueStar />
          </span>
          <span className="start-btn-wordmark">
            <GeminiWordmark />
          </span>
        </button>

        <div className="taskbar-apps">
          {windows.map((win) => {
            const isActive = activeWindowId === win.id && !win.isMinimized;
            return (
              <button
                key={win.id}
                type="button"
                className={`taskbar-app-btn ${isActive ? 'active' : ''}`}
                onClick={() => onTaskbarWindowClick(win.id)}
                title={win.title}
              >
                <AppPixelIcon appId={win.id} size={16} />
                <span className="taskbar-app-title">{win.title}</span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};
