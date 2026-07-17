import React from 'react'; // Force reload
import { ChatHeader } from './ChatHeader';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { EmptyChatHero } from './EmptyChatHero';
import { useAppSelector } from '../../redux/hooks';

export const ChatArea: React.FC = () => {
  const { messages } = useAppSelector((state) => state.chat);
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
          <MessageInput />
        </>
      )}
    </main>
  );
};
