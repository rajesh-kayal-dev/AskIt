import React from 'react';
import { MessageSquare, Send, MessageCircle, Bot, Plus, ArrowUp, Link2, Sparkles, Layout, Edit3, LineChart } from 'lucide-react';
import { useAppDispatch } from '../../redux/hooks';

export const AgentView: React.FC = () => {
  const dispatch = useAppDispatch();

  return (
    <div className="flex-1 flex flex-col items-center justify-center relative overflow-hidden h-full">
      {/* Background Watermark */}
      <div 
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
        style={{ zIndex: 0 }}
      >
        <span 
          className="font-black italic tracking-tighter" 
          style={{ 
            fontFamily: 'sans-serif',
            fontSize: '50rem',
            lineHeight: 1,
            color: 'transparent',
            WebkitTextStroke: '1px rgba(255, 255, 255, 0.08)',
            animation: 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite'
          }}
        >
          AI
        </span>
      </div>

      <div 
        className="relative z-10 w-full max-w-[760px] px-6 flex flex-col items-center mt-[-10vh] opacity-0"
        style={{ animation: 'fade-in-up 0.8s ease-out forwards 0.2s' }}
      >
        
        {/* Headers */}
        <h1 className="text-5xl font-crimson font-medium mb-4" style={{ color: 'var(--text-primary)' }}>
          Create anything you can imagine
        </h1>
        <p className="text-[17px] font-crimson mb-10" style={{ color: 'var(--text-secondary)' }}>
          Interact with askit.ai and explore the boundless creative world
        </p>

        {/* Input Box */}
        <div 
          className="w-full rounded-2xl p-4 flex flex-col justify-between shadow-sm relative transition-all focus-within:ring-1 focus-within:ring-[var(--border-light)]"
          style={{ 
            background: 'var(--bg-elevated)', 
            border: '1px solid var(--border-subtle)',
            minHeight: '140px' 
          }}
        >
          <textarea
            className="w-full bg-transparent border-none outline-none focus:outline-none focus:ring-0 focus:border-transparent resize-none text-[15px] placeholder:text-[var(--text-muted)]"
            placeholder="Send a Message"
            rows={2}
            style={{ color: 'var(--text-primary)', boxShadow: 'none' }}
          />

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2">
              <button 
                className="w-8 h-8 rounded-lg flex items-center justify-center border-none cursor-pointer hover:bg-[var(--bg-hover)] transition-colors"
                style={{ background: 'transparent', color: 'var(--text-secondary)' }}
              >
                <Plus className="w-5 h-5" />
              </button>
              
              <button 
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-none cursor-pointer transition-colors text-xs font-semibold"
                style={{ background: 'var(--bg-hover)', color: 'var(--text-primary)' }}
              >
                <Sparkles className="w-3.5 h-3.5" />
                PPT Agent
              </button>
            </div>

            <button 
              className="w-8 h-8 rounded-full flex items-center justify-center border-none cursor-pointer transition-colors"
              style={{ background: 'var(--bg-hover)', color: 'var(--text-muted)' }}
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tags Row */}
        <div className="flex items-center justify-center gap-3 mt-6">
          <button className="flex items-center gap-1.5 px-3 py-1 rounded-md border text-xs cursor-pointer hover:bg-[var(--bg-hover)] transition-colors" style={{ borderColor: 'var(--border-subtle)', background: 'transparent', color: 'var(--text-secondary)' }}>
            <MessageSquare className="w-3.5 h-3.5" /> IM
          </button>
          <span className="text-[var(--border-light)]">|</span>
          <button className="flex items-center gap-1.5 px-3 py-1 rounded-md border text-xs cursor-pointer hover:bg-[var(--bg-hover)] transition-colors" style={{ borderColor: 'var(--border-subtle)', background: 'transparent', color: 'var(--text-secondary)' }}>
            <Layout className="w-3.5 h-3.5" /> Full-Stack
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1 rounded-md border text-xs cursor-pointer hover:bg-[var(--bg-hover)] transition-colors" style={{ borderColor: 'var(--border-subtle)', background: 'transparent', color: 'var(--text-secondary)' }}>
            <Edit3 className="w-3.5 h-3.5" /> Writing
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1 rounded-md border text-xs cursor-pointer hover:bg-[var(--bg-hover)] transition-colors" style={{ borderColor: 'var(--border-subtle)', background: 'transparent', color: 'var(--text-secondary)' }}>
            <LineChart className="w-3.5 h-3.5" /> Data Insight
          </button>
        </div>

        {/* Integrations Grid */}
        <div className="grid grid-cols-2 gap-4 mt-8 w-full">
          {/* Discord */}
          <div 
            className="flex items-center justify-between p-4 rounded-xl border transition-colors hover:bg-[var(--bg-hover)]"
            style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border-subtle)' }}
          >
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-[#5865F2] flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Discord</span>
              </div>
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Always on standby in your community.</span>
            </div>
            <button className="px-4 py-1.5 rounded-full border-none font-semibold text-xs cursor-pointer hover:opacity-90" style={{ background: '#fff', color: '#000' }}>
              Connect
            </button>
          </div>

          {/* Lark */}
          <div 
            className="flex items-center justify-between p-4 rounded-xl border transition-colors hover:bg-[var(--bg-hover)]"
            style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border-subtle)' }}
          >
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-[#00D6B9] flex items-center justify-center">
                  <Link2 className="w-4 h-4 text-white" />
                </div>
                <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Lark</span>
              </div>
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Need a assistant? @ me in Lark.</span>
            </div>
            <button className="px-4 py-1.5 rounded-full border-none font-semibold text-xs cursor-pointer hover:opacity-90" style={{ background: '#fff', color: '#000' }}>
              Connect
            </button>
          </div>

          {/* WeChat */}
          <div 
            className="flex items-center justify-between p-4 rounded-xl border transition-colors hover:bg-[var(--bg-hover)]"
            style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border-subtle)' }}
          >
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-[#07C160] flex items-center justify-center">
                  <MessageCircle className="w-4 h-4 text-white" />
                </div>
                <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>WeChat</span>
              </div>
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Access WeChat. @ me anytime to work.</span>
            </div>
            <button className="px-4 py-1.5 rounded-full border-none font-semibold text-xs cursor-pointer hover:opacity-90" style={{ background: '#fff', color: '#000' }}>
              Connect
            </button>
          </div>

          {/* Telegram */}
          <div 
            className="flex items-center justify-between p-4 rounded-xl border transition-colors hover:bg-[var(--bg-hover)]"
            style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border-subtle)' }}
          >
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[#2AABEE] flex items-center justify-center">
                  <Send className="w-3.5 h-3.5 text-white ml-[-1px]" />
                </div>
                <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Telegram</span>
              </div>
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Quick reply wherever you are.</span>
            </div>
            <button className="px-4 py-1.5 rounded-full border-none font-semibold text-[11px] cursor-not-allowed" style={{ background: 'var(--bg-hover)', color: 'var(--text-muted)' }}>
              Coming soon
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
