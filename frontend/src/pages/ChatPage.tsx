import React, { useEffect } from 'react';
import { Sidebar } from '../components/Sidebar/Sidebar';
import { ChatArea } from '../components/ChatArea/ChatArea';
import { RightPanel } from '../components/RightPanel/RightPanel';
import { AgentView } from '../components/AgentArea/AgentView';
import { SettingsModal } from '../components/Modals/SettingsModal';
import { useAppSelector } from '../redux/hooks';

export const ChatPage: React.FC = () => {
  const { theme, activeView } = useAppSelector((state) => state.ui);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <div className="h-screen w-screen flex overflow-hidden relative text-white" style={{ background: 'var(--bg-primary)' }}>
      <Sidebar />
      {activeView === 'chat' ? (
        <>
          <ChatArea />
          <RightPanel />
        </>
      ) : (
        <AgentView />
      )}
      <SettingsModal />
    </div>
  );
};
