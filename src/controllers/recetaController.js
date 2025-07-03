// your-backend-project/src/controllers/recetaController.js
// Controlador para manejar las peticiones HTTP relacionadas con recetas.

import recetaService from '../services/recetaService.js';

const recetaController = {
  // GET /api/recetas/ingredientes-disponibles
  getIngredientesDisponibles: async (req, res, next) => {
    try {
      const ingredientes = await recetaService.getAllIngredientesForReceta();
      res.status(200).json(ingredientes);
    } catch (error) {
      next(error);
    }
  },

  // POST /api/recetas
  addReceta: async (req, res, next) => {
    try {
      const { recetaData, ingredientesIds } = req.body; // Espera un objeto con datos de la receta y un array de IDs

      // Validaciones básicas (puedes añadir más)
      if (!recetaData || !recetaData.nombre || !recetaData.descripcion || !recetaData.instrucciones || !recetaData.imagen) {
        res.status(400);
        throw new Error('Datos de receta incompletos (nombre, descripción, instrucciones, imagen son requeridos).');
      }
      if (!ingredientesIds || !Array.isArray(ingredientesIds) || ingredientesIds.length === 0) {
        res.status(400);
        throw new Error('Se requiere al menos un ID de ingrediente.');
      }

      const newReceta = await recetaService.addReceta(recetaData, ingredientesIds);
      res.status(201).json(newReceta);
    } catch (error) {
      next(error);
    }
  },

  // GET /api/recetas
  getAllRecetas: async (req, res, next) => {
    try {
      const recetas = await recetaService.getAllRecetas();
      res.status(200).json(recetas);
    } catch (error) {
      next(error);
    }
  },

  // NUEVO: GET /api/recetas/:id
  getRecetaById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const recetaId = parseInt(id);

      if (isNaN(recetaId)) {
        res.status(400);
        throw new Error('ID de receta inválido.');
      }

      const receta = await recetaService.getRecetaByIdWithIngredientes(recetaId);

      if (!receta) {
        res.status(404);
        throw new Error('Receta no encontrada.');
      }

      res.status(200).json(receta);
    } catch (error) {
      console.error('Error en getRecetaById controller:', error);
      next(error);
    }
  },

  // GET /api/recetas/ingredientes-relaciones
  getAllRecetaIngredienteRelations: async (req, res, next) => {
    try {
      const relations = await recetaService.getAllRecetaIngredienteRelations();
      res.status(200).json(relations);
    } catch (error) {
      next(error);
    }
  },

  // DELETE /api/recetas/:id
  deleteReceta: async (req, res, next) => {
    try {
      const { id } = req.params;
      if (isNaN(parseInt(id))) {
        res.status(400);
        throw new Error('ID de receta inválido.');
      }
      await recetaService.deleteReceta(parseInt(id));
      res.status(204).send(); // No Content
    } catch (error) {
      next(error);
    }
  },
};

export default recetaController;