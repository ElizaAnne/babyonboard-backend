// test/createTestUser.js
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

async function createTestUser() {
  const testEmail = 'test@yourdomain.com';
  const testPassword = 'secure-test-password';

  // Sign up new user
  const { data, error } = await supabase.auth.signUp({
    email: testEmail,
    password: testPassword
  });

  if (error) {
    console.error('Error creating user:', error);
    return;
  }

  console.log('Test user created:', {
    email: testEmail,
    password: testPassword,
    userId: data.user.id
  });

  // Sign in to get token
  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
    email: testEmail,
    password: testPassword
  });

  if (signInError) {
    console.error('Error signing in:', signInError);
    return;
  }

  console.log('Access Token:', signInData.session.access_token);
}

createTestUser();
