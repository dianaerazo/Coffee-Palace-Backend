
import express from 'express';
import productController from '../controllers/productController.js'; 

const router = express.Router();

router.get('/', productController.getProducts);              
router.post('/', productController.addProduct);              
router.get('/categories', productController.getCategoriasProduct); 
router.delete('/:id', productController.deleteProduct);   
export default router;