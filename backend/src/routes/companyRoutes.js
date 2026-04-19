import express from 'express';
import { createCompany, getCompanies, registerForDrive, deleteCompany } from '../controllers/companyController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getCompanies);
router.post('/register', authenticate, registerForDrive);
router.post('/', authenticate, createCompany);
router.delete('/:id', authenticate, deleteCompany);

export default router;
