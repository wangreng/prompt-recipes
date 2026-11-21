import React from 'react';
import { AppId } from '../types';

interface IconProps {
  size?: number;
}

/* 1. My Gemtop — wider gray isometric CRT monitor on desktop base */
export const MyGemtopIcon: React.FC<IconProps> = ({ size = 48 }) => (
  <svg width={size * 1.12} height={size} viewBox="0 0 64 56" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Desktop PC base unit (wider isometric beige/gray box) */}
    <polygon
      points="6,41 15,35 56,35 58,41 58,50 6,50"
      fill="#cfcfcf"
      stroke="#1e1e1e"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
    <polygon points="6,41 58,41 56,35 15,35" fill="#e5e5e5" stroke="#1e1e1e" strokeWidth="1.4" strokeLinejoin="round" />
    <rect x="6" y="41" width="52" height="9" fill="#c6c6c6" stroke="#1e1e1e" strokeWidth="1.6" strokeLinejoin="round" />
    {/* Floppy drive slot + eject button + vent lines */}
    <rect x="35" y="44" width="16" height="2.6" rx="0.6" fill="#444444" />
    <rect x="47" y="47.2" width="4" height="1.4" fill="#777777" />
    <line x1="11" y1="44" x2="22" y2="44" stroke="#666666" strokeWidth="1.2" />
    <line x1="11" y1="46.8" x2="22" y2="46.8" stroke="#666666" strokeWidth="1.2" />
    <circle cx="28" cy="45.5" r="1.4" fill="#22c55e" stroke="#1e1e1e" strokeWidth="0.7" />

    {/* Monitor neck / swivel stand */}
    <path
      d="M23,35 L25,38 L41,38 L43,35 Z"
      fill="#a8a8a8"
      stroke="#1e1e1e"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />

    {/* CRT Monitor rear casing (isometric depth) */}
    <polygon
      points="12,9 19,5 50,5 54,10 54,30 48,35 12,35"
      fill="#b8b8b8"
      stroke="#1e1e1e"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
    {/* Monitor top slope */}
    <polygon
      points="11,10 19,5 50,5 46,10"
      fill="#ececec"
      stroke="#1e1e1e"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    {/* Monitor right side */}
    <polygon
      points="46,10 50,5 54,10 54,29 46,35"
      fill="#a6a6a6"
      stroke="#1e1e1e"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    {/* Monitor front bezel (wider CRT) */}
    <rect
      x="11"
      y="10"
      width="35"
      height="25"
      rx="2"
      fill="#d8d8d8"
      stroke="#1e1e1e"
      strokeWidth="1.6"
    />
    {/* CRT Screen */}
    <rect
      x="14.5"
      y="13"
      width="28"
      height="17.5"
      rx="1.5"
      fill="#1e4e5f"
      stroke="#1e1e1e"
      strokeWidth="1.4"
    />
    {/* Screen glossy reflection */}
    <path d="M16.5 15 L25 15 L16.5 23.5 Z" fill="#38bdf8" fillOpacity="0.32" />
    <path d="M17 28.5 L39 28.5" stroke="#0f2b36" strokeWidth="1.2" />
    {/* Power LED on bezel */}
    <circle cx="40.5" cy="32.6" r="1.2" fill="#22c55e" />
    <line x1="15" y1="32.6" x2="23" y2="32.6" stroke="#7a7a7a" strokeWidth="1.2" />
  </svg>
);

