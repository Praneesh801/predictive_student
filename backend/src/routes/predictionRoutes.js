import express from 'express';
import * as predictionController from '../controllers/predictionController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Create prediction
router.post('/students/:studentId/predictions', authMiddleware, predictionController.createPrediction);

// Get all predictions for a student
router.get('/students/:studentId/predictions', authMiddleware, predictionController.getPredictionsByStudent);

// Get latest prediction for a student
router.get('/students/:studentId/predictions/latest', authMiddleware, predictionController.getLatestPrediction);

// Delete prediction
router.delete('/predictions/:predictionId', authMiddleware, predictionController.deletePrediction);

export default router;
