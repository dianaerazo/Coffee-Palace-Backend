// your-backend-project/src/routes/orderRoutes.js
import express from 'express';
import orderController from '../controllers/orderController.js';

const router = express.Router();

router.get('/', orderController.getOrders); // GET /api/orders
router.patch('/:id/status', orderController.updateOrderStatus); // PATCH /api/orders/:id/status

export default router;