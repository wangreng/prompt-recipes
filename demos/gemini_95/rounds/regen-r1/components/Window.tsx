import React, { useRef, useState } from 'react';
import { WindowState } from '../types';
import { AppIcon } from './PixelIcons';

interface WindowProps {
  win: WindowState;
  isActive: boolean;
  onFocus: () => void;
  onMinimize: () => void;
  onClose: () => void;
  onMove: (x: number, y: number) => void;
  onResize: (x: number, y: number, width: number, height: number) => void;
  children: React.ReactNode;
}

type ResizeDir = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw';

const TASKBAR_HEIGHT = 38;

export const Window: React.FC<WindowProps> = ({
  win,
  isActive,
  onFocus,
  onMinimize,
  onClose,
  onMove,
  onResize,
  children,
}) => {
  const [isInteracting, setIsInteracting] = useState(false);
  const dragRef = useRef<{
    startX: number;
    startY: number;
    origX: number;
    origY: number;
  } | null>(null);

  const resizeRef = useRef<{
    dir: ResizeDir;
    startX: number;
    startY: number;
    origX: number;
    origY: number;
    origW: number;
    origH: number;
  } | null>(null);

  if (win.isMinimized) {
    return null;
  }

  const handleTitleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) return;
    e.preventDefault();
    onFocus();
    setIsInteracting(true);

    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      origX: win.x,
      origY: win.y,
    };

    const handleMouseMove = (ev: MouseEvent) => {
      if (!dragRef.current) return;
      const dx = ev.clientX - dragRef.current.startX;
      const dy = ev.clientY - dragRef.current.startY;
      const maxX = Math.max(0, window.innerWidth - 100);
      const maxY = Math.max(0, window.innerHeight - TASKBAR_HEIGHT - 32);
      const nextX = Math.min(maxX, Math.max(-win.width + 100, dragRef.current.origX + dx));
      const nextY = Math.min(maxY, Math.max(0, dragRef.current.origY + dy));
      onMove(nextX, nextY);
    };

    const handleMouseUp = () => {
      dragRef.current = null;
      setIsInteracting(false);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleResizeMouseDown = (dir: ResizeDir) => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onFocus();
    setIsInteracting(true);

    resizeRef.current = {
      dir,
      startX: e.clientX,
      startY: e.clientY,
      origX: win.x,
      origY: win.y,
      origW: win.width,
      origH: win.height,
    };

    const handleMouseMove = (ev: MouseEvent) => {
      const r = resizeRef.current;
      if (!r) return;
      const dx = ev.clientX - r.startX;
      const dy = ev.clientY - r.startY;

      let nextX = r.origX;
      let nextY = r.origY;
      let nextW = r.origW;
      let nextH = r.origH;

      if (r.dir.includes('e')) {
        nextW = Math.max(win.minWidth, Math.min(window.innerWidth - r.origX, r.origW + dx));
      }
      if (r.dir.includes('s')) {
        const maxH = window.innerHeight - TASKBAR_HEIGHT - r.origY;
        nextH = Math.max(win.minHeight, Math.min(maxH, r.origH + dy));
      }
      if (r.dir.includes('w')) {
        const proposedW = r.origW - dx;
        if (proposedW >= win.minWidth) {
          nextW = proposedW;
          nextX = r.origX + dx;
        }
      }
      if (r.dir.includes('n')) {
        const proposedH = r.origH - dy;
        const proposedY = r.origY + dy;
        if (proposedH >= win.minHeight && proposedY >= 0) {
          nextH = proposedH;
          nextY = proposedY;
        }
      }

      onResize(nextX, nextY, nextW, nextH);
    };

    const handleMouseUp = () => {
      resizeRef.current = null;
      setIsInteracting(false);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div
      className="win95-window win95-window-border"
      style={{
        left: win.x,
        top: win.y,
        width: win.width,
        height: win.height,
        zIndex: win.zIndex,
      }}
      onMouseDown={onFocus}
      data-window-id={win.id}
    >
      {/* Title Bar */}
      <div
        className={`win95-titlebar ${isActive ? 'active' : 'inactive'}`}
        onMouseDown={handleTitleMouseDown}
      >
        <div className="win95-titlebar-left">
          <AppIcon appId={win.id} size={16} />
          <span className="win95-titlebar-title">{win.title}</span>
        </div>
        <div className="win95-titlebar-controls">
          <button
            type="button"
            className="win95-titlebar-btn"
            aria-label={`Minimize ${win.title}`}
            title="Minimize"
            onClick={(e) => {
              e.stopPropagation();
              onMinimize();
            }}
          >
            <svg width="10" height="10" viewBox="0 0 10 10" shapeRendering="crispEdges">
              <rect x="1" y="7" width="7" height="2" fill="#000" />
            </svg>
          </button>
          <button
            type="button"
            className="win95-titlebar-btn"
            aria-label={`Close ${win.title}`}
            title="Close"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
          >
            <svg width="10" height="10" viewBox="0 0 10 10" shapeRendering="crispEdges">
              <path
                d="M1 1h2v1h1v1h2V2h1V1h2v2H8v1H7v2h1v1h1v2H7V8H6V7H4v1H3v1H1V7h1V6h1V4H2V3H1V1z"
                fill="#000"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Window Content */}
      <div className="win95-window-body">
        {children}
        {/* Prevents embedded iframes from stealing pointer events while dragging/resizing */}
        {isInteracting && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 50,
              background: 'transparent',
            }}
          />
        )}
      </div>

      {/* Edge & Corner Resize Handles */}
      <div
        className="win95-resize-handle"
        style={{ top: 0, left: 6, right: 6, height: 4, cursor: 'ns-resize' }}
        onMouseDown={handleResizeMouseDown('n')}
      />
      <div
        className="win95-resize-handle"
        style={{ bottom: 0, left: 6, right: 14, height: 5, cursor: 'ns-resize' }}
        onMouseDown={handleResizeMouseDown('s')}
      />
      <div
        className="win95-resize-handle"
        style={{ left: 0, top: 6, bottom: 6, width: 4, cursor: 'ew-resize' }}
        onMouseDown={handleResizeMouseDown('w')}
      />
      <div
        className="win95-resize-handle"
        style={{ right: 0, top: 6, bottom: 14, width: 5, cursor: 'ew-resize' }}
        onMouseDown={handleResizeMouseDown('e')}
      />
      <div
        className="win95-resize-handle"
        style={{ top: 0, left: 0, width: 8, height: 8, cursor: 'nwse-resize' }}
        onMouseDown={handleResizeMouseDown('nw')}
      />
      <div
        className="win95-resize-handle"
        style={{ top: 0, right: 0, width: 8, height: 8, cursor: 'nesw-resize' }}
        onMouseDown={handleResizeMouseDown('ne')}
      />
      <div
        className="win95-resize-handle"
        style={{ bottom: 0, left: 0, width: 8, height: 8, cursor: 'nesw-resize' }}
        onMouseDown={handleResizeMouseDown('sw')}
      />
      <div
        className="win95-resize-handle win95-resize-se"
        onMouseDown={handleResizeMouseDown('se')}
        title="Resize"
      />
    </div>
  );
};
