import React, { useEffect, useState } from 'react';

function createEasterEggPhotoDataUrl(): string {
  const canvas = document.createElement('canvas');
  canvas.width = 520;
  canvas.height = 360;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // 1995 vaporwave / laser portrait studio backdrop
  const bg = ctx.createLinearGradient(0, 0, 520, 360);
  bg.addColorStop(0, '#10002b');
  bg.addColorStop(0.55, '#3c096c');
  bg.addColorStop(1, '#005f73');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 520, 360);

  // Retro 90s laser beams
  const lasers = [
    { x1: 0, y1: 30, x2: 520, y2: 210, color: 'rgba(255, 0, 255, 0.35)' },
    { x1: 520, y1: 20, x2: 0, y2: 260, color: 'rgba(0, 255, 255, 0.35)' },
    { x1: 90, y1: 0, x2: 430, y2: 360, color: 'rgba(255, 255, 0, 0.22)' },
    { x1: 420, y1: 0, x2: 70, y2: 360, color: 'rgba(0, 255, 136, 0.25)' },
  ];
  lasers.forEach((l) => {
    ctx.strokeStyle = l.color;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(l.x1, l.y1);
    ctx.lineTo(l.x2, l.y2);
    ctx.stroke();
  });

  // Perspective neon grid floor
  ctx.fillStyle = '#0c0820';
  ctx.fillRect(0, 245, 520, 115);
  ctx.strokeStyle = '#ff00cc';
  ctx.lineWidth = 1.5;
  for (let y = 250; y <= 360; y += 18) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(520, y);
    ctx.stroke();
  }
  for (let i = -5; i <= 11; i++) {
    ctx.beginPath();
    ctx.moveTo(260 + i * 28, 245);
    ctx.lineTo(260 + i * 74, 360);
    ctx.stroke();
  }

  // Stars
  ctx.fillStyle = '#ffffff';
  for (let i = 0; i < 40; i++) {
    const sx = (i * 97) % 510 + 5;
    const sy = (i * 53) % 210 + 8;
    ctx.fillRect(sx, sy, (i % 2) + 1, (i % 2) + 1);
  }

  // Retro Beige CRT Hero Character wearing 90s "Deal With It" pixel shades
  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.45)';
  ctx.beginPath();
  ctx.ellipse(260, 286, 115, 22, 0, 0, Math.PI * 2);
  ctx.fill();

  // Monitor body
  ctx.fillStyle = '#d6cfb8';
  ctx.strokeStyle = '#111111';
  ctx.lineWidth = 4;
  ctx.fillRect(166, 78, 188, 152);
  ctx.strokeRect(166, 78, 188, 152);

  // Top bevel
  ctx.fillStyle = '#eee8d5';
  ctx.fillRect(170, 82, 180, 10);

  // CRT Glass Screen
  ctx.fillStyle = '#008080';
  ctx.fillRect(184, 96, 152, 106);
  ctx.strokeStyle = '#333333';
  ctx.lineWidth = 3;
  ctx.strokeRect(184, 96, 152, 106);

  // Pixel Sunglasses on CRT face!
  ctx.fillStyle = '#000000';
  ctx.fillRect(198, 122, 124, 10);
  ctx.fillRect(204, 132, 46, 22);
  ctx.fillRect(270, 132, 46, 22);
  // White pixel glare on sunglasses
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(212, 136, 8, 6);
  ctx.fillRect(220, 142, 8, 6);
  ctx.fillRect(278, 136, 8, 6);
  ctx.fillRect(286, 142, 8, 6);

  // Smug retro grin
  ctx.fillStyle = '#ffff66';
  ctx.fillRect(236, 170, 48, 8);
  ctx.fillRect(228, 164, 8, 8);
  ctx.fillRect(284, 164, 8, 8);

  // Power LED
  ctx.fillStyle = '#00ff00';
  ctx.fillRect(326, 212, 10, 6);

  // Stand & Keyboard
  ctx.fillStyle = '#b4ad96';
  ctx.fillRect(228, 230, 64, 18);
  ctx.strokeRect(228, 230, 64, 18);

  ctx.fillStyle = '#ded8c5';
  ctx.fillRect(148, 248, 224, 34);
  ctx.strokeRect(148, 248, 224, 34);
  ctx.fillStyle = '#999484';
  for (let r = 0; r < 2; r++) {
    for (let c = 0; c < 12; c++) {
      ctx.fillRect(158 + c * 17, 254 + r * 12, 13, 8);
    }
  }

  // Cute pixel orange tabby cat sitting on the monitor!
  ctx.fillStyle = '#ff9933';
  ctx.fillRect(220, 42, 44, 36);
  // Cat ears
  ctx.beginPath();
  ctx.moveTo(222, 42);
  ctx.lineTo(230, 26);
  ctx.lineTo(238, 42);
  ctx.moveTo(246, 42);
  ctx.lineTo(254, 26);
  ctx.lineTo(262, 42);
  ctx.fill();
  // Cat eyes & smile
  ctx.fillStyle = '#000000';
  ctx.fillRect(230, 52, 5, 5);
  ctx.fillRect(249, 52, 5, 5);
  ctx.fillStyle = '#ff5588';
  ctx.fillRect(239, 58, 6, 4);

  // Floating 3.5" Floppy Disk on the left
  ctx.fillStyle = '#1e40af';
  ctx.fillRect(46, 130, 74, 78);
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.strokeRect(46, 130, 74, 78);
  ctx.fillStyle = '#e5e7eb';
  ctx.fillRect(62, 130, 42, 26);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(54, 166, 58, 36);
  ctx.fillStyle = '#cc0000';
  ctx.font = 'bold 9px Courier New, monospace';
  ctx.fillText('SECRET', 63, 181);
  ctx.fillText('STASH #1', 59, 194);

  // Bold red diagonal "TOP SECRET" stamp
  ctx.save();
  ctx.translate(390, 96);
  ctx.rotate(0.24);
  ctx.strokeStyle = '#ff2222';
  ctx.lineWidth = 4;
  ctx.strokeRect(-92, -26, 184, 52);
  ctx.fillStyle = 'rgba(255, 0, 0, 0.16)';
  ctx.fillRect(-92, -26, 184, 52);
  ctx.fillStyle = '#ff3333';
  ctx.font = 'bold 20px Impact, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('TOP SECRET!', 0, -2);
  ctx.font = 'bold 11px Courier New, monospace';
  ctx.fillText('DO NOT SHOW ANYONE', 0, 16);
  ctx.restore();

  // Caption banner at bottom
  ctx.fillStyle = 'rgba(0, 0, 0, 0.72)';
  ctx.fillRect(20, 296, 480, 44);
  ctx.fillStyle = '#ffff00';
  ctx.font = 'bold 15px "Comic Sans MS", cursive';
  ctx.textAlign = 'center';
  ctx.fillText('Caught Gemini 95 flexing in the 1995 server room!!', 260, 317);
  ctx.fillStyle = '#00ffff';
  ctx.font = '12px Courier New, monospace';
  ctx.fillText('C:\\dontshowthistoanyone.jpg  |  Pentium 90MHz Lab Archive', 260, 333);

  // Authentic 90s orange digital camera date stamp
  ctx.fillStyle = '#ff6a00';
  ctx.font = 'bold 14px Courier New, monospace';
  ctx.textAlign = 'left';
  ctx.fillText("'95 08 24", 18, 28);

  return canvas.toDataURL('image/jpeg', 0.88);
}

