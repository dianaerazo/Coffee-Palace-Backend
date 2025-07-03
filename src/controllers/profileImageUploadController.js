// src/controllers/profileImageUploadController.js

import profileImageUploadService from '../services/profileImageUploadService.js';
import userService from '../services/userService.js'; // Import the userService

const profileImageUploadController = {
  uploadProfileImage: async (req, res, next) => {
    try {
      if (!req.file) {
        res.status(400);
        throw new Error('No se ha proporcionado ningún archivo de imagen de perfil.');
      }

      const { authId } = req.params; // authId from URL parameters
      // You also need the user's email to update the user record in your 'usuario' table.
      // Assuming 'email' is passed in the request body from the frontend.
      const { email } = req.body; 

      if (!authId) {
        res.status(400);
        throw new Error('El ID de autenticación (authId) es requerido para subir la imagen de perfil.');
      }
      if (!email) { // Ensure email is provided
        res.status(400);
        throw new Error('El email del usuario es requerido para actualizar la imagen de perfil en la base de datos.');
      }

      const { buffer, mimetype, originalname } = req.file;

      // 1. Upload image to Supabase Storage
      const imageUrl = await profileImageUploadService.uploadProfileImage(buffer, mimetype, originalname, authId);

      // 2. Update the user's profile in the database with the new image URL
      const updatedUser = await userService.updateUserImageByEmail(email, imageUrl);

      if (!updatedUser) {
        // This means the user was not found or the update failed in the DB
        res.status(404);
        throw new Error('Usuario no encontrado o no se pudo actualizar la URL de la imagen de perfil en la base de datos.');
      }

      // Respond with the new URL and the updated user data
      res.status(200).json({
        message: 'Imagen de perfil subida y URL actualizada en la base de datos.',
        url: imageUrl,
        user: updatedUser // You can send back the updated user object if needed
      });

    } catch (error) {
      // It's good that you're using next(error) for centralized error handling
      next(error);
    }
  }
};

export default profileImageUploadController;