
import express from 'express';
import categoryRoutes from './categoryRoutes.js';
import ingredienteRoutes from './ingredienteRoutes.js';
import productRoutes from './productRoutes.js'; 
import userRoutes from './userRoutes.js'; 
import imageUploadRoutes from './imageUploadRoutes.js';
import recetaRoutes from './recetaRoutes.js'; 
import orderRoutes from './orderRoutes.js'; 
import authRoutes from './authRoutes.js';
import chekcoutRoutes from './carritoRoute.js'; 

const router = express.Router();

router.use('/usuarios', userRoutes);
router.use('/categories', categoryRoutes);
router.use('/ingredientes', ingredienteRoutes);
router.use('/products', productRoutes); 
router.use('/upload', imageUploadRoutes); 
router.use('/recetas', recetaRoutes); 
router.use('/orders', orderRoutes); 
router.use('/auth', authRoutes); 
router.use('/client', chekcoutRoutes); 

export default router;