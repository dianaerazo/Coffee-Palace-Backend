// src/routes/comentariosRoutes.js
import express from 'express';
import comentariosController from '../controllers/comentariosController.js';

const router = express.Router();

router.get('/producto/:idProducto', comentariosController.getComentariosByProductoId);
router.post('/', comentariosController.addComentario);

export default router;