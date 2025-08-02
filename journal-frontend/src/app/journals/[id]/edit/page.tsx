'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useJournalActions } from '@/hooks/useJournalActions'; // <- use this new hook
import { Header } from '@/components/layout/Header';
import { JournalForm } from '@/components/journal/JournalForm';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Journal } from '@/types';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function EditJournalPage() {
  const router = useRouter();
  const { id } = useParams() as { id: string };

  const { user, loading: authLoading } = useAuth();
  const { getJournal } = useJournalActions(); // <- only includes getJournal, no side effects

  const [journal, setJournal] = useState<Journal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [authLoading, user, router]);

  const fetchJournal = useCallback(async () => {
    if (!id || !user) return;

    try {
      setLoading(true);
      const data = await getJournal(parseInt(id));
      setJournal(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to load journal entry');
    } finally {
      setLoading(false);
    }
  }, [id, user, getJournal]);

  useEffect(() => {
    fetchJournal();
  }, [fetchJournal]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) return null;

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">{error}</p>
            <Link href="/journals">
              <Button>Back to Journals</Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  if (!journal) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">Journal entry not found</p>
            <Link href="/journals">
              <Button>Back to Journals</Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <JournalForm journal={journal} mode="edit" />
      </main>
    </div>
  );
}