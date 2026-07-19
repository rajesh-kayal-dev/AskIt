import React from 'react'; // Force reload
import { ChatHeader } from './ChatHeader';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { EmptyChatHero } from './EmptyChatHero';
import { useAppSelector } from '../../redux/hooks';

export const ChatArea: React.FC = () => {
  const { messages, streamError } = useAppSelector((state) => state.chat);
  const isChatEmpty = messages.length === 0;
  return (
    <main
      className="main-content flex-1 flex flex-col min-w-0 relative"
      style={{ background: 'var(--bg-primary)' }}
    >
      <ChatHeader />
      {isChatEmpty ? (
        <EmptyChatHero />
      ) : (
        <>
          <MessageList />
          {streamError && (
            <div className="mx-auto max-w-[760px] w-full px-6 mb-2">
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm p-3 rounded-lg flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                {streamError}
              </div>
            </div>
          )}
          <MessageInput />
        </>
      )}
    </main>
  );
};
