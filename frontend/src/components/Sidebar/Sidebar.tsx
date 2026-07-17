import React, { useState, useRef, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { setSidebarOpen, toggleTheme, setSettingsModalOpen, toggleSidebar, setActiveView, setSearchModalOpen } from '../../redux/uiSlice';
import { X, Plus, Search, Settings, HelpCircle, ChevronRight, LogOut, PanelLeft, SquarePen, Bot, Presentation, MessageSquare, Code, Image, FileText } from 'lucide-react';
import { ChatList } from './ChatList';
import { cn } from '../../lib/utils';
import { useAuth } from '../../features/auth/hooks/useAuth';

export const Sidebar: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isSidebarOpen, activeView } = useAppSelector((state) => state.ui);

  const { user, logout } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const firstName = user?.name ? user.name.split(' ')[0] : 'User';
  const initials = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    <>
      <aside
        className={cn(
          'sidebar-container group/sidebar w-[260px] h-screen flex flex-col fixed lg:relative z-30 transition-all duration-300',
          !isSidebarOpen && 'closed'
        )}
        style={{
          background: 'var(--bg-secondary)',
          borderRight: '1px solid var(--border-subtle)',
        }}
      >
        {/* Sidebar Header with Close Button */}
        <div className={cn("h-14 flex items-center transition-all", isSidebarOpen ? "justify-between px-4" : "justify-center px-0")}>
          {isSidebarOpen ? (
            <>
              <div className="flex items-center gap-2 overflow-hidden mt-1">
                <img src="/AskIt_Logo.png" alt="AskIT Logo" className="w-8 h-8 object-contain" />
                <span className="text-[1.4rem] font-semibold tracking-wide lowercase opacity-70" style={{ color: 'var(--text-primary)', fontFamily: "'Outfit', sans-serif" }}>askit</span>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0 mt-1">
                <button
                  className="w-7 h-7 rounded-md hidden lg:flex items-center justify-center cursor-pointer border-none transition-all duration-200 hover:bg-[var(--bg-hover)]"
                  style={{ background: 'transparent' }}
                  onClick={() => dispatch(setSearchModalOpen(true))}
                  title="Search"
                >
                  <Search className="w-[18px] h-[18px]" style={{ color: 'var(--text-secondary)' }} />
                </button>
                <button
                  className="w-7 h-7 rounded-md hidden lg:flex items-center justify-center cursor-pointer border-none transition-all duration-200 hover:bg-[var(--bg-hover)]"
                  style={{ background: 'transparent' }}
                  onClick={() => dispatch(toggleSidebar())}
                  title="Close sidebar"
                >
                  <PanelLeft className="w-[18px] h-[18px]" style={{ color: 'var(--text-secondary)' }} />
                </button>
                <button
                  className="close-btn w-7 h-7 rounded-md flex items-center justify-center cursor-pointer border-none transition-all lg:hidden hover:bg-[var(--bg-hover)]"
                  style={{ background: 'transparent', color: 'var(--text-tertiary)' }}
                  onClick={() => dispatch(setSidebarOpen(false))}
                  aria-label="Close sidebar"
                  title="Close sidebar"
                >
                  <X className="w-[18px] h-[18px]" />
                </button>
              </div>
            </>
          ) : (
            <button 
              className="w-10 h-10 mt-1 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-200 border-none hover:bg-[var(--bg-hover)]" 
              style={{ background: 'transparent' }}
              onClick={() => dispatch(toggleSidebar())} 
              title="Open sidebar"
            >
              <img src="/AskIt_Logo.png" alt="AskIT Logo" className="w-7 h-7 object-contain block group-hover/sidebar:hidden" />
              <PanelLeft className="w-5 h-5 hidden group-hover/sidebar:block" style={{ color: 'var(--text-secondary)' }} />
            </button>
          )}
        </div>

        {/* Top Menu Items */}
        <div className={cn("mt-4 flex flex-col gap-1 transition-all", isSidebarOpen ? "px-3" : "px-2 items-center")}>
          <div className={cn("p-1 flex flex-col gap-0.5", isSidebarOpen ? "w-full" : "w-11")}
               style={{ background: 'transparent' }}>
            <button 
              className={cn(
                "flex items-center overflow-hidden transition-all cursor-pointer",
                isSidebarOpen ? "gap-2.5 w-full px-3 py-2 rounded-lg" : "justify-center w-full h-9 rounded-lg"
              )}
              style={{
                background: activeView === 'chat' ? 'var(--bg-active)' : 'transparent',
                color: activeView === 'chat' ? 'var(--text-primary)' : 'var(--text-secondary)',
                border: activeView === 'chat' ? '1px solid var(--border-subtle)' : '1px solid transparent',
                boxShadow: activeView === 'chat' ? 'var(--shadow-sm)' : 'none',
              }}
              onMouseEnter={(e) => { if (activeView !== 'chat') e.currentTarget.style.background = 'var(--bg-hover)' }}
              onMouseLeave={(e) => { if (activeView !== 'chat') e.currentTarget.style.background = 'transparent' }}
              onClick={() => dispatch(setActiveView('chat'))}
              title="Chat"
            >
              <SquarePen className="w-[15px] h-[15px] flex-shrink-0" />
              {isSidebarOpen && <span className="text-[13px] font-medium whitespace-nowrap">Chat</span>}
            </button>
            
            <button 
              className={cn(
                "flex items-center overflow-hidden transition-all cursor-pointer",
                isSidebarOpen ? "gap-2.5 w-full px-3 py-2 rounded-lg" : "justify-center w-full h-9 rounded-lg"
              )}
              style={{
                background: activeView === 'agent' ? 'var(--bg-active)' : 'transparent',
                color: activeView === 'agent' ? 'var(--text-primary)' : 'var(--text-secondary)',
                border: activeView === 'agent' ? '1px solid var(--border-subtle)' : '1px solid transparent',
                boxShadow: activeView === 'agent' ? 'var(--shadow-sm)' : 'none',
              }}
              onMouseEnter={(e) => { if (activeView !== 'agent') e.currentTarget.style.background = 'var(--bg-hover)' }}
              onMouseLeave={(e) => { if (activeView !== 'agent') e.currentTarget.style.background = 'transparent' }}
              onClick={() => dispatch(setActiveView('agent'))}
              title="Agent"
            >
              <Bot className="w-[15px] h-[15px] flex-shrink-0" />
              {isSidebarOpen && <span className="text-[13px] font-medium whitespace-nowrap">Agent</span>}
            </button>
          </div>

          <div className={cn("mt-3 flex flex-col gap-0.5", isSidebarOpen ? "w-full" : "w-11")}>
            <button 
              className={cn(
                "flex items-center overflow-hidden transition-colors border-none cursor-pointer text-[13px] font-medium hover:bg-[var(--bg-hover)]",
                isSidebarOpen ? "gap-2.5 w-full px-4 py-2 rounded-lg" : "justify-center w-full h-11 rounded-xl"
              )}
              style={{ background: 'transparent', color: 'var(--text-secondary)' }}
              title="New Task"
            >
              <Plus className="w-[15px] h-[15px] flex-shrink-0 opacity-70" />
              {isSidebarOpen && <span className="whitespace-nowrap">New Task</span>}
            </button>

            <button 
              className={cn(
                "flex items-center overflow-hidden transition-colors border-none cursor-pointer text-[13px] font-medium opacity-90 hover:opacity-100",
                isSidebarOpen ? "gap-2.5 w-full px-4 py-2 rounded-lg" : "justify-center w-full h-11 rounded-xl"
              )}
              style={{ background: 'transparent', color: 'var(--text-primary)' }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-hover)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              title="AI PPT"
            >
              <Presentation className="w-[15px] h-[15px] flex-shrink-0" />
              {isSidebarOpen && <span className="whitespace-nowrap">AI PPT</span>}
            </button>
          </div>
        </div>

        {/* Recent Chats Section */}
        <div className="mt-6 flex-1 overflow-y-auto flex flex-col overflow-x-hidden">
          {isSidebarOpen ? (
             <ChatList />
          ) : (
            <div className="flex flex-col items-center gap-3 px-2">
              <button
                className="w-11 h-11 rounded-xl flex items-center justify-center cursor-pointer transition-all hover:bg-[var(--bg-hover)] border-none"
                style={{ background: 'transparent', color: 'var(--text-secondary)' }}
                onClick={() => dispatch(setSearchModalOpen(true))}
                title="Search"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* User Profile (Bottom) */}
        <div className={cn("relative flex transition-all", isSidebarOpen ? "p-3" : "p-3 justify-center")} ref={userMenuRef}>
          {isUserMenuOpen && (
            <div 
              className={cn("absolute rounded-xl border shadow-lg z-50 scale-in", isSidebarOpen ? "bottom-full left-3 right-3 mb-2 py-2" : "left-full bottom-0 ml-2 py-2 w-48")} 
              style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border-subtle)' }}
            >
              <button
                className="w-full px-4 py-2 flex items-center gap-3 text-[13px] cursor-pointer border-none text-left transition-colors hover:bg-[var(--bg-hover)]"
                style={{ color: 'var(--text-primary)', background: 'transparent' }}
                onClick={() => {
                  dispatch(setSettingsModalOpen(true));
                  setIsUserMenuOpen(false);
                }}
              >
                <Settings className="w-[15px] h-[15px] flex-shrink-0" style={{ color: 'var(--text-secondary)' }} />
                Settings
              </button>
              
              <button
                className="w-full px-4 py-2 flex items-center gap-3 text-[13px] cursor-pointer border-none text-left transition-colors hover:bg-[var(--bg-hover)]"
                style={{ color: 'var(--text-primary)', background: 'transparent' }}
              >
                <HelpCircle className="w-[15px] h-[15px] flex-shrink-0" style={{ color: 'var(--text-secondary)' }} />
                Help & Support
              </button>
              
              <div className="h-px my-1.5 mx-3" style={{ background: 'var(--border-subtle)' }}></div>
              
              <button
                className="w-full px-4 py-2 flex items-center gap-3 text-[13px] cursor-pointer border-none text-left transition-colors hover:bg-red-500/10 hover:text-red-500"
                style={{ color: '#ef4444', background: 'transparent' }}
                onClick={() => {
                  logout();
                  setIsUserMenuOpen(false);
                }}
              >
                <LogOut className="w-[15px] h-[15px] flex-shrink-0" />
                Log Out
              </button>
            </div>
          )}

          <button
            className={cn("flex items-center gap-3 rounded-lg cursor-pointer transition-all duration-200 border-none hover:bg-[var(--bg-hover)] group/userbtn", isSidebarOpen ? "w-full p-1.5" : "w-11 h-11 justify-center p-0")}
            style={{ background: 'transparent' }}
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            title="User menu"
          >
            <div
              className={cn("rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0 bg-[#0ea5e9]", isSidebarOpen ? "w-[26px] h-[26px] text-[11px]" : "w-[30px] h-[30px] text-[12px]")}
            >
              {initials}
            </div>
            {isSidebarOpen && (
              <>
                <div className="flex-1 min-w-0 text-left overflow-hidden">
                  <div className="text-[13px] font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                    {firstName}
                  </div>
                </div>
                <Settings 
                  className="w-[15px] h-[15px] flex-shrink-0 opacity-0 group-hover/userbtn:opacity-100 transition-opacity" 
                  style={{ color: 'var(--text-muted)' }}
                />
              </>
            )}
          </button>
        </div>
      </aside>

      {/* Sidebar Overlay (Mobile) */}
      <div
        className={cn(
          'overlay fixed inset-0 z-20 lg:hidden',
          !isSidebarOpen && 'hidden'
        )}
        style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
        onClick={() => dispatch(setSidebarOpen(false))}
        aria-hidden="true"
      ></div>
    </>
  );
};
