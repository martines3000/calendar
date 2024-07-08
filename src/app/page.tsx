import { View } from '@/app/View';
import { createClient } from '@/lib/supabase/server';

export default async function Page() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <View isLoggedIn={!!user} />;
}
