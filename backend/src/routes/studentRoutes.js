import express from 'express';
import { authMiddleware, roleMiddleware } from '../middleware/auth.js';
import {
  createStudent,
  getStudentData,
  updateStudentData,
  getAllStudents,
  getEligibleStudents,
  deleteStudent,
  getMyStudentProfile,
} from '../controllers/studentController.js';

const router = express.Router();

router.post('/', authMiddleware, roleMiddleware('staff', 'admin'), createStudent);
router.get('/me/profile', authMiddleware, getMyStudentProfile);
router.get('/:studentId', authMiddleware, getStudentData);
router.put('/:studentId', authMiddleware, roleMiddleware('staff', 'admin'), updateStudentData);
router.get('/', authMiddleware, roleMiddleware('staff', 'admin'), getAllStudents);
router.get('/eligible/list', authMiddleware, roleMiddleware('staff', 'admin'), getEligibleStudents);
router.delete('/:studentId', authMiddleware, roleMiddleware('admin'), deleteStudent);

export default router;
