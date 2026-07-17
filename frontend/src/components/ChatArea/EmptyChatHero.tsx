import React, { useState, useRef, useEffect } from 'react';
import { Globe, Wrench, Atom, Plus, ArrowUp, Mic, AudioLines } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { addMessage, setIsGenerating } from '../../redux/chatSlice';
import { chatService } from '../../services/api';

export const EmptyChatHero: React.FC = () => {
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

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!content.trim() || isGenerating) return;

    const userContent = content.trim();
    setContent('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

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
      handleSubmit();
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center relative overflow-y-auto w-full h-full pb-10">
      {/* Background Watermark */}
      <div 
        className="absolute inset-0 flex items-start justify-center pointer-events-none select-none overflow-hidden pt-[2vh]"
        style={{ zIndex: 0 }}
      >
        <span 
          style={{ 
            fontFamily: "'Musashi Brush', cursive",
            fontSize: '28rem', /* Increased size as requested */
            lineHeight: 1,
            color: 'var(--text-primary)',
            opacity: 0.03, /* Extremely subtle solid fill */
            userSelect: 'none',
            whiteSpace: 'nowrap'
          }}
        >
          AskIT
        </span>
      </div>

      <div 
        className="relative z-10 w-full max-w-[760px] px-6 flex flex-col items-center mt-[-5vh] opacity-0"
        style={{ animation: 'fade-in-up 0.8s ease-out forwards 0.2s' }}
      >
        
        {/* Headers */}
        <h1 className="text-5xl font-crimson font-medium mb-4" style={{ color: 'var(--text-primary)' }}>
          What can I build for you?
        </h1>
        <p className="text-[17px] font-crimson mb-8" style={{ color: 'var(--text-secondary)' }}>
          Interact with askit.ai and explore the boundless creative world
        </p>

        {/* Input Box */}
        <div 
          className="w-full rounded-2xl p-4 flex flex-col justify-between shadow-sm relative transition-all focus-within:ring-1 focus-within:ring-[var(--border-light)]"
          style={{ 
            background: 'var(--bg-elevated)', 
            border: '1px solid var(--border-subtle)',
            minHeight: '130px' 
          }}
        >
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isGenerating}
            className="w-full bg-transparent border-none outline-none focus:outline-none focus:ring-0 focus:border-transparent resize-none text-[15px] placeholder:text-[var(--text-muted)]"
            placeholder={isVoiceAgentActive ? "Connecting..." : "How can I help you today?"}
            rows={2}
            style={{ color: 'var(--text-primary)', boxShadow: 'none' }}
          />

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-1.5">
              <button 
                className="w-8 h-8 rounded-lg flex items-center justify-center border-none cursor-pointer hover:bg-[var(--bg-hover)] transition-colors"
                style={{ background: 'transparent', color: 'var(--text-secondary)' }}
              >
                <Plus className="w-5 h-5" />
              </button>
              
              <button 
                className="w-8 h-8 rounded-lg flex items-center justify-center border-none cursor-pointer hover:bg-[var(--bg-hover)] transition-colors"
                style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}
              >
                <Globe className="w-4 h-4" />
              </button>
              
              <button 
                className="w-8 h-8 rounded-lg flex items-center justify-center border-none cursor-pointer hover:bg-[var(--bg-hover)] transition-colors"
                style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}
              >
                <Wrench className="w-4 h-4" />
              </button>
              
              <button 
                className="w-8 h-8 rounded-lg flex items-center justify-center border-none cursor-pointer hover:bg-[var(--bg-hover)] transition-colors"
                style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}
              >
                <Atom className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Voice Typing */}
              <button 
                type="button"
                className="w-8 h-8 rounded-full flex items-center justify-center border-none cursor-pointer transition-colors"
                style={{ background: 'transparent', color: 'var(--text-secondary)' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-hover)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                title="Voice typing"
              >
                <Mic className="w-4 h-4" />
              </button>

              {/* Conditional Voice Assistant / Send / Cancel Button */}
              {isVoiceAgentActive ? (
                <button 
                  type="button"
                  onClick={() => setIsVoiceAgentActive(false)}
                  className="h-8 px-3.5 rounded-full flex items-center justify-center gap-1.5 border-none cursor-pointer transition-all"
                  style={{ background: '#003a80', color: '#ffffff', fontSize: '13px', fontWeight: 500 }}
                  title="Stop voice agent"
                >
                  <span className="flex gap-0.5 mt-[-4px] tracking-tighter text-lg leading-none opacity-80">•••</span>
                  {content.trim().length === 0 ? 'Cancel' : 'Stop'}
                </button>
              ) : content.trim().length === 0 ? (
                <button 
                  type="button"
                  onClick={() => setIsVoiceAgentActive(true)}
                  className="w-8 h-8 rounded-full flex items-center justify-center border-none cursor-pointer transition-colors"
                  style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-hover)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--bg-tertiary)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                  title="Voice assistant chat"
                >
                  <AudioLines className="w-4 h-4" />
                </button>
              ) : (
                <button 
                  onClick={(e) => handleSubmit(e)}
                  disabled={isGenerating}
                  className="w-8 h-8 rounded-full flex items-center justify-center border-none cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background: 'var(--text-primary)', color: 'var(--bg-primary)' }}
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Agent Modes Selector */}
        <div className="flex items-center justify-center mt-6 w-full">
          <div className="flex items-center gap-1 p-1 rounded-full border shadow-sm" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-subtle)' }}>
            {[
              { id: 'auto', label: 'Auto', icon: <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg> },
              { id: 'chat', label: 'Chat', icon: <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>, active: true },
              { id: 'coding', label: 'Coding', icon: <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg> },
              { id: 'pdf', label: 'PDF', icon: <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg> },
              { id: 'ppt', label: 'PPT', icon: <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h20"/><path d="M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3"/><path d="m7 21 5-5 5 5"/></svg> },
              { id: 'image', label: 'Image', icon: <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg> },
              { id: 'search', label: 'Search', icon: <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg> }
            ].map((mode) => (
              <button 
                key={mode.id} 
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[13px] font-medium transition-all cursor-pointer border-none" 
                style={{ 
                  background: mode.active ? 'var(--bg-active)' : 'transparent', 
                  color: mode.active ? 'var(--text-primary)' : 'var(--text-secondary)'
                }}
                onMouseEnter={(e) => { 
                  if (!mode.active) {
                    e.currentTarget.style.background = 'var(--bg-hover)'; 
                    e.currentTarget.style.color = 'var(--text-primary)'; 
                  }
                }}
                onMouseLeave={(e) => { 
                  if (!mode.active) { 
                    e.currentTarget.style.background = 'transparent'; 
                    e.currentTarget.style.color = 'var(--text-secondary)'; 
                  } 
                }}
              >
                {mode.icon}
                {mode.label}
              </button>
            ))}
          </div>
        </div>


      </div>
    </div>
  );
};
