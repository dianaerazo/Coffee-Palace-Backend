// your-backend-project/src/routes/index.js
// Aggregates and exports all API routes.

import express from 'express';
import categoryRoutes from './categoryRoutes.js';
import ingredienteRoutes from './ingredienteRoutes.js';
import productRoutes from './productRoutes.js'; 
import userRoutes from './userRoutes.js'; 
import imageUploadRoutes from './imageUploadRoutes.js'; // <--- ¡NUEVA IMPORTACIÓN!

const router = express.Router();

router.use('/usuarios', userRoutes);
router.use('/categories', categoryRoutes);
router.use('/ingredientes', ingredienteRoutes);
router.use('/products', productRoutes); 
router.use('/upload', imageUploadRoutes); // <--- ¡NUEVA LÍNEA! Monta el router de subida bajo '/api/upload'

export default router;