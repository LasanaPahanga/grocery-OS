import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  let next = requestUrl.searchParams.get('next') ?? '/';

  if (!next.startsWith('/')) {
    next = '/';
  }

  if (!code) {
    return NextResponse.redirect(new URL('/login', requestUrl.origin));
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    const loginUrl = new URL('/login', requestUrl.origin);
    loginUrl.searchParams.set('error', 'auth');
    loginUrl.searchParams.set('error_description', error.message);
    return NextResponse.redirect(loginUrl);
  }

  const forwardedHost = request.headers.get('x-forwarded-host');
  const isLocalEnv = process.env.NODE_ENV === 'development';

  if (isLocalEnv) {
    return NextResponse.redirect(new URL(next, requestUrl.origin));
  }

  if (forwardedHost) {
    return NextResponse.redirect(`https://${forwardedHost}${next}`);
  }

  return NextResponse.redirect(new URL(next, requestUrl.origin));
}
