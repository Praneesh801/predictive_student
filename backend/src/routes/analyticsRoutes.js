import express from 'express';
import { authMiddleware, roleMiddleware } from '../middleware/auth.js';
import {
  getPlacementStats,
  getStudentStats,
  getPredictionAccuracy,
  getTrendAnalysis,
  getPlacementAnalytics,
} from '../controllers/analyticsController.js';

const router = express.Router();

router.get('/placement-stats', authMiddleware, roleMiddleware('admin', 'staff'), getPlacementStats);
router.get('/student-stats', authMiddleware, roleMiddleware('admin', 'staff'), getStudentStats);
router.get('/prediction-accuracy', authMiddleware, roleMiddleware('admin', 'staff'), getPredictionAccuracy);
router.get('/trend-analysis', authMiddleware, roleMiddleware('admin', 'staff'), getTrendAnalysis);
router.get('/placement-analytics', authMiddleware, roleMiddleware('admin', 'staff'), getPlacementAnalytics);

export default router;