export const ImageViewer: React.FC<{ fileName?: string }> = ({
  fileName = 'dontshowthistoanyone.jpg',
}) => {
  const [imgSrc, setImgSrc] = useState<string>('');
  const [zoom, setZoom] = useState<number>(100);

  useEffect(() => {
    setImgSrc(createEasterEggPhotoDataUrl());
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Viewer Controls */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '4px 6px 6px',
        }}
      >
        <button
          type="button"
          className="win95-btn"
          onClick={() => setZoom((z) => Math.max(50, z - 25))}
        >
          Zoom -
        </button>
        <button
          type="button"
          className="win95-btn"
          onClick={() => setZoom(100)}
        >
          100%
        </button>
        <button
          type="button"
          className="win95-btn"
          onClick={() => setZoom((z) => Math.min(175, z + 25))}
        >
          Zoom +
        </button>
        <span style={{ marginLeft: 'auto', fontSize: 12, color: '#333' }}>
          {fileName} ({zoom}%)
        </span>
      </div>

      {/* Sunken Image Canvas */}
      <div
        className="win95-sunken win95-scroll"
        style={{
          flex: 1,
          backgroundColor: '#2b2b2b',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 14,
        }}
      >
        {imgSrc && (
          <img
            src={imgSrc}
            alt="Secret 1995 easter egg photo"
            style={{
              width: `${zoom}%`,
              maxWidth: zoom === 100 ? '100%' : 'none',
              height: 'auto',
              border: '3px solid #ffffff',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.65)',
            }}
          />
        )}
      </div>

      {/* Status Bar */}
      <div
        className="win95-sunken-thin"
        style={{ marginTop: 4, padding: '2px 6px', fontSize: 11 }}
      >
        Shhh! You weren&apos;t supposed to find this file on C:\
      </div>
    </div>
  );
};
