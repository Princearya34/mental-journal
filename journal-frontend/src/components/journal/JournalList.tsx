'use client';

import React from 'react';
import { useJournals } from '@/hooks/useJournals';
import { JournalCard } from './JournalCard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { Plus } from 'lucide-react';

export function JournalList() {
  const { journals, loading, error, deleteJournal } = useJournals();

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  if (!Array.isArray(journals) || journals.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">No journal entries yet</h3>
        <p className="text-gray-600 mb-4">Start your journaling journey by creating your first entry.</p>
        <Link href="/journals/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create First Entry
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Your Journal Entries</h2>
        <Link href="/journals/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Entry
          </Button>
        </Link>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {journals.map((journal) => (
          <JournalCard
            key={journal.id}
            journal={journal}
            onDelete={deleteJournal}
          />
        ))}
      </div>
    </div>
  );
}