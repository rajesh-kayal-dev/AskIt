import React, { useState, useRef, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { setCurrentChatId } from '../../redux/chatSlice';
import { MoreHorizontal, Edit2, Archive, Trash2, PlusCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

export const ChatList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { chats, currentChatId } = useAppSelector((state) => state.chat);
  const { isSidebarOpen } = useAppSelector((state) => state.ui);
  
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Group chats by their group property
  const groupedChats = chats.reduce((acc, chat) => {
    if (!acc[chat.group]) acc[chat.group] = [];
    acc[chat.group].push(chat);
    return acc;
  }, {} as Record<string, typeof chats>);

  // Ensure order: Today, Previous 7 days, Previous 30 days
  const groupOrder = ['Today', 'Previous 7 days', 'Previous 30 days'];
  const orderedGroups = groupOrder.filter(g => groupedChats[g]).map(g => ({ name: g, chats: groupedChats[g] }));

  return (
    <div className="space-y-6">
      {orderedGroups.map((group) => (
        <div key={group.name} className="flex flex-col gap-0.5">
          <div className="text-[12px] font-medium px-3 pb-1" style={{ color: 'var(--text-tertiary)' }}>
            {group.name}
          </div>
          {group.chats.map((chat) => (
            <div key={chat.id} className="relative group/chat">
              <button
                className={cn(
                  'w-full h-9 px-3 rounded-md cursor-pointer text-left flex items-center justify-between border-none transition-colors relative z-10',
                  chat.id === currentChatId ? 'bg-[var(--bg-active)]' : 'bg-transparent hover:bg-[var(--bg-hover)]'
                )}
                onClick={() => dispatch(setCurrentChatId(chat.id))}
                aria-label={`${chat.title} chat`}
              >
                <div 
                  className="text-[13.5px] truncate flex-1 pr-6 font-medium" 
                  style={{ color: chat.id === currentChatId ? 'var(--text-primary)' : 'var(--text-secondary)' }}
                >
                  {chat.title}
                </div>
                
                {(chat.id === currentChatId || chat.id === openMenuId) && (
                  <div 
                    className="absolute right-1 flex items-center justify-center w-7 h-7 rounded-md hover:bg-[var(--bg-elevated)] transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenMenuId(openMenuId === chat.id ? null : chat.id);
                    }}
                  >
                    <MoreHorizontal className="w-[18px] h-[18px]" style={{ color: 'var(--text-tertiary)' }} />
                  </div>
                )}
                {/* Show on hover for inactive */}
                {chat.id !== currentChatId && chat.id !== openMenuId && (
                  <div 
                    className="absolute right-1 flex items-center justify-center w-7 h-7 rounded-md hover:bg-[var(--bg-elevated)] transition-colors opacity-0 group-hover/chat:opacity-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenMenuId(chat.id);
                    }}
                  >
                    <MoreHorizontal className="w-[18px] h-[18px]" style={{ color: 'var(--text-tertiary)' }} />
                  </div>
                )}
              </button>
              
              {openMenuId === chat.id && (
                <div 
                  ref={menuRef}
                  className="absolute right-2 top-9 z-50 py-1.5 rounded-lg border shadow-lg w-44 flex flex-col scale-in"
                  style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-subtle)' }}
                >
                  <button 
                    className="w-full px-3 py-1.5 flex items-center gap-3 text-[13.5px] cursor-pointer border-none text-left transition-colors hover:bg-[var(--bg-hover)]"
                    style={{ color: 'var(--text-primary)', background: 'transparent' }}
                  >
                    <Edit2 className="w-[15px] h-[15px]" style={{ color: 'var(--text-secondary)' }} />
                    Rename
                  </button>
                  <button 
                    className="w-full px-3 py-1.5 flex items-center gap-3 text-[13.5px] cursor-pointer border-none text-left transition-colors hover:bg-[var(--bg-hover)]"
                    style={{ color: 'var(--text-primary)', background: 'transparent' }}
                  >
                    <Archive className="w-[15px] h-[15px]" style={{ color: 'var(--text-secondary)' }} />
                    Archive
                  </button>
                  <button 
                    className="w-full px-3 py-1.5 flex items-center gap-3 text-[13.5px] cursor-pointer border-none text-left transition-colors hover:bg-[var(--bg-hover)]"
                    style={{ color: 'var(--text-primary)', background: 'transparent' }}
                  >
                    <Trash2 className="w-[15px] h-[15px]" style={{ color: 'var(--text-secondary)' }} />
                    Delete
                  </button>
                  <div className="h-px my-1.5 mx-3" style={{ background: 'var(--border-subtle)' }}></div>
                  <button 
                    className="w-full px-3 py-1.5 flex items-center gap-3 text-[13.5px] cursor-pointer border-none text-left transition-colors hover:bg-[var(--bg-hover)]"
                    style={{ color: 'var(--text-primary)', background: 'transparent' }}
                  >
                    <PlusCircle className="w-[15px] h-[15px]" style={{ color: 'var(--text-secondary)' }} />
                    Add Tags
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
