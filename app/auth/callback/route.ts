import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    try {
      await supabase.auth.exchangeCodeForSession(code);
      
      // Redirect to dashboard after successful login
      return NextResponse.redirect(new URL('/dashboard', request.url));
    } catch (error) {
      console.error('Auth callback error:', error);
      // Redirect to login with error
      return NextResponse.redirect(
        new URL('/auth/error?message=Authentication failed', request.url)
      );
    }
  }

  // No code provided
  return NextResponse.redirect(new URL('/auth/error?message=No authorization code', request.url));
}
