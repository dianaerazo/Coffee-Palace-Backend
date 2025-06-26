// your-backend-project/src/controllers/categoryController.js
// This controller handles HTTP requests for categories, calls category service, and sends responses.

import categoryService from '../services/categoryService.js'; // Use 'import' and add .js extension

const categoryController = {
  // Handler for GET /api/categories
  getCategories: async (req, res, next) => {
    try {
      const categories = await categoryService.getAllCategories(); // Call the service
      res.status(200).json(categories); // Send data as JSON response with 200 (OK) status
    } catch (error) {
      next(error); // Pass the error to the error handling middleware
    }
  },

  // Handler for POST /api/categories
  addCategory: async (req, res, next) => {
    try {
      const { nombre } = req.body; // Expects JSON in the request body: { "nombre": "New Name" }

      // Basic input validation
      if (!nombre) {
        res.status(400); // Bad Request
        throw new Error('Category name (nombre) is required.');
      }

      const newCategory = await categoryService.addCategory({ nombre }); // Call the service with data
      res.status(201).json(newCategory); // Send the new category with 201 (Created) status
    } catch (error) {
      next(error);
    }
  },

  // Handler for DELETE /api/categories/:id
  deleteCategory: async (req, res, next) => {
    try {
      const { id } = req.params; // Get ID from URL parameters

      // Validate that the ID is a number before passing it to the service
      if (isNaN(parseInt(id))) {
        res.status(400);
        throw new Error('Invalid category ID provided.');
      }

      await categoryService.deleteCategory(parseInt(id)); // Call service to delete, parsing ID to integer
      res.status(204).send(); // Send 204 (No Content) status for successful deletion with no response body
    } catch (error) {
      next(error);
    }
  },
};

// Export the controller object as the default export for ES modules.
export default categoryController; // <--- ¡CAMBIA ESTO!