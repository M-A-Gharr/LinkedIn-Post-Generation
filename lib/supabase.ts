import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Post = {
  id: string;
  user_id: string | null;
  content: string;
  type: 'long' | 'short' | 'carousel';
  theme: string;
  created_at: string;
  updated_at: string;
  is_favorite: boolean;
};

export type CalendarIdea = {
  id: string;
  user_id: string | null;
  title: string;
  description: string | null;
  scheduled_date: string | null;
  status: 'pending' | 'completed' | 'archived';
  category: string | null;
  created_at: string;
  updated_at: string;
};
