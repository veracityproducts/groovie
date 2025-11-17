'use client';

import React, { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

export interface ChatInputProps {
  onSendMessage: (message: string) => Promise<void>;
  isLoading: boolean;
  placeholder?: string;
  submitOnEnter?: boolean;
  submitOnCtrlEnter?: boolean;
  rows?: number;
  maxLength?: number;
  buttonText?: string;
  className?: string;
  inputClassName?: string;
  buttonClassName?: string;
}

/**
 * Chat input component - fully customizable
 * Supports various keyboard shortcuts and styling options
 */
export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isLoading,
  placeholder = 'Type your message...',
  submitOnEnter = false,
  submitOnCtrlEnter = true,
  rows = 3,
  maxLength,
  buttonText,
  className = '',
  inputClassName = '',
  buttonClassName = '',
}) => {
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim() || isSending || isLoading) {
      return;
    }

    setIsSending(true);
    const message = input.trim();
    setInput('');

    try {
      await onSendMessage(message);
    } catch {
      // Error handling - message already shown by parent
      setInput(message); // Restore input on error
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const isEnter = e.key === 'Enter';

    if (isEnter && submitOnEnter && !e.ctrlKey && !e.shiftKey) {
      handleSubmit(e as unknown as React.FormEvent);
    }

    if (isEnter && submitOnCtrlEnter && e.ctrlKey) {
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  const isDisabled = !input.trim() || isLoading || isSending;

  return (
    <form onSubmit={handleSubmit} className={`flex gap-2 ${className}`}>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={isLoading || isSending}
        rows={rows}
        maxLength={maxLength}
        className={`
          flex-1 p-3 border border-border rounded-lg
          focus:outline-none focus:ring-2 focus:ring-primary
          disabled:bg-muted disabled:text-muted-foreground
          resize-none
          ${inputClassName}
        `}
      />

      <Button
        type="submit"
        disabled={isDisabled}
        className={`self-end px-4 py-3 ${buttonClassName}`}
      >
        {isSending || isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : buttonText ? (
          buttonText
        ) : (
          <Send className="w-5 h-5" />
        )}
      </Button>
    </form>
  );
};
