import express from 'express';
import { authMiddleware, roleMiddleware } from '../middleware/auth.js';
import {
  createPlacementRecord,
  getPlacementRecord,
  updatePlacementStatus,
  getStudentPlacements,
  getAllPlacementRecords,
  deletePlacementRecord,
} from '../controllers/placementController.js';

const router = express.Router();

router.post('/', authMiddleware, roleMiddleware('staff', 'admin'), createPlacementRecord);
router.get('/:recordId', authMiddleware, getPlacementRecord);
router.put('/:recordId', authMiddleware, roleMiddleware('staff', 'admin'), updatePlacementStatus);
router.get('/student/:studentId', authMiddleware, getStudentPlacements);
router.get('/', authMiddleware, roleMiddleware('staff', 'admin'), getAllPlacementRecords);
router.delete('/:recordId', authMiddleware, roleMiddleware('admin'), deletePlacementRecord);

export default router;
