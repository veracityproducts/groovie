'use client';

import React from 'react';
import type { Conversation } from '../types';

export interface ConversationSidebarProps {
  conversations: Conversation[];
  currentConversationId?: string;
  onSelectConversation: (conversationId: string) => void;
  modeLabel: string;
  isOpen: boolean;
  className?: string;
}

/**
 * Standalone conversation history sidebar
 * No internal state management - fully controlled by parent
 */
export const ConversationSidebar: React.FC<ConversationSidebarProps> = ({
  conversations,
  currentConversationId,
  onSelectConversation,
  modeLabel,
  isOpen,
  className = '',
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className={`
        w-64 bg-card text-card-foreground border-r border-border
        flex flex-col ${className}
      `}
    >
      {/* Sidebar Header */}
      <div className="p-4 border-b border-border">
        <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">
          Conversations
        </h2>
        <p className="text-xs text-muted-foreground mt-1">{modeLabel}</p>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="p-4 text-xs text-muted-foreground">No conversations yet</div>
        ) : (
          <div className="space-y-1 p-2">
            {conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => onSelectConversation(conv.id)}
                className={`
                  w-full text-left p-3 rounded text-sm
                  transition-colors duration-200
                  ${currentConversationId === conv.id ? 'bg-primary/10 text-foreground font-medium' : 'text-muted-foreground hover:bg-muted'}
                  truncate
                `}
              >
                {conv.title}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
