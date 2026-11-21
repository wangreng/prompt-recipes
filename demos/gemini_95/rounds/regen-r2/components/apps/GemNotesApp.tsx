import React, { useState, useRef, useEffect } from 'react';
import { streamStory } from '../../services/geminiService';

export const GemNotesApp: React.FC = () => {
  const [content, setContent] = useState<string>(
    'Welcome to GemNotes 95!\n\nType your notes here in crisp Courier New, or click "Generate Story" above to stream a twist-ending Gemini tale.\n'
  );
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const abortRef = useRef<AbortController | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  const handleGenerateStory = async () => {
    if (isStreaming) {
      abortRef.current?.abort();
      setIsStreaming(false);
      return;
    }

    const controller = new AbortController();
    abortRef.current = controller;
    setIsStreaming(true);
    setContent('');

    await streamStory((chunk) => {
      setContent((prev) => prev + chunk);
      if (textareaRef.current) {
        textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
      }
    }, controller.signal);

    if (!controller.signal.aborted) {
      setIsStreaming(false);
    }
  };

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#c0c0c0' }}>
      <div className="win95-menubar">
        <button type="button" className="win95-menubar-item">File</button>
        <button type="button" className="win95-menubar-item">Edit</button>
        <button type="button" className="win95-menubar-item">Search</button>
        <button type="button" className="win95-menubar-item">Help</button>
      </div>

      <div className="win95-toolbar">
        <button
          type="button"
          className={`win95-btn ${isStreaming ? 'pressed' : ''}`}
          onClick={handleGenerateStory}
        >
          <span>✨</span>
          <span>{isStreaming ? 'Stop Story' : 'Generate Story'}</span>
        </button>
        <button
          type="button"
          className="win95-btn"
          onClick={() => {
            abortRef.current?.abort();
            setIsStreaming(false);
            setContent('');
          }}
        >
          Clear
        </button>
        {isStreaming && (
          <span className="font-courier" style={{ fontSize: 12, color: '#000080', marginLeft: 4 }}>
            Streaming twist ending...
          </span>
        )}
      </div>

      <textarea
        ref={textareaRef}
        className="gemnotes-textarea"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        spellCheck={false}
        aria-label="GemNotes Editor"
      />

      <div className="win95-statusbar">
        <div className="win95-statusbar-cell font-courier">
          {isStreaming ? 'Receiving from Gemini...' : 'Ready'}
        </div>
        <div className="win95-statusbar-cell font-courier" style={{ flex: 0.45 }}>
          Words: {wordCount}
        </div>
      </div>
    </div>
  );
};
