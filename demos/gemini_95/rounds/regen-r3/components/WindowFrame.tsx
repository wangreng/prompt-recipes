import React, { useRef } from 'react';
import { AppId, WindowInstance } from '../types';
import { AppPixelIcon } from './PixelIcons';

interface WindowFrameProps {
  win: WindowInstance;
  isActive: boolean;
  onFocus: (id: AppId) => void;
  onClose: (id: AppId) => void;
  onMinimize: (id: AppId) => void;
  onUpdateRect: (
    id: AppId,
    rect: { x: number; y: number; width: number; height: number }
  ) => void;
  onDragStateChange: (dragging: boolean) => void;
  children: React.ReactNode;
}

type ResizeDir = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw';

const TASKBAR_HEIGHT = 36;

export const WindowFrame: React.FC<WindowFrameProps> = ({
  win,
  isActive,
  onFocus,
  onClose,
  onMinimize,
  onUpdateRect,
  onDragStateChange,
  children,
}) => {
  const dragRef = useRef<{
    mode: 'move' | ResizeDir;
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

  const startPointerInteraction = (
    e: React.MouseEvent,
    mode: 'move' | ResizeDir
  ) => {
    if (e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();
    onFocus(win.id);
    onDragStateChange(true);

    dragRef.current = {
      mode,
      startX: e.clientX,
      startY: e.clientY,
      origX: win.x,
      origY: win.y,
      origW: win.width,
      origH: win.height,
    };

    const handleMouseMove = (ev: MouseEvent) => {
      const state = dragRef.current;
      if (!state) return;
      const dx = ev.clientX - state.startX;
      const dy = ev.clientY - state.startY;
      const maxY = window.innerHeight - TASKBAR_HEIGHT - 30;
      const maxX = window.innerWidth - 60;

      if (state.mode === 'move') {
        const nextX = Math.max(-state.origW + 80, Math.min(maxX, state.origX + dx));
        const nextY = Math.max(0, Math.min(maxY, state.origY + dy));
        onUpdateRect(win.id, {
          x: nextX,
          y: nextY,
          width: state.origW,
          height: state.origH,
        });
        return;
      }

      let nextX = state.origX;
      let nextY = state.origY;
      let nextW = state.origW;
      let nextH = state.origH;

      if (state.mode.includes('e')) {
        nextW = Math.max(win.minWidth, state.origW + dx);
      }
      if (state.mode.includes('s')) {
        const maxH = window.innerHeight - TASKBAR_HEIGHT - state.origY;
        nextH = Math.max(win.minHeight, Math.min(maxH, state.origH + dy));
      }
      if (state.mode.includes('w')) {
        const proposedW = state.origW - dx;
        if (proposedW >= win.minWidth) {
          nextW = proposedW;
          nextX = state.origX + dx;
        } else {
          nextW = win.minWidth;
          nextX = state.origX + (state.origW - win.minWidth);
        }
      }
      if (state.mode.includes('n')) {
        const proposedH = state.origH - dy;
        const proposedY = state.origY + dy;
        if (proposedH >= win.minHeight && proposedY >= 0) {
          nextH = proposedH;
          nextY = proposedY;
        } else if (proposedY < 0) {
          nextY = 0;
          nextH = state.origH + state.origY;
        } else {
          nextH = win.minHeight;
          nextY = state.origY + (state.origH - win.minHeight);
        }
      }

      onUpdateRect(win.id, {
        x: nextX,
        y: nextY,
        width: nextW,
        height: nextH,
      });
    };

    const handleMouseUp = () => {
      dragRef.current = null;
      onDragStateChange(false);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div
      className="win-window"
      style={{
        left: `${win.x}px`,
        top: `${win.y}px`,
        width: `${win.width}px`,
        height: `${win.height}px`,
        zIndex: win.zIndex,
      }}
      onMouseDown={() => onFocus(win.id)}
      role="dialog"
      aria-label={win.title}
    >
      {/* Title Bar */}
      <div
        className={`win-titlebar ${isActive ? '' : 'inactive'}`}
        onMouseDown={(e) => startPointerInteraction(e, 'move')}
      >
        <div className="win-titlebar-left">
          <AppPixelIcon appId={win.id} size={16} />
          <span className="win-title-text">{win.title}</span>
        </div>

        <div
          className="win-titlebar-controls"
          onMouseDown={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            className="win-ctrl-btn"
            aria-label="Minimize"
            title="Minimize"
            onClick={(e) => {
              e.stopPropagation();
              onMinimize(win.id);
            }}
          >
            <svg width="10" height="10" viewBox="0 0 10 10" shapeRendering="crispEdges">
              <rect x="2" y="7" width="6" height="2" fill="#000000" />
            </svg>
          </button>
          <button
            type="button"
            className="win-ctrl-btn"
            aria-label="Close"
            title="Close"
            onClick={(e) => {
              e.stopPropagation();
              onClose(win.id);
            }}
          >
            <svg width="10" height="10" viewBox="0 0 10 10" shapeRendering="crispEdges">
              <path
                d="M2 1h1v1h1v1h2V2h1V1h1v1H7v1H6v1h1v1h1v1h1v1H8V7H7V6H6V5H4v1H3v1H2v1H1V7h1V6h1V5h1V4H3V3H2V2H1V1z"
                fill="#000000"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Window Content */}
      <div className="win-body">{children}</div>

      {/* 8-way Resize Handles */}
      <div className="resize-handle resize-n" onMouseDown={(e) => startPointerInteraction(e, 'n')} />
      <div className="resize-handle resize-s" onMouseDown={(e) => startPointerInteraction(e, 's')} />
      <div className="resize-handle resize-e" onMouseDown={(e) => startPointerInteraction(e, 'e')} />
      <div className="resize-handle resize-w" onMouseDown={(e) => startPointerInteraction(e, 'w')} />
      <div className="resize-handle resize-nw" onMouseDown={(e) => startPointerInteraction(e, 'nw')} />
      <div className="resize-handle resize-ne" onMouseDown={(e) => startPointerInteraction(e, 'ne')} />
      <div className="resize-handle resize-sw" onMouseDown={(e) => startPointerInteraction(e, 'sw')} />
      <div className="resize-handle resize-se" onMouseDown={(e) => startPointerInteraction(e, 'se')} />
    </div>
  );
};
