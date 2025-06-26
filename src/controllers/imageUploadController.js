// your-backend-project/src/controllers/imageUploadController.js
// Controlador para manejar las peticiones de subida de imágenes.

import imageUploadService from '../services/imageUploadService.js';

const imageUploadController = {
  uploadProductImage: async (req, res, next) => {
    try {
      // Multer adjunta el archivo subido a req.file
      if (!req.file) {
        res.status(400);
        throw new Error('No se ha proporcionado ningún archivo de imagen.');
      }

      const { buffer, mimetype, originalname } = req.file; // Obtiene el buffer, tipo MIME y nombre original del archivo

      // Llama al servicio para subir la imagen a Supabase Storage
      const imageUrl = await imageUploadService.uploadImage(buffer, mimetype, originalname);

      // Responde con la URL pública de la imagen
      res.status(200).json({ url: imageUrl });
    } catch (error) {
      next(error); // Pasa el error al middleware de manejo de errores
    }
  }
};

export default imageUploadController;