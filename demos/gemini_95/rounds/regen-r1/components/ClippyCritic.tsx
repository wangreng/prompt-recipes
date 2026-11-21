import React from 'react';
import { ClippyRobotSvg } from './PixelIcons';

interface ClippyCriticProps {
  message: string;
  isThinking: boolean;
  onRequestCritique: () => void;
}

export const ClippyCritic: React.FC<ClippyCriticProps> = ({
  message,
  isThinking,
  onRequestCritique,
}) => {
  return (
    <div className="clippy-container" aria-live="polite">
      <div className="clippy-bubble">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 4,
            borderBottom: '1px dashed #c8b860',
            paddingBottom: 3,
          }}
        >
          <span style={{ fontWeight: 700, fontSize: 12, color: '#000080' }}>
            Clippy-95 Art Critic
          </span>
          <button
            type="button"
            onClick={onRequestCritique}
            disabled={isThinking}
            style={{
              background: '#fff3a1',
              border: '1px solid #000',
              borderRadius: 4,
              fontSize: 11,
              fontFamily: 'var(--font-quip)',
              cursor: isThinking ? 'wait' : 'pointer',
              padding: '1px 6px',
              color: '#000',
            }}
            title="Ask Clippy for a fresh Gemini Vision critique"
          >
            {isThinking ? 'Judging...' : 'Roast Now'}
          </button>
        </div>
        <div>
          {isThinking
            ? 'Squinting at your pixels with Gemini Vision...'
            : message}
        </div>
      </div>

      <button
        type="button"
        className="clippy-robot-btn"
        onClick={onRequestCritique}
        title="Click me for an instant art critique!"
        aria-label="Clippy Art Critic Robot"
      >
        <ClippyRobotSvg thinking={isThinking} />
      </button>
    </div>
  );
};
