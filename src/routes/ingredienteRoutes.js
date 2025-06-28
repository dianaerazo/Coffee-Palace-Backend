
import express from 'express';
import ingredienteController from '../controllers/ingredienteController.js';
const router = express.Router();

router.get('/', ingredienteController.getIngredientes);   
router.post('/', ingredienteController.addIngrediente);     
router.delete('/:id', ingredienteController.deleteIngrediente); 

export default router;