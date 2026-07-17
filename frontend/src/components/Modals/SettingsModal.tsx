import React from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { setSettingsModalOpen, toggleTheme } from '../../redux/uiSlice';
import { X } from 'lucide-react';

export const SettingsModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isSettingsModalOpen } = useAppSelector((state) => state.ui);

  if (!isSettingsModalOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
      onClick={() => dispatch(setSettingsModalOpen(false))}
    >
      <div
        className="modal-content w-full max-w-md rounded-2xl p-6 scale-in"
        style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-light)',
          boxShadow: 'var(--shadow-lg)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
            Settings
          </h3>
          <button
            className="close-btn w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer border-none transition-all"
            style={{ background: 'transparent', color: 'var(--text-tertiary)' }}
            onClick={() => dispatch(setSettingsModalOpen(false))}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-5">
          {/* Appearance */}
          <div className="p-4 rounded-xl" style={{ background: 'var(--bg-tertiary)' }}>
            <div className="font-medium mb-3" style={{ color: 'var(--text-primary)' }}>
              Appearance
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Dark Mode
              </span>
              <button
                className="theme-toggle"
                aria-label="Toggle dark mode"
                onClick={() => dispatch(toggleTheme())}
              ></button>
            </div>
          </div>

          {/* Notifications */}
          <div className="p-4 rounded-xl" style={{ background: 'var(--bg-tertiary)' }}>
            <div className="font-medium mb-3" style={{ color: 'var(--text-primary)' }}>
              Notifications
            </div>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Sound Effects
              </span>
              <input type="checkbox" defaultChecked className="w-5 h-5 rounded" style={{ accentColor: '#3b82f6' }} />
            </label>
          </div>

          {/* About */}
          <div className="p-4 rounded-xl text-center" style={{ background: 'var(--bg-tertiary)' }}>
            <div className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
              AskIT v1.0.0
            </div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
              AI-Powered Knowledge Assistant
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
