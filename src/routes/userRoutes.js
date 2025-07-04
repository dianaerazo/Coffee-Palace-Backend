import express from 'express';
import userController from '../controllers/userController.js';

const router = express.Router();

router.get('/', userController.getUsers);
router.post('/', userController.addUser);
router.delete('/:id', userController.deleteUser);
router.patch('/:email/image', userController.updateUserImage);
router.get('/profile-by-email', userController.getUsuarioByEmail);

export default router;