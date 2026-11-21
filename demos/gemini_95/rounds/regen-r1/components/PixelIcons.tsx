import React from 'react';
import { AppId } from '../types';

interface IconProps {
  size?: number;
}

export const MyGemtopIcon: React.FC<IconProps> = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" shapeRendering="crispEdges">
    {/* Monitor outer casing */}
    <rect x="3" y="3" width="26" height="19" fill="#000" />
    <rect x="4" y="4" width="24" height="17" fill="#dfdfdf" />
    <rect x="4" y="4" width="24" height="2" fill="#ffffff" />
    <rect x="4" y="19" width="24" height="2" fill="#808080" />
    <rect x="26" y="4" width="2" height="17" fill="#808080" />
    {/* Screen bezel */}
    <rect x="6" y="6" width="20" height="13" fill="#404040" />
    <rect x="7" y="7" width="18" height="11" fill="#008080" />
    <rect x="7" y="7" width="18" height="3" fill="#000080" />
    {/* Gemini sparkle inside CRT */}
    <rect x="15" y="10" width="2" height="6" fill="#ffff66" />
    <rect x="13" y="12" width="6" height="2" fill="#ffff66" />
    <rect x="15" y="12" width="2" height="2" fill="#ffffff" />
    <rect x="20" y="11" width="2" height="2" fill="#00ffff" />
    {/* Power LED */}
    <rect x="24" y="19" width="2" height="1" fill="#00ff00" />
    {/* Stand */}
    <rect x="12" y="22" width="8" height="2" fill="#000" />
    <rect x="13" y="22" width="6" height="2" fill="#808080" />
    {/* Desktop beige base */}
    <rect x="4" y="24" width="24" height="6" fill="#000" />
    <rect x="5" y="25" width="22" height="4" fill="#c0c0c0" />
    <rect x="5" y="25" width="22" height="1" fill="#ffffff" />
    {/* Floppy slot & LED */}
    <rect x="17" y="26" width="7" height="2" fill="#404040" />
    <rect x="7" y="27" width="2" height="1" fill="#00cc00" />
    <rect x="10" y="27" width="2" height="1" fill="#ff9900" />
  </svg>
);

export const ChromeIcon: React.FC<IconProps> = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" shapeRendering="crispEdges">
    {/* Outer black pixel circle */}
    <rect x="10" y="2" width="12" height="2" fill="#000" />
    <rect x="7" y="4" width="18" height="2" fill="#000" />
    <rect x="5" y="6" width="22" height="4" fill="#000" />
    <rect x="3" y="10" width="26" height="12" fill="#000" />
    <rect x="5" y="22" width="22" height="4" fill="#000" />
    <rect x="7" y="26" width="18" height="2" fill="#000" />
    <rect x="10" y="28" width="12" height="2" fill="#000" />
    {/* Red top arc */}
    <rect x="10" y="4" width="12" height="6" fill="#e52521" />
    <rect x="7" y="6" width="18" height="4" fill="#e52521" />
    <rect x="6" y="8" width="19" height="4" fill="#ff3b30" />
    <rect x="10" y="4" width="8" height="2" fill="#ff7066" />
    {/* Yellow right arc */}
    <rect x="17" y="10" width="10" height="10" fill="#ffcc00" />
    <rect x="18" y="10" width="9" height="12" fill="#ffdd00" />
    <rect x="15" y="19" width="10" height="7" fill="#f5b800" />
    <rect x="16" y="24" width="6" height="4" fill="#e0a400" />
    {/* Green left/bottom arc */}
    <rect x="5" y="10" width="8" height="12" fill="#2db84b" />
    <rect x="7" y="19" width="10" height="7" fill="#22993c" />
    <rect x="10" y="25" width="7" height="3" fill="#1c8032" />
    <rect x="6" y="11" width="4" height="7" fill="#46d463" />
    {/* Center white ring & blue orb */}
    <rect x="11" y="10" width="10" height="12" fill="#ffffff" />
    <rect x="10" y="11" width="12" height="10" fill="#ffffff" />
    <rect x="12" y="11" width="8" height="10" fill="#000000" />
    <rect x="11" y="12" width="10" height="8" fill="#000000" />
    <rect x="12" y="12" width="8" height="8" fill="#1e88e5" />
    <rect x="13" y="13" width="6" height="6" fill="#2196f3" />
    {/* Glossy pixel highlight */}
    <rect x="13" y="13" width="2" height="2" fill="#bbdefb" />
    <rect x="13" y="13" width="1" height="1" fill="#ffffff" />
  </svg>
);

