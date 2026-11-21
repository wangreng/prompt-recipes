export type AppId =
  | 'my-gemtop'
  | 'chrome'
  | 'gemnotes'
  | 'gempaint'
  | 'doom'
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
  defaultX: number;
  defaultY: number;
  showOnDesktop: boolean;
}

export interface WindowState {
  id: AppId;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  zIndex: number;
  x: number;
  y: number;
  width: number;
  height: number;
  minWidth: number;
  minHeight: number;
}
