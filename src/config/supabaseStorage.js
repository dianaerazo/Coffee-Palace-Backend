// your-backend-project/src/config/supabaseStorage.js
// Configura el cliente de Supabase Storage

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv'; // Asegúrate de tener dotenv si usas .env para las claves

dotenv.config(); // Carga las variables de entorno

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

// Verifica que las variables de entorno estén cargadas
if (!supabaseUrl || !supabaseKey) {
  console.error('Error: SUPABASE_URL o SUPABASE_KEY no definidos en .env para Supabase Storage.');
  process.exit(1); // Salir si las claves no están
}

// Crea una instancia del cliente de Supabase para Storage
const supabaseStorage = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false // No es necesario mantener la sesión de autenticación para Storage en un backend simple
  }
});

export default supabaseStorage;