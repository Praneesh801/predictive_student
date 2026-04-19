import express from 'express';
import {
  createStudent, getStudents, getStudent,
  updateStudent, deleteStudent, predictPlacement, bulkInsertStudents,
  updatePlacementStatus
} from '../controllers/studentController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/predict', predictPlacement);
router.get('/', getStudents);
router.post('/bulk', authenticate, bulkInsertStudents);
router.put('/:id/status', authenticate, updatePlacementStatus);
router.post('/', authenticate, createStudent);
router.get('/:id', authenticate, getStudent);
router.put('/:id', authenticate, updateStudent);
router.delete('/:id', authenticate, deleteStudent);

export default router;
