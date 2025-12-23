import { supabase } from './supabase';

export async function signInWithLinkedIn() {
  // Use the Vercel callback URL for the LinkedIn OAuth flow
  const redirectUrl = 'https://postgen-mag.vercel.app/auth/callback';

  // Ensure we do not use the implicit flow. Request PKCE/authorization code flow so the
  // authorization code is delivered to Supabase's callback endpoint (server-side exchange).
  // Supabase by default uses PKCE; we explicitly avoid any `flowType: 'implicit'` parameter.
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'linkedin_oidc',
    options: {
      redirectTo: redirectUrl,
    },
  });

  if (error) {
    console.error('LinkedIn login error:', error);
    throw error;
  }

  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('Sign out error:', error);
    throw error;
  }
}

export async function getCurrentUser() {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.user;
}

export async function getCurrentSession() {
  const { data: { session }, error } = await supabase.auth.getSession();
  return { session, error };
}

export async function getLinkedInProfile() {
  try {
    const user = await getCurrentUser();
    if (!user) return null;

    // Fetch user's LinkedIn profile from user_metadata (populated by Supabase)
    return {
      id: user.id,
      email: user.email,
      name: user.user_metadata?.name,
      picture: user.user_metadata?.picture,
      linkedin_id: user.user_metadata?.sub, // LinkedIn user ID
    };
  } catch (error) {
    console.error('Error fetching LinkedIn profile:', error);
    return null;
  }
}

export async function sharePostToLinkedIn(content: string): Promise<boolean> {
  try {
    // Open LinkedIn share dialog with content
    const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      window.location.origin
    )}`;

    // For native LinkedIn sharing, we'll use a workaround:
    // Open LinkedIn with pre-filled text (user must manually post)
    const linkedInShareUrl = `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(
      content
    )}`;

    window.open(linkedInShareUrl, 'linkedin-share', 'width=550,height=600');
    return true;
  } catch (error) {
    console.error('Error sharing to LinkedIn:', error);
    throw error;
  }
}
