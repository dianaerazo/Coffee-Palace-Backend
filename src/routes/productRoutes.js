const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authenticateToken } = require('../middleware/authentication');

// Obtener todos los productos
router.get('/', authenticateToken, productController.getAllProducts);

// Actualizar stock de un producto
router.put('/stock', authenticateToken, productController.updateProductStock);

// Crear nuevo producto
router.post('/', authenticateToken, productController.createProduct);

module.exports = router;
