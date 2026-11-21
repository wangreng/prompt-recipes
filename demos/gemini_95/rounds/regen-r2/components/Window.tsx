import React, { useState, useRef, useEffect } from 'react';
import { WindowState } from '../types';
import { AppIcon } from './Icons';

interface WindowProps {
  win: WindowState;
  isActive: boolean;
  onFocus: () => void;
  onClose: () => void;
  onMinimize: () => void;
  onUpdateBounds: (bounds: { x: number; y: number; width: number; height: number }) => void;
  children: React.ReactNode;
}

type ResizeDir = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw';

const TASKBAR_HEIGHT = 40;

export const Window: React.FC<WindowProps> = ({
  win,
  isActive,
  onFocus,
  onClose,
  onMinimize,
  onUpdateBounds,
  children,
}) => {
  const [interaction, setInteraction] = useState<'drag' | 'resize' | null>(null);
  const startRef = useRef<{
    mouseX: number;
    mouseY: number;
    x: number;
    y: number;
    width: number;
    height: number;
    dir?: ResizeDir;
  } | null>(null);

  useEffect(() => {
    if (!interaction) return;

    const handleMouseMove = (e: MouseEvent) => {
      const s = startRef.current;
      if (!s) return;

      const dx = e.clientX - s.mouseX;
      const dy = e.clientY - s.mouseY;
      const maxH = window.innerHeight - TASKBAR_HEIGHT;

      if (interaction === 'drag') {
        const nextX = Math.max(-s.width + 80, Math.min(window.innerWidth - 80, s.x + dx));
        const nextY = Math.max(0, Math.min(maxH - 30, s.y + dy));
        onUpdateBounds({ x: nextX, y: nextY, width: s.width, height: s.height });
      } else if (interaction === 'resize' && s.dir) {
        let nextX = s.x;
        let nextY = s.y;
        let nextW = s.width;
        let nextH = s.height;

        if (s.dir.includes('e')) {
          nextW = Math.max(win.minWidth, s.width + dx);
        }
        if (s.dir.includes('s')) {
          nextH = Math.max(win.minHeight, Math.min(maxH - s.y, s.height + dy));
        }
        if (s.dir.includes('w')) {
          const proposedW = s.width - dx;
          if (proposedW >= win.minWidth) {
            nextW = proposedW;
            nextX = s.x + dx;
          } else {
            nextW = win.minWidth;
            nextX = s.x + (s.width - win.minWidth);
          }
        }
        if (s.dir.includes('n')) {
          const proposedH = s.height - dy;
          const clampedY = Math.max(0, s.y + dy);
          const actualDy = clampedY - s.y;
          if (s.height - actualDy >= win.minHeight) {
            nextH = s.height - actualDy;
            nextY = clampedY;
          } else {
            nextH = win.minHeight;
            nextY = s.y + (s.height - win.minHeight);
          }
        }

        onUpdateBounds({ x: nextX, y: nextY, width: nextW, height: nextH });
      }
    };

    const handleMouseUp = () => {
      setInteraction(null);
      startRef.current = null;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [interaction, onUpdateBounds, win.minWidth, win.minHeight]);

  if (!win.isOpen || win.isMinimized) {
    return null;
  }

  const startDrag = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) return;
    e.preventDefault();
    onFocus();
    startRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      x: win.x,
      y: win.y,
      width: win.width,
      height: win.height,
    };
    setInteraction('drag');
  };

  const startResize = (dir: ResizeDir) => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onFocus();
    startRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      x: win.x,
      y: win.y,
      width: win.width,
      height: win.height,
      dir,
    };
    setInteraction('resize');
  };

  const dirs: ResizeDir[] = ['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw'];

  return (
    <>
      {interaction && <div className="drag-iframe-shield" />}
      <div
        className="win95-window"
        style={{
          left: win.x,
          top: win.y,
          width: win.width,
          height: win.height,
          zIndex: win.zIndex,
        }}
        onMouseDown={onFocus}
      >
        {dirs.map((dir) => (
          <div
            key={dir}
            className={`resize-handle resize-${dir}`}
            onMouseDown={startResize(dir)}
          />
        ))}

        {/* Navy-blue Title Bar */}
        <div
          className={`win95-titlebar ${isActive ? '' : 'inactive'}`}
          onMouseDown={startDrag}
        >
          <div className="win95-titlebar-left">
            <span className="win95-titlebar-icon">
              <AppIcon appId={win.id} size={16} />
            </span>
            <span className="win95-titlebar-text">{win.title}</span>
          </div>

          <div className="win95-titlebar-controls">
            <button
              type="button"
              className="win95-ctrl-btn"
              title="Minimize"
              aria-label="Minimize"
              onClick={(e) => {
                e.stopPropagation();
                onMinimize();
              }}
            >
              <svg width="10" height="10" viewBox="0 0 10 10">
                <rect x="1.5" y="7" width="7" height="1.8" fill="#000000" />
              </svg>
            </button>
            <button
              type="button"
              className="win95-ctrl-btn"
              title="Close"
              aria-label="Close"
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
            >
              <svg width="10" height="10" viewBox="0 0 10 10">
                <path
                  d="M2 2 L8 8 M8 2 L2 8"
                  stroke="#000000"
                  strokeWidth="1.8"
                  strokeLinecap="square"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Sunken Content Area */}
        <div className="win95-window-body win95-sunken">{children}</div>
      </div>
    </>
  );
};
