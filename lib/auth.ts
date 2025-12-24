import { createClient } from '../app/utils/supabase/client'

const supabase = createClient()

export async function signInWithLinkedIn() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'linkedin_oidc',
    options: {
      redirectTo: 'https://postgen-mag.vercel.app/auth/callback',
      scopes: 'openid profile email w_member_social',
    },
  })
  
  if (error) throw error
  return data
}