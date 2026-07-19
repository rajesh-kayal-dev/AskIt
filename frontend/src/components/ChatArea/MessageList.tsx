import React, { useEffect, useRef, useState } from 'react';
import { useAppSelector } from '../../redux/hooks';
import { MessageBubble } from './MessageBubble';
import { MarkdownRenderer } from './MarkdownRenderer';
import { Loader2 } from 'lucide-react';

export const MessageList: React.FC = () => {
  const { messages, isGenerating, isLoadingMessages, currentStreamingMessage } = useAppSelector((state) => state.chat);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showThinkingIndicator, setShowThinkingIndicator] = useState(false);

  // Show "AskIt is thinking..." only after 1.5s of waiting with no streaming content
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (isGenerating && !currentStreamingMessage) {
      timer = setTimeout(() => {
        setShowThinkingIndicator(true);
      }, 1500);
    } else {
      setShowThinkingIndicator(false);
    }
    return () => clearTimeout(timer);
  }, [isGenerating, currentStreamingMessage]);

  // Auto-scroll to bottom whenever messages change or generating
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages, isGenerating, currentStreamingMessage]);

  // ── Loading state (opening existing conversation) ─────────────────────────
  if (isLoadingMessages) {
    return (
      <div
        className="flex-1 overflow-y-auto scroll-smooth py-6 px-5 lg:px-12"
        style={{ background: 'var(--bg-primary)' }}
      >
        <div className="flex flex-col gap-4 max-w-[900px] mx-auto">
          {/* AI bubble skeletons */}
          {[...Array(3)].map((_, i) => (
            <div key={i} className={i % 2 === 0 ? 'mr-auto max-w-[70%]' : 'ml-auto max-w-[55%]'}>
              <div
                className="h-14 rounded-2xl animate-pulse"
                style={{ background: 'var(--bg-elevated)', opacity: 0.6 - i * 0.1 }}
              />
            </div>
          ))}
          <div className="flex items-center justify-center gap-2 py-4">
            <Loader2 className="w-4 h-4 animate-spin" style={{ color: 'var(--text-muted)' }} />
            <span className="text-[12px]" style={{ color: 'var(--text-muted)' }}>Loading messages...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="messages-container flex-1 overflow-y-auto scroll-smooth py-6 px-5 lg:px-12"
      role="log"
      aria-live="polite"
      aria-label="Chat messages"
      style={{ background: 'var(--bg-primary)' }}
    >
      <div className="max-w-[900px] mx-auto">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}

        {/* Streaming Message or Typing Indicator */}
        {isGenerating && messages.length > 0 && messages[messages.length - 1].type === 'user' && (
          <div className="message-ai w-full mb-6">
            <div
              className="text-[15px] leading-relaxed break-words overflow-x-hidden py-1"
              style={{
                color: 'var(--text-primary)',
              }}
            >
              {currentStreamingMessage ? (
                <MarkdownRenderer content={currentStreamingMessage} className="streaming" />
              ) : showThinkingIndicator ? (
                <div className="flex flex-col gap-2">
                  <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>AskIt is thinking...</span>
                  <div className="flex items-center gap-1.5 h-4">
                    <div className="typing-dot w-2 h-2 rounded-full" style={{ background: 'var(--text-tertiary)' }}></div>
                    <div className="typing-dot w-2 h-2 rounded-full" style={{ background: 'var(--text-tertiary)', animationDelay: '0.2s' }}></div>
                    <div className="typing-dot w-2 h-2 rounded-full" style={{ background: 'var(--text-tertiary)', animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 py-1">
                  <Loader2 className="w-4 h-4 animate-spin" style={{ color: 'var(--text-muted)' }} />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
