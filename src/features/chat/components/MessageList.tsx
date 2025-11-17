'use client';

import React from 'react';
import type { Message } from '../types';
import { MessageBubble } from './MessageBubble';
import { LoadingBubble } from './LoadingBubble';

export interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  enableAutoScroll?: boolean;
  emptyStateMessage?: string;
  className?: string;
  loadingMessage?: string;
}

/**
 * Renders a list of chat messages - fully customizable
 * Auto-scroll is optional and can be disabled
 * All styling is customizable via props and className
 */
export const MessageList: React.FC<MessageListProps> = ({
  messages,
  isLoading,
  enableAutoScroll = true,
  emptyStateMessage = 'Start a conversation. Ask me anything!',
  className = '',
  loadingMessage = 'Thinking...',
}) => {
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive (if enabled)
  React.useEffect(() => {
    if (!enableAutoScroll) return;
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [enableAutoScroll]);

  return (
    <div className={`space-y-4 p-4 ${className}`}>
      {messages.length === 0 && !isLoading && (
        <div className="flex items-center justify-center h-full text-muted-foreground">
          <p className="text-center">{emptyStateMessage}</p>
        </div>
      )}

      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}

      {isLoading && <LoadingBubble message={loadingMessage} />}

      <div ref={messagesEndRef} />
    </div>
  );
};
