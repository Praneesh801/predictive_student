import express from 'express';
import * as placementDriveController from '../controllers/placementDriveController.js';
import { authMiddleware, roleMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Create placement drive (Admin/Staff only)
router.post('/placement-drives', authMiddleware, roleMiddleware('admin', 'staff'), placementDriveController.createPlacementDrive);

// Get all placement drives
router.get('/placement-drives', authMiddleware, placementDriveController.getAllPlacementDrives);

// Get upcoming placement drives
router.get('/placement-drives/upcoming', authMiddleware, placementDriveController.getUpcomingDrives);

// Get placement drive by ID
router.get('/placement-drives/:driveId', authMiddleware, placementDriveController.getPlacementDriveById);

// Get drives by company
router.get('/companies/:companyId/drives', authMiddleware, placementDriveController.getDrivesByCompany);

// Update placement drive (Admin/Staff only)
router.put('/placement-drives/:driveId', authMiddleware, roleMiddleware('admin', 'staff'), placementDriveController.updatePlacementDrive);

// Delete placement drive (Admin only)
router.delete('/placement-drives/:driveId', authMiddleware, roleMiddleware('admin'), placementDriveController.deletePlacementDrive);

export default router;
