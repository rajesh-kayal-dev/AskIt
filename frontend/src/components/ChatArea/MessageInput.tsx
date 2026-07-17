import React, { useState, useRef, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { addMessage, setIsGenerating } from '../../redux/chatSlice';
import { chatService } from '../../services/api';
import { Paperclip, Mic, ArrowUp, AudioLines } from 'lucide-react';

export const MessageInput: React.FC = () => {
  const [content, setContent] = useState('');
  const [isVoiceAgentActive, setIsVoiceAgentActive] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const dispatch = useAppDispatch();
  const { isGenerating, model } = useAppSelector((state) => state.chat);

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [content]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || isGenerating) return;

    const userContent = content.trim();
    setContent('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    // Add user message
    dispatch(addMessage({
      id: Date.now().toString(),
      type: 'user',
      content: userContent,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }));

    dispatch(setIsGenerating(true));

    try {
      const response = await chatService.sendMessage(userContent, model);
      dispatch(addMessage(response));
    } catch (error) {
      console.error('Failed to send message:', error);
      dispatch(addMessage({
        id: Date.now().toString(),
        type: 'ai',
        content: 'Sorry, I encountered an error. Please try again.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }));
    } finally {
      dispatch(setIsGenerating(false));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div
      className="sticky bottom-0 z-10 w-full py-4 px-4 lg:px-6"
      style={{
        background: 'linear-gradient(to top, var(--bg-primary) 0%, var(--bg-primary) 80%, transparent 100%)',
      }}
    >
      <div className="max-w-[900px] mx-auto">
        <form
          className="input-form w-full p-4 rounded-2xl border flex items-end gap-3 transition-all duration-200"
          style={{
            borderColor: 'var(--border-light)',
            background: 'var(--bg-tertiary)',
          }}
          onSubmit={handleSubmit}
        >
          {/* Attach Button */}
          <button
            type="button"
            className="btn-interact w-9 h-9 rounded-lg flex items-center justify-center cursor-pointer border-none flex-shrink-0 transition-all hover:bg-[var(--bg-hover)]"
            style={{ background: 'transparent' }}
            title="Attach files"
          >
            <Paperclip className="w-5 h-5" style={{ strokeWidth: 2, color: 'var(--text-tertiary)' }} />
          </button>

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isVoiceAgentActive ? "Connecting..." : "Ask anything..."}
            className="flex-1 resize-none min-h-[24px] max-h-[160px] py-2 px-0 border-0 border-transparent outline-none focus:outline-none focus:ring-0 focus:border-transparent text-base leading-6 overflow-y-auto"
            style={{
              background: 'transparent',
              color: 'var(--text-primary)',
              fontFamily: 'inherit',
              boxShadow: 'none',
            }}
            rows={1}
            disabled={isGenerating}
          />

          {/* Mic Button (Voice Typing) */}
          <button
            type="button"
            className="btn-interact w-9 h-9 rounded-lg flex items-center justify-center cursor-pointer border-none flex-shrink-0 transition-all hover:bg-[var(--bg-hover)]"
            style={{ background: 'transparent' }}
            title="Voice typing"
          >
            <Mic className="w-5 h-5" style={{ strokeWidth: 2, color: 'var(--text-tertiary)' }} />
          </button>

          {/* Conditional Voice Assistant / Send / Cancel Button */}
          {isVoiceAgentActive ? (
            <button 
              type="button"
              onClick={() => setIsVoiceAgentActive(false)}
              className="h-10 px-4 rounded-xl flex items-center justify-center gap-1.5 border-none cursor-pointer transition-all"
              style={{ background: '#003a80', color: '#ffffff', fontSize: '14px', fontWeight: 500 }}
              title="Stop voice agent"
            >
              <span className="flex gap-0.5 mt-[-4px] tracking-tighter text-lg leading-none opacity-80">•••</span>
              {content.trim().length === 0 ? 'Cancel' : 'Stop'}
            </button>
          ) : content.trim().length === 0 ? (
            <button
              type="button"
              onClick={() => setIsVoiceAgentActive(true)}
              className="btn-interact w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer border-none flex-shrink-0 transition-all hover:bg-[var(--bg-hover)]"
              style={{ background: 'transparent' }}
              title="Voice assistant chat"
            >
              <AudioLines className="w-5 h-5" style={{ strokeWidth: 2, color: 'var(--text-tertiary)' }} />
            </button>
          ) : (
            <button
              type="submit"
              className="send-btn w-10 h-10 rounded-xl flex items-center justify-center text-white border-none cursor-pointer transition-all duration-200 flex-shrink-0 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
              style={{
                background: 'var(--gradient-button)',
                boxShadow: 'var(--shadow-md)',
              }}
              disabled={isGenerating}
            >
              <ArrowUp className="w-5 h-5" style={{ strokeWidth: 2 }} />
            </button>
          )}
        </form>
      </div>
    </div>
  );
};
