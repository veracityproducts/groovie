'use client';

import { useEffect, useState } from 'react';
import type { AccessLevel } from '@/shared/types/common';

/**
 * Hook to get the current user's access level
 * In development, returns 'free' by default
 * In production, fetches from API
 */
export const useAccessLevel = () => {
  const [accessLevel, setAccessLevel] = useState<AccessLevel>('free');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAccessLevel = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // TODO: Replace with actual API call to fetch user's access level
        // const response = await fetch('/api/auth/access-level')
        // const data = await response.json()
        // setAccessLevel(data.accessLevel)

        // For now, default to 'free'
        setAccessLevel('free');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch access level');
        setAccessLevel('free'); // Default to free on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchAccessLevel();
  }, []);

  return { accessLevel, isLoading, error };
};
