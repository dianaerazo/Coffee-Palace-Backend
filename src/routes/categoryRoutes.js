// ... (resto del código de importaciones y definición de rutas)

import express from 'express';
import categoryController from '../controllers/categoryController.js';

const router = express.Router();

router.get('/', categoryController.getCategories);
router.post('/', categoryController.addCategory);
router.delete('/:id', categoryController.deleteCategory);

export default router; // <--- ¡Asegúrate de que exporta el router por defecto!