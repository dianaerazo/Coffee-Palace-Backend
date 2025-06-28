
import ingredienteService from '../services/ingredienteService.js'; 

const ingredienteController = {
  getIngredientes: async (req, res, next) => {
    try {
      const ingredientes = await ingredienteService.getAllIngredientes();
      res.status(200).json(ingredientes); 
    } catch (error) {
      next(error);
    }
  },

  addIngrediente: async (req, res, next) => {
    try {
      const { nombre } = req.body; 

      if (!nombre) {
        res.status(400); 
        throw new Error('Ingredient name (nombre) is required.');
      }

      const newIngrediente = await ingredienteService.addIngrediente({ nombre }); 
      res.status(201).json(newIngrediente);
    } catch (error) {
      next(error);
    }
  },

  deleteIngrediente: async (req, res, next) => {
    try {
      const { id } = req.params;

      if (isNaN(parseInt(id))) {
        res.status(400);
        throw new Error('Invalid ingredient ID provided.');
      }

      await ingredienteService.deleteIngrediente(parseInt(id)); 
      res.status(204).send(); 
    } catch (error) {
      next(error);
    }
  },
};

export default ingredienteController;