'use client';

import React from 'react';
import type { Message } from '../types';

export interface MessageBubbleProps {
  message: Message;
  className?: string;
}

/**
 * Renders a single chat message bubble
 * Styling adapts based on message role (user vs assistant)
 */
export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  className = '',
}) => {
  const isUserMessage = message.role === 'user';

  return (
    <div
      className={`flex mb-4 ${isUserMessage ? 'justify-end' : 'justify-start'} ${className}`}
    >
      <div
        className={`
          max-w-xs lg:max-w-md xl:max-w-lg px-4 py-2 rounded-lg
          ${isUserMessage ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-muted text-muted-foreground rounded-bl-none'}
        `}
      >
        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        <p className="text-xs mt-1 opacity-70">
          {message.createdAt.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      </div>
    </div>
  );
};
