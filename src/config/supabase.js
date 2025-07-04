import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY; 

if (!supabaseUrl || !supabaseServiceRoleKey) { 
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment variables.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, { 
  auth: {
    autoRefreshToken: false, 
    persistSession: false,   
    detectSessionInUrl: false 
  }
});

export default supabase;