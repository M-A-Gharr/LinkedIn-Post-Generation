import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET(request) {
  const supabase = createRouteHandlerClient({ cookies });
  const url = new URL(request.url);
  const code = url.searchParams.get('code');

  if (!code) {
    return NextResponse.redirect(new URL('/auth/error', request.url));
  }

  try {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      console.error('Auth callback error:', error);
      return NextResponse.redirect(new URL('/auth/error', request.url));
    }

    return NextResponse.redirect(new URL('/dashboard', request.url));
  } catch (err) {
    console.error('Unexpected callback error:', err);
    return NextResponse.redirect(new URL('/auth/error', request.url));
  }
}
