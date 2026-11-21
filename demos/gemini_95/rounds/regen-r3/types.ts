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
  id: AppId;
  title: string;
  label: string;
  defaultWidth: number;
  defaultHeight: number;
  minWidth: number;
  minHeight: number;
  showOnDesktop: boolean;
  showInStartMenu: boolean;
}

export interface WindowInstance {
  id: AppId;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  minWidth: number;
  minHeight: number;
  zIndex: number;
  isMinimized: boolean;
}

export const APPS: AppDefinition[] = [
  {
    id: 'my-gemtop',
    title: 'My Gemtop',
    label: 'My Gemtop',
    defaultWidth: 500,
    defaultHeight: 360,
    minWidth: 340,
    minHeight: 250,
    showOnDesktop: true,
    showInStartMenu: true,
  },
  {
    id: 'chrome',
    title: 'Chrome - 1999',
    label: 'Chrome',
    defaultWidth: 740,
    defaultHeight: 520,
    minWidth: 460,
    minHeight: 340,
    showOnDesktop: true,
    showInStartMenu: true,
  },
  {
    id: 'gemnotes',
    title: 'GemNotes',
    label: 'GemNotes',
    defaultWidth: 540,
    defaultHeight: 400,
    minWidth: 340,
    minHeight: 260,
    showOnDesktop: true,
    showInStartMenu: true,
  },
  {
    id: 'gempaint',
    title: 'GemPaint',
    label: 'GemPaint',
    defaultWidth: 680,
    defaultHeight: 490,
    minWidth: 480,
    minHeight: 380,
    showOnDesktop: true,
    showInStartMenu: true,
  },
  {
    id: 'doom-ii',
    title: 'Doom II',
    label: 'Doom II',
    defaultWidth: 680,
    defaultHeight: 490,
    minWidth: 440,
    minHeight: 340,
    showOnDesktop: true,
    showInStartMenu: true,
  },
  {
    id: 'gemini-chat',
    title: 'Gemini Chat',
    label: 'Gemini Chat',
    defaultWidth: 480,
    defaultHeight: 420,
    minWidth: 340,
    minHeight: 280,
    showOnDesktop: true,
    showInStartMenu: true,
  },
  {
    id: 'gemsweeper',
    title: 'GemSweeper',
    label: 'GemSweeper',
    defaultWidth: 332,
    defaultHeight: 472,
    minWidth: 312,
    minHeight: 420,
    showOnDesktop: true,
    showInStartMenu: true,
  },
  {
    id: 'image-viewer',
    title: 'Image Viewer - dontshowthistoanyone.jpg',
    label: 'Image Viewer',
    defaultWidth: 500,
    defaultHeight: 440,
    minWidth: 340,
    minHeight: 320,
    showOnDesktop: false,
    showInStartMenu: false,
  },
];

export const APP_MAP: Record<AppId, AppDefinition> = APPS.reduce(
  (acc, app) => {
    acc[app.id] = app;
    return acc;
  },
  {} as Record<AppId, AppDefinition>
);
