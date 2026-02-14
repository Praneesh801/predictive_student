import express from 'express';
import { authMiddleware, roleMiddleware } from '../middleware/auth.js';
import {
  createNotification,
  getUserNotifications,
  markNotificationAsRead,
  getUnreadNotifications,
  deleteNotification,
} from '../controllers/notificationController.js';

const router = express.Router();

router.post('/', authMiddleware, roleMiddleware('staff', 'admin'), createNotification);
router.get('/user/:userId', authMiddleware, getUserNotifications);
router.get('/user/:userId/unread', authMiddleware, getUnreadNotifications);
router.put('/:notificationId/read', authMiddleware, markNotificationAsRead);
router.delete('/:notificationId', authMiddleware, deleteNotification);

export default router;
