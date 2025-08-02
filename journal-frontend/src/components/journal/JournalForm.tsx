'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useJournals } from '@/hooks/useJournals';
import { Journal } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface JournalFormProps {
  journal?: Journal;
  mode: 'create' | 'edit';
}

export function JournalForm({ journal, mode }: JournalFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    mood: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { createJournal, updateJournal } = useJournals();
  const router = useRouter();

  useEffect(() => {
    if (journal && mode === 'edit') {
      setFormData({
        title: journal.title || '',
        content: journal.content,
        mood: journal.mood || '',
      });
    }
  }, [journal, mode]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        title: formData.title,
        content: formData.content,
        mood: formData.mood,
        ai_response: '', // optional, can be removed or populated later
      };

      if (mode === 'create') {
        await createJournal(payload);
      } else if (journal) {
        await updateJournal(journal.id, payload);
      }

      router.push('/journals');
    } catch (err: any) {
      setError(err.message || `Failed to ${mode} journal entry`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link href="/journals" className="inline-flex items-center text-gray-600 hover:text-gray-900">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Journals
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {mode === 'create' ? 'Create New Journal Entry' : 'Edit Journal Entry'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <Input
              label="Title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Enter a title for your journal entry"
            />

            <div>
              <label htmlFor="mood" className="block text-sm font-medium text-gray-700 mb-1">
                Mood (Optional)
              </label>
              <select
                id="mood"
                name="mood"
                value={formData.mood}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select a mood</option>
                <option value="happy">😊 Happy</option>
                <option value="sad">😢 Sad</option>
                <option value="excited">🎉 Excited</option>
                <option value="anxious">😰 Anxious</option>
                <option value="calm">😌 Calm</option>
                <option value="angry">😠 Angry</option>
                <option value="grateful">🙏 Grateful</option>
                <option value="confused">😕 Confused</option>
                <option value="motivated">💪 Motivated</option>
                <option value="tired">😴 Tired</option>
              </select>
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                Content
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                required
                rows={12}
                className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Write your thoughts here..."
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Link href="/journals">
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" loading={loading}>
                <Save className="h-4 w-4 mr-2" />
                {mode === 'create' ? 'Create Entry' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
