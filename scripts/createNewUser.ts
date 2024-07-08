import { createClient } from '@supabase/supabase-js';
import prompts from 'prompts';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SERVICE_ROLE_KEY!
);

const emailResponse = await prompts({
  type: 'text',
  name: 'email',
  message: 'Enter new users email address:',
});

if (!emailResponse.email) {
  console.error('Please provide an email address.');
  process.exit(1);
}

const passwordResponse = await prompts({
  type: 'text',
  name: 'password',
  message: 'Enter new users password:',
});

if (!passwordResponse.password) {
  console.error('Please provide a password');
  process.exit(1);
}

const nameResponse = await prompts({
  type: 'text',
  name: 'name',
  message: 'Enter new users name:',
});


if (!nameResponse.name) {
  console.error('Please provide a name');
  process.exit(1);
}

const { data, error } = await supabase.auth.admin.createUser({
  email: emailResponse.email,
  password: passwordResponse.password,
  user_metadata: { name: nameResponse.name },
  email_confirm: true,
});

if (error) {
  console.error(error);
  process.exit(1);
}

console.log('User created:');
console.log(data);
