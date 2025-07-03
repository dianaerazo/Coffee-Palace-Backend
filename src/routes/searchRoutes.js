// routes/searchRoutes.js

import express from 'express';

import searchController from '../controllers/searchController.js'; // <-- ¡Añadido .js!

const router = express.Router();

router.get('/', searchController.searchItems);

export default router;