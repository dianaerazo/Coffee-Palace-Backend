// your-backend-project/src/routes/authRoutes.js
import express from 'express';
import authController from '../controllers/authController.js';

const router = express.Router();

// Rutas de autenticación
router.post('/signup', authController.signUp); // Registro de usuario con email/password/name
router.post('/signin', authController.signIn); // Inicio de sesión con email/password
router.post('/reset-password', authController.sendPasswordReset); // Envío de enlace para restablecer contraseña
router.post('/signin-google-token', authController.signInWithGoogleToken); // Inicio de sesión con ID Token de Google
router.delete('/users/:id', authController.deleteUser); // Eliminación de usuario (requiere privilegios de admin)
router.post('/signout', authController.signOut); // Cierre de sesión

export default router;