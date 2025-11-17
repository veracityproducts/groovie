'use client';

import { useCallback, useEffect, useState } from 'react';
import type { ChatMode, Conversation } from '../types';

interface UseConversationHistoryOptions {
  mode: ChatMode;
  userId?: string;
  apiEndpoint?: string;
  onError?: (error: Error) => void;
}

/**
 * Hook to fetch and manage conversation history for a specific mode
 * Automatically filters conversations by the provided mode
 */
export const useConversationHistory = ({
  mode,
  userId,
  apiEndpoint = '/api/conversations',
  onError,
}: UseConversationHistoryOptions) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch conversations for the current mode
  const fetchConversations = useCallback(async () => {
    if (!userId) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // TODO: Replace with actual API call
      // const response = await fetch(`${apiEndpoint}?mode=${mode}&userId=${userId}`)
      // const data = await response.json()
      // setConversations(data.conversations)

      // For now, return empty array
      setConversations([]);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to fetch conversations';
      setError(errorMsg);
      onError?.(err instanceof Error ? err : new Error(errorMsg));
    } finally {
      setIsLoading(false);
    }
  }, [mode, userId, apiEndpoint, onError]);

  // Fetch on mount and when mode/userId changes
  useEffect(() => {
    fetchConversations();
  }, [mode, userId, fetchConversations]);

  const createConversation = useCallback(
    async (_title: string) => {
      if (!userId) {
        return null;
      }

      try {
        setError(null);

        // TODO: Replace with actual API call
        // const response = await fetch(apiEndpoint, {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ title: _title, mode, userId }),
        // })
        // const data = await response.json()
        // setConversations(prev => [...prev, data.conversation])
        // return data.conversation

        return null;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to create conversation';
        setError(errorMsg);
        onError?.(err instanceof Error ? err : new Error(errorMsg));
        return null;
      }
    },
    [mode, userId, apiEndpoint, onError]
  );

  const deleteConversation = useCallback(
    async (conversationId: string) => {
      try {
        setError(null);

        // TODO: Replace with actual API call
        // await fetch(`${apiEndpoint}/${conversationId}`, { method: 'DELETE' })
        // setConversations(prev => prev.filter(c => c.id !== conversationId))

        setConversations((prev) => prev.filter((c) => c.id !== conversationId));
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to delete conversation';
        setError(errorMsg);
        onError?.(err instanceof Error ? err : new Error(errorMsg));
      }
    },
    [apiEndpoint, onError]
  );

  const updateConversationTitle = useCallback(
    async (conversationId: string, newTitle: string) => {
      try {
        setError(null);

        // TODO: Replace with actual API call
        // const response = await fetch(`${apiEndpoint}/${conversationId}`, {
        //   method: 'PATCH',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ title: newTitle }),
        // })
        // const data = await response.json()

        setConversations((prev) =>
          prev.map((c) => (c.id === conversationId ? { ...c, title: newTitle } : c))
        );
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to update conversation';
        setError(errorMsg);
        onError?.(err instanceof Error ? err : new Error(errorMsg));
      }
    },
    [apiEndpoint, onError]
  );

  return {
    conversations,
    isLoading,
    error,
    fetchConversations,
    createConversation,
    deleteConversation,
    updateConversationTitle,
  };
};
