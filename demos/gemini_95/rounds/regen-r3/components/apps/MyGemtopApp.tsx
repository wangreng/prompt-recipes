import React, { useState } from 'react';
import { DriveCIcon, JpgFileIcon } from '../PixelIcons';

interface MyGemtopAppProps {
  onOpenImageViewer: () => void;
}

export const MyGemtopApp: React.FC<MyGemtopAppProps> = ({ onOpenImageViewer }) => {
  const [path, setPath] = useState<'root' | 'C:'>('root');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
      <div className="app-menubar">
        <span className="app-menubar-item">File</span>
        <span className="app-menubar-item">Edit</span>
        <span className="app-menubar-item">View</span>
        <span className="app-menubar-item">Help</span>
      </div>

      <div className="explorer-toolbar">
        <button
          type="button"
          className="win95-btn"
          disabled={path === 'root'}
          onClick={() => setPath('root')}
          title="Up One Level"
        >
          &#8593; Up
        </button>
        <div className="explorer-address win95-sunken">
          {path === 'root' ? 'My Gemtop' : 'C:\\'}
        </div>
      </div>

      <div className="explorer-pane win95-sunken">
        {path === 'root' ? (
          <button
            type="button"
            className="explorer-item"
            onClick={() => setPath('C:')}
            onDoubleClick={() => setPath('C:')}
          >
            <DriveCIcon size={46} />
            <span className="explorer-item-name">Local Disk (C:)</span>
          </button>
        ) : (
          <button
            type="button"
            className="explorer-item"
            onClick={onOpenImageViewer}
            onDoubleClick={onOpenImageViewer}
          >
            <JpgFileIcon size={44} />
            <span className="explorer-item-name">dontshowthistoanyone.jpg</span>
          </button>
        )}
      </div>

      <div className="app-statusbar">
        <span>{path === 'root' ? '1 object(s)' : '1 object(s) (42.8 KB)'}</span>
        <span>{path === 'root' ? 'My Gemtop' : 'C:\\'}</span>
      </div>
    </div>
  );
};
