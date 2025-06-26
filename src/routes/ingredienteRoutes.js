// your-backend-project/src/routes/ingredienteRoutes.js
// Defines specific routes for the 'Ingrediente' entity.

import express from 'express';
import ingredienteController from '../controllers/ingredienteController.js'; // Import the ingredient controller

const router = express.Router();

// Define routes and associate controllers.
router.get('/', ingredienteController.getIngredientes);     // GET /api/ingredientes
router.post('/', ingredienteController.addIngrediente);     // POST /api/ingredientes
router.delete('/:id', ingredienteController.deleteIngrediente); // DELETE /api/ingredientes/:id

// Export the router as the default export for ES modules.
export default router;