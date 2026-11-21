import React, { useRef, useState } from 'react';
import { streamTwistStory } from '../services/geminiService';

export const GemNotes: React.FC = () => {
  const [content, setContent] = useState<string>(
    'Welcome to GemNotes 95!\n\nType your own notes here, or click "Generate Story" above to stream a short twist-ending story from Gemini AI.'
  );
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [status, setStatus] = useState<string>('Ready');
  const abortRef = useRef<AbortController | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const handleGenerateStory = async () => {
    if (isStreaming) return;
    const controller = new AbortController();
    abortRef.current = controller;

    setIsStreaming(true);
    setStatus('Streaming twist-ending story from Gemini...');

    const isDefaultPrompt = content.startsWith('Welcome to GemNotes 95!');
    const seed = isDefaultPrompt ? '' : content;

    if (isDefaultPrompt) {
      setContent('');
    } else if (content.trim().length > 0) {
      setContent((prev) => `${prev}\n\n`);
    }

    try {
      const res = await streamTwistStory(
        seed,
        (chunk) => {
          setContent((prev) => prev + chunk);
          if (textareaRef.current) {
            textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
          }
        },
        controller.signal
      );

      if (controller.signal.aborted) {
        setStatus('Generation stopped.');
      } else if (res.usedFallback) {
        setStatus('Done (offline demo story — set API_KEY for live Gemini).');
      } else {
        setStatus('Story complete!');
      }
    } catch {
      setStatus('Could not reach Gemini. Please try again.');
    } finally {
      setIsStreaming(false);
      abortRef.current = null;
    }
  };

  const handleStop = () => {
    abortRef.current?.abort();
  };

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Classic Menu & Action Toolbar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '4px 6px 6px',
          flexWrap: 'wrap',
        }}
      >
        <button
          type="button"
          className="win95-btn"
          onClick={handleGenerateStory}
          disabled={isStreaming}
          style={{ fontWeight: 700 }}
        >
          ✨ {isStreaming ? 'Generating...' : 'Generate Story'}
        </button>

        {isStreaming && (
          <button type="button" className="win95-btn" onClick={handleStop}>
            Stop
          </button>
        )}

        <button
          type="button"
          className="win95-btn"
          disabled={isStreaming}
          onClick={() => {
            setContent('');
            setStatus('Cleared');
          }}
        >
          Clear
        </button>
      </div>

      {/* Monospace Courier New Notepad */}
      <textarea
        ref={textareaRef}
        className="win95-sunken win95-scroll font-mono-95"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        spellCheck={false}
        style={{
          flex: 1,
          width: '100%',
          resize: 'none',
          padding: 10,
          fontFamily: 'var(--font-mono)',
          fontSize: 14,
          lineHeight: 1.5,
          color: '#000000',
          backgroundColor: '#ffffff',
          outline: 'none',
          userSelect: 'text',
        }}
      />

      {/* Status Bar */}
      <div
        style={{
          display: 'flex',
          gap: 4,
          marginTop: 4,
          fontSize: 11,
        }}
      >
        <div className="win95-sunken-thin" style={{ flex: 1, padding: '2px 6px' }}>
          {status}
        </div>
        <div
          className="win95-sunken-thin font-mono-95"
          style={{ width: 120, padding: '2px 6px', textAlign: 'right' }}
        >
          {wordCount} words
        </div>
      </div>
    </div>
  );
};
