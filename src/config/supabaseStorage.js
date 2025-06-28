
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv'; 
dotenv.config(); 

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: SUPABASE_URL o SUPABASE_KEY no definidos en .env para Supabase Storage.');
  process.exit(1); 
}

const supabaseStorage = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false
  }
});

export default supabaseStorage;