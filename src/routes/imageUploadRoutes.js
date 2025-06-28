
import express from 'express';
import multer from 'multer'; 
import imageUploadController from '../controllers/imageUploadController.js';

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/product', upload.single('image'), imageUploadController.uploadProductImage);


export default router;