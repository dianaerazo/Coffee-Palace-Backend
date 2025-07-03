import supabase from '../config/supabase.js';

const authService = {
   signUp: async (email, password, name) => {

    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          name: name 
        }
      }
    });

    if (error) {
      console.error('[AuthService] Error de autenticación de Supabase (signUp):', error);
      throw new Error(`Fallo en el registro: ${error.message}`);
    }

    if (!data.user && !data.session) {
      console.log('[AuthService] Registro inicial de Supabase completado, requiere confirmación por email.');
     
      return { user: null, session: null, message: 'Revisa tu correo para confirmar la cuenta.' };
    }

  
    console.log('[AuthService] Proceso de registro finalizado. Devolviendo datos de sesión/usuario.');
    return data;
  },

  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      console.error('Error en authService.signIn:', error);
      throw new Error(`Fallo en el inicio de sesión: ${error.message}`);
    }
    return data;
  },

  signInWithGoogleIdToken: async (googleIdToken) => {
    try {
      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: 'google',
        token: googleIdToken
      });

      if (error) {
        console.error('Error en authService.signInWithGoogleIdToken:', error);
        throw new Error(`Fallo en el inicio de sesión con Google: ${error.message}`);
      }
      return data;
    } catch (e) {
      console.error('Excepción en authService.signInWithGoogleIdToken:', e);
      throw e;
    }
  },

  sendPasswordResetEmail: async (email) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    });

    if (error) {
      console.error('Error en authService.sendPasswordResetEmail:', error);
      throw new Error(`Fallo al enviar el enlace de recuperación: ${error.message}`);
    }
    return data;
  },

  deleteUser: async (userId) => {
    try {
      const { data, error } = await supabase.auth.admin.deleteUser(userId);

      if (error) {
        console.error(`Error en authService.deleteUser para ID ${userId}:`, error);
        throw new Error(`Fallo al borrar usuario: ${error.message}`);
      }
      if (!data || !data.user) {
        throw new Error(`Usuario con ID ${userId} no encontrado o ya borrado.`);
      }
      return data;
    } catch (e) {
      console.error('Excepción en authService.deleteUser:', e);
      throw e;
    }
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Error en authService.signOut:', error);
      throw new Error(`Fallo al cerrar sesión: ${error.message}`);
    }
    return { message: 'Sesión cerrada exitosamente.' };
  },

  /**
   * Obtiene los datos de un usuario de la tabla 'usuario' por su correo.
   * @param {string} email - El correo electrónico del usuario.
   * @returns {Promise<Object|null>} El objeto usuario de tu tabla 'usuario', o null si no se encuentra.
   * @throws {Error} Si ocurre un error en la consulta a la base de datos.
   */
   getUsuarioProfileByEmail: async (email) => {
        try {

            const { data, error } = await supabase
                .from('usuario')
                .select('*')
                .eq('correo', email)
                .single(); 

            if (error) {
                console.error('[AuthService] Supabase query error:', error); 
                return null;
            }

            if (!data) {
                console.log('[AuthService] No user profile found for email in Supabase:', email); 
                return null;
            }

            return data; 
        } catch (e) {
            console.error('[AuthService] Exception in getUsuarioProfileByEmail:', e.message);
            throw e; 
        }
    },
};

export default authService;