export const GemNotesIcon: React.FC<IconProps> = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" shapeRendering="crispEdges">
    {/* Spiral rings */}
    <rect x="7" y="2" width="2" height="4" fill="#404040" />
    <rect x="11" y="2" width="2" height="4" fill="#404040" />
    <rect x="15" y="2" width="2" height="4" fill="#404040" />
    <rect x="19" y="2" width="2" height="4" fill="#404040" />
    {/* Page shadow & border */}
    <rect x="5" y="4" width="19" height="25" fill="#000" />
    <rect x="6" y="5" width="17" height="23" fill="#ffffff" />
    {/* Blue top header */}
    <rect x="6" y="5" width="17" height="3" fill="#0080c0" />
    {/* Red margin & ruled lines */}
    <rect x="9" y="8" width="1" height="20" fill="#ff9999" />
    <rect x="11" y="11" width="10" height="1" fill="#80a0c0" />
    <rect x="11" y="14" width="9" height="1" fill="#80a0c0" />
    <rect x="11" y="17" width="10" height="1" fill="#80a0c0" />
    <rect x="11" y="20" width="7" height="1" fill="#80a0c0" />
    <rect x="11" y="23" width="9" height="1" fill="#80a0c0" />
    {/* Diagonal yellow pixel pencil */}
    <rect x="25" y="10" width="4" height="3" fill="#ff80a0" />
    <rect x="23" y="12" width="4" height="4" fill="#ffcc00" />
    <rect x="21" y="14" width="4" height="4" fill="#ffcc00" />
    <rect x="19" y="16" width="4" height="4" fill="#e6b000" />
    <rect x="17" y="18" width="4" height="4" fill="#ffcc00" />
    <rect x="15" y="20" width="4" height="4" fill="#f5d0a0" />
    <rect x="14" y="23" width="2" height="2" fill="#000000" />
    {/* Pencil outline hints */}
    <rect x="25" y="9" width="4" height="1" fill="#000" />
    <rect x="29" y="10" width="1" height="3" fill="#000" />
    <rect x="13" y="24" width="2" height="2" fill="#000" />
  </svg>
);

export const GemPaintIcon: React.FC<IconProps> = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" shapeRendering="crispEdges">
    {/* Palette silhouette */}
    <rect x="8" y="4" width="14" height="2" fill="#000" />
    <rect x="5" y="6" width="20" height="3" fill="#000" />
    <rect x="3" y="9" width="24" height="12" fill="#000" />
    <rect x="5" y="21" width="18" height="4" fill="#000" />
    <rect x="8" y="25" width="12" height="2" fill="#000" />
    {/* Warm wooden palette fill */}
    <rect x="8" y="6" width="14" height="19" fill="#e8c382" />
    <rect x="5" y="9" width="20" height="12" fill="#e8c382" />
    <rect x="6" y="7" width="16" height="16" fill="#f3d69d" />
    <rect x="18" y="18" width="7" height="4" fill="#c79e58" />
    {/* Thumb hole */}
    <rect x="18" y="19" width="4" height="3" fill="#000" />
    <rect x="19" y="20" width="2" height="1" fill="#008080" />
    {/* Paint dabs */}
    <rect x="8" y="9" width="4" height="3" fill="#ff0000" />
    <rect x="14" y="7" width="4" height="3" fill="#ffff00" />
    <rect x="20" y="9" width="3" height="3" fill="#00cc00" />
    <rect x="6" y="14" width="4" height="3" fill="#0066ff" />
    <rect x="9" y="19" width="4" height="3" fill="#cc00ff" />
    {/* Paintbrush */}
    <rect x="24" y="3" width="4" height="3" fill="#000" />
    <rect x="25" y="4" width="2" height="2" fill="#00ffff" />
    <rect x="22" y="6" width="4" height="4" fill="#808080" />
    <rect x="19" y="9" width="4" height="4" fill="#8b4513" />
    <rect x="16" y="12" width="4" height="4" fill="#a0522d" />
    <rect x="14" y="15" width="3" height="3" fill="#5c2e0c" />
  </svg>
);

