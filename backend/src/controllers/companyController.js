import Company from '../models/Company.js';
import Student from '../models/Student.js';

export const createCompany = async (req, res) => {
  try {
    const company = await Company.create(req.body);
    res.status(201).json({ message: 'Company drive created successfuly', company });
  } catch (err) {
    res.status(500).json({ message: 'Error creating company', error: err.message });
  }
};

export const getCompanies = async (req, res) => {
  try {
    const companies = await Company.find({ isActive: true }).sort({ date: 1 });
    res.json({ companies });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching companies', error: err.message });
  }
};

export const registerForDrive = async (req, res) => {
  try {
    const { companyId, studentId } = req.body;
    
    // Check if both exist
    const company = await Company.findById(companyId);
    let student = await Student.findOne({ userId: studentId });
    if (!student) student = await Student.findById(studentId); // Try direct ID if not found by userId
    
    if (!company || !student) return res.status(404).json({ message: 'Company or Student record not found' });
    
    // Toggle registration status (register if not registered, unregister if already)
    const alreadyRegistered = student.registeredCompanies.includes(companyId);
    
    if (alreadyRegistered) {
      // Unregister
      student.registeredCompanies = student.registeredCompanies.filter(c => c.toString() !== companyId);
      company.registrations = company.registrations.filter(s => s.toString() !== studentId);
      student.placementStatus = 'not_applied';
    } else {
      // Check eligibility (optional - can also let everyone register but highlight status)
      if (student.cgpa < company.criteria.minCGPA) {
        return res.status(403).json({ message: 'Does not meet CGPA criteria' });
      }
      
      student.registeredCompanies.push(companyId);
      company.registrations.push(studentId);
      student.placementStatus = 'applied';
    }
    
    await student.save();
    await company.save();
    
    res.json({ 
      message: alreadyRegistered ? 'Registration cancelled' : 'Registered successfully', 
      isRegistered: !alreadyRegistered 
    });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
};

export const deleteCompany = async (req, res) => {
    try {
      const company = await Company.findByIdAndDelete(req.params.id);
      if (!company) return res.status(404).json({ message: 'Company not found' });
      res.json({ message: 'Company drive deleted' });
    } catch (err) {
      res.status(500).json({ message: 'Error deleting company', error: err.message });
    }
  };
