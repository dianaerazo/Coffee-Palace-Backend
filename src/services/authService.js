// your-backend-project/src/services/authService.js
import supabase from '../config/supabase.js';

const authService = {
  /**
   * Registra un nuevo usuario con email, contraseña y nombre.
   * El nombre se guarda en los metadatos del usuario de Supabase.
   * @param {string} email - El correo electrónico del usuario.
   * @param {string} password - La contraseña del usuario.
   * @param {string} name - El nombre del usuario.
   * @returns {Promise<Object>} Un objeto con los datos del usuario y la sesión, o un mensaje de confirmación por correo.
   * @throws {Error} Si ocurre un error durante el registro (ej. email ya existe, contraseña débil).
   */
  signUp: async (email, password, name) => {
    // Llama a la API de registro de Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: { // Metadatos que se guardarán con el perfil de auth.users
          name: name
        }
      }
    });

    if (error) {
      console.error('Error en authService.signUp:', error);
      throw new Error(`Fallo en el registro: ${error.message}`);
    }
    // Si data.user es null pero no hay error, suele significar que se envió un correo de confirmación.
    if (!data.user && !data.session) {
      return { user: null, session: null, message: 'Revisa tu correo para confirmar la cuenta.' };
    }
    return data; // Contiene user y session
  },

  /**
   * Inicia sesión con email y contraseña.
   * @param {string} email - El correo electrónico del usuario.
   * @param {string} password - La contraseña del usuario.
   * @returns {Promise<Object>} Un objeto con los datos del usuario y la sesión.
   * @throws {Error} Si ocurre un error durante el inicio de sesión (ej. credenciales inválidas, email no confirmado).
   */
  signIn: async (email, password) => {
    // Llama a la API de inicio de sesión de Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      console.error('Error en authService.signIn:', error);
      throw new Error(`Fallo en el inicio de sesión: ${error.message}`);
    }
    return data; // Contiene user y session
  },

  /**
   * Inicia sesión utilizando un ID Token de Google.
   * El cliente Android obtiene este token y lo envía al backend,
   * el backend lo usa para autenticarse directamente con Supabase Auth.
   * @param {string} googleIdToken - El ID Token de Google (JWT).
   * @returns {Promise<Object>} Un objeto con los datos del usuario y la sesión de Supabase.
   * @throws {Error} Si el ID Token es inválido o ocurre un error en la autenticación.
   */
  signInWithGoogleIdToken: async (googleIdToken) => {
    try {
      // Supabase Auth puede verificar y usar directamente el ID Token de Google
      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: 'google', // Especifica el proveedor OAuth
        token: googleIdToken // El ID Token de Google
      });

      if (error) {
        console.error('Error en authService.signInWithGoogleIdToken:', error);
        throw new Error(`Fallo en el inicio de sesión con Google: ${error.message}`);
      }
      return data; // Contiene user y session de Supabase
    } catch (e) {
      console.error('Excepción en authService.signInWithGoogleIdToken:', e);
      throw e;
    }
  },

  /**
   * Envía un enlace de recuperación de contraseña a un email.
   * @param {string} email - El correo electrónico al que se enviará el enlace de recuperación.
   * @returns {Promise<Object>} Un objeto vacío o con datos de confirmación.
   * @throws {Error} Si el email no existe o hay un error al enviar el enlace.
   */
  sendPasswordResetEmail: async (email) => {
    // Llama a la API de restablecimiento de contraseña de Supabase Auth
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      // Opcional: puedes especificar una URL para redirigir al usuario después de hacer clic en el enlace del correo.
      // url: 'https://tu-dominio.com/update-password',
    });

    if (error) {
      console.error('Error en authService.sendPasswordResetEmail:', error);
      throw new Error(`Fallo al enviar el enlace de recuperación: ${error.message}`);
    }
    // Supabase a menudo devuelve { user: null } o un objeto vacío en caso de éxito aquí.
    return data;
  },

  /**
   * Borra un usuario de Supabase Auth utilizando la clave de rol de servicio (admin).
   * Esto omite las políticas RLS y es para uso administrativo.
   * @param {string} userId - El UUID del usuario (id de la tabla auth.users).
   * @returns {Promise<Object>} Los datos del usuario borrado.
   * @throws {Error} Si el usuario no se encuentra o hay un error en la operación.
   */
  deleteUser: async (userId) => {
    try {
      // supabase.auth.admin.deleteUser() requiere la service_role_key
      const { data, error } = await supabase.auth.admin.deleteUser(userId);

      if (error) {
        console.error(`Error en authService.deleteUser para ID ${userId}:`, error);
        throw new Error(`Fallo al borrar usuario: ${error.message}`);
      }
      if (!data || !data.user) {
        // Puede ocurrir si el usuario ya no existe
        throw new Error(`Usuario con ID ${userId} no encontrado o ya borrado.`);
      }
      return data; // Contiene el objeto del usuario borrado
    } catch (e) {
      console.error('Excepción en authService.deleteUser:', e);
      throw e;
    }
  },

  /**
   * Cierra la sesión activa de un usuario en Supabase.
   * Aunque el cliente también limpia su sesión local, esto invalida la sesión en el servidor.
   * @returns {Promise<Object>} Resultado del cierre de sesión.
   * @throws {Error} Si ocurre un error al intentar cerrar la sesión.
   */
  signOut: async () => {
    const { error } = await supabase.auth.signOut(); // Esto invalida el refresh token del usuario si está presente

    if (error) {
      console.error('Error en authService.signOut:', error);
      throw new Error(`Fallo al cerrar sesión: ${error.message}`);
    }
    return { message: 'Sesión cerrada exitosamente.' };
  },
};

export default authService;