/* 2. Chrome — smooth classic four-color Chrome logo with thin dark outlines */
export const ChromeIcon: React.FC<IconProps> = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <clipPath id="chromeCircleClip">
        <circle cx="28" cy="28" r="22" />
      </clipPath>
    </defs>
    {/* Base circle */}
    <g clipPath="url(#chromeCircleClip)">
      {/* Red top sector */}
      <path d="M28,28 L6,16 L6,4 L52,4 L52,19 L28,19 Z" fill="#ea4335" />
      {/* Yellow right/bottom-right sector */}
      <path d="M28,19 L52,19 L52,52 L25,52 L36,33 Z" fill="#fbbc05" />
      {/* Green left/bottom-left sector */}
      <path d="M6,16 L28,28 L36,33 L25,52 L4,52 L4,16 Z" fill="#34a853" />
      {/* Crisp divider lines between segments */}
      <line x1="28" y1="19" x2="50" y2="19" stroke="#1e1e1e" strokeWidth="1.4" />
      <line x1="20.2" y1="32.5" x2="9.2" y2="13.5" stroke="#1e1e1e" strokeWidth="1.4" />
      <line x1="35.8" y1="32.5" x2="24.8" y2="51.5" stroke="#1e1e1e" strokeWidth="1.4" />
    </g>
    {/* Outer thin dark ring */}
    <circle cx="28" cy="28" r="22" stroke="#1e1e1e" strokeWidth="1.7" />
    {/* White inner ring */}
    <circle cx="28" cy="28" r="10.2" fill="#ffffff" stroke="#1e1e1e" strokeWidth="1.4" />
    {/* Classic blue center orb */}
    <circle cx="28" cy="28" r="7.4" fill="#4285f4" stroke="#1e1e1e" strokeWidth="1.2" />
    {/* Subtle sheen */}
    <ellipse cx="25.8" cy="25.5" rx="2.4" ry="1.4" transform="rotate(-25 25.8 25.5)" fill="#ffffff" fillOpacity="0.45" />
  </svg>
);

/* 3. GemNotes — tiny gray Win95 notepad window with lined paper, sparkle, diagonal pencil */
export const GemNotesIcon: React.FC<IconProps> = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Mini Win95 window frame */}
    <rect x="6" y="7" width="38" height="42" rx="1.5" fill="#c8c8c8" stroke="#1e1e1e" strokeWidth="1.6" />
    {/* Navy title bar */}
    <rect x="8" y="9" width="34" height="6.5" fill="#000080" />
    <rect x="37" y="10.5" width="3.5" height="3.5" fill="#d8d8d8" stroke="#1e1e1e" strokeWidth="0.6" />
    <line x1="10.5" y1="12.2" x2="23" y2="12.2" stroke="#ffffff" strokeWidth="1.4" strokeLinecap="round" />

    {/* White lined paper content */}
    <rect x="9" y="17.5" width="32" height="28.5" fill="#ffffff" stroke="#444444" strokeWidth="1.1" />
    <line x1="12" y1="23" x2="36" y2="23" stroke="#9ca3af" strokeWidth="1.2" />
    <line x1="12" y1="28" x2="34" y2="28" stroke="#9ca3af" strokeWidth="1.2" />
    <line x1="12" y1="33" x2="31" y2="33" stroke="#9ca3af" strokeWidth="1.2" />
    <line x1="12" y1="38" x2="27" y2="38" stroke="#9ca3af" strokeWidth="1.2" />
    <line x1="12" y1="43" x2="24" y2="43" stroke="#9ca3af" strokeWidth="1.2" />

    {/* Gemini cyan-blue sparkle inside notepad */}
    <path
      d="M34 19.5 L35.4 23.1 L39 24.5 L35.4 25.9 L34 29.5 L32.6 25.9 L29 24.5 L32.6 23.1 Z"
      fill="#38bdf8"
      stroke="#1e3a8a"
      strokeWidth="1"
      strokeLinejoin="round"
    />

    {/* Diagonal pencil across bottom-right */}
    <g transform="translate(31, 37) rotate(-42)">
      <rect x="-12" y="-3.5" width="21" height="7" fill="#facc15" stroke="#1e1e1e" strokeWidth="1.5" strokeLinejoin="round" />
      {/* Eraser */}
      <rect x="9" y="-3.5" width="5" height="7" rx="1" fill="#f472b6" stroke="#1e1e1e" strokeWidth="1.5" />
      {/* Ferrule */}
      <rect x="6.5" y="-3.5" width="2.8" height="7" fill="#d1d5db" stroke="#1e1e1e" strokeWidth="1.1" />
      {/* Tip */}
      <polygon points="-12,-3.5 -18,0 -12,3.5" fill="#fde68a" stroke="#1e1e1e" strokeWidth="1.4" strokeLinejoin="round" />
      <polygon points="-16,-1.2 -18.5,0 -16,1.2" fill="#1e1e1e" />
    </g>
  </svg>
);

