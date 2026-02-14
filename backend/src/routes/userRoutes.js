import express from 'express';
import { authMiddleware, roleMiddleware } from '../middleware/auth.js';
import {
  getProfile,
  updateProfile,
  getAllUsers,
  updateUserRole,
  deleteUser,
} from '../controllers/userController.js';

const router = express.Router();

router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, updateProfile);
router.get('/', authMiddleware, roleMiddleware('admin'), getAllUsers);
router.put('/:userId/role', authMiddleware, roleMiddleware('admin'), updateUserRole);
router.delete('/:userId', authMiddleware, roleMiddleware('admin'), deleteUser);

export default router;
