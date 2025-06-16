// test/getToken.js
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

async function getTestToken() {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'test@example.com',
    password: 'test-password'
  });

  if (error) {
    console.error('Error getting token:', error);
    return;
  }

  console.log('Access Token:', data.session.access_token);
}

getTestToken();
