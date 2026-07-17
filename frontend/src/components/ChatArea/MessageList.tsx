import React, { useEffect, useRef } from 'react';
import { useAppSelector } from '../../redux/hooks';
import { MessageBubble } from './MessageBubble';

export const MessageList: React.FC = () => {
  const { messages, isGenerating } = useAppSelector((state) => state.chat);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages, isGenerating]);

  return (
    <div
      ref={containerRef}
      className="messages-container flex-1 overflow-y-auto scroll-smooth py-6 px-5 lg:px-12"
      role="log"
      aria-live="polite"
      aria-label="Chat messages"
      style={{ background: 'var(--bg-primary)' }}
    >
      {messages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} />
      ))}

      {isGenerating && (
        <div className="message-ai max-w-[75%] mr-auto mb-3">
          <div
            className="message-bubble px-5 py-4 rounded-2xl rounded-bl-md shadow-md"
            style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-light)',
            }}
          >
            <div className="flex items-center gap-1.5 h-6">
              <div className="typing-dot w-2 h-2 rounded-full bg-blue-500"></div>
              <div className="typing-dot w-2 h-2 rounded-full bg-blue-500"></div>
              <div className="typing-dot w-2 h-2 rounded-full bg-blue-500"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
