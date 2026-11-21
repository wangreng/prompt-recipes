import React, { useState, useRef, useEffect } from 'react';
import { streamChatReply, ChatTurn } from '../../services/geminiService';

interface Message {
  id: number;
  sender: 'user' | 'ai';
  text: string;
  time: string;
}

function nowTime(): string {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export const GeminiChatApp: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: 'ai',
      text: 'Welcome to Gemini Chat 95! Connected at 56.6k. What would you like to chat about today?',
      time: nowTime(),
    },
  ]);
  const [input, setInput] = useState<string>('');
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const logRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const nextIdRef = useRef<number>(2);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isStreaming) return;

    const userMsg: Message = {
      id: nextIdRef.current++,
      sender: 'user',
      text: trimmed,
      time: nowTime(),
    };
    const aiMsgId = nextIdRef.current++;
    const aiMsg: Message = {
      id: aiMsgId,
      sender: 'ai',
      text: '',
      time: nowTime(),
    };

    const history: ChatTurn[] = messages.map((m) => ({
      role: m.sender === 'user' ? 'user' : 'model',
      text: m.text,
    }));

    setMessages((prev) => [...prev, userMsg, aiMsg]);
    setInput('');
    setIsStreaming(true);

    const controller = new AbortController();
    abortRef.current = controller;

    await streamChatReply(
      history,
      trimmed,
      (chunk) => {
        setMessages((prev) =>
          prev.map((m) => (m.id === aiMsgId ? { ...m, text: m.text + chunk } : m))
        );
      },
      controller.signal
    );

    if (!controller.signal.aborted) {
      setIsStreaming(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#c0c0c0' }}>
      <div className="win95-menubar">
        <button type="button" className="win95-menubar-item">File</button>
        <button
          type="button"
          className="win95-menubar-item"
          onClick={() => {
            abortRef.current?.abort();
            setIsStreaming(false);
            setMessages([
              {
                id: nextIdRef.current++,
                sender: 'ai',
                text: 'Chat history cleared! Ready for a fresh conversation.',
                time: nowTime(),
              },
            ]);
          }}
        >
          Clear Log
        </button>
        <button type="button" className="win95-menubar-item">Help</button>
      </div>

      {/* Retro Message Log (Blue User, Green AI) */}
      <div ref={logRef} className="chat-log win95-sunken" style={{ margin: '4px' }}>
        {messages.map((msg) => (
          <div key={msg.id} className="chat-msg">
            <span className="chat-time">[{msg.time}]</span>
            {msg.sender === 'user' ? (
              <>
                <span className="chat-sender-user">You: </span>
                <span className="chat-text-user">{msg.text}</span>
              </>
            ) : (
              <>
                <span className="chat-sender-ai">Gemini: </span>
                <span className="chat-text-ai">
                  {msg.text || (isStreaming ? '...' : '')}
                </span>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Message Input Row */}
      <form
        onSubmit={handleSend}
        style={{ display: 'flex', gap: 6, padding: '4px 6px 6px', alignItems: 'center' }}
      >
        <input
          type="text"
          className="win95-input font-inter"
          style={{ flex: 1, height: 28, fontSize: 13 }}
          placeholder="Type a message to Gemini..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isStreaming}
        />
        <button
          type="submit"
          className="win95-btn"
          style={{ height: 28, padding: '0 14px', fontWeight: 700 }}
          disabled={isStreaming || !input.trim()}
        >
          {isStreaming ? '...' : 'Send'}
        </button>
      </form>
    </div>
  );
};
