import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Journal, JournalStats } from '@/types';

export function useJournals() {
  const [journals, setJournals] = useState<Journal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJournals = async () => {
    try {
      setLoading(true);
      const response = await api.get('/journals');
      
      // Add debugging
      console.log('API Response:', response.data);
      
      // Handle Laravel paginated response correctly
      let journalsData;
      if (response.data.data && response.data.data.data) {
        // Paginated response: response.data.data.data
        journalsData = response.data.data.data;
      } else if (response.data.data) {
        // Direct data response: response.data.data
        journalsData = response.data.data;
      } else {
        // Fallback: response.data
        journalsData = response.data;
      }
      
      console.log('Parsed journals data:', journalsData);
      console.log('Is array?', Array.isArray(journalsData));
      
      setJournals(Array.isArray(journalsData) ? journalsData : []);
      setError(null);
    } catch (err: any) {
      console.error('Fetch journals error:', err);
      setError(err.response?.data?.message || 'Failed to fetch journals');
    } finally {
      setLoading(false);
    }
  };

  const createJournal = async (data: Partial<Journal>) => {
    try {
      const response = await api.post('/journals', data);
      console.log('Create response:', response.data);
      
      // Instead of refetching, optimistically update the state
      const newJournal = response.data.data || response.data;
      if (newJournal) {
        setJournals(prev => [newJournal, ...prev]);
      }
      
      // Still refetch to ensure consistency
      await fetchJournals();
      return response.data;
    } catch (err: any) {
      console.error('Create journal error:', err);
      throw new Error(err.response?.data?.message || 'Failed to create journal');
    }
  };

  const updateJournal = async (id: number, data: Partial<Journal>) => {
    try {
      const response = await api.put(`/journals/${id}`, data);
      
      // Optimistically update the specific journal
      const updatedJournal = response.data.data || response.data;
      if (updatedJournal) {
        setJournals(prev => 
          prev.map(journal => 
            journal.id === id ? updatedJournal : journal
          )
        );
      }
      
      await fetchJournals();
      return response.data;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to update journal');
    }
  };

  const deleteJournal = async (id: number) => {
    try {
      await api.delete(`/journals/${id}`);
      
      // Optimistically remove from state
      setJournals(prev => prev.filter(journal => journal.id !== id));
      
      await fetchJournals();
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to delete journal');
    }
  };

  const getJournal = async (id: number): Promise<Journal> => {
    try {
      const response = await api.get(`/journals/${id}`);
      // Handle the same nested structure for single journal
      return response.data.data?.data || response.data.data || response.data;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to fetch journal');
    }
  };

  const getStats = async (): Promise<JournalStats> => {
    try {
      const response = await api.get('/journals/stats/summary');
      // Handle the same nested structure for stats
      return response.data.data?.data || response.data.data || response.data;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to fetch stats');
    }
  };

  const analyzeJournal = async (content: string) => {
    try {
      const response = await api.post('/journals/analyze', { content });
      return response.data;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to analyze journal');
    }
  };

  useEffect(() => {
    fetchJournals();
  }, []);

  return {
    journals,
    loading,
    error,
    fetchJournals,
    createJournal,
    updateJournal,
    deleteJournal,
    getJournal,
    getStats,
    analyzeJournal,
  };
}