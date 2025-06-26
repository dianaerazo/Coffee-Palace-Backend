// your-backend-project/src/controllers/ingredienteController.js
// Logic for handling HTTP requests for ingredients, calling the service, and sending responses.

import ingredienteService from '../services/ingredienteService.js'; // Import the ingredient service

const ingredienteController = {
  // Handler for GET /api/ingredientes
  getIngredientes: async (req, res, next) => {
    try {
      const ingredientes = await ingredienteService.getAllIngredientes(); // Call the service
      res.status(200).json(ingredientes); // Send data as JSON response with 200 (OK) status
    } catch (error) {
      next(error); // Pass the error to the error handling middleware
    }
  },

  // Handler for POST /api/ingredientes
  addIngrediente: async (req, res, next) => {
    try {
      const { nombre } = req.body; // Expects JSON in the request body: { "nombre": "New Name" }

      // Basic input validation
      if (!nombre) {
        res.status(400); // Bad Request
        throw new Error('Ingredient name (nombre) is required.');
      }

      const newIngrediente = await ingredienteService.addIngrediente({ nombre }); // Call the service with data
      res.status(201).json(newIngrediente); // Send the new ingredient with 201 (Created) status
    } catch (error) {
      next(error);
    }
  },

  // Handler for DELETE /api/ingredientes/:id
  deleteIngrediente: async (req, res, next) => {
    try {
      const { id } = req.params; // Get ID from URL parameters

      // Validate that the ID is a number before passing it to the service
      if (isNaN(parseInt(id))) {
        res.status(400);
        throw new Error('Invalid ingredient ID provided.');
      }

      await ingredienteService.deleteIngrediente(parseInt(id)); // Call service to delete, parsing ID to integer
      res.status(204).send(); // Send 204 (No Content) status for successful deletion without a response body
    } catch (error) {
      next(error);
    }
  },
};

// Export the controller object as the default export for ES modules.
export default ingredienteController;