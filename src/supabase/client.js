// src/supabase/client.js
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Use your secret service role key on backend.
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = { supabase };