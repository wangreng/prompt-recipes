import React, { useEffect, useRef, useState } from 'react';
import { ChatTurn, streamChatReply } from '../services/geminiService';

interface ChatMessage extends ChatTurn {
  id: number;
  time: string;
}

function nowStamp(): string {
  return new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export const GeminiChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      sender: 'ai',
      time: nowStamp(),
      text: 'Welcome to Gemini Chat 95! Connected at 56kbps. Ask me anything and watch my reply stream in real time!',
    },
  ]);
  const [input, setInput] = useState<string>('');
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const nextIdRef = useRef<number>(2);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isStreaming) return;

    const historySnapshot: ChatTurn[] = messages.map((m) => ({
      sender: m.sender,
      text: m.text,
    }));

    const userMsg: ChatMessage = {
      id: nextIdRef.current++,
      sender: 'user',
      time: nowStamp(),
      text: trimmed,
    };

    const aiMsgId = nextIdRef.current++;
    const aiPlaceholder: ChatMessage = {
      id: aiMsgId,
      sender: 'ai',
      time: nowStamp(),
      text: '',
    };

    setMessages((prev) => [...prev, userMsg, aiPlaceholder]);
    setInput('');
    setIsStreaming(true);

    try {
      await streamChatReply(historySnapshot, trimmed, (chunk) => {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === aiMsgId ? { ...m, text: m.text + chunk } : m
          )
        );
      });
    } catch {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === aiMsgId
            ? {
                ...m,
                text: 'Oops! The 56k modem hiccuped. Please try sending your message again.',
              }
            : m
        )
      );
    } finally {
      setIsStreaming(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Chat Header Strip */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '2px 6px 5px',
          fontSize: 11,
        }}
      >
        <span>
          <b>Room:</b> #Gemini-Lobby-95
        </span>
        <span style={{ color: '#007a1f', fontWeight: 700 }}>
          ● {isStreaming ? 'Gemini is typing...' : 'Online (56kbps)'}
        </span>
      </div>

      {/* Sunken White Chat Transcript (Blue User Text, Green AI Text) */}
      <div
        className="win95-sunken win95-scroll"
        style={{
          flex: 1,
          backgroundColor: '#ffffff',
          padding: 10,
          fontSize: 13,
          lineHeight: 1.5,
          userSelect: 'text',
        }}
      >
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          const textColor = isUser ? '#0033cc' : '#007a1f';
          return (
            <div key={msg.id} style={{ marginBottom: 10, color: textColor }}>
              <span
                style={{
                  fontSize: 11,
                  color: '#808080',
                  marginRight: 6,
                  fontFamily: 'var(--font-mono)',
                }}
              >
                [{msg.time}]
              </span>
              <strong style={{ marginRight: 6 }}>
                {isUser ? 'You:' : 'Gemini:'}
              </strong>
              <span style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                {msg.text || (isStreaming ? '▋' : '')}
              </span>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input Bar */}
      <form
        onSubmit={handleSend}
        style={{
          display: 'flex',
          gap: 6,
          marginTop: 6,
        }}
      >
        <input
          type="text"
          className="win95-sunken"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message to Gemini..."
          disabled={isStreaming}
          style={{
            flex: 1,
            padding: '5px 8px',
            fontFamily: 'var(--font-ui)',
            fontSize: 13,
            color: '#0033cc',
            outline: 'none',
          }}
        />
        <button
          type="submit"
          className="win95-btn"
          disabled={isStreaming || !input.trim()}
          style={{ fontWeight: 700, padding: '4px 16px' }}
        >
          Send
        </button>
      </form>
    </div>
  );
};
