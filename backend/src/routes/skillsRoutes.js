import express from 'express';
import * as skillsController from '../controllers/skillsController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Create or update skills for a student
router.post('/students/:studentId/skills', authMiddleware, skillsController.createOrUpdateSkills);

// Get skills by student
router.get('/students/:studentId/skills', authMiddleware, skillsController.getSkillsByStudent);

// Delete skills
router.delete('/students/:studentId/skills', authMiddleware, skillsController.deleteSkills);

export default router;
