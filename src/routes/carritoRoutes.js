// your-backend-project/src/routes/carritoRoutes.js
import express from 'express';
import carritoController from '../controllers/carritoController.js';

const router = express.Router();

router.post('/', carritoController.addCartItem); // POST /api/carrito
router.get('/user/:authId', carritoController.getCartItemsForUser); // CAMBIADO de :userId a :authId
router.delete('/:cartItemId', carritoController.deleteCartEntry); // DELETE /api/carrito/:cartItemId
router.delete('/user/:authId/clear', carritoController.clearUserCart); // DELETE /api/carrito/user/:userId/clear

export default router;