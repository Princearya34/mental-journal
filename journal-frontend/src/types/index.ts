export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Journal {
  id: number;
  title: string;
  content: string;
  mood?: string;
  ai_response?: string;
  created_at: string;
  updated_at: string;
  user_id: number;
}

export interface JournalStats {
  total_entries: number;
  entries_this_week: number;
  entries_this_month: number;
  writing_streak: number;
  most_common_mood: string;
}


export interface AIAnalysis {
  sentiment: 'positive' | 'negative' | 'neutral';
  suggested_mood: string;
  keywords: string[];
  ai_response: string;
  insights?: string[];
  suggestions?: string[];
}


export interface AuthResponse {
  user: User;
  access_token: string;
  token_type: string;
  message?: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}