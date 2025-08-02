'use client';

import React, { useState } from 'react';
import { useJournals } from '@/hooks/useJournals';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { AIAnalysis } from '@/types';
import { Brain, TrendingUp, Lightbulb, Heart, RefreshCcw, ListChecks } from 'lucide-react';

interface JournalAnalysisProps {
  content: string;
}

export function JournalAnalysis({ content }: JournalAnalysisProps) {
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { analyzeJournal } = useJournals();

  const handleAnalyze = async () => {
    if (!content.trim()) {
      setError('Please provide some content to analyze.');
      return;
    }

    setLoading(true);
    setError('');
    setAnalysis(null);

    try {
      const result = await analyzeJournal(content);
      setAnalysis(result);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to analyze journal entry.');
    } finally {
      setLoading(false);
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-600 bg-green-100';
      case 'negative': return 'text-red-600 bg-red-100';
      case 'neutral':
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Brain className="h-5 w-5 mr-2 text-purple-600" />
          AI Analysis
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {!analysis && (
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              Get AI insights about your journal entry including sentiment, mood, keywords, and suggestions.
            </p>
            <Button onClick={handleAnalyze} loading={loading}>
              <Brain className="h-4 w-4 mr-2" />
              Analyze Entry
            </Button>
          </div>
        )}

        {error && (
          <div className="rounded-md bg-red-50 p-4 text-sm text-red-800">
            {error}
          </div>
        )}

        {loading && (
          <div className="flex justify-center py-8">
            <LoadingSpinner size="lg" />
          </div>
        )}

        {analysis && (
          <div className="space-y-6">
            {/* Sentiment */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center mb-1">
                  <Heart className="h-4 w-4 mr-2 text-pink-600" />
                  <span className="font-medium">Sentiment</span>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getSentimentColor(analysis.sentiment)}`}>
                  {analysis.sentiment}
                </span>
              </div>

              {/* Suggested Mood */}
              <div>
                <div className="flex items-center mb-1">
                  <TrendingUp className="h-4 w-4 mr-2 text-blue-600" />
                  <span className="font-medium">Suggested Mood</span>
                </div>
                <span className="text-sm text-gray-700 capitalize">{analysis.suggested_mood}</span>
              </div>
            </div>

            {/* AI Response */}
            {analysis.ai_response && (
              <div>
                <h4 className="font-medium mb-1">AI Reflection</h4>
                <p className="text-sm text-gray-800 bg-gray-50 p-3 rounded-md">{analysis.ai_response}</p>
              </div>
            )}

            {/* Keywords */}
            {analysis.keywords && analysis.keywords.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Keywords</h4>
                <div className="flex flex-wrap gap-2">
                  {analysis.keywords.map((word, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {word}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Insights */}
            {analysis.insights && analysis.insights.length > 0 && (
              <div>
                <h4 className="font-medium mb-2 flex items-center">
                  <Lightbulb className="h-4 w-4 mr-2 text-yellow-600" />
                  Insights
                </h4>
                <ul className="space-y-2">
                  {analysis.insights.map((insight, index) => (
                    <li key={index} className="text-sm text-gray-700 bg-yellow-50 p-3 rounded-md">
                      {insight}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Suggestions */}
            {analysis.suggestions && analysis.suggestions.length > 0 && (
              <div>
                <h4 className="font-medium mb-2 flex items-center">
                  <ListChecks className="h-4 w-4 mr-2 text-green-600" />
                  Suggestions
                </h4>
                <ul className="space-y-2">
                  {analysis.suggestions.map((suggestion, index) => (
                    <li key={index} className="text-sm text-gray-700 bg-green-50 p-3 rounded-md">
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setAnalysis(null);
                setError('');
              }}
            >
              <RefreshCcw className="h-4 w-4 mr-2" />
              Analyze Again
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
