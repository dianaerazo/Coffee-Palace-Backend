import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // <--- ¡CAMBIO AQUÍ! Usar SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceRoleKey) { // <--- ¡CAMBIO AQUÍ! Validar SERVICE_ROLE_KEY
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment variables.");
  process.exit(1);
}

// Inicializa el cliente Supabase con la service_role_key
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, { // <--- ¡CAMBIO AQUÍ! Pasar SERVICE_ROLE_KEY
  auth: {
    autoRefreshToken: false, // Opcional, pero recomendado para el cliente de backend
    persistSession: false,   // Opcional, pero recomendado para el cliente de backend
    detectSessionInUrl: false // Opcional, pero recomendado para el cliente de backend
  }
});

export default supabase;