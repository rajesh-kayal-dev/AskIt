import React from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { setArtifactPanelOpen } from '../../redux/uiSlice';
import { X, Copy, Download, Maximize2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { MarkdownRenderer } from '../ChatArea/MarkdownRenderer';

export const ArtifactPanel: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isArtifactPanelOpen, activeArtifact } = useAppSelector((state) => state.ui);

  if (!activeArtifact) return null;

  return (
    <aside
      className={cn(
        'right-panel-container w-[450px] h-screen border-l flex flex-col fixed right-0 top-0 lg:relative z-50',
        !isArtifactPanelOpen && 'hidden'
      )}
      style={{
        background: 'var(--bg-primary)',
        borderColor: 'var(--border-subtle)',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between py-3 px-4 border-b"
        style={{ borderColor: 'var(--border-subtle)', background: 'var(--bg-secondary)' }}
      >
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider px-2 py-1 rounded" style={{ background: 'var(--bg-hover)', color: 'var(--text-secondary)' }}>
            {activeArtifact.artifactType}
          </span>
          <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
            {activeArtifact.language || "Output"}
          </span>
        </div>
        
        <div className="flex items-center gap-1">
          <button className="w-8 h-8 flex items-center justify-center rounded transition-all hover:bg-[var(--bg-hover)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] cursor-pointer bg-transparent border-none" title="Copy">
            <Copy className="w-4 h-4" />
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded transition-all hover:bg-[var(--bg-hover)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] cursor-pointer bg-transparent border-none" title="Download">
            <Download className="w-4 h-4" />
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded transition-all hover:bg-[var(--bg-hover)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] cursor-pointer bg-transparent border-none" title="Expand">
            <Maximize2 className="w-4 h-4" />
          </button>
          <div className="w-px h-4 mx-1" style={{ background: 'var(--border-light)' }}></div>
          <button
            className="w-8 h-8 flex items-center justify-center rounded transition-all hover:bg-red-500/10 text-[var(--text-tertiary)] hover:text-red-500 cursor-pointer bg-transparent border-none"
            onClick={() => dispatch(setArtifactPanelOpen(false))}
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-6" style={{ background: 'var(--bg-primary)' }}>
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <MarkdownRenderer 
            content={
              activeArtifact.artifactType === 'code' 
                ? "```" + (activeArtifact.language || '') + "\n" + activeArtifact.content + "\n```" 
                : activeArtifact.content
            } 
          />
        </div>
      </div>
    </aside>
  );
};
