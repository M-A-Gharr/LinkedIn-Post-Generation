import { createClient } from '../app/utils/supabase/client';

const supabase = createClient();

// 1. Sign In
export async function signInWithLinkedIn() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'linkedin_oidc',
    options: {
      redirectTo: 'https://postgen-mag.vercel.app/auth/callback',
      scopes: 'openid profile email w_member_social',
    },
  });
  if (error) throw error;
  return data;
}

// 2. Sign Out
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
  window.location.href = '/auth/login';
}

// 3. Get Current User
export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) return null;
  return user;
}

// 4. Get Current Session (Used by protected-layout)
export async function getCurrentSession() {
  const { data: { session }, error } = await supabase.auth.getSession();
  return { session, error };
}

// 5. Get LinkedIn Profile metadata
export async function getLinkedInProfile() {
  try {
    const user = await getCurrentUser();
    if (!user) return null;
    return {
      id: user.id,
      email: user.email,
      name: user.user_metadata?.full_name || user.user_metadata?.name,
      picture: user.user_metadata?.avatar_url || user.user_metadata?.picture,
    };
  } catch (error) {
    return null;
  }
}

// 6. Share Post (The function your dashboard is crying for)
export async function sharePostToLinkedIn(content: string): Promise<boolean> {
  try {
    // This is your workaround for now (pre-filled text)
    const linkedInShareUrl = `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(content)}`;
    window.open(linkedInShareUrl, 'linkedin-share', 'width=550,height=600');
    return true;
  } catch (error) {
    console.error('Error sharing to LinkedIn:', error);
    return false;
  }
}