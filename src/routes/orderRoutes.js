const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authenticateToken } = require('../middleware/authentication');

// Obtener todos los pedidos (puede ser para el vendedor)
router.get('/', authenticateToken, orderController.getAllOrders);

// Crear un pedido (desde app del cliente)
router.post('/', authenticateToken, orderController.createOrder);

module.exports = router;
