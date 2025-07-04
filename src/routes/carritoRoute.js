import express from 'express';
import checkoutController from '../controllers/carritoController.js';

const router = express.Router();

router.post('/checkout/orders', checkoutController.createOrder);
router.post('/checkout/capture', checkoutController.captureOrder);

export default router;