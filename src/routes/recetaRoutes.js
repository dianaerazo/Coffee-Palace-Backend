// your-backend-project/src/routes/recetaRoutes.js
// Define las rutas para la entidad 'receta'.

import express from 'express';
import recetaController from '../controllers/recetaController.js';

const router = express.Router();

// Rutas para recetas
router.get('/', recetaController.getAllRecetas); // GET /api/recetas
router.post('/', recetaController.addReceta);   // POST /api/recetas
router.delete('/:id', recetaController.deleteReceta); // DELETE /api/recetas/:id

// Rutas para los datos auxiliares de recetas
router.get('/ingredientes-disponibles', recetaController.getIngredientesDisponibles); // GET /api/recetas/ingredientes-disponibles
router.get('/ingredientes-relaciones', recetaController.getAllRecetaIngredienteRelations); // GET /api/recetas/ingredientes-relaciones

export default router;