'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useJournals } from '@/hooks/useJournals';
import { Header } from '@/components/layout/Header';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { JournalAnalysis } from '@/components/journal/JournalAnalysis';
import { Journal } from '@/types';
import { formatDateTime } from '@/lib/utils';
import Link from 'next/link';
import { ArrowLeft, Edit, Trash2, Calendar } from 'lucide-react';

interface JournalDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function JournalDetailPage({ params }: JournalDetailPageProps) {
  // Unwrap the params Promise using React.use()
  const resolvedParams = use(params);
  const { id } = resolvedParams;

  const { user, loading: authLoading } = useAuth();
  const { getJournal, deleteJournal } = useJournals();
  const [journal, setJournal] = useState<Journal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    let isMounted = true;

    const fetchJournal = async () => {
      if (!user || !id) return;
      
      try {
        setLoading(true);
        setError('');
        const journalData = await getJournal(parseInt(id));
        
        // Only update state if component is still mounted
        if (isMounted) {
          setJournal(journalData);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.response?.data?.message || 'Failed to load journal entry');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchJournal();

    // Cleanup function
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, id]); // Explicitly exclude getJournal with eslint disable

  const handleDelete = async () => {
    if (!journal) return;
    
    if (window.confirm('Are you sure you want to delete this journal entry?')) {
      try {
        await deleteJournal(journal.id);
        router.push('/journals');
      } catch (error) {
        console.error('Failed to delete journal:', error);
      }
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

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
      <main className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link href="/journals" className="inline-flex items-center text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Journals
          </Link>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-2xl">{journal.title}</CardTitle>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDateTime(journal.created_at)}
                    </div>
                    {journal.mood && (
                      <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Mood: {journal.mood}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Link href={`/journals/${journal.id}/edit`}>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm" onClick={handleDelete}>
                    <Trash2 className="h-4 w-4 mr-2 text-red-600" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                {journal.content.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-4 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </CardContent>
          </Card>

          <JournalAnalysis content={journal.content} />
        </div>
      </main>
    </div>
  );
}