/* 4. GemPaint — tiny gray Win95 paint window with green canvas, left palette dots, diagonal paintbrush */
export const GemPaintIcon: React.FC<IconProps> = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Mini Win95 window frame */}
    <rect x="5" y="7" width="40" height="41" rx="1.5" fill="#c8c8c8" stroke="#1e1e1e" strokeWidth="1.6" />
    {/* Navy title bar */}
    <rect x="7" y="9" width="36" height="6.5" fill="#000080" />
    <rect x="38" y="10.5" width="3.5" height="3.5" fill="#d8d8d8" stroke="#1e1e1e" strokeWidth="0.6" />
    <line x1="9.5" y1="12.2" x2="22" y2="12.2" stroke="#ffffff" strokeWidth="1.4" strokeLinecap="round" />

    {/* Left palette strip with colorful dots */}
    <rect x="7.5" y="17.5" width="9.5" height="27.5" fill="#dfdfdf" stroke="#555555" strokeWidth="1" />
    <circle cx="10.5" cy="21" r="1.7" fill="#ef4444" stroke="#1e1e1e" strokeWidth="0.6" />
    <circle cx="14.2" cy="21" r="1.7" fill="#facc15" stroke="#1e1e1e" strokeWidth="0.6" />
    <circle cx="10.5" cy="25.8" r="1.7" fill="#3b82f6" stroke="#1e1e1e" strokeWidth="0.6" />
    <circle cx="14.2" cy="25.8" r="1.7" fill="#a855f7" stroke="#1e1e1e" strokeWidth="0.6" />
    <circle cx="10.5" cy="30.6" r="1.7" fill="#f97316" stroke="#1e1e1e" strokeWidth="0.6" />
    <circle cx="14.2" cy="30.6" r="1.7" fill="#06b6d4" stroke="#1e1e1e" strokeWidth="0.6" />
    <circle cx="10.5" cy="35.4" r="1.7" fill="#ec4899" stroke="#1e1e1e" strokeWidth="0.6" />
    <circle cx="14.2" cy="35.4" r="1.7" fill="#1e1e1e" stroke="#1e1e1e" strokeWidth="0.6" />

    {/* Vibrant green canvas area */}
    <rect x="19" y="17.5" width="23.5" height="27.5" fill="#4ade80" stroke="#444444" strokeWidth="1.1" />
    {/* Subtle playful brushstroke on green canvas */}
    <path d="M22 36 Q27 24 34 29 T39 22" stroke="#166534" strokeWidth="2" strokeLinecap="round" fill="none" />
    <circle cx="25" cy="23" r="2.2" fill="#fef08a" />

    {/* Diagonal paintbrush overlapping bottom-right */}
    <g transform="translate(36, 36) rotate(-42)">
      {/* Wooden handle */}
      <rect x="-1" y="-2.7" width="18" height="5.4" rx="2.5" fill="#b45309" stroke="#1e1e1e" strokeWidth="1.5" />
      {/* Silver ferrule */}
      <rect x="-5.5" y="-3.1" width="5" height="6.2" fill="#d1d5db" stroke="#1e1e1e" strokeWidth="1.4" />
      {/* Bristles */}
      <path d="M-5.5,-3 C-10,-3.5 -14,-1.5 -16,0.5 C-13,3.5 -9,3.5 -5.5,3 Z" fill="#2563eb" stroke="#1e1e1e" strokeWidth="1.4" strokeLinejoin="round" />
    </g>
  </svg>
);

