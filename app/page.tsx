import { redirect } from 'next/navigation';
import AppShell from '@/components/AppShell';
import { createClient } from '@/lib/supabase/server';
import { getFamily, getInventory } from '@/lib/supabase/data';

export const dynamic = 'force-dynamic';

type HomeSearchParams = {
  code?: string;
  next?: string;
  error?: string;
  error_description?: string;
};

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<HomeSearchParams>;
}) {
  const params = await searchParams;

  // OAuth often lands on Site URL (/) with ?code= — forward to the PKCE exchange route.
  if (params.code) {
    const q = new URLSearchParams({ code: params.code });
    if (params.next) q.set('next', params.next);
    redirect(`/auth/callback?${q.toString()}`);
  }

  if (params.error) {
    const q = new URLSearchParams({ error: params.error });
    if (params.error_description) q.set('error_description', params.error_description);
    redirect(`/login?${q.toString()}`);
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const [inventory, family] = await Promise.all([
    getInventory(user.id),
    getFamily(user.id),
  ]);

  return (
    <AppShell
      userEmail={user.email ?? 'Signed-in user'}
      initialInventory={inventory}
      initialFamily={family}
    />
  );
}
