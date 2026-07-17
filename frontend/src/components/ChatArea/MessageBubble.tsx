import React from 'react';
import type { Message } from '../../redux/chatSlice';
import { Copy, RefreshCw, ThumbsUp, ThumbsDown } from 'lucide-react';
import { cn } from '../../lib/utils';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.type === 'user';

  return (
    <div className={cn(isUser ? 'message-user max-w-[70%] ml-auto mb-3' : 'message-ai max-w-[75%] mr-auto mb-3')}>
      <div
        className={cn(
          'message-bubble px-5 py-4 rounded-2xl text-[15px] leading-relaxed whitespace-pre-wrap break-words shadow-md',
          isUser ? 'rounded-br-md text-white' : 'rounded-bl-md'
        )}
        style={{
          background: isUser ? 'var(--gradient-button)' : 'var(--bg-elevated)',
          color: isUser ? '#fff' : 'var(--text-primary)',
          border: isUser ? 'none' : '1px solid var(--border-light)'
        }}
        dangerouslySetInnerHTML={!isUser ? { __html: message.content } : undefined}
      >
        {isUser && message.content}
      </div>

      <div className={cn('flex items-center gap-3 mt-1', isUser ? 'justify-end pr-1' : 'justify-start pl-1')}>
        <span className="text-[11px] font-medium" style={{ color: 'var(--text-muted)' }}>
          {message.time}
        </span>

        {!isUser && (
          <div className="message-actions flex items-center gap-1.5">
            <button
              className="w-6 h-6 rounded flex items-center justify-center cursor-pointer border-none transition-all"
              style={{ background: 'transparent', color: 'var(--text-tertiary)' }}
              title="Copy response"
            >
              <Copy className="w-3.5 h-3.5 hover:text-white" />
            </button>
            <button
              className="w-6 h-6 rounded flex items-center justify-center cursor-pointer border-none transition-all"
              style={{ background: 'transparent', color: 'var(--text-tertiary)' }}
              title="Regenerate"
            >
              <RefreshCw className="w-3.5 h-3.5 hover:text-white" />
            </button>
            <button
              className="w-6 h-6 rounded flex items-center justify-center cursor-pointer border-none transition-all"
              style={{ background: 'transparent', color: 'var(--text-tertiary)' }}
              title="Helpful"
            >
              <ThumbsUp className="w-3.5 h-3.5 hover:text-white" />
            </button>
            <button
              className="w-6 h-6 rounded flex items-center justify-center cursor-pointer border-none transition-all"
              style={{ background: 'transparent', color: 'var(--text-tertiary)' }}
              title="Not helpful"
            >
              <ThumbsDown className="w-3.5 h-3.5 hover:text-white" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
