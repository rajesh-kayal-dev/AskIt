import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { setSettingsModalOpen, setTheme, type Theme } from '../../redux/uiSlice';
import { X, Settings, User, Database, FileText, Sun, Moon, Monitor, ChevronDown } from 'lucide-react';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { cn } from '../../lib/utils';

type Tab = 'general' | 'profile' | 'data' | 'about';

export const SettingsModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isSettingsModalOpen, theme } = useAppSelector((state) => state.ui);
  const { user, logout } = useAuth();
  
  const [activeTab, setActiveTab] = useState<Tab>('general');

  if (!isSettingsModalOpen) return null;

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'general', label: 'General', icon: <Settings className="w-[18px] h-[18px]" /> },
    { id: 'profile', label: 'Profile', icon: <User className="w-[18px] h-[18px]" /> },
    { id: 'data', label: 'Data', icon: <Database className="w-[18px] h-[18px]" /> },
    { id: 'about', label: 'About', icon: <FileText className="w-[18px] h-[18px]" /> },
  ];

  const handleLogout = () => {
    logout();
    dispatch(setSettingsModalOpen(false));
  };

  const getInitials = (name: string) => name.charAt(0).toUpperCase();

  const maskEmail = (email: string) => {
    if (!email) return '';
    const parts = email.split('@');
    if (parts.length !== 2) return email;
    const [name, domain] = parts;
    if (name.length <= 4) return email; // Too short to mask well
    const maskedName = name.substring(0, 3) + '*******' + name.substring(name.length - 3);
    return `${maskedName}@${domain}`;
  };

  const GoogleIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );

  return (
    <AnimatePresence>
      {isSettingsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pt-16">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => dispatch(setSettingsModalOpen(false))}
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-[700px] min-h-[450px] flex rounded-2xl overflow-hidden shadow-2xl border"
            style={{ 
              background: 'var(--bg-secondary)', 
              borderColor: 'var(--border-subtle)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button (Absolute positioned top right) */}
            <button
              className="absolute top-4 right-4 p-1.5 rounded-lg transition-colors z-10 hover:bg-[var(--bg-hover)]"
              onClick={() => dispatch(setSettingsModalOpen(false))}
            >
              <X className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
            </button>

            {/* Left Sidebar */}
            <div 
              className="w-[200px] flex flex-col p-4 border-r"
              style={{ borderColor: 'var(--border-subtle)' }}
            >
              <h3 className="text-[15px] font-semibold mb-6 px-2" style={{ color: 'var(--text-primary)' }}>
                Settings
              </h3>
              <nav className="flex flex-col gap-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-xl text-[14px] font-medium transition-all border-none text-left w-full",
                      activeTab === tab.id ? "" : "hover:bg-[var(--bg-hover)]"
                    )}
                    style={{
                      background: activeTab === tab.id ? 'var(--bg-elevated)' : 'transparent',
                      color: activeTab === tab.id ? 'var(--text-primary)' : 'var(--text-secondary)'
                    }}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Right Content Area */}
            <div className="flex-1 p-8 overflow-y-auto" style={{ background: 'var(--bg-secondary)' }}>
              
              {/* General Tab */}
              {activeTab === 'general' && (
                <div className="flex flex-col gap-8 animate-in fade-in duration-300">
                  
                  {/* Theme Section */}
                  <div className="flex flex-col gap-3">
                    <label className="text-[14px] font-medium" style={{ color: 'var(--text-primary)' }}>Theme</label>
                    <div className="grid grid-cols-3 gap-3">
                      {(['light', 'dark', 'system'] as Theme[]).map((t) => (
                        <button
                          key={t}
                          onClick={() => dispatch(setTheme(t))}
                          className="flex flex-col items-center justify-center gap-2 h-20 rounded-xl transition-all cursor-pointer border"
                          style={{
                            background: theme === t ? 'var(--bg-elevated)' : 'transparent',
                            borderColor: theme === t ? 'var(--border-strong)' : 'var(--border-subtle)',
                            color: theme === t ? 'var(--text-primary)' : 'var(--text-secondary)'
                          }}
                        >
                          {t === 'light' && <Sun className="w-5 h-5" />}
                          {t === 'dark' && <Moon className="w-5 h-5" />}
                          {t === 'system' && <Monitor className="w-5 h-5" />}
                          <span className="text-[13px] capitalize">{t}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Language Section */}
                  <div className="flex items-center justify-between">
                    <label className="text-[14px] font-medium" style={{ color: 'var(--text-primary)' }}>Language</label>
                    <button 
                      className="flex items-center gap-2 px-4 py-1.5 rounded-full border-none transition-colors hover:bg-[var(--bg-hover)]"
                      style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)' }}
                    >
                      <span className="text-[13px]">System</span>
                      <ChevronDown className="w-4 h-4 opacity-70" />
                    </button>
                  </div>
                </div>
              )}

              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="flex flex-col gap-6 animate-in fade-in duration-300">
                  <div className="flex items-center justify-between pb-4 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
                    <span className="text-[14px]" style={{ color: 'var(--text-primary)' }}>Name</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[14px] font-medium" style={{ color: 'var(--text-primary)' }}>{user?.name || 'User'}</span>
                      <GoogleIcon />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pb-4 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
                    <span className="text-[14px]" style={{ color: 'var(--text-primary)' }}>Email address</span>
                    <span className="text-[14px]" style={{ color: 'var(--text-secondary)' }}>
                      {maskEmail(user?.email || 'user@example.com')}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between pb-4 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
                    <span className="text-[14px]" style={{ color: 'var(--text-primary)' }}>Phone number</span>
                    <span className="text-[14px]" style={{ color: 'var(--text-secondary)' }}>-</span>
                  </div>
                  
                  <div className="flex items-center justify-between pb-4 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
                    <span className="text-[14px]" style={{ color: 'var(--text-primary)' }}>Log out of all devices</span>
                    <button 
                      className="px-4 py-1.5 rounded-full border text-[13px] font-medium transition-colors hover:bg-red-500/10 cursor-pointer"
                      style={{ borderColor: 'var(--border-strong)', color: '#ef4444', background: 'transparent' }}
                      onClick={handleLogout}
                    >
                      Log out
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-[14px]" style={{ color: 'var(--text-primary)' }}>Delete account</span>
                    <button 
                      className="px-4 py-1.5 rounded-full border text-[13px] font-medium transition-colors hover:bg-red-500/10 cursor-pointer"
                      style={{ borderColor: 'var(--border-strong)', color: '#ef4444', background: 'transparent' }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}

              {/* Data Tab */}
              {activeTab === 'data' && (
                <div className="flex flex-col gap-6 animate-in fade-in duration-300">
                  <div className="flex items-center justify-between pb-4 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
                    <div className="flex flex-col pr-8">
                      <span className="text-[14px] font-medium mb-1" style={{ color: 'var(--text-primary)' }}>Improve the model for everyone</span>
                      <span className="text-[12px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                        Allow your content to be used to train our models and improve our services. We secure your data privacy.
                      </span>
                    </div>
                    {/* Fake Toggle Switch */}
                    <div className="w-10 h-5 rounded-full flex items-center px-0.5 cursor-pointer flex-shrink-0" style={{ background: '#3b82f6' }}>
                      <div className="w-4 h-4 bg-white rounded-full shadow-sm ml-auto"></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pb-4 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
                    <span className="text-[14px] font-medium" style={{ color: 'var(--text-primary)' }}>Shared Links</span>
                    <button 
                      className="px-4 py-1.5 rounded-full border text-[13px] font-medium transition-colors hover:bg-[var(--bg-hover)] cursor-pointer"
                      style={{ borderColor: 'var(--border-strong)', color: 'var(--text-primary)', background: 'transparent' }}
                    >
                      Manage
                    </button>
                  </div>

                  <div className="flex items-center justify-between pb-4 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
                    <div className="flex flex-col pr-8">
                      <span className="text-[14px] font-medium mb-1" style={{ color: 'var(--text-primary)' }}>Export data</span>
                      <span className="text-[12px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                        This data includes your account information and all chat history. Exporting may take some time. The download link will be valid for 7 days.
                      </span>
                    </div>
                    <button 
                      className="px-4 py-1.5 rounded-full border text-[13px] font-medium transition-colors hover:bg-[var(--bg-hover)] cursor-pointer flex-shrink-0"
                      style={{ borderColor: 'var(--border-strong)', color: 'var(--text-primary)', background: 'transparent' }}
                    >
                      Export
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[14px] font-medium" style={{ color: 'var(--text-primary)' }}>Delete all chats</span>
                    <button 
                      className="px-4 py-1.5 rounded-full border text-[13px] font-medium transition-colors hover:bg-red-500/10 cursor-pointer"
                      style={{ borderColor: 'var(--border-strong)', color: '#ef4444', background: 'transparent' }}
                    >
                      Delete all
                    </button>
                  </div>
                </div>
              )}

              {/* About Tab */}
              {activeTab === 'about' && (
                <div className="flex flex-col gap-6 animate-in fade-in duration-300">
                  <div className="flex items-center justify-between pb-4 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
                    <span className="text-[14px]" style={{ color: 'var(--text-primary)' }}>Terms of Use</span>
                    <button 
                      className="px-4 py-1.5 rounded-full border text-[13px] font-medium transition-colors hover:bg-[var(--bg-hover)] cursor-pointer"
                      style={{ borderColor: 'var(--border-strong)', color: 'var(--text-primary)', background: 'transparent' }}
                    >
                      View
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[14px]" style={{ color: 'var(--text-primary)' }}>Privacy Policy</span>
                    <button 
                      className="px-4 py-1.5 rounded-full border text-[13px] font-medium transition-colors hover:bg-[var(--bg-hover)] cursor-pointer"
                      style={{ borderColor: 'var(--border-strong)', color: 'var(--text-primary)', background: 'transparent' }}
                    >
                      View
                    </button>
                  </div>
                </div>
              )}

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
