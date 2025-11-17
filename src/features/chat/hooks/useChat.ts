'use client';

import { useCallback, useState } from 'react';
import type { ChatMode, Message } from '../types';

interface UseChatOptions {
  initialMode?: ChatMode;
  apiEndpoint?: string;
  onError?: (error: Error) => void;
}

/**
 * Generic, mode-aware chat hook
 * Manages messages, loading state, and API communication
 */
export const useChat = ({
  initialMode = 'reading-resource',
  apiEndpoint = '/api/modes/[mode]/chat',
  onError,
}: UseChatOptions = {}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMode, setCurrentMode] = useState<ChatMode>(initialMode);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim()) {
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Create user message
        const userMessage: Message = {
          id: `msg-${Date.now()}`,
          content: content.trim(),
          role: 'user',
          createdAt: new Date(),
          mode: currentMode,
        };

        // Add user message to state
        setMessages((prev) => [...prev, userMessage]);

        // Send to API
        const endpoint = apiEndpoint.replace('[mode]', currentMode);
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: content.trim(),
            mode: currentMode,
            conversationId: 'temp', // TODO: Replace with actual conversation ID
          }),
        });

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        // Parse response
        const data = await response.json();

        // Create assistant message
        const assistantMessage: Message = {
          id: `msg-${Date.now()}-response`,
          content: data.content || data.message || 'No response',
          role: 'assistant',
          createdAt: new Date(),
          mode: currentMode,
          artifacts: data.artifacts,
        };

        // Add assistant message to state
        setMessages((prev) => [...prev, assistantMessage]);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to send message';
        setError(errorMsg);
        onError?.(err instanceof Error ? err : new Error(errorMsg));
      } finally {
        setIsLoading(false);
      }
    },
    [currentMode, apiEndpoint, onError]
  );

  const switchMode = useCallback((mode: ChatMode) => {
    setCurrentMode(mode);
    // Note: Messages persist across mode switches per design
    // Each message has a 'mode' field for filtering
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return {
    messages,
    currentMode,
    isLoading,
    error,
    sendMessage,
    switchMode,
    clearMessages,
  };
};
