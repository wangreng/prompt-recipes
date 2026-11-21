import React, { useState } from 'react';
import { HardDriveIcon, JpgFileIcon } from '../components/PixelIcons';

interface MyGemtopProps {
  onOpenSecretImage: () => void;
}

export const MyGemtop: React.FC<MyGemtopProps> = ({ onOpenSecretImage }) => {
  const [currentPath, setCurrentPath] = useState<'root' | 'c'>('root');
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Classic Win95 Menu Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          padding: '2px 8px 4px',
          fontSize: 12,
          borderBottom: '1px solid #808080',
          boxShadow: '0 1px 0 #ffffff',
        }}
      >
        <span>
          <u>F</u>ile
        </span>
        <span>
          <u>E</u>dit
        </span>
        <span>
          <u>V</u>iew
        </span>
        <span>
          <u>H</u>elp
        </span>
      </div>

      {/* Explorer Toolbar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '6px 6px',
        }}
      >
        <button
          type="button"
          className="win95-btn"
          disabled={currentPath === 'root'}
          onClick={() => {
            setCurrentPath('root');
            setSelectedItem(null);
          }}
        >
          ⬆ Up
        </button>
        <span style={{ fontSize: 12, fontWeight: 500 }}>Address:</span>
        <div
          className="win95-sunken"
          style={{
            flex: 1,
            padding: '2px 7px',
            fontSize: 12,
            backgroundColor: '#ffffff',
          }}
        >
          {currentPath === 'root' ? 'My Gemtop' : 'C:\\'}
        </div>
      </div>

      {/* White Sunken File Explorer Area */}
      <div
        className="win95-sunken win95-scroll"
        style={{
          flex: 1,
          backgroundColor: '#ffffff',
          padding: 18,
        }}
        onClick={() => setSelectedItem(null)}
      >
        {currentPath === 'root' ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setCurrentPath('c');
                setSelectedItem(null);
              }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: 112,
                padding: '10px 8px',
                background:
                  selectedItem === 'c-drive' ? '#000080' : 'transparent',
                color: selectedItem === 'c-drive' ? '#ffffff' : '#000000',
                border:
                  selectedItem === 'c-drive'
                    ? '1px dotted #ffff00'
                    : '1px solid transparent',
                cursor: 'pointer',
                gap: 6,
                fontFamily: 'var(--font-ui)',
              }}
              title="Click to open Local Disk (C:)"
            >
              <HardDriveIcon size={46} />
              <span style={{ fontSize: 12, fontWeight: 600 }}>
                Local Disk (C:)
              </span>
              <span style={{ fontSize: 11, color: '#606060' }}>
                512 MB Free
              </span>
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedItem('secret');
                onOpenSecretImage();
              }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: 156,
                padding: '10px 8px',
                background:
                  selectedItem === 'secret' ? '#000080' : 'transparent',
                color: selectedItem === 'secret' ? '#ffffff' : '#000000',
                border:
                  selectedItem === 'secret'
                    ? '1px dotted #ffff00'
                    : '1px solid transparent',
                cursor: 'pointer',
                gap: 6,
                fontFamily: 'var(--font-ui)',
              }}
              title="Click to open dontshowthistoanyone.jpg"
            >
              <JpgFileIcon size={46} />
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  wordBreak: 'break-all',
                }}
              >
                dontshowthistoanyone.jpg
              </span>
              <span
                style={{
                  fontSize: 11,
                  color: selectedItem === 'secret' ? '#d0e0ff' : '#606060',
                }}
              >
                JPEG Image • 420 KB
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div
        style={{
          display: 'flex',
          gap: 4,
          marginTop: 4,
          fontSize: 11,
        }}
      >
        <div
          className="win95-sunken-thin"
          style={{ flex: 1, padding: '2px 6px' }}
        >
          {currentPath === 'root'
            ? '1 object(s) — Click Local Disk (C:) to browse'
            : '1 secret file found — Click dontshowthistoanyone.jpg to view'}
        </div>
        <div
          className="win95-sunken-thin"
          style={{ width: 120, padding: '2px 6px' }}
        >
          {currentPath === 'root' ? 'My Gemtop' : 'C:\\'}
        </div>
      </div>
    </div>
  );
};
