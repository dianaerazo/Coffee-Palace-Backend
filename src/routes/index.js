
import express from 'express';
import categoryRoutes from './categoryRoutes.js';
import ingredienteRoutes from './ingredienteRoutes.js';
import productRoutes from './productRoutes.js'; 
import userRoutes from './userRoutes.js'; 
import imageUploadRoutes from './imageUploadRoutes.js';
import recetaRoutes from './recetaRoutes.js'; // <--- ¡NUEVA IMPORTACIÓN!
import orderRoutes from './orderRoutes.js'; // <--- ¡NUEVA IMPORTACIÓN!


const router = express.Router();

router.use('/usuarios', userRoutes);
router.use('/categories', categoryRoutes);
router.use('/ingredientes', ingredienteRoutes);
router.use('/products', productRoutes); 
router.use('/upload', imageUploadRoutes); 
router.use('/recetas', recetaRoutes); // <--- ¡NUEVA LÍNEA! Monta el router de receta bajo '/api/recetas'
router.use('/orders', orderRoutes); // <--- ¡NUEVA LÍNEA! Monta las rutas de orden bajo '/api/orders'


export default router;