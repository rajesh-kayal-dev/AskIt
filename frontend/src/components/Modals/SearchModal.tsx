import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { setSearchModalOpen } from '../../redux/uiSlice';
import { Search, X, MessageSquare } from 'lucide-react';
import { cn } from '../../lib/utils';

export const SearchModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isSearchModalOpen } = useAppSelector((state) => state.ui);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when modal opens
  useEffect(() => {
    if (isSearchModalOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isSearchModalOpen]);

  // Handle keyboard shortcuts (Escape to close)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSearchModalOpen) {
        dispatch(setSearchModalOpen(false));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchModalOpen, dispatch]);

  // mock results imitating the UI screenshot
  const mockResults = [
    {
      id: 1,
      title: 'Backend Architecture for AI SaaS',
      date: '4/22',
      snippet: '...backend - a clean, modular, production-ready Node.js project structure that separates c...',
    },
    {
      id: 2,
      title: 'Backend Architecture for AI SaaS',
      date: '4/22',
      snippet: 'You are a senior backend engineer and mentor. Your task is to help me build a production-l...',
    },
    {
      id: 3,
      title: 'Backend Architecture for AI SaaS',
      date: '4/22',
      snippet: '...for DataPilotAI - a production-grade AI SaaS platform with: - Document processing pipeli...',
    },
    {
      id: 4,
      title: 'Backend Architecture for AI SaaS',
      date: '4/22',
      snippet: 'You are a senior backend engineer and AI system architect with 10+ years of experience b...',
    },
  ];

  return (
    <AnimatePresence>
      {isSearchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
            onClick={() => dispatch(setSearchModalOpen(false))}
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-[650px] flex flex-col rounded-2xl shadow-2xl overflow-hidden border"
            style={{ 
              background: 'var(--bg-secondary)', 
              borderColor: 'var(--border-subtle)',
            }}
          >
            {/* Search Input Area */}
            <div 
              className="flex items-center px-4 py-3 border-b"
              style={{ borderColor: 'var(--border-subtle)', background: 'var(--bg-elevated)' }}
            >
              <Search className="w-[18px] h-[18px] mr-3" style={{ color: 'var(--text-tertiary)' }} />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search chat content..."
                className="flex-1 bg-transparent border-none outline-none focus:outline-none focus:ring-0 focus:ring-offset-0 focus:border-none text-[15px] shadow-none focus:shadow-none"
                style={{ color: 'var(--text-primary)' }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                className="p-1 rounded-md cursor-pointer transition-colors hover:bg-[var(--bg-hover)]"
                onClick={() => {
                  if (searchQuery) {
                    setSearchQuery('');
                  } else {
                    dispatch(setSearchModalOpen(false));
                  }
                }}
              >
                <X className="w-[18px] h-[18px]" style={{ color: 'var(--text-tertiary)' }} />
              </button>
            </div>

            {/* Filters Row */}
            <div 
              className="px-4 py-2 flex items-center gap-2 border-b"
              style={{ borderColor: 'var(--border-subtle)', background: 'var(--bg-primary)' }}
            >
              {['and', 'are', 'all'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={cn(
                    "px-4 py-1 text-xs font-medium rounded-full cursor-pointer transition-all border-none",
                    activeFilter === filter ? "" : "hover:bg-[var(--bg-hover)]"
                  )}
                  style={{
                    background: activeFilter === filter ? 'var(--bg-hover)' : 'transparent',
                    color: activeFilter === filter ? 'var(--text-primary)' : 'var(--text-secondary)'
                  }}
                >
                  {filter}
                </button>
              ))}
            </div>

            {/* Results List */}
            <div 
              className="flex flex-col max-h-[50vh] overflow-y-auto"
              style={{ background: 'var(--bg-primary)' }}
            >
              {mockResults.map((result) => (
                <div 
                  key={result.id}
                  className="flex flex-col px-4 py-3 cursor-pointer transition-colors border-b last:border-b-0 hover:bg-[var(--bg-hover)]"
                  style={{ borderColor: 'var(--border-subtle)' }}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 relative mt-0.5" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
                      <MessageSquare className="w-4 h-4 opacity-70" />
                      <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] font-bold text-white bg-[#0ea5e9] border border-[var(--bg-primary)]">
                        R
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-[14px] font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                          {result.title}
                        </h4>
                        <span className="text-[12px] flex-shrink-0 ml-4" style={{ color: 'var(--text-tertiary)' }}>
                          {result.date}
                        </span>
                      </div>
                      <p className="text-[13px] leading-relaxed truncate" style={{ color: 'var(--text-secondary)' }}>
                        {result.snippet}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
