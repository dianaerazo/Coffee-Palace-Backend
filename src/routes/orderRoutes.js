// your-backend-project/src/routes/orderRoutes.js
import express from 'express';
import orderController from '../controllers/orderController.js';

const router = express.Router();

router.get('/', orderController.getOrders); // GET /api/orders
router.patch('/:id/status', orderController.updateOrderStatus); // PATCH /api/orders/:id/status
router.post('/', orderController.createOrder); // POST /api/orders (para crear una nueva orden desde el carrito)
router.get('/user/:userId', orderController.getUserOrders); 

export default router;