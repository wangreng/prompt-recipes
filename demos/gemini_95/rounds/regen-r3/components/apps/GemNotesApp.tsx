import React, { useEffect, useRef, useState } from 'react';
import { streamTwistStory } from '../../services/geminiService';

const INITIAL_TEXT = `Welcome to GemNotes 95!

Type your notes here, or click "Generate Story" above to watch Gemini AI stream a brand-new short story with a twist ending...`;

export const GemNotesApp: React.FC = () => {
  const [content, setContent] = useState(INITIAL_TEXT);
  const [isStreaming, setIsStreaming] = useState(false);
  const [status, setStatus] = useState('Ready');
  const abortRef = useRef<AbortController | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  const handleGenerateStory = async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setIsStreaming(true);
    setContent('');
    setStatus('Gemini is writing a twist-ending story...');

    try {
      await streamTwistStory(
        (chunk) => {
          setContent((prev) => prev + chunk);
          if (textareaRef.current) {
            textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
          }
        },
        controller.signal
      );
      if (!controller.signal.aborted) {
        setStatus('Story complete!');
      }
    } catch {
      if (!controller.signal.aborted) {
        setStatus('Error generating story');
      }
    } finally {
      if (!controller.signal.aborted) {
        setIsStreaming(false);
      }
    }
  };

  const handleClear = () => {
    abortRef.current?.abort();
    setIsStreaming(false);
    setContent('');
    setStatus('Cleared');
  };

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
      <div className="app-menubar">
        <span className="app-menubar-item">File</span>
        <span className="app-menubar-item">Edit</span>
        <span className="app-menubar-item">Search</span>
        <span className="app-menubar-item">Help</span>
      </div>

      <div className="notepad-toolbar">
        <button
          type="button"
          className="win95-btn"
          onClick={handleGenerateStory}
          disabled={isStreaming}
          style={{ fontWeight: 600 }}
        >
          &#10022; {isStreaming ? 'Writing...' : 'Generate Story'}
        </button>
        <button
          type="button"
          className="win95-btn"
          onClick={handleClear}
        >
          Clear
        </button>
      </div>

      <textarea
        ref={textareaRef}
        className="notepad-textarea win95-sunken"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        spellCheck={false}
        aria-label="GemNotes text editor"
      />

      <div className="app-statusbar">
        <span>{status}</span>
        <span className="font-courier">{wordCount} words</span>
      </div>
    </div>
  );
};
