import express from 'express';
import { getPlacementStats, getStudentStats } from '../controllers/analyticsController.js';

const router = express.Router();

router.get('/placement-stats', getPlacementStats);
router.get('/student-stats', getStudentStats);

export default router;
