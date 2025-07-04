
import express from 'express';
import multer from 'multer'; 
import imageUploadController from '../controllers/imageUploadController.js';
import profileImageUploadController from '../controllers/profileImageUploadController.js'; // Importa el nuevo controlador

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/product', upload.single('image'), imageUploadController.uploadProductImage);
router.post('/profile/:authId', upload.single('image'), profileImageUploadController.uploadProfileImage);


export default router;