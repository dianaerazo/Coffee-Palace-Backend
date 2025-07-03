
import express from 'express';
import categoryRoutes from './categoryRoutes.js';
import ingredienteRoutes from './ingredienteRoutes.js';
import productRoutes from './productRoutes.js'; 
import userRoutes from './userRoutes.js'; 
import imageUploadRoutes from './imageUploadRoutes.js';
import recetaRoutes from './recetaRoutes.js'; 
import orderRoutes from './orderRoutes.js'; 
import authRoutes from './authRoutes.js';
import comentariosRoutes from './comentariosRoutes.js'; 
import searchRoutes from './searchRoutes.js'; // This is correct for a default export
import carritoRoutes from './carritoRoutes.js'; // NUEVO



const router = express.Router();

router.use('/usuarios', userRoutes);
router.use('/categories', categoryRoutes);
router.use('/ingredientes', ingredienteRoutes);
router.use('/products', productRoutes); 
router.use('/productos', productRoutes); 
router.use('/upload', imageUploadRoutes); 
router.use('/recetas', recetaRoutes); 
router.use('/orders', orderRoutes); 
router.use('/auth', authRoutes); 
router.use('/comentarios', comentariosRoutes); 
router.use('/search', searchRoutes); // <-- Use the new search routes
router.use('/carrito', carritoRoutes); // NUEVO





export default router;