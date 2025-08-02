import React from 'react';
import Link from 'next/link';
import { Journal } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatDate, truncateText } from '@/lib/utils';
import { Edit, Trash2, Calendar } from 'lucide-react';

interface JournalCardProps {
  journal: Journal;
  onDelete: (id: number) => void;
}

export function JournalCard({ journal, onDelete }: JournalCardProps) {
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this journal entry?')) {
      onDelete(journal.id);
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">
            <Link 
              href={`/journals/${journal.id}`}
              className="hover:text-blue-600 transition-colors"
            >
              {journal.title}
            </Link>
          </CardTitle>
          <div className="flex space-x-1">
            <Link href={`/journals/${journal.id}/edit`}>
              <Button variant="ghost" size="sm">
                <Edit className="h-4 w-4" />
              </Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={handleDelete}>
              <Trash2 className="h-4 w-4 text-red-600" />
            </Button>
          </div>
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <Calendar className="h-4 w-4 mr-1" />
          {formatDate(journal.created_at)}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 mb-4">
          {truncateText(journal.content, 150)}
        </p>
        {journal.mood && (
          <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            Mood: {journal.mood}
          </div>
        )}
      </CardContent>
    </Card>
  );
}