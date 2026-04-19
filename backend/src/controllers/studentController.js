import Student from '../models/Student.js';

export const createStudent = async (req, res) => {
  try {
    const student = await Student.create(req.body);
    res.status(201).json({ message: 'Student created', student });
  } catch (err) {
    res.status(500).json({ message: 'Error creating student', error: err.message });
  }
};

export const getStudents = async (req, res) => {
  try {
    const { status, email, search, page = 1, limit = 10 } = req.query;
    const filter = {};
    if (status) filter.placementStatus = status;
    if (email) filter.email = email;
    if (search) filter.name = { $regex: search, $options: 'i' };

    const students = await Student.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await Student.countDocuments(filter);
    res.json({ students, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching students', error: err.message });
  }
};

export const getStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json({ student });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching student', error: err.message });
  }
};

export const updateStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json({ message: 'Student updated', student });
  } catch (err) {
    res.status(500).json({ message: 'Error updating student', error: err.message });
  }
};

export const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json({ message: 'Student deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting student', error: err.message });
  }
};

export const predictPlacement = async (req, res) => {
  try {
    const { cgpa = 0, skills = [], internships = 0, projects = 0, tenthPercentage = 60, twelfthPercentage = 60, communicationLevel = 5 } = req.body;
    
    const cgScore       = Math.min(parseFloat(cgpa) / 10, 1) * 35;
    const skillScore    = Math.min(skills.length / 5, 1) * 20;
    const internScore   = Math.min(parseInt(internships) / 2, 1) * 15;
    const projScore     = Math.min(parseInt(projects) / 3, 1) * 15;
    const commScore     = (parseInt(communicationLevel) / 10) * 15;
    
    const probability = Math.round(cgScore + skillScore + internScore + projScore + commScore);
    const eligible = probability >= 60;

    const skillGaps = [];
    if (parseFloat(cgpa) < 7.5) skillGaps.push({ item: 'CGPA', detail: 'Aim for 7.5+', type: 'warning' });
    if (skills.length < 3) skillGaps.push({ item: 'Skills', detail: 'Learn more tech stacks', type: 'error' });
    if (parseInt(internships) === 0) skillGaps.push({ item: 'Internships', detail: 'Gain industry exposure', type: 'error' });

    res.json({
      probability,
      eligible,
      status: eligible ? 'Likely to be Placed' : 'Needs Improvement',
      skillGaps,
      suggestions: skillGaps.map(g => `Improve ${g.item}: ${g.detail}`)
    });
  } catch (err) {
    res.status(500).json({ message: 'Prediction failed', error: err.message });
  }
};

export const bulkInsertStudents = async (req, res) => {
  try {
    const { students } = req.body; // Array of student objects
    if (!Array.isArray(students)) return res.status(400).json({ message: 'Students array required' });

    const result = await Student.insertMany(students);
    res.status(201).json({ message: `${result.length} students inserted successfuly`, count: result.length });
  } catch (err) {
    console.error('Bulk insert error:', err);
    res.status(500).json({ message: 'Bulk insert failed', error: err.message });
  }
};

export const updatePlacementStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, companyPlaced } = req.body; // e.g., 'placed', 'not_placed', 'applied'

    if (!['not_applied', 'applied', 'placed', 'not_placed', 'ai_needed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid placement status' });
    }

    const student = await Student.findByIdAndUpdate(
      id,
      { placementStatus: status, companyPlaced: companyPlaced || '' },
      { new: true }
    );
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json({ message: `Student status updated to ${status}`, student });
  } catch (err) {
    res.status(500).json({ message: 'Status update failed', error: err.message });
  }
};
