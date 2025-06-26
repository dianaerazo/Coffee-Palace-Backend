// your-backend-project/src/routes/productRoutes.js
// Defines specific routes for the 'producto' entity.

import express from 'express';
import productController from '../controllers/productController.js'; // Import the product controller

const router = express.Router();

// Define routes and associate controllers.
router.get('/', productController.getProducts);               // GET /api/products
router.post('/', productController.addProduct);               // POST /api/products
router.get('/categories', productController.getCategoriasProduct); // GET /api/products/categories (for product form)
router.delete('/:id', productController.deleteProduct);       // DELETE /api/products/:id

// Export the router as the default export for ES modules.
export default router;