const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken, authorizeRoles } = require('../middleware/authentication');

// Obtener todos los usuarios (solo admins)
router.get('/', authenticateToken, authorizeRoles('admin'), userController.getAllUsers);

// Actualizar rol u otro dato del usuario
router.put('/', authenticateToken, authorizeRoles('admin'), userController.updateUser);

module.exports = router;