/* 5. Doom II — red spiky floating Cacodemon monster with white horns and one eye */
export const DoomIcon: React.FC<IconProps> = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Outer white/ivory curved horns */}
    <path
      d="M15 17 C9 12 9 6 15 4 C14 9 16 11 20 13 Z"
      fill="#f5f5dc"
      stroke="#1e1e1e"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path
      d="M41 17 C47 12 47 6 41 4 C42 9 40 11 36 13 Z"
      fill="#f5f5dc"
      stroke="#1e1e1e"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path
      d="M28 11 L25 4 L31 4 Z"
      fill="#f5f5dc"
      stroke="#1e1e1e"
      strokeWidth="1.3"
      strokeLinejoin="round"
    />
    <path
      d="M10 28 L4 25 L9 33 Z"
      fill="#f5f5dc"
      stroke="#1e1e1e"
      strokeWidth="1.3"
      strokeLinejoin="round"
    />
    <path
      d="M46 28 L52 25 L47 33 Z"
      fill="#f5f5dc"
      stroke="#1e1e1e"
      strokeWidth="1.3"
      strokeLinejoin="round"
    />

    {/* Spiky red Cacodemon body */}
    <path
      d="M28 9 L33 12 L39 10 L42 16 L48 18 L46 25 L50 31 L45 36 L47 43 L40 44 L36 50 L28 47 L20 50 L16 44 L9 43 L11 36 L6 31 L10 25 L8 18 L14 16 L17 10 L23 12 Z"
      fill="#dc2626"
      stroke="#1e1e1e"
      strokeWidth="1.7"
      strokeLinejoin="round"
    />
    {/* Subtle shading / crown highlight */}
    <ellipse cx="28" cy="27" rx="15" ry="14" fill="#ef4444" fillOpacity="0.45" />

    {/* Single glowing bright green cyclops eye */}
    <ellipse cx="28" cy="23.5" rx="7.5" ry="6.2" fill="#22c55e" stroke="#1e1e1e" strokeWidth="1.6" />
    <ellipse cx="28" cy="23.5" rx="4.6" ry="3.8" fill="#86efac" />
    {/* Fierce vertical slit pupil */}
    <ellipse cx="28" cy="23.5" rx="1.6" ry="4.4" fill="#0f172a" />
    <circle cx="25.5" cy="21.5" r="1.2" fill="#ffffff" />

    {/* Menacing snarling mouth with dark blue/black interior and white fangs */}
    <path
      d="M16 33 Q28 38 40 33 Q38 44 28 44 Q18 44 16 33 Z"
      fill="#1e1b4b"
      stroke="#1e1e1e"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    {/* Upper fangs */}
    <polygon points="19,34 21.5,39 24,35" fill="#ffffff" stroke="#1e1e1e" strokeWidth="0.9" />
    <polygon points="26,35.5 28,39.5 30,35.5" fill="#ffffff" stroke="#1e1e1e" strokeWidth="0.9" />
    <polygon points="32,35 34.5,39 37,34" fill="#ffffff" stroke="#1e1e1e" strokeWidth="0.9" />
    {/* Lower fangs */}
    <polygon points="22,42.5 24,39 26,43" fill="#ffffff" stroke="#1e1e1e" strokeWidth="0.8" />
    <polygon points="30,43 32,39 34,42.5" fill="#ffffff" stroke="#1e1e1e" strokeWidth="0.8" />
  </svg>
);

/* 6. Gemini Chat — white rounded-square tile with dark border and centered blue four-point Gemini star */
export const GeminiChatIcon: React.FC<IconProps> = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="gemStarGrad" x1="12" y1="12" x2="44" y2="44" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#38bdf8" />
        <stop offset="50%" stopColor="#2563eb" />
        <stop offset="100%" stopColor="#4f46e5" />
      </linearGradient>
    </defs>
    {/* Subtle drop shadow frame */}
    <rect x="8" y="8" width="40" height="40" rx="9" fill="#d4d4d4" />
    {/* White rounded-square tile with dark border */}
    <rect
      x="7"
      y="7"
      width="40"
      height="40"
      rx="9"
      fill="#ffffff"
      stroke="#1e1e1e"
      strokeWidth="1.9"
    />
    {/* Centered four-point Gemini star */}
    <path
      d="M27 12.5 C27.8 21.5 31.5 25.2 40.5 26 C31.5 26.8 27.8 30.5 27 39.5 C26.2 30.5 22.5 26.8 13.5 26 C22.5 25.2 26.2 21.5 27 12.5 Z"
      fill="url(#gemStarGrad)"
      stroke="#1e3a8a"
      strokeWidth="1.1"
      strokeLinejoin="round"
    />
  </svg>
);

