// your-backend-project/src/routes/imageUploadRoutes.js
// Define las rutas para la subida de imágenes.

import express from 'express';
import multer from 'multer'; // Importa Multer
import imageUploadController from '../controllers/imageUploadController.js';

const router = express.Router();

// Configura Multer para almacenar el archivo en memoria (Buffer)
// Esto es ideal para subir a servicios en la nube como Supabase Storage.
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Define la ruta POST para subir imágenes de productos
// 'image' es el nombre del campo del formulario que contendrá el archivo
router.post('/product', upload.single('image'), imageUploadController.uploadProductImage);

// Puedes añadir más rutas de subida aquí si tienes diferentes tipos de imágenes
// router.post('/profile-picture', upload.single('avatar'), imageUploadController.uploadProfileImage);

export default router;