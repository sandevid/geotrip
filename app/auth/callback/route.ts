import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const origin = requestUrl.origin;

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Get the user
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        // Check if profile exists, if not create one
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', user.id)
          .single();

        if (!existingProfile) {
          // Create profile
          await supabase.from('profiles').insert({
            id: user.id,
            email: user.email!,
            full_name: user.user_metadata.full_name || null,
            avatar_url: user.user_metadata.avatar_url || null,
            role: 'user',
          });
        }
      }

      return NextResponse.redirect(`${origin}/`);
    }
  }

  // Return to home if something went wrong
  return NextResponse.redirect(`${origin}/`);
}
