
import imageUploadService from '../services/imageUploadService.js';

const imageUploadController = {
  uploadProductImage: async (req, res, next) => {
    try {
      if (!req.file) {
        res.status(400);
        throw new Error('No se ha proporcionado ningún archivo de imagen.');
      }

      const { buffer, mimetype, originalname } = req.file;
      const imageUrl = await imageUploadService.uploadImage(buffer, mimetype, originalname);

      res.status(200).json({ url: imageUrl });
    } catch (error) {
      next(error); 
    }
  }
};

export default imageUploadController;