export const DoomIcon: React.FC<IconProps> = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" shapeRendering="crispEdges">
    {/* Fiery red/orange retro emblem */}
    <rect x="4" y="4" width="24" height="24" fill="#000" />
    <rect x="5" y="5" width="22" height="22" fill="#4a0000" />
    {/* Pixel flames at bottom */}
    <rect x="6" y="22" width="20" height="5" fill="#cc2200" />
    <rect x="7" y="19" width="4" height="6" fill="#ff5500" />
    <rect x="13" y="17" width="6" height="8" fill="#ff6600" />
    <rect x="21" y="20" width="4" height="5" fill="#ff4400" />
    <rect x="14" y="21" width="4" height="5" fill="#ffcc00" />
    {/* Classic Doom Marine Helmet */}
    <rect x="9" y="6" width="14" height="15" fill="#000" />
    <rect x="10" y="7" width="12" height="12" fill="#4f6d44" />
    <rect x="11" y="7" width="10" height="3" fill="#6f9460" />
    <rect x="8" y="10" width="2" height="7" fill="#3a5232" />
    <rect x="22" y="10" width="2" height="7" fill="#3a5232" />
    {/* Visor */}
    <rect x="10" y="11" width="12" height="5" fill="#1a1a1a" />
    <rect x="11" y="12" width="10" height="3" fill="#ff2200" />
    <rect x="12" y="12" width="3" height="2" fill="#ffaa00" />
    <rect x="17" y="12" width="3" height="2" fill="#ffaa00" />
    {/* Chin guard */}
    <rect x="12" y="17" width="8" height="3" fill="#808080" />
    <rect x="14" y="18" width="4" height="2" fill="#303030" />
  </svg>
);

export const GeminiChatIcon: React.FC<IconProps> = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" shapeRendering="crispEdges">
    {/* Back green AI bubble */}
    <rect x="11" y="11" width="18" height="13" fill="#000" />
    <rect x="12" y="12" width="16" height="11" fill="#00b85c" />
    <rect x="12" y="12" width="16" height="2" fill="#44e88e" />
    <rect x="23" y="24" width="4" height="3" fill="#000" />
    <rect x="23" y="23" width="3" height="3" fill="#00b85c" />
    {/* AI dots */}
    <rect x="16" y="17" width="2" height="2" fill="#ffffff" />
    <rect x="20" y="17" width="2" height="2" fill="#ffffff" />
    <rect x="24" y="17" width="2" height="2" fill="#ffffff" />
    {/* Front blue user bubble */}
    <rect x="3" y="4" width="19" height="13" fill="#000" />
    <rect x="4" y="5" width="17" height="11" fill="#1e66ff" />
    <rect x="4" y="5" width="17" height="2" fill="#66a3ff" />
    <rect x="5" y="17" width="4" height="3" fill="#000" />
    <rect x="6" y="16" width="3" height="3" fill="#1e66ff" />
    {/* Sparkle inside front bubble */}
    <rect x="12" y="7" width="2" height="7" fill="#ffff66" />
    <rect x="9" y="10" width="8" height="2" fill="#ffff66" />
    <rect x="12" y="10" width="2" height="2" fill="#ffffff" />
  </svg>
);

