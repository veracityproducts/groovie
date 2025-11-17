'use client';

import React from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

export interface ChatDisplayProps {
  sidebar?: React.ReactNode;
  header?: React.ReactNode;
  modeToggle: React.ReactNode;
  messageList: React.ReactNode;
  chatInput: React.ReactNode;
  showSidebar?: boolean;
  onToggleSidebar?: () => void;
  className?: string;
}

/**
 * Pure layout component for chat interface
 * NO internal logic or state management
 * Parent is responsible for orchestrating all child components
 * Fully composable and flexible
 */
export const ChatDisplay: React.FC<ChatDisplayProps> = ({
  sidebar,
  header,
  modeToggle,
  messageList,
  chatInput,
  showSidebar = true,
  onToggleSidebar,
  className = '',
}) => {
  return (
    <div className={`flex h-screen bg-background ${className}`}>
      {/* Sidebar - Optional */}
      {sidebar && showSidebar && <div className="w-64 bg-card text-card-foreground border-r border-border flex flex-col">{sidebar}</div>}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header - Optional */}
        {header ? (
          <div className="bg-background border-b border-border p-4 flex items-center justify-between">
            {onToggleSidebar && (
              <Button
                onClick={onToggleSidebar}
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground"
              >
                {showSidebar ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            )}
            {header}
            {onToggleSidebar && <div className="w-8" />}
          </div>
        ) : null}

        {/* Mode Toggle Bar */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div>{modeToggle}</div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto bg-background">{messageList}</div>

          {/* Chat Input Area */}
          <div className="bg-background border-t border-border p-4">{chatInput}</div>
        </div>
      </div>
    </div>
  );
};
