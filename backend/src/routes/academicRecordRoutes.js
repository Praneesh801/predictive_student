import express from 'express';
import * as academicRecordController from '../controllers/academicRecordController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Create or update academic record
router.post('/students/:studentId/academic-record', authMiddleware, academicRecordController.createOrUpdateAcademicRecord);

// Get academic record
router.get('/students/:studentId/academic-record', authMiddleware, academicRecordController.getAcademicRecord);

// Delete academic record
router.delete('/students/:studentId/academic-record', authMiddleware, academicRecordController.deleteAcademicRecord);

export default router;
