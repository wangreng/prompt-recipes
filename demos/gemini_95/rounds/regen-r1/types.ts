export type AppId =
  | 'my-gemtop'
  | 'chrome'
  | 'gemnotes'
  | 'gempaint'
  | 'doom-ii'
  | 'gemini-chat'
  | 'gemsweeper'
  | 'image-viewer';

export interface AppDefinition {
  id: Exclude<AppId, 'image-viewer'>;
  title: string;
  windowTitle: string;
  defaultWidth: number;
  defaultHeight: number;
  minWidth: number;
  minHeight: number;
}

export interface WindowState {
  id: AppId;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  minWidth: number;
  minHeight: number;
  isMinimized: boolean;
  zIndex: number;
  payload?: {
    fileName?: string;
  };
}

export const DESKTOP_APPS: AppDefinition[] = [
  {
    id: 'my-gemtop',
    title: 'My Gemtop',
    windowTitle: 'My Gemtop',
    defaultWidth: 520,
    defaultHeight: 370,
    minWidth: 340,
    minHeight: 240,
  },
  {
    id: 'chrome',
    title: 'Chrome',
    windowTitle: 'Chrome - World Wide Web',
    defaultWidth: 740,
    defaultHeight: 530,
    minWidth: 440,
    minHeight: 340,
  },
  {
    id: 'gemnotes',
    title: 'GemNotes',
    windowTitle: 'Untitled - GemNotes',
    defaultWidth: 560,
    defaultHeight: 420,
    minWidth: 360,
    minHeight: 260,
  },
  {
    id: 'gempaint',
    title: 'GemPaint',
    windowTitle: 'untitled - GemPaint',
    defaultWidth: 680,
    defaultHeight: 490,
    minWidth: 500,
    minHeight: 380,
  },
  {
    id: 'doom-ii',
    title: 'Doom II',
    windowTitle: 'DOOM II: Hell on Earth',
    defaultWidth: 660,
    defaultHeight: 470,
    minWidth: 440,
    minHeight: 340,
  },
  {
    id: 'gemini-chat',
    title: 'Gemini Chat',
    windowTitle: 'Gemini Chat 95',
    defaultWidth: 480,
    defaultHeight: 430,
    minWidth: 340,
    minHeight: 300,
  },
  {
    id: 'gemsweeper',
    title: 'GemSweeper',
    windowTitle: 'GemSweeper',
    defaultWidth: 356,
    defaultHeight: 515,
    minWidth: 336,
    minHeight: 460,
  },
];
