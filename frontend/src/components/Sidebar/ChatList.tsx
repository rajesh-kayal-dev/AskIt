import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  setCurrentConversationId,
  setMessages,
  setIsLoadingMessages,
  updateConversationTitle,
  removeConversation,
  startNewChat,
} from '../../redux/chatSlice';
import { chatHistoryService } from '../../services/api';
import { MoreHorizontal, Edit2, Trash2, Check, X, Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

export const ChatList: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { conversations, currentConversationId, isLoadingHistory } = useAppSelector((state) => state.chat);

  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [loadingConvId, setLoadingConvId] = useState<string | null>(null);

  const menuRef = useRef<HTMLDivElement>(null);
  const renameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (renamingId && renameInputRef.current) {
      renameInputRef.current.focus();
      renameInputRef.current.select();
    }
  }, [renamingId]);

  // ── Group conversations by date ──────────────────────────────────────────
  const groupedConversations = conversations.reduce((acc, conv) => {
    const group = conv.group;
    if (!acc[group]) acc[group] = [];
    acc[group].push(conv);
    return acc;
  }, {} as Record<string, typeof conversations>);

  const groupOrder = ['Today', 'Previous 7 days', 'Previous 30 days', 'Older'];
  const orderedGroups = groupOrder
    .filter(g => groupedConversations[g]?.length > 0)
    .map(g => ({ name: g, conversations: groupedConversations[g] }));

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleSelectConversation = (convId: string) => {
    if (convId === currentConversationId) return;
    setOpenMenuId(null);
    navigate(`/c/${convId}`);
  };


  const handleStartRename = (id: string, currentTitle: string) => {
    setOpenMenuId(null);
    setRenamingId(id);
    setRenameValue(currentTitle);
  };

  const handleRenameSubmit = async (id: string) => {
    const trimmed = renameValue.trim();
    if (!trimmed) {
      setRenamingId(null);
      return;
    }
    try {
      await chatHistoryService.renameConversation(id, trimmed);
      dispatch(updateConversationTitle({ id, title: trimmed }));
    } catch (err) {
      console.error('Failed to rename:', err);
    } finally {
      setRenamingId(null);
    }
  };

  const handleRenameKeyDown = (e: React.KeyboardEvent, id: string) => {
    if (e.key === 'Enter') handleRenameSubmit(id);
    if (e.key === 'Escape') setRenamingId(null);
  };

  const handleDeleteClick = (id: string) => {
    setOpenMenuId(null);
    setDeleteConfirmId(id);
  };

  const confirmDelete = async () => {
    if (!deleteConfirmId) return;
    
    const id = deleteConfirmId;
    setDeleteConfirmId(null);
    setDeletingId(id);
    
    try {
      await chatHistoryService.deleteConversation(id);
      dispatch(removeConversation(id));
      // If deleting active conversation, start fresh
      if (id === currentConversationId) {
        dispatch(startNewChat());
      }
    } catch (err) {
      console.error('Failed to delete:', err);
    } finally {
      setDeletingId(null);
    }
  };

  // ── Empty / Loading states ────────────────────────────────────────────────
  if (isLoadingHistory) {
    return (
      <div className="flex flex-col gap-2 px-3 mt-2">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="h-8 rounded-md animate-pulse"
            style={{ background: 'var(--bg-hover)', opacity: 0.5 + i * 0.1 }}
          />
        ))}
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="px-4 py-6 text-center">
        <p className="text-[12px]" style={{ color: 'var(--text-muted)' }}>
          No conversations yet
        </p>
        <p className="text-[11px] mt-1" style={{ color: 'var(--text-muted)', opacity: 0.7 }}>
          Start a new chat to begin
        </p>
      </div>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-4 pb-4">
      {orderedGroups.map((group) => (
        <div key={group.name} className="flex flex-col gap-0.5">
          <div className="text-[11px] font-semibold px-3 pb-1 pt-1 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
            {group.name}
          </div>

          {group.conversations.map((conv) => {
            const isActive = conv.id === currentConversationId;
            const isRenaming = renamingId === conv.id;
            const isDeleting = deletingId === conv.id;
            const isLoadingThis = loadingConvId === conv.id;

            return (
              <div key={conv.id} className="relative group/chat">
                {isRenaming ? (
                  // ── Inline Rename Input ──────────────────────────────────
                  <div
                    className="flex items-center gap-1 mx-1 px-2 py-1 rounded-md"
                    style={{ background: 'var(--bg-active)', border: '1px solid var(--border-light)' }}
                  >
                    <input
                      ref={renameInputRef}
                      value={renameValue}
                      onChange={(e) => setRenameValue(e.target.value)}
                      onKeyDown={(e) => handleRenameKeyDown(e, conv.id)}
                      className="flex-1 bg-transparent border-none outline-none text-[13px]"
                      style={{ color: 'var(--text-primary)' }}
                    />
                    <button
                      onClick={() => handleRenameSubmit(conv.id)}
                      className="w-5 h-5 flex items-center justify-center rounded border-none cursor-pointer hover:text-green-400 transition-colors"
                      style={{ background: 'transparent', color: 'var(--text-secondary)' }}
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setRenamingId(null)}
                      className="w-5 h-5 flex items-center justify-center rounded border-none cursor-pointer hover:text-red-400 transition-colors"
                      style={{ background: 'transparent', color: 'var(--text-secondary)' }}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  // ── Normal Chat Item ─────────────────────────────────────
                  <button
                    className={cn(
                      'w-full h-9 px-3 rounded-md cursor-pointer text-left flex items-center justify-between border-none transition-colors relative z-10',
                      isActive ? 'bg-[var(--bg-active)]' : 'bg-transparent hover:bg-[var(--bg-hover)]',
                      isDeleting && 'opacity-40'
                    )}
                    onClick={() => handleSelectConversation(conv.id)}
                    disabled={isDeleting}
                    aria-label={`${conv.title} conversation`}
                  >
                    <div
                      className="text-[13.5px] truncate flex-1 pr-6 font-medium"
                      style={{ color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)' }}
                    >
                      {isLoadingThis ? (
                        <span className="flex items-center gap-1.5">
                          <Loader2 className="w-3 h-3 animate-spin" />
                          {conv.title}
                        </span>
                      ) : conv.title}
                    </div>

                    {/* Menu button — show on hover or when menu open */}
                    <div
                      className={cn(
                        'absolute right-1 flex items-center justify-center w-7 h-7 rounded-md transition-all',
                        isActive || openMenuId === conv.id
                          ? 'opacity-100 hover:bg-[var(--bg-elevated)]'
                          : 'opacity-0 group-hover/chat:opacity-100 hover:bg-[var(--bg-elevated)]'
                      )}
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuId(openMenuId === conv.id ? null : conv.id);
                      }}
                    >
                      <MoreHorizontal className="w-[16px] h-[16px]" style={{ color: 'var(--text-tertiary)' }} />
                    </div>
                  </button>
                )}

                {/* ── Context Menu ─────────────────────────────────────── */}
                {openMenuId === conv.id && (
                  <div
                    ref={menuRef}
                    className="absolute right-2 top-9 z-50 py-1.5 rounded-lg border shadow-lg w-44 flex flex-col scale-in"
                    style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-subtle)' }}
                  >
                    <button
                      className="w-full px-3 py-1.5 flex items-center gap-3 text-[13px] cursor-pointer border-none text-left transition-colors hover:bg-[var(--bg-hover)]"
                      style={{ color: 'var(--text-primary)', background: 'transparent' }}
                      onClick={() => handleStartRename(conv.id, conv.title)}
                    >
                      <Edit2 className="w-[14px] h-[14px]" style={{ color: 'var(--text-secondary)' }} />
                      Rename
                    </button>
                    <button
                      className="w-full px-3 py-1.5 flex items-center gap-3 text-[13px] cursor-pointer border-none text-left transition-colors hover:bg-red-500/10"
                      style={{ color: '#ef4444', background: 'transparent' }}
                      onClick={() => handleDeleteClick(conv.id)}
                    >
                      <Trash2 className="w-[14px] h-[14px]" />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}
      
      {/* ── Delete Confirmation Modal ───────────────────────────────────── */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div 
            className="w-full max-w-sm rounded-xl border p-6 shadow-2xl flex flex-col gap-4 scale-in"
            style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border-light)' }}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Delete chat?</h3>
              <button 
                onClick={() => setDeleteConfirmId(null)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[var(--bg-hover)] transition-colors border-none bg-transparent cursor-pointer"
                style={{ color: 'var(--text-secondary)' }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <p className="text-[14px]" style={{ color: 'var(--text-secondary)' }}>
              This will delete <strong>{conversations.find(c => c.id === deleteConfirmId)?.title}</strong>.
            </p>
            
            <div className="flex justify-end gap-3 mt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-lg text-[14px] font-medium border cursor-pointer hover:bg-[var(--bg-hover)] transition-colors"
                style={{ background: 'transparent', borderColor: 'var(--border-light)', color: 'var(--text-primary)' }}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-lg text-[14px] font-medium border-none cursor-pointer hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                style={{ background: '#ef4444', color: '#ffffff' }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
