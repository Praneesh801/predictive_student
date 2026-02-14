import Company from '../models/Company.js';

// Create a new company
export const createCompany = async (req, res) => {
  try {
    const { companyName, eligibilityCGPA, maxArrearLimit, jobRole, packageOffered, website, industry, location, contactPerson, contactEmail, contactPhone, description } = req.body;

    // Check if company already exists
    const existingCompany = await Company.findOne({ companyName });
    if (existingCompany) {
      return res.status(400).json({ message: 'Company already registered' });
    }

    const company = new Company({
      companyName,
      eligibilityCGPA,
      maxArrearLimit,
      jobRole: jobRole || [],
      packageOffered: packageOffered || [],
      website,
      industry,
      location,
      contactPerson,
      contactEmail,
      contactPhone,
      description,
    });

    const savedCompany = await company.save();
    res.status(201).json({ message: 'Company created successfully', company: savedCompany });
  } catch (error) {
    res.status(500).json({ message: 'Error creating company', error: error.message });
  }
};

// Get all companies
export const getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find();
    res.status(200).json({ companies });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching companies', error: error.message });
  }
};

// Get company by ID
export const getCompanyById = async (req, res) => {
  try {
    const { companyId } = req.params;
    const company = await Company.findById(companyId);

    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    res.status(200).json({ company });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching company', error: error.message });
  }
};

// Update company
export const updateCompany = async (req, res) => {
  try {
    const { companyId } = req.params;
    const updates = req.body;

    const company = await Company.findByIdAndUpdate(companyId, updates, { new: true, runValidators: true });

    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    res.status(200).json({ message: 'Company updated successfully', company });
  } catch (error) {
    res.status(500).json({ message: 'Error updating company', error: error.message });
  }
};

// Delete company
export const deleteCompany = async (req, res) => {
  try {
    const { companyId } = req.params;
    const company = await Company.findByIdAndDelete(companyId);

    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    res.status(200).json({ message: 'Company deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting company', error: error.message });
  }
};

// Get companies by eligibility criteria
export const getCompaniesByEligibility = async (req, res) => {
  try {
    const { minCGPA, maxArrears } = req.query;

    const filter = {};
    if (minCGPA) filter.eligibilityCGPA = { $lte: parseFloat(minCGPA) };
    if (maxArrears) filter.maxArrearLimit = { $gte: parseInt(maxArrears) };

    const companies = await Company.find(filter);
    res.status(200).json({ companies });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching eligible companies', error: error.message });
  }
};
