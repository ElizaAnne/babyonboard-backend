// routes/image.js
import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { handleImageUpload, uploadImage, processImage } from '../controllers/imageController.js';

const router = express.Router();

router.post('/upload', authMiddleware, handleImageUpload, uploadImage);
router.post('/process', authMiddleware, processImage);

export default router;
