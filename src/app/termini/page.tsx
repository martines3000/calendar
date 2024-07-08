import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { View } from './View';

export default async function Page() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/prijava');
  }

  return (
    <div className="flex h-full w-full justify-center overflow-hidden">
      <View />
    </div>
  );
}
