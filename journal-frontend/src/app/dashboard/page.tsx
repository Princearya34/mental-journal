'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useJournals } from '@/hooks/useJournals';
import { Header } from '@/components/layout/Header';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { JournalStats } from '@/types';
import Link from 'next/link';
import { BookOpen, TrendingUp, Calendar, Plus, BarChart3 } from 'lucide-react';

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const { journals, loading: journalsLoading } = useJournals();
  const [stats, setStats] = useState<JournalStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        if (Array.isArray(journals) && journals.length > 0) {
          const mockStats: JournalStats = {
            total_entries: journals.length,
            entries_this_week: journals.filter(j => {
              const journalDate = new Date(j.created_at);
              const weekAgo = new Date();
              weekAgo.setDate(weekAgo.getDate() - 7);
              return journalDate > weekAgo;
            }).length,
            entries_this_month: journals.filter(j => {
              const journalDate = new Date(j.created_at);
              const monthAgo = new Date();
              monthAgo.setMonth(monthAgo.getMonth() - 1);
              return journalDate > monthAgo;
            }).length,
            most_common_mood: 'happy',
            writing_streak: 5,
          };
          setStats(mockStats);
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setStatsLoading(false);
      }
    };

    if (!journalsLoading) {
      fetchStats();
    }
  }, [journals, journalsLoading]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  const recentJournals = Array.isArray(journals) ? journals.slice(0, 3) : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user.name}!
          </h1>
          <p className="text-gray-600 mt-2">
            Here's your journaling overview and recent entries.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Entries</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statsLoading ? '...' : stats?.total_entries || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Week</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statsLoading ? '...' : stats?.entries_this_week || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Writing Streak</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statsLoading ? '...' : stats?.writing_streak || 0}
              </div>
              <p className="text-xs text-muted-foreground">days</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Common Mood</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold capitalize">
                {statsLoading ? '...' : stats?.most_common_mood || 'N/A'}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Entries */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recent Entries</CardTitle>
                  <Link href="/journals">
                    <Button variant="outline" size="sm">View All</Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {journalsLoading ? (
                  <div className="flex justify-center py-8">
                    <LoadingSpinner />
                  </div>
                ) : recentJournals.length > 0 ? (
                  <div className="space-y-4">
                    {recentJournals.map((journal) => (
                      <div key={journal.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                        <Link href={`/journals/${journal.id}`}>
                          <h3 className="font-medium text-gray-900 hover:text-blue-600 cursor-pointer">
                            {journal.title}
                          </h3>
                        </Link>
                        <p className="text-sm text-gray-600 mt-1">
                          {journal.content.substring(0, 100)}...
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-500">
                            {new Date(journal.created_at).toLocaleDateString()}
                          </span>
                          {journal.mood && (
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                              {journal.mood}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">No journal entries yet</p>
                    <Link href="/journals/new">
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Your First Entry
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/journals/new">
                  <Button className="w-full justify-start">
                    <Plus className="h-4 w-4 mr-2" />
                    New Journal Entry
                  </Button>
                </Link>
                <Link href="/journals">
                  <Button variant="outline" className="w-full justify-start">
                    <BookOpen className="h-4 w-4 mr-2" />
                    View All Entries
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Writing Tips */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Writing Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-gray-600">
                  <p>• Try to write consistently, even if it's just a few sentences</p>
                  <p>• Don't worry about perfect grammar - focus on your thoughts</p>
                  <p>• Use the mood tracker to identify patterns</p>
                  <p>• Review past entries to see your growth</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}