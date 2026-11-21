import React, { useEffect, useRef, useState } from 'react';
import { ChatTurn, streamChatReply } from '../../services/geminiService';

interface Message {
  id: number;
  sender: 'user' | 'ai';
  text: string;
  time: string;
}

function nowStamp(): string {
  const d = new Date();
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export const GeminiChatApp: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: 'ai',
      text: "Welcome to Gemini Chat 95! You're connected at 56kbps. Ask me anything!",
      time: nowStamp(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);

  const transcriptRef = useRef<HTMLDivElement | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const nextIdRef = useRef(2);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  useEffect(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isStreaming) return;

    const history: ChatTurn[] = messages.map((m) => ({
      role: m.sender === 'user' ? 'user' : 'model',
      text: m.text,
    }));

    const userMsg: Message = {
      id: nextIdRef.current++,
      sender: 'user',
      text: trimmed,
      time: nowStamp(),
    };

    const aiMsgId = nextIdRef.current++;
    const aiPlaceholder: Message = {
      id: aiMsgId,
      sender: 'ai',
      text: '',
      time: nowStamp(),
    };

    setMessages((prev) => [...prev, userMsg, aiPlaceholder]);
    setInput('');
    setIsStreaming(true);

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
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
    } catch {
      if (!controller.signal.aborted) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === aiMsgId
              ? {
                  ...m,
                  text: 'Connection hiccup on the 56k line! Try sending that again.',
                }
              : m
          )
        );
      }
    } finally {
      if (!controller.signal.aborted) {
        setIsStreaming(false);
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
      <div className="app-menubar">
        <span className="app-menubar-item">Chat</span>
        <span className="app-menubar-item">Edit</span>
        <span className="app-menubar-item">People</span>
        <span className="app-menubar-item">Help</span>
      </div>

      <div ref={transcriptRef} className="chat-transcript win95-sunken">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={msg.sender === 'user' ? 'chat-msg-user' : 'chat-msg-ai'}
          >
            <span style={{ opacity: 0.65, fontSize: 11, marginRight: 5 }}>
              [{msg.time}]
            </span>
            <span className="chat-sender">
              {msg.sender === 'user' ? 'You:' : 'Gemini:'}
            </span>
            <span style={{ whiteSpace: 'pre-wrap' }}>
              {msg.text || (isStreaming && msg.sender === 'ai' ? '...' : '')}
            </span>
          </div>
        ))}
      </div>

      <form className="chat-input-row" onSubmit={handleSend}>
        <input
          type="text"
          className="chat-input win95-sunken"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isStreaming}
          aria-label="Chat message"
        />
        <button
          type="submit"
          className="win95-btn"
          disabled={isStreaming || !input.trim()}
          style={{ minWidth: 66, fontWeight: 600 }}
        >
          Send
        </button>
      </form>

      <div className="app-statusbar">
        <span>{isStreaming ? 'Gemini is typing...' : 'Connected to Gemini-Net'}</span>
        <span>Online</span>
      </div>
    </div>
  );
};
