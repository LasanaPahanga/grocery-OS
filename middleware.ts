import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const code = searchParams.get('code');

  // Supabase may redirect OAuth to Site URL (e.g. /) instead of /auth/callback.
  if (code && pathname !== '/auth/callback') {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/auth/callback';
    return NextResponse.redirect(redirectUrl);
  }

  return updateSession(request);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
