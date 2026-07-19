import React, { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar/Sidebar';
import { ChatArea } from '../components/ChatArea/ChatArea';
import { RightPanel } from '../components/RightPanel/RightPanel';
import { ArtifactPanel } from '../components/ArtifactPanel/ArtifactPanel';
import { AgentView } from '../components/AgentArea/AgentView';
import { SettingsModal } from '../components/Modals/SettingsModal';
import { SearchModal } from '../components/Modals/SearchModal';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import {
  setConversations,
  setIsLoadingHistory,
  setCurrentConversationId,
  setMessages,
  setIsLoadingMessages,
  prependConversation,
  startNewChat,
} from '../redux/chatSlice';
import { chatHistoryService } from '../services/api';

export const ChatPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { uuid } = useParams<{ uuid?: string }>();
  const { theme, activeView, isArtifactPanelOpen } = useAppSelector((state) => state.ui);
  const { currentConversationId, messages } = useAppSelector((state) => state.chat);
  const hydratedRef = useRef<string | null>(null); // track last hydrated uuid to avoid double-fetch

  // Apply theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Load conversation history on mount (restore sidebar on login/refresh)
  useEffect(() => {
    const loadConversations = async () => {
      dispatch(setIsLoadingHistory(true));
      try {
        const conversations = await chatHistoryService.getConversations();
        dispatch(setConversations(conversations));
      } catch (err) {
        console.error('Failed to load conversations:', err);
      } finally {
        dispatch(setIsLoadingHistory(false));
      }
    };

    loadConversations();
  }, [dispatch]);

  // Hydrate messages when uuid is present in URL (browser refresh or direct link)
  useEffect(() => {
    if (!uuid) {
      hydratedRef.current = null;
      dispatch(startNewChat());
      return;
    }

    if (currentConversationId === uuid && messages.length > 0) {
      hydratedRef.current = uuid;
      return;
    }

    if (hydratedRef.current === uuid) return;
    hydratedRef.current = uuid;

    const hydrate = async () => {
      dispatch(setIsLoadingMessages(true));
      dispatch(setCurrentConversationId(uuid));
      try {
        const { conversation, messages } = await chatHistoryService.getConversationWithMessages(uuid);
        dispatch(setMessages(messages));
        // Ensure this conversation appears in the sidebar (in case conversations loaded before this)
        dispatch(prependConversation(conversation));
      } catch (err) {
        console.error('Failed to hydrate conversation:', err);
      } finally {
        dispatch(setIsLoadingMessages(false));
      }
    };

    hydrate();
  }, [uuid, dispatch]);

  return (
    <div className="h-screen w-screen flex overflow-hidden relative text-white" style={{ background: 'var(--bg-primary)' }}>
      <Sidebar />
      {activeView === 'chat' ? (
        <>
          <ChatArea />
          {isArtifactPanelOpen ? <ArtifactPanel /> : <RightPanel />}
        </>
      ) : (
        <AgentView />
      )}
      <SettingsModal />
      <SearchModal />
    </div>
  );
};