/* 7. GemSweeper — tiny gray Win95 window with numbered Minesweeper grid on left and spiky black exploding mine on right */
export const GemSweeperIcon: React.FC<IconProps> = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Mini Win95 window frame */}
    <rect x="4" y="8" width="42" height="40" rx="1.5" fill="#c8c8c8" stroke="#1e1e1e" strokeWidth="1.6" />
    {/* Navy title bar */}
    <rect x="6" y="10" width="38" height="6" fill="#000080" />
    <rect x="39" y="11.3" width="3.4" height="3.4" fill="#d8d8d8" stroke="#1e1e1e" strokeWidth="0.6" />
    <line x1="8.5" y1="13" x2="21" y2="13" stroke="#ffffff" strokeWidth="1.3" strokeLinecap="round" />

    {/* Numbered Minesweeper grid on left */}
    <g>
      <rect x="7.5" y="18.5" width="22.5" height="26.5" fill="#dfdfdf" stroke="#555555" strokeWidth="1" />
      {/* Grid lines */}
      <line x1="15" y1="18.5" x2="15" y2="45" stroke="#888888" strokeWidth="0.9" />
      <line x1="22.5" y1="18.5" x2="22.5" y2="45" stroke="#888888" strokeWidth="0.9" />
      <line x1="7.5" y1="27.3" x2="30" y2="27.3" stroke="#888888" strokeWidth="0.9" />
      <line x1="7.5" y1="36.1" x2="30" y2="36.1" stroke="#888888" strokeWidth="0.9" />

      {/* Colored Minesweeper numbers */}
      <text x="11.2" y="25.2" textAnchor="middle" fontFamily="Courier New, monospace" fontSize="8" fontWeight="900" fill="#0000ff">1</text>
      <text x="18.8" y="25.2" textAnchor="middle" fontFamily="Courier New, monospace" fontSize="8" fontWeight="900" fill="#008000">2</text>
      <text x="11.2" y="34" textAnchor="middle" fontFamily="Courier New, monospace" fontSize="8" fontWeight="900" fill="#008000">2</text>
      <text x="18.8" y="34" textAnchor="middle" fontFamily="Courier New, monospace" fontSize="8" fontWeight="900" fill="#dc2626">3</text>
      <text x="11.2" y="42.8" textAnchor="middle" fontFamily="Courier New, monospace" fontSize="8" fontWeight="900" fill="#0000ff">1</text>
      {/* Tiny raised unopened cell */}
      <rect x="23.2" y="36.8" width="6.2" height="7.4" fill="#c0c0c0" stroke="#ffffff" strokeWidth="0.8" />
    </g>

    {/* Explosion burst behind mine on right */}
    <polygon
      points="40,17 43,23 50,20 47,27 54,30 47,34 51,41 44,39 41,46 37,40 31,42 33,35 28,31 34,27 32,20 38,23"
      fill="#f97316"
      stroke="#1e1e1e"
      strokeWidth="1.2"
      strokeLinejoin="round"
    />
    <polygon
      points="40,21 42.5,25.5 47.5,24 45.5,29 50,31.5 45.5,34 47.5,38.5 42.5,37 40,41.5 37.5,37 33,38 35,33.5 31.5,31 35.5,28.5 34.5,24 38.5,25.5"
      fill="#fde047"
    />

    {/* Spiky black mine on right */}
    <g stroke="#111111" strokeWidth="2.1" strokeLinecap="round">
      <line x1="40" y1="21" x2="40" y2="41" />
      <line x1="30" y1="31" x2="50" y2="31" />
      <line x1="33" y1="24" x2="47" y2="38" />
      <line x1="47" y1="24" x2="33" y2="38" />
    </g>
    <circle cx="40" cy="31" r="6.8" fill="#18181b" stroke="#000000" strokeWidth="1.3" />
    <circle cx="37.8" cy="28.8" r="1.9" fill="#ffffff" />
  </svg>
);

/* Image Viewer icon (for taskbar/titlebar) */
export const ImageViewerIcon: React.FC<IconProps> = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="3" width="20" height="18" rx="1.5" fill="#ffffff" stroke="#1e1e1e" strokeWidth="1.6" />
    <rect x="4" y="5" width="16" height="11" fill="#93c5fd" stroke="#1e1e1e" strokeWidth="1" />
    <circle cx="8.5" cy="8.5" r="1.8" fill="#fde047" />
    <polygon points="4,16 10,10 14,14 16.5,11.5 20,16" fill="#22c55e" stroke="#14532d" strokeWidth="0.8" />
  </svg>
);

