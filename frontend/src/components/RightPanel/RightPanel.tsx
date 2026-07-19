import React from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { setPanelOpen } from '../../redux/uiSlice';
import { X, FileCode, PanelRightOpen, Info } from 'lucide-react';
import { cn } from '../../lib/utils';

export const RightPanel: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isPanelOpen } = useAppSelector((state) => state.ui);
  const { conversations, currentConversationId, topics, files, messages, model } = useAppSelector((state) => state.chat);

  const currentChat = conversations.find(c => c.id === currentConversationId);

  return (
    <>
      <aside
        className={cn(
          'right-panel-container w-[320px] h-screen border-l overflow-y-auto fixed right-0 top-0 lg:relative z-40 hidden lg:block',
          !isPanelOpen && 'closed'
        )}
        style={{
          background: 'var(--bg-secondary)',
          borderColor: 'var(--border-subtle)',
        }}
      >
        {/* Panel Header with Close Button */}
        <div
          className="sticky top-0 z-10 py-5 px-5 pb-4 border-b flex items-start justify-between"
          style={{
            background: 'var(--bg-secondary)',
            borderColor: 'var(--border-subtle)',
          }}
        >
          <div>
            <h3 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
              Conversation Info
            </h3>
          </div>
          <button
            className="close-btn w-7 h-7 rounded-md flex items-center justify-center cursor-pointer border-none transition-all"
            style={{ background: 'transparent', color: 'var(--text-tertiary)' }}
            onClick={() => dispatch(setPanelOpen(false))}
            title="Close panel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Panel Content */}
        <div className="py-5 px-5 space-y-6">
          {/* Metadata Section */}
          <div className="space-y-4">
            <div>
              <div
                className="text-[11px] font-semibold uppercase tracking-wide mb-1.5"
                style={{ color: 'var(--text-muted)' }}
              >
                Created
              </div>
              <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {'Just now'}
              </div>
            </div>

            <div>
              <div
                className="text-[11px] font-semibold uppercase tracking-wide mb-1.5"
                style={{ color: 'var(--text-muted)' }}
              >
                Messages
              </div>
              <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {messages.length}
              </div>
            </div>

            <div>
              <div
                className="text-[11px] font-semibold uppercase tracking-wide mb-1.5"
                style={{ color: 'var(--text-muted)' }}
              >
                Model
              </div>
              <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {model}
              </div>
            </div>

            <div>
              <div
                className="text-[11px] font-semibold uppercase tracking-wide mb-1.5"
                style={{ color: 'var(--text-muted)' }}
              >
                Status
              </div>
              <div className="text-sm flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Active
              </div>
            </div>
          </div>

          {/* Topics Section */}
          <div className="pt-4 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
            <div
              className="text-[11px] font-semibold uppercase tracking-wide mb-3"
              style={{ color: 'var(--text-muted)' }}
            >
              Topics Discussed
            </div>
            <div className="flex flex-wrap gap-2">
              {topics.map((topic, idx) => (
                <span
                  key={idx}
                  className="inline-flex px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-all hover:scale-105"
                  style={{ background: 'var(--bg-hover)', color: 'var(--text-secondary)' }}
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>

          {/* Shared Files Section */}
          <div className="pt-4 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
            <div
              className="text-[11px] font-semibold uppercase tracking-wide mb-3"
              style={{ color: 'var(--text-muted)' }}
            >
              Shared Files
            </div>
            <div className="space-y-2">
              {files.map((file, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all hover:bg-[var(--bg-hover)]"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  <FileCode className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--text-tertiary)' }} />
                  <span className="text-sm flex-1 truncate">{file.name}</span>
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{file.size}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons (Sticky Bottom) */}
        <div
          className="sticky bottom-0 py-5 px-5 border-t space-y-2"
          style={{
            borderColor: 'var(--border-subtle)',
            background: 'linear-gradient(to top, var(--bg-secondary) 0%, var(--bg-secondary) 90%, transparent 100%)',
          }}
        >
          <button
            className="btn-interact w-full py-2.5 px-4 rounded-lg border text-sm font-medium cursor-pointer transition-all hover:bg-[var(--bg-hover)] hover:border-[var(--border-medium)]"
            style={{
              border: '1px solid var(--border-light)',
              background: 'transparent',
              color: 'var(--text-secondary)',
            }}
          >
            Export Chat
          </button>
          <button
            className="btn-interact w-full py-2.5 px-4 rounded-lg border text-sm font-medium cursor-pointer transition-all hover:bg-red-500/10"
            style={{
              border: '1px solid rgba(239,68,68,0.25)',
              background: 'transparent',
              color: '#ef4444',
            }}
          >
            Delete Chat
          </button>
        </div>
      </aside>

      {/* Panel Toggle Button (Desktop) */}
      {!isPanelOpen && (
        <button
          className="hidden lg:flex fixed right-0 top-1/2 -translate-y-1/2 w-6 h-12 rounded-l-lg cursor-pointer z-30 items-center justify-center shadow-lg transition-all duration-200 hover:pr-1 border-none"
          style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-light) 1px solid transparent 0px' }}
          onClick={() => dispatch(setPanelOpen(true))}
          title="Toggle context panel"
        >
          <PanelRightOpen className="w-4 h-4 panel-icon transition-transform duration-200" style={{ color: 'var(--text-tertiary)' }} />
        </button>
      )}

      {/* Panel Toggle Button (Mobile) */}
      <button
        className="lg:hidden fixed right-4 bottom-24 w-12 h-12 rounded-full cursor-pointer z-30 shadow-lg flex items-center justify-center transition-all hover:scale-110 border-none"
        style={{ background: 'var(--gradient-button)' }}
        onClick={() => dispatch(setPanelOpen(true))}
        title="Context info"
      >
        <Info className="w-5 h-5 text-white" />
      </button>
    </>
  );
};
