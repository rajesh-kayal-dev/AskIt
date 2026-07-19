import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  addMessage,
  setIsGenerating,
  setCurrentStreamingMessage,
  setStreamError,
  setLastPrompt,
  moveConversationToTop,
  setCurrentConversationId,
  prependConversation,
} from '../../redux/chatSlice';
import {
  setArtifactPanelOpen,
  setActiveArtifact,
  appendArtifactContent
} from '../../redux/uiSlice';
import { chatHistoryService } from '../../services/api';
import { Paperclip, Mic, ArrowUp, AudioLines, Square } from 'lucide-react';

// Keep abort controller reference outside component to survive renders
let streamAbortController: AbortController | null = null;

export const MessageInput: React.FC = () => {
  const [content, setContent] = useState('');
  const [isVoiceAgentActive, setIsVoiceAgentActive] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isGenerating, currentConversationId } = useAppSelector((state) => state.chat);

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [content]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || isGenerating) return;

    const userContent = content.trim();
    setContent('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }



    dispatch(addMessage({
      id: `temp-user-${Date.now()}`,
      type: 'user',
      content: userContent,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }));

    dispatch(setLastPrompt(userContent));
    dispatch(setStreamError(null));
    dispatch(setCurrentStreamingMessage(''));
    dispatch(setIsGenerating(true));

    streamAbortController = new AbortController();

    let aiResponseText = '';
    let isStreamingArtifact = false;

    try {
      const stream = chatHistoryService.streamMessage(userContent, currentConversationId, streamAbortController.signal);

      let finalConversationId = currentConversationId;
      let chunkCount = 0;
      let tokenBuffer = '';
      let lastUpdateTime = Date.now();

      const flushBuffer = () => {
        if (tokenBuffer) {
          aiResponseText += tokenBuffer;
          tokenBuffer = '';
          dispatch(setCurrentStreamingMessage(aiResponseText));
        }
      };

      for await (const chunk of stream) {
        chunkCount++;

        if (chunk.event === 'start') {

        } else if (chunk.event === 'metadata') {
          if (chunk.data.isArtifact) {
            isStreamingArtifact = true;
            dispatch(setArtifactPanelOpen(true));
            dispatch(setActiveArtifact({
              artifactType: chunk.data.artifactType || 'output',
              language: chunk.data.language || '',
              title: chunk.data.title || '',
              content: '',
            }));
          }

        } else if (chunk.event === 'token') {
          if (isStreamingArtifact) {
            dispatch(appendArtifactContent(chunk.data.text));
          } else {
            tokenBuffer += chunk.data.text;
            const now = Date.now();
            if (now - lastUpdateTime >= 30) { // 30ms buffer (approx 33fps updates)
              flushBuffer();
              lastUpdateTime = now;
            }
          }

        } else if (chunk.event === 'done') {
          const { conversationId: doneUUID, title: doneTitle } = chunk.data;
          if (!currentConversationId && doneUUID) {
            finalConversationId = doneUUID;
            dispatch(setCurrentConversationId(doneUUID));
            dispatch(prependConversation({
              id: doneUUID,
              title: doneTitle || 'New Chat',
              updatedAt: new Date().toISOString(),
              group: 'Today',
            }));
            navigate(`/c/${doneUUID}`, { replace: true });
          } else if (currentConversationId) {
            finalConversationId = currentConversationId;
          }

        } else if (chunk.event === 'error') {
          throw new Error(chunk.data.message || 'Stream Error');
        }
      }

      flushBuffer(); // Make sure any remaining buffered text is rendered


      if (isStreamingArtifact) {
        dispatch(addMessage({
          id: `ai-${Date.now()}`,
          type: 'ai',
          content: `Generated Artifact: Open the right panel to view.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }));
      } else if (aiResponseText) {
        dispatch(addMessage({
          id: `ai-${Date.now()}`,
          type: 'ai',
          content: aiResponseText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }));
      } else {

      }

      if (finalConversationId) {
        dispatch(moveConversationToTop(finalConversationId));
      }

    } catch (error: any) {
      if (error.name === 'AbortError') {
        // stream cancelled by user — no action needed
      } else {
        console.error('Stream error:', error.name, error.message);
        dispatch(setStreamError(error.message));
        if (aiResponseText) {
          dispatch(addMessage({
            id: `ai-${Date.now()}`,
            type: 'ai',
            content: aiResponseText,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          }));
        }
      }
    } finally {
      dispatch(setIsGenerating(false));
      dispatch(setCurrentStreamingMessage(''));
      streamAbortController = null;
    }
  };

  const stopGeneration = () => {
    if (streamAbortController) {
      streamAbortController.abort();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div
      className="sticky bottom-0 z-10 w-full py-4 px-4 lg:px-6"
      style={{
        background: 'linear-gradient(to top, var(--bg-primary) 0%, var(--bg-primary) 80%, transparent 100%)',
      }}
    >
      <div className="max-w-[900px] mx-auto">
        <form
          className="input-form w-full p-4 rounded-2xl border flex items-end gap-3 transition-all duration-200"
          style={{
            borderColor: 'var(--border-light)',
            background: 'var(--bg-tertiary)',
          }}
          onSubmit={handleSubmit}
        >
          {/* Attach Button */}
          <button
            type="button"
            className="btn-interact w-9 h-9 rounded-lg flex items-center justify-center cursor-pointer border-none flex-shrink-0 transition-all hover:bg-[var(--bg-hover)]"
            style={{ background: 'transparent' }}
            title="Attach files"
          >
            <Paperclip className="w-5 h-5" style={{ strokeWidth: 2, color: 'var(--text-tertiary)' }} />
          </button>

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isVoiceAgentActive ? "Connecting..." : "Ask anything..."}
            className="flex-1 resize-none min-h-[24px] max-h-[160px] py-2 px-0 border-0 border-transparent outline-none focus:outline-none focus:ring-0 focus:border-transparent text-base leading-6 overflow-y-auto"
            style={{
              background: 'transparent',
              color: 'var(--text-primary)',
              fontFamily: 'inherit',
              boxShadow: 'none',
            }}
            rows={1}
            disabled={isGenerating}
          />

          {/* Mic Button */}
          <button
            type="button"
            className="btn-interact w-9 h-9 rounded-lg flex items-center justify-center cursor-pointer border-none flex-shrink-0 transition-all hover:bg-[var(--bg-hover)]"
            style={{ background: 'transparent' }}
            title="Voice typing"
          >
            <Mic className="w-5 h-5" style={{ strokeWidth: 2, color: 'var(--text-tertiary)' }} />
          </button>

          {/* Voice / Send / Cancel */}
          {isVoiceAgentActive ? (
            <button 
              type="button"
              onClick={() => setIsVoiceAgentActive(false)}
              className="h-10 px-4 rounded-xl flex items-center justify-center gap-1.5 border-none cursor-pointer transition-all"
              style={{ background: '#003a80', color: '#ffffff', fontSize: '14px', fontWeight: 500 }}
            >
              <span className="flex gap-0.5 mt-[-4px] tracking-tighter text-lg leading-none opacity-80">•••</span>
              {content.trim().length === 0 ? 'Cancel' : 'Stop'}
            </button>
          ) : content.trim().length === 0 ? (
            <button
              type="button"
              onClick={() => setIsVoiceAgentActive(true)}
              className="btn-interact w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer border-none flex-shrink-0 transition-all hover:bg-[var(--bg-hover)]"
              style={{ background: 'transparent' }}
            >
              <AudioLines className="w-5 h-5" style={{ strokeWidth: 2, color: 'var(--text-tertiary)' }} />
            </button>
          ) : isGenerating ? (
            <button
              type="button"
              onClick={stopGeneration}
              className="send-btn w-10 h-10 rounded-xl flex items-center justify-center text-white border-none cursor-pointer transition-all duration-200 flex-shrink-0"
              style={{
                background: 'var(--text-secondary)',
                boxShadow: 'var(--shadow-md)',
              }}
              title="Stop Generating"
            >
              <Square className="w-4 h-4 fill-current" />
            </button>
          ) : (
            <button
              type="submit"
              className="send-btn w-10 h-10 rounded-xl flex items-center justify-center text-white border-none cursor-pointer transition-all duration-200 flex-shrink-0 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                background: 'var(--gradient-button)',
                boxShadow: 'var(--shadow-md)',
              }}
            >
              <ArrowUp className="w-5 h-5" style={{ strokeWidth: 2 }} />
            </button>
          )}
        </form>
      </div>
    </div>
  );
};
