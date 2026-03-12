const { createClient } = require('@supabase/supabase-js');
const { getConfig } = require('../config/services');

// Initialize the Supabase client.
// It relies on these variables existing in backend/.env:
// SUPABASE_URL
// SUPABASE_ANON_KEY

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false
  }
});

module.exports = supabase;
