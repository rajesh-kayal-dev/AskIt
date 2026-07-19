import React, { useState } from 'react';
import type { Message } from '../../redux/chatSlice';
import { Copy, RefreshCw, ThumbsUp, ThumbsDown, Check, Volume2, Pencil, Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { MarkdownRenderer } from './MarkdownRenderer';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { setIsGenerating, updateMessageContentInState, updateMessageFeedbackInState } from '../../redux/chatSlice';
import { chatHistoryService } from '../../services/api';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.type === 'user';
  const dispatch = useAppDispatch();
  const { messages, currentConversationId, isGenerating, model } = useAppSelector((state) => state.chat);
  const [copied, setCopied] = useState(false);
  const [isPlayingSpeech, setIsPlayingSpeech] = useState(false);
  const [isLocalRegenerating, setIsLocalRegenerating] = useState(false);

  const handleCopyResponse = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy response', err);
    }
  };

  const handleLike = async () => {
    const isCurrentlyLiked = message.feedback === 'like';
    const newFeedback = isCurrentlyLiked ? null : 'like';

    dispatch(updateMessageFeedbackInState({ id: message.id, feedback: newFeedback }));
    try {
      await chatHistoryService.updateMessageContent(message.id, undefined, newFeedback);
    } catch (err) {
      console.error('Failed to update message feedback', err);
    }
  };

  const handleDislike = async () => {
    const isCurrentlyDisliked = message.feedback === 'dislike';
    const newFeedback = isCurrentlyDisliked ? null : 'dislike';

    dispatch(updateMessageFeedbackInState({ id: message.id, feedback: newFeedback }));
    try {
      await chatHistoryService.updateMessageContent(message.id, undefined, newFeedback);
    } catch (err) {
      console.error('Failed to update message feedback', err);
    }
  };

  const handleReadAloud = () => {
    if (isPlayingSpeech) {
      window.speechSynthesis.cancel();
      setIsPlayingSpeech(false);
    } else {
      window.speechSynthesis.cancel(); // clear queue
      const utterance = new SpeechSynthesisUtterance(message.content);
      utterance.onend = () => setIsPlayingSpeech(false);
      utterance.onerror = () => setIsPlayingSpeech(false);
      setIsPlayingSpeech(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleRegenerate = async () => {
    if (isGenerating) return;

    // Find the user prompt immediately preceding this message
    const msgIndex = messages.findIndex(m => m.id === message.id);
    const prevUserMsg = msgIndex > 0 ? messages[msgIndex - 1] : null;
    const userPrompt = prevUserMsg && prevUserMsg.type === 'user' ? prevUserMsg.content : null;

    if (!userPrompt) {
      console.warn("Could not find preceding user prompt to regenerate.");
      return;
    }

    dispatch(setIsGenerating(true));
    setIsLocalRegenerating(true);
    dispatch(updateMessageContentInState({ id: message.id, content: '' }));

    const abortController = new AbortController();
    let aiResponseText = '';
    let tokenBuffer = '';
    let lastUpdateTime = Date.now();

    const flushBuffer = () => {
      if (tokenBuffer) {
        aiResponseText += tokenBuffer;
        tokenBuffer = '';
        dispatch(updateMessageContentInState({ id: message.id, content: aiResponseText }));
      }
    };

    try {
      const stream = chatHistoryService.streamMessage(
        userPrompt,
        currentConversationId,
        abortController.signal,
        message.id // pass message.id so backend updates the existing message instead of appending new
      );
      
      for await (const chunk of stream) {
        if (chunk.event === 'token') {
          tokenBuffer += chunk.data.text;
          const now = Date.now();
          if (now - lastUpdateTime >= 30) {
            flushBuffer();
            lastUpdateTime = now;
          }
        } else if (chunk.event === 'error') {
          throw new Error(chunk.data.message || 'Stream Error');
        }
      }

      flushBuffer();
    } catch (err) {
      console.error('Regeneration error:', err);
    } finally {
      dispatch(setIsGenerating(false));
      setIsLocalRegenerating(false);
    }
  };

  return (
    <div className={cn(isUser ? 'message-user max-w-[70%] ml-auto mb-3' : 'message-ai w-full mb-6')}>
      {isUser ? (
        <div
          className={cn(
            'message-bubble px-5 py-4 rounded-2xl rounded-tr-md text-[15px] leading-relaxed whitespace-pre-wrap break-words shadow-sm text-[var(--text-primary)]'
          )}
          style={{
            background: 'var(--bg-elevated)'
          }}
        >
          {message.content}
        </div>
      ) : (
        <div
          className="text-[15px] leading-relaxed break-words overflow-x-hidden py-1"
          style={{
            color: 'var(--text-primary)'
          }}
        >
          {message.content ? (
            <MarkdownRenderer content={message.content} />
          ) : (
            <div className="flex items-center gap-2 py-1">
              <Loader2 className="w-4 h-4 animate-spin" style={{ color: 'var(--text-muted)' }} />
            </div>
          )}
        </div>
      )}

      <div className={cn('flex items-center gap-3 mt-1.5', isUser ? 'justify-end pr-1' : 'justify-start pl-0.5')}>
        {isUser && (
          <div className="flex items-center gap-1.5">
            <div className="message-actions flex items-center gap-1">
              {/* Copy Button */}
              <div className="action-btn-container">
                <button
                  onClick={handleCopyResponse}
                  className="w-6 h-6 rounded flex items-center justify-center cursor-pointer border-none transition-all"
                  style={{ background: 'transparent', color: 'var(--text-tertiary)' }}
                >
                  {copied ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 hover:text-white" />
                  )}
                </button>
                <div className="action-btn-tooltip">{copied ? "Copied!" : "Copy prompt"}</div>
              </div>

              {/* Edit Button */}
              <div className="action-btn-container">
                <button
                  className="w-6 h-6 rounded flex items-center justify-center cursor-pointer border-none transition-all"
                  style={{ background: 'transparent', color: 'var(--text-tertiary)' }}
                >
                  <Pencil className="w-3.5 h-3.5 hover:text-white" />
                </button>
                <div className="action-btn-tooltip">Edit prompt</div>
              </div>
            </div>
          </div>
        )}

        {!isUser && (
          <div className="message-actions flex items-center gap-1">
            {/* Read Aloud Button */}
            <div className="action-btn-container">
              <button
                onClick={handleReadAloud}
                className="w-6 h-6 rounded flex items-center justify-center cursor-pointer border-none transition-all"
                style={{ background: 'transparent', color: 'var(--text-tertiary)' }}
              >
                <Volume2 className={cn("w-3.5 h-3.5 hover:text-white", isPlayingSpeech && "text-emerald-400")} />
              </button>
              <div className="action-btn-tooltip">Read aloud</div>
            </div>

            {/* Copy Response Button */}
            <div className="action-btn-container">
              <button
                onClick={handleCopyResponse}
                className="w-6 h-6 rounded flex items-center justify-center cursor-pointer border-none transition-all"
                style={{ background: 'transparent', color: 'var(--text-tertiary)' }}
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5 hover:text-white" />
                )}
              </button>
              <div className="action-btn-tooltip">{copied ? "Copied!" : "Copy response"}</div>
            </div>

            {/* Regenerate Button */}
            <div className="action-btn-container">
              <button
                onClick={handleRegenerate}
                disabled={isGenerating}
                className="w-6 h-6 rounded flex items-center justify-center cursor-pointer border-none transition-all disabled:opacity-50"
                style={{ background: 'transparent', color: 'var(--text-tertiary)' }}
              >
                <RefreshCw className={cn("w-3.5 h-3.5 hover:text-white", isLocalRegenerating && "animate-spin")} />
              </button>
              <div className="action-btn-tooltip text-left flex flex-col gap-0.5" style={{ minWidth: '100px' }}>
                <div className="font-semibold text-white">Try again...</div>
                <div className="text-[10px] text-gray-400">Used {model || 'groq/gpt-oss-120b'}</div>
              </div>
            </div>

            {/* Good response Button */}
            {message.feedback !== 'dislike' && (
              <div className="action-btn-container">
                <button
                  onClick={handleLike}
                  className="w-6 h-6 rounded flex items-center justify-center cursor-pointer border-none transition-all"
                  style={{ 
                    background: 'transparent', 
                    color: message.feedback === 'like' ? '#34d399' : 'var(--text-tertiary)' 
                  }}
                >
                  <ThumbsUp className="w-3.5 h-3.5 hover:text-white" />
                </button>
                <div className="action-btn-tooltip">{message.feedback === 'like' ? "Remove like" : "Good response"}</div>
              </div>
            )}

            {/* Bad response Button */}
            {message.feedback !== 'like' && (
              <div className="action-btn-container">
                <button
                  onClick={handleDislike}
                  className="w-6 h-6 rounded flex items-center justify-center cursor-pointer border-none transition-all"
                  style={{ 
                    background: 'transparent', 
                    color: message.feedback === 'dislike' ? '#f87171' : 'var(--text-tertiary)' 
                  }}
                >
                  <ThumbsDown className="w-3.5 h-3.5 hover:text-white" />
                </button>
                <div className="action-btn-tooltip">{message.feedback === 'dislike' ? "Remove dislike" : "Bad response"}</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
