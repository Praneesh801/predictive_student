import express from 'express';
import * as companyController from '../controllers/companyController.js';
import { authMiddleware, roleMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Create company (Admin only)
router.post('/companies', authMiddleware, roleMiddleware('admin', 'staff'), companyController.createCompany);

// Get all companies
router.get('/companies', authMiddleware, companyController.getAllCompanies);

// Get company by ID
router.get('/companies/:companyId', authMiddleware, companyController.getCompanyById);

// Get companies by eligibility criteria
router.get('/companies/eligible', authMiddleware, companyController.getCompaniesByEligibility);

// Update company (Admin only)
router.put('/companies/:companyId', authMiddleware, roleMiddleware('admin', 'staff'), companyController.updateCompany);

// Delete company (Admin only)
router.delete('/companies/:companyId', authMiddleware, roleMiddleware('admin'), companyController.deleteCompany);

export default router;
