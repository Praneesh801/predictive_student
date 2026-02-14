import express from "express";
import { authMiddleware, roleMiddleware } from "../middleware/auth.js";
import * as applicationController from "../controllers/applicationController.js";
import * as placementDriveController from "../controllers/placementDriveController.js";

const router = express.Router();

router.post("/placement-drives", authMiddleware, roleMiddleware("admin", "staff"), placementDriveController.createPlacementDrive);
router.get("/placement-drives", authMiddleware, placementDriveController.getAllPlacementDrives);
router.get("/placement-drives/upcoming", authMiddleware, placementDriveController.getUpcomingDrives);
router.get("/placement-drives/:driveId", authMiddleware, placementDriveController.getPlacementDriveById);
router.put("/placement-drives/:driveId", authMiddleware, roleMiddleware("admin", "staff"), placementDriveController.updatePlacementDrive);
router.delete("/placement-drives/:driveId", authMiddleware, roleMiddleware("admin"), placementDriveController.deletePlacementDrive);

router.post("/applications", authMiddleware, applicationController.createApplication);
router.get("/students/:studentId/applications", authMiddleware, applicationController.getApplicationsByStudent);
router.get("/placement-drives/:driveId/applications", authMiddleware, roleMiddleware("admin", "staff"), applicationController.getApplicationsByDrive);
router.get("/applications/:applicationId", authMiddleware, applicationController.getApplicationById);
router.put("/applications/:applicationId/status", authMiddleware, roleMiddleware("admin", "staff"), applicationController.updateApplicationStatus);
router.post("/applications/:applicationId/interview-rounds", authMiddleware, roleMiddleware("admin", "staff"), applicationController.addInterviewRound);
router.delete("/applications/:applicationId", authMiddleware, applicationController.deleteApplication);
router.get("/applications/stats", authMiddleware, roleMiddleware("admin"), applicationController.getApplicationStats);

export default router;
