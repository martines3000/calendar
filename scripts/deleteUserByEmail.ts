import { createClient } from '@supabase/supabase-js';
import prompts from 'prompts';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SERVICE_ROLE_KEY!
);

const emailResponse = await prompts({
  type: 'text',
  name: 'email',
  message: 'Enter email address of user to delete:',
});

if (!emailResponse.email) {
  console.error('Please provide an email address.');
  process.exit(1);
}

// Find the user by email
const { data: listUsersData, error: listUsersError } =
  await supabase.auth.admin.listUsers();

if (listUsersError) {
  console.error(listUsersError);
  process.exit(1);
}

const user = listUsersData.users.find((user) => user.email === emailResponse.email);

if (!user) {
  console.error(`User with email ${emailResponse.email} not found`);
  process.exit(1);
}

// Delete the user
const { error } = await supabase.auth.admin.deleteUser(user.id);

if (error) {
  console.error(error);
  process.exit(1);
}
