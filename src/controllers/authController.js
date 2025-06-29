import authService from '../services/authService.js';

const authController = {

  signUp: async (req, res, next) => {
    try {
      const { email, password, name } = req.body;
      if (!email || !password || !name) {
        res.status(400);
        throw new Error('Email, contraseña y nombre son requeridos para el registro.');
      }
      const data = await authService.signUp(email, password, name);
      if (data.message) {
        return res.status(200).json({ message: data.message }); // Mensaje de confirmación por correo
      }
      res.status(201).json({ message: 'Usuario registrado con éxito.', user: data.user, session: data.session });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Maneja el inicio de sesión de usuarios existentes.
   * Ruta: POST /api/auth/signin
   * Espera: { email, password } en el cuerpo de la solicitud.
   */
  signIn: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        res.status(400);
        throw new Error('Email y contraseña son requeridos para iniciar sesión.');
      }
      const data = await authService.signIn(email, password);
      res.status(200).json({ message: 'Inicio de sesión exitoso.', user: data.user, session: data.session });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Maneja el inicio de sesión con un ID Token de Google.
   * Ruta: POST /api/auth/signin-google-token
   * Espera: { idToken } en el cuerpo de la solicitud.
   */
  signInWithGoogleToken: async (req, res, next) => {
    try {
      const { idToken } = req.body;
      if (!idToken) {
        res.status(400);
        throw new Error('El ID Token de Google es requerido.');
      }
      const data = await authService.signInWithGoogleIdToken(idToken);
      res.status(200).json({ message: 'Inicio de sesión con Google exitoso.', user: data.user, session: data.session });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Maneja la solicitud de restablecimiento de contraseña.
   * Ruta: POST /api/auth/reset-password
   * Espera: { email } en el cuerpo de la solicitud.
   */
  sendPasswordReset: async (req, res, next) => {
    try {
      const { email } = req.body;
      if (!email) {
        res.status(400);
        throw new Error('Email es requerido para restablecer la contraseña.');
      }
      await authService.sendPasswordResetEmail(email);
      res.status(200).json({ message: 'Si el correo está registrado, se ha enviado un enlace de recuperación.' });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Maneja la eliminación de usuarios por su ID. Requiere permisos de administrador.
   * Ruta: DELETE /api/auth/users/:id
   * Espera: userId como parámetro de la URL.
   */
  deleteUser: async (req, res, next) => {
    try {
      const { id } = req.params; // El ID del usuario (UUID de Supabase Auth)
      if (!id) {
        res.status(400);
        throw new Error('ID de usuario es requerido para la eliminación.');
      }
      const deletedUser = await authService.deleteUser(id);
      res.status(200).json({ message: `Usuario ${id} borrado con éxito.`, user: deletedUser.user });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Maneja el cierre de sesión de un usuario.
   * Ruta: POST /api/auth/signout
   * No espera nada en el cuerpo de la solicitud (token se gestiona en el cliente o header).
   */
  signOut: async (req, res, next) => {
    try {
      await authService.signOut();
      res.status(200).json({ message: 'Sesión cerrada exitosamente.' });
    } catch (error) {
      next(error);
    }
  },
};

export default authController;