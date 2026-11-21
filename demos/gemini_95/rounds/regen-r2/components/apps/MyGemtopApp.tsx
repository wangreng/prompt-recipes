import React, { useState } from 'react';
import { HardDriveIcon, JpgFileIcon } from '../Icons';

interface MyGemtopAppProps {
  onOpenEasterEggImage: () => void;
}

export const MyGemtopApp: React.FC<MyGemtopAppProps> = ({ onOpenEasterEggImage }) => {
  const [currentPath, setCurrentPath] = useState<'root' | 'C:'>('root');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#c0c0c0' }}>
      {/* Classic Win95 Menu Bar */}
      <div className="win95-menubar">
        <button type="button" className="win95-menubar-item">File</button>
        <button type="button" className="win95-menubar-item">Edit</button>
        <button type="button" className="win95-menubar-item">View</button>
        <button type="button" className="win95-menubar-item">Help</button>
      </div>

      {/* Navigation Toolbar */}
      <div className="win95-toolbar">
        <button
          type="button"
          className="win95-btn"
          disabled={currentPath === 'root'}
          onClick={() => setCurrentPath('root')}
        >
          ⬆ Up
        </button>
        <div
          className="win95-input font-inter"
          style={{ flex: 1, fontSize: 12, padding: '2px 8px', height: 24, display: 'flex', alignItems: 'center' }}
        >
          {currentPath === 'root' ? 'My Gemtop' : 'C:\\'}
        </div>
      </div>

      {/* White File Explorer Canvas */}
      <div className="explorer-canvas win95-sunken" style={{ margin: '4px' }}>
        {currentPath === 'root' ? (
          <button
            type="button"
            className="explorer-item"
            onClick={() => setCurrentPath('C:')}
            onDoubleClick={() => setCurrentPath('C:')}
          >
            <HardDriveIcon size={46} />
            <span>Local Disk (C:)</span>
          </button>
        ) : (
          <button
            type="button"
            className="explorer-item"
            onClick={onOpenEasterEggImage}
            onDoubleClick={onOpenEasterEggImage}
          >
            <JpgFileIcon size={46} />
            <span>dontshowthistoanyone.jpg</span>
          </button>
        )}
      </div>

      {/* Status Bar */}
      <div className="win95-statusbar">
        <div className="win95-statusbar-cell">1 object(s)</div>
        <div className="win95-statusbar-cell" style={{ flex: 0.7 }}>
          {currentPath === 'root' ? 'My Gemtop' : '42.0 KB (Classified)'}
        </div>
      </div>
    </div>
  );
};