/* Start Button Wordmark — stylized blue-to-purple gradient "Gemini" with dark outline and cyan-blue sparkle on top */
export const GeminiStartLogo: React.FC = () => (
  <svg width="82" height="26" viewBox="0 0 98 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Gemini Start">
    <defs>
      <linearGradient id="startGeminiGrad" x1="6" y1="10" x2="90" y2="29" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#2563eb" />
        <stop offset="50%" stopColor="#6366f1" />
        <stop offset="100%" stopColor="#9333ea" />
      </linearGradient>
      <linearGradient id="startSparkleGrad" x1="72" y1="0" x2="86" y2="12" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#a5f3fc" />
        <stop offset="50%" stopColor="#22d3ee" />
        <stop offset="100%" stopColor="#0284c7" />
      </linearGradient>
    </defs>
    {/* Stylized gradient Gemini wordmark with dark outline */}
    <text
      x="6"
      y="27"
      fontFamily="Inter, system-ui, sans-serif"
      fontSize="21.5"
      fontWeight="800"
      fontStyle="italic"
      letterSpacing="-0.4"
      fill="url(#startGeminiGrad)"
      stroke="#111827"
      strokeWidth="3.2"
      strokeLinejoin="round"
      style={{ paintOrder: 'stroke fill' }}
    >
      Gemini
    </text>
    {/* Cyan-blue sparkle cleanly perched on top */}
    <path
      d="M78.5 0.5 C79.1 4.2 80.7 5.8 84.5 6.4 C80.7 7.0 79.1 8.6 78.5 12.3 C77.9 8.6 76.3 7.0 72.5 6.4 C76.3 5.8 77.9 4.2 78.5 0.5 Z"
      fill="url(#startSparkleGrad)"
      stroke="#0f172a"
      strokeWidth="1.15"
      strokeLinejoin="round"
    />
  </svg>
);

/* Hard drive C: icon for My Gemtop */
export const HardDriveIcon: React.FC<{ size?: number }> = ({ size = 44 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <polygon points="6,24 14,15 42,15 36,24" fill="#e5e5e5" stroke="#1e1e1e" strokeWidth="1.6" strokeLinejoin="round" />
    <rect x="6" y="24" width="30" height="11" fill="#c0c0c0" stroke="#1e1e1e" strokeWidth="1.6" strokeLinejoin="round" />
    <polygon points="36,24 42,15 42,26 36,35" fill="#9a9a9a" stroke="#1e1e1e" strokeWidth="1.6" strokeLinejoin="round" />
    <rect x="10" y="28" width="14" height="3" fill="#444444" />
    <circle cx="30" cy="29.5" r="1.8" fill="#22c55e" stroke="#1e1e1e" strokeWidth="0.7" />
  </svg>
);

/* JPEG file icon for My Gemtop */
export const JpgFileIcon: React.FC<{ size?: number }> = ({ size = 44 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 6 H30 L38 14 V42 H10 Z" fill="#ffffff" stroke="#1e1e1e" strokeWidth="1.6" strokeLinejoin="round" />
    <path d="M30 6 V14 H38" fill="#d4d4d4" stroke="#1e1e1e" strokeWidth="1.5" strokeLinejoin="round" />
    <rect x="14" y="17" width="20" height="14" fill="#bae6fd" stroke="#1e1e1e" strokeWidth="1.1" />
    <circle cx="19" cy="21" r="2" fill="#facc15" />
    <polygon points="14,31 20,24 25,28 28,25 34,31" fill="#22c55e" />
    <rect x="13" y="34" width="22" height="5.5" fill="#000080" />
    <text x="24" y="38.2" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="5" fontWeight="700" fill="#ffffff">
      JPG
    </text>
  </svg>
);

export const AppIcon: React.FC<{ appId: AppId; size?: number }> = ({ appId, size = 48 }) => {
  switch (appId) {
    case 'my-gemtop':
      return <MyGemtopIcon size={size} />;
    case 'chrome':
      return <ChromeIcon size={size} />;
    case 'gemnotes':
      return <GemNotesIcon size={size} />;
    case 'gempaint':
      return <GemPaintIcon size={size} />;
    case 'doom':
      return <DoomIcon size={size} />;
    case 'gemini-chat':
      return <GeminiChatIcon size={size} />;
    case 'gemsweeper':
      return <GemSweeperIcon size={size} />;
    case 'image-viewer':
      return <ImageViewerIcon size={size} />;
  }
};
