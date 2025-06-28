
import categoryService from '../services/categoryService.js';

const categoryController = {
  getCategories: async (req, res, next) => {
    try {
      const categories = await categoryService.getAllCategories(); 
      res.status(200).json(categories); 
    } catch (error) {
      next(error); 
    }
  },

  addCategory: async (req, res, next) => {
    try {
      const { nombre } = req.body; 

      if (!nombre) {
        res.status(400); 
        throw new Error('Category name (nombre) is required.');
      }

      const newCategory = await categoryService.addCategory({ nombre }); 
      res.status(201).json(newCategory); 
    } catch (error) {
      next(error);
    }
  },

  deleteCategory: async (req, res, next) => {
    try {
      const { id } = req.params; 

      if (isNaN(parseInt(id))) {
        res.status(400);
        throw new Error('Invalid category ID provided.');
      }

      await categoryService.deleteCategory(parseInt(id)); 
      res.status(204).send(); 
    } catch (error) {
      next(error);
    }
  },
};

export default categoryController; 