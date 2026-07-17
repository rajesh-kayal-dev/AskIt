import React from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { setSidebarOpen, toggleSidebar } from '../../redux/uiSlice';
import { Menu, ChevronDown, Share, Share2, MoreVertical, PanelLeft } from 'lucide-react';

export const ChatHeader: React.FC = () => {
  const dispatch = useAppDispatch();
  const { chats, currentChatId, messages, model } = useAppSelector((state) => state.chat);
  const { isSidebarOpen } = useAppSelector((state) => state.ui);

  const currentChat = chats.find(c => c.id === currentChatId);

  return (
    <header
      className="sticky top-0 z-20 w-full h-16 px-4 lg:px-6 flex items-center justify-between"
      style={{
        background: 'var(--bg-primary)',
        backdropFilter: 'blur(12px)',
      }}
    >
      <div className="flex items-center gap-3">
        {/* Mobile Menu Toggle */}
        <button
          className="lg:hidden w-10 h-10 rounded-lg flex items-center justify-center cursor-pointer border-none transition-all duration-200 hover:bg-[var(--bg-hover)]"
          style={{ background: 'transparent' }}
          onClick={() => dispatch(setSidebarOpen(true))}
          aria-label="Open sidebar"
        >
          <Menu className="w-6 h-6" style={{ strokeWidth: 2, color: 'var(--text-secondary)' }} />
        </button>

        <div className="flex items-center gap-1">
          <button
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[15px] font-semibold cursor-pointer transition-colors hover:bg-[var(--bg-hover)] border-none"
            style={{
              background: 'transparent',
              color: 'var(--text-primary)',
            }}
            aria-label="Select model"
          >
            <span className="tracking-wide text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">GLM-5V-Turbo</span>
            <ChevronDown className="w-4 h-4 opacity-40" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Share Button */}
        <button
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold cursor-pointer transition-all hover:bg-[var(--bg-hover)]"
          style={{ 
            background: 'transparent', 
            borderColor: 'var(--border-subtle)',
            color: 'var(--text-secondary)'
          }}
          aria-label="Share conversation"
        >
          <Share className="w-3.5 h-3.5" />
          <span>Share</span>
        </button>
      </div>
    </header>
  );
};
