import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { SubmitButton } from './SubmitButton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default async function Login() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    return redirect('/');
  }

  const signIn = async (formData: FormData) => {
    'use server';

    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error(error);
      return redirect('/prijava?message=Could not authenticate user');
    }

    return redirect('/');
  };

  return (
    <div className="flex h-full w-full justify-center overflow-hidden">
      <div className="flex max-w-2xl flex-1 flex-col px-8 py-4">
        <div className="flex">
          <Link
            href="/"
            className="group flex items-center rounded-md border-2 bg-btn-background px-4 py-2 text-foreground text-sm no-underline hover:bg-btn-background-hover"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="group-hover:-translate-x-1 mr-2 h-4 w-4 transition-transform"
            >
              <title>Nazaj</title>
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Nazaj
          </Link>
        </div>
        <form className="flex w-full flex-1 animate-in flex-col justify-center gap-2 text-foreground">
          <Label htmlFor="email">Email</Label>
          <Input
            className="mb-6 rounded-md border bg-inherit px-4 py-2"
            name="email"
            placeholder="ime.priimek@gmail.com"
            required
          />
          <Label htmlFor="password">Geslo</Label>
          <Input
            className="mb-6 rounded-md border bg-inherit px-4 py-2"
            type="password"
            name="password"
            placeholder="••••••••"
            required
          />
          <SubmitButton formAction={signIn} pendingText="Nalaganje...">
            Prijava
          </SubmitButton>
        </form>
      </div>
    </div>
  );
}