export const GemSweeperIcon: React.FC<IconProps> = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" shapeRendering="crispEdges">
    {/* Classic 3D tile backdrop */}
    <rect x="2" y="2" width="28" height="28" fill="#000" />
    <rect x="3" y="3" width="26" height="26" fill="#c0c0c0" />
    <rect x="3" y="3" width="26" height="2" fill="#ffffff" />
    <rect x="3" y="3" width="2" height="26" fill="#ffffff" />
    <rect x="3" y="27" width="26" height="2" fill="#808080" />
    <rect x="27" y="3" width="2" height="26" fill="#808080" />
    {/* Mine spikes */}
    <rect x="15" y="6" width="2" height="20" fill="#000" />
    <rect x="6" y="15" width="20" height="2" fill="#000" />
    <rect x="9" y="9" width="2" height="2" fill="#000" />
    <rect x="21" y="9" width="2" height="2" fill="#000" />
    <rect x="9" y="21" width="2" height="2" fill="#000" />
    <rect x="21" y="21" width="2" height="2" fill="#000" />
    {/* Mine sphere */}
    <rect x="10" y="10" width="12" height="12" fill="#000" />
    <rect x="11" y="9" width="10" height="14" fill="#000" />
    <rect x="9" y="11" width="14" height="10" fill="#000" />
    <rect x="12" y="12" width="3" height="3" fill="#ffffff" />
    {/* Little red flag in corner */}
    <rect x="22" y="7" width="1" height="6" fill="#000" />
    <rect x="18" y="7" width="4" height="3" fill="#ff0000" />
  </svg>
);

export const ImageViewerIcon: React.FC<IconProps> = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" shapeRendering="crispEdges">
    <rect x="3" y="5" width="26" height="22" fill="#000" />
    <rect x="4" y="6" width="24" height="20" fill="#ffffff" />
    <rect x="6" y="8" width="20" height="16" fill="#66ccff" />
    <rect x="20" y="10" width="4" height="4" fill="#ffee00" />
    <rect x="6" y="18" width="20" height="6" fill="#228833" />
    <rect x="9" y="15" width="6" height="5" fill="#446644" />
    <rect x="11" y="13" width="3" height="3" fill="#ffffff" />
    <rect x="15" y="16" width="8" height="4" fill="#2e7d32" />
  </svg>
);

export const GeminiStartIcon: React.FC<IconProps> = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" shapeRendering="crispEdges">
    <rect x="1" y="2" width="6" height="5" fill="#ff2a2a" />
    <rect x="9" y="2" width="6" height="5" fill="#00aa44" />
    <rect x="1" y="9" width="6" height="5" fill="#1e88e5" />
    <rect x="9" y="9" width="6" height="5" fill="#ffcc00" />
    <rect x="7" y="4" width="2" height="8" fill="#ffffff" />
    <rect x="4" y="7" width="8" height="2" fill="#ffffff" />
  </svg>
);

