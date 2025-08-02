// hooks/useJournalActions.ts
import { useCallback } from 'react';
import api from '@/lib/api';
import { Journal, JournalStats } from '@/types';

export function useJournalActions() {
  const getJournal = useCallback(async (id: number): Promise<Journal> => {
    try {
      const response = await api.get(`/journals/${id}`);
      return response.data.data?.data || response.data.data || response.data;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to fetch journal');
    }
  }, []);

  return {
    getJournal,
  };
}
