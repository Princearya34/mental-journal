'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { BookOpen, Brain, BarChart3, Shield } from 'lucide-react';

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (user) {
    return null; // Will redirect to dashboard
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pt-20 pb-16 text-center">
          <div className="flex justify-center mb-8">
            <BookOpen className="h-16 w-16 text-blue-600" />
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6">
            Your Personal
            <span className="text-blue-600"> Journal</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Capture your thoughts, track your moods, and gain insights with AI-powered analysis. 
            Start your journaling journey today.
          </p>
          <div className="space-x-4">
            <Link href="/register">
              <Button size="lg">Get Started</Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg">Sign In</Button>
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 pb-20">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <BookOpen className="h-12 w-12 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Easy Journaling</h3>
            <p className="text-gray-600">
              Write and organize your thoughts with our intuitive interface. 
              Track your daily experiences and emotions.
            </p>
          </div>
          
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <Brain className="h-12 w-12 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">AI Insights</h3>
            <p className="text-gray-600">
              Get personalized insights about your writing patterns, mood trends, 
              and emotional well-being.
            </p>
          </div>
          
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <BarChart3 className="h-12 w-12 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Progress Tracking</h3>
            <p className="text-gray-600">
              Monitor your journaling habits and see your personal growth 
              over time with detailed statistics.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}