export const HardDriveIcon: React.FC<IconProps> = ({ size = 44 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" shapeRendering="crispEdges">
    <rect x="3" y="10" width="26" height="14" fill="#000" />
    <rect x="4" y="11" width="24" height="5" fill="#dfdfdf" />
    <rect x="4" y="11" width="24" height="2" fill="#ffffff" />
    <rect x="4" y="16" width="24" height="7" fill="#a0a0a0" />
    <rect x="6" y="18" width="12" height="3" fill="#404040" />
    <rect x="22" y="19" width="4" height="2" fill="#00ff00" />
    <rect x="6" y="8" width="20" height="2" fill="#000" />
    <rect x="7" y="9" width="18" height="2" fill="#c0c0c0" />
  </svg>
);

export const JpgFileIcon: React.FC<IconProps> = ({ size = 44 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" shapeRendering="crispEdges">
    <rect x="5" y="2" width="17" height="28" fill="#000" />
    <rect x="22" y="6" width="5" height="24" fill="#000" />
    <rect x="21" y="3" width="3" height="4" fill="#000" />
    <rect x="6" y="3" width="15" height="26" fill="#ffffff" />
    <rect x="21" y="7" width="5" height="22" fill="#ffffff" />
    {/* Folded corner */}
    <rect x="21" y="4" width="4" height="4" fill="#c0c0c0" />
    {/* Miniature sunset photo */}
    <rect x="8" y="9" width="15" height="13" fill="#000" />
    <rect x="9" y="10" width="13" height="6" fill="#ff6699" />
    <rect x="9" y="14" width="13" height="3" fill="#ffcc33" />
    <rect x="14" y="11" width="3" height="3" fill="#ffffaa" />
    <rect x="9" y="17" width="13" height="4" fill="#330066" />
    {/* JPG label bars */}
    <rect x="9" y="24" width="4" height="2" fill="#000080" />
    <rect x="14" y="24" width="4" height="2" fill="#000080" />
    <rect x="19" y="24" width="3" height="2" fill="#000080" />
  </svg>
);

export const SmileyIcon: React.FC<{
  mood: 'happy' | 'tense' | 'win' | 'dead';
  size?: number;
}> = ({ mood, size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" shapeRendering="crispEdges">
    <rect x="6" y="2" width="12" height="2" fill="#000" />
    <rect x="4" y="4" width="16" height="2" fill="#000" />
    <rect x="2" y="6" width="20" height="12" fill="#000" />
    <rect x="4" y="18" width="16" height="2" fill="#000" />
    <rect x="6" y="20" width="12" height="2" fill="#000" />
    <rect x="6" y="4" width="12" height="16" fill="#ffdd00" />
    <rect x="4" y="6" width="16" height="12" fill="#ffdd00" />

    {mood === 'happy' && (
      <>
        <rect x="8" y="8" width="2" height="2" fill="#000" />
        <rect x="14" y="8" width="2" height="2" fill="#000" />
        <rect x="7" y="14" width="2" height="2" fill="#000" />
        <rect x="9" y="15" width="6" height="2" fill="#000" />
        <rect x="15" y="14" width="2" height="2" fill="#000" />
      </>
    )}

    {mood === 'tense' && (
      <>
        <rect x="8" y="8" width="2" height="2" fill="#000" />
        <rect x="14" y="8" width="2" height="2" fill="#000" />
        <rect x="10" y="13" width="4" height="4" fill="#000" />
        <rect x="11" y="14" width="2" height="2" fill="#ffdd00" />
      </>
    )}

    {mood === 'win' && (
      <>
        <rect x="5" y="8" width="14" height="2" fill="#000" />
        <rect x="6" y="9" width="5" height="3" fill="#000" />
        <rect x="13" y="9" width="5" height="3" fill="#000" />
        <rect x="7" y="9" width="2" height="1" fill="#66ccff" />
        <rect x="14" y="9" width="2" height="1" fill="#66ccff" />
        <rect x="8" y="15" width="8" height="2" fill="#000" />
        <rect x="7" y="14" width="2" height="1" fill="#000" />
        <rect x="15" y="14" width="2" height="1" fill="#000" />
      </>
    )}

    {mood === 'dead' && (
      <>
        <rect x="7" y="8" width="1" height="1" fill="#000" />
        <rect x="9" y="8" width="1" height="1" fill="#000" />
        <rect x="8" y="9" width="1" height="1" fill="#000" />
        <rect x="7" y="10" width="1" height="1" fill="#000" />
        <rect x="9" y="10" width="1" height="1" fill="#000" />

        <rect x="14" y="8" width="1" height="1" fill="#000" />
        <rect x="16" y="8" width="1" height="1" fill="#000" />
        <rect x="15" y="9" width="1" height="1" fill="#000" />
        <rect x="14" y="10" width="1" height="1" fill="#000" />
        <rect x="16" y="10" width="1" height="1" fill="#000" />

        <rect x="9" y="15" width="6" height="2" fill="#000" />
        <rect x="7" y="16" width="2" height="2" fill="#000" />
        <rect x="15" y="16" width="2" height="2" fill="#000" />
      </>
    )}
  </svg>
);

export const ClippyRobotSvg: React.FC<{ thinking?: boolean }> = ({ thinking }) => (
  <svg width="74" height="82" viewBox="0 0 36 40" shapeRendering="crispEdges">
    {/* Antenna */}
    <rect x="17" y="1" width="2" height="4" fill="#404040" />
    <rect x="16" y="0" width="4" height="3" fill={thinking ? '#ff3366' : '#00ffff'} />
    <rect x="17" y="1" width="1" height="1" fill="#ffffff" />

    {/* Metallic paperclip-robot body */}
    <rect x="10" y="5" width="16" height="28" fill="#000" />
    <rect x="8" y="7" width="20" height="24" fill="#000" />
    <rect x="10" y="6" width="16" height="26" fill="#c8d4e0" />
    <rect x="9" y="8" width="18" height="22" fill="#b0c0d4" />
    <rect x="10" y="7" width="4" height="24" fill="#e8f0f8" />
    <rect x="23" y="8" width="3" height="22" fill="#7c8ea4" />

    {/* Paperclip inner metallic loop */}
    <rect x="13" y="21" width="10" height="8" fill="#54667a" />
    <rect x="14" y="22" width="8" height="6" fill="#d8e4f0" />
    <rect x="16" y="24" width="4" height="4" fill="#54667a" />

    {/* Expressive big Clippy eyes */}
    <rect x="9" y="9" width="8" height="8" fill="#000" />
    <rect x="19" y="9" width="8" height="8" fill="#000" />
    <rect x="10" y="10" width="6" height="6" fill="#ffffff" />
    <rect x="20" y="10" width="6" height="6" fill="#ffffff" />
    {/* Pupils */}
    <rect x={thinking ? 13 : 12} y="12" width="3" height="3" fill="#000080" />
    <rect x={thinking ? 23 : 22} y="12" width="3" height="3" fill="#000080" />
    <rect x={thinking ? 13 : 12} y="12" width="1" height="1" fill="#ffffff" />
    <rect x={thinking ? 23 : 22} y="12" width="1" height="1" fill="#ffffff" />
    {/* Sassy eyebrows */}
    <rect x="9" y="8" width="7" height="2" fill="#000" />
    <rect x="20" y="7" width="7" height="2" fill="#000" />

    {/* Smug mouth */}
    <rect x="14" y="18" width="8" height="2" fill="#000" />
    <rect x="21" y="17" width="2" height="2" fill="#000" />

    {/* Little robot arms */}
    <rect x="4" y="17" width="4" height="3" fill="#000" />
    <rect x="5" y="18" width="3" height="1" fill="#c0c0c0" />
    <rect x="28" y="17" width="4" height="3" fill="#000" />
    <rect x="28" y="18" width="3" height="1" fill="#c0c0c0" />

    {/* Base shadow & pedestal */}
    <rect x="11" y="33" width="14" height="3" fill="#000" />
    <rect x="12" y="33" width="12" height="2" fill="#4f6d9a" />
    <rect x="8" y="36" width="20" height="3" fill="rgba(0,0,0,0.28)" />
  </svg>
);

export const AppIcon: React.FC<{ appId: AppId; size?: number }> = ({
  appId,
  size = 48,
}) => {
  switch (appId) {
    case 'my-gemtop':
      return <MyGemtopIcon size={size} />;
    case 'chrome':
      return <ChromeIcon size={size} />;
    case 'gemnotes':
      return <GemNotesIcon size={size} />;
    case 'gempaint':
      return <GemPaintIcon size={size} />;
    case 'doom-ii':
      return <DoomIcon size={size} />;
    case 'gemini-chat':
      return <GeminiChatIcon size={size} />;
    case 'gemsweeper':
      return <GemSweeperIcon size={size} />;
    case 'image-viewer':
      return <ImageViewerIcon size={size} />;
  }
};
