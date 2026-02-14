import Student from '../models/Student.js';
import { calculatePlacementProbability } from '../utils/helpers.js';
import { mockDB, generateId } from '../config/mockDB.js';

export const createStudent = async (req, res) => {
  try {
    const { userId, rollNumber, department, ...studentData } = req.body;

    // Validate required fields
    if (!userId || !rollNumber || !department) {
      return res.status(400).json({ message: 'userId, rollNumber, and department are required' });
    }

    // Validate CGPA if provided
    if (studentData.cgpa && (studentData.cgpa < 0 || studentData.cgpa > 10)) {
      return res.status(400).json({ message: 'CGPA must be between 0 and 10' });
    }

    try {
      // Check if student already exists
      const existingStudent = await Student.findOne({ rollNumber });
      if (existingStudent) {
        return res.status(400).json({ message: 'Student with this roll number already exists' });
      }

      // Create student object with all provided data
      const student = new Student({
        userId,
        rollNumber,
        department,
        ...studentData,
        placementEligible: (studentData.cgpa || 0) >= 6.0,
      });

      // Calculate placement probability and set eligibility band
      const prediction = calculatePlacementProbability(student);
      student.predictedPlacementProbability = prediction.probability;
      student.eligibilityBand = prediction.band;
      
      await student.save();

      return res.status(201).json({
        message: 'Student record created successfully',
        student: {
          ...student.toObject(),
          eligibilityBand: prediction.band,
          eligible: prediction.eligible,
        },
      });
    } catch (mongoError) {
      // Fall back to mock DB
      const existingStudent = mockDB.students.find(s => s.rollNumber === rollNumber);
      if (existingStudent) {
        return res.status(400).json({ message: 'Student with this roll number already exists' });
      }

      // Calculate prediction
      const tempStudent = {
        ...studentData,
        cgpa: studentData.cgpa || 0,
      };
      const prediction = calculatePlacementProbability(tempStudent);

      const student = {
        _id: generateId(),
        userId,
        rollNumber,
        department,
        ...studentData,
        placementEligible: (studentData.cgpa || 0) >= 6.0,
        placementStatus: 'not_placed',
        predictedPlacementProbability: prediction.probability,
        eligibilityBand: prediction.band,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockDB.students.push(student);

      return res.status(201).json({
        message: 'Student record created successfully (Demo Mode)',
        student: {
          ...student,
          eligible: prediction.eligible,
        },
      });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const getStudentData = async (req, res) => {
  try {
    const { studentId } = req.params;

    try {
      const student = await Student.findById(studentId);
      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }
      return res.json(student);
    } catch (mongoError) {
      // Fall back to mock DB
      const student = mockDB.students.find(s => s._id === studentId);
      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }
      return res.json(student);
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const updateStudentData = async (req, res) => {
  try {
    const { studentId } = req.params;
    const updateData = req.body;

    try {
      const student = await Student.findByIdAndUpdate(studentId, updateData, {
        new: true,
        runValidators: true,
      });

      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }

      student.predictedPlacementProbability = calculatePlacementProbability(student);
      await student.save();

      return res.json({
        message: 'Student data updated successfully',
        student,
      });
    } catch (mongoError) {
      // Fall back to mock DB
      const studentIndex = mockDB.students.findIndex(s => s._id === studentId);
      if (studentIndex === -1) {
        return res.status(404).json({ message: 'Student not found' });
      }

      const student = { ...mockDB.students[studentIndex], ...updateData, updatedAt: new Date() };
      student.predictedPlacementProbability = calculatePlacementProbability(student);
      mockDB.students[studentIndex] = student;

      return res.json({
        message: 'Student data updated successfully (Demo)',
        student,
      });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const getAllStudents = async (req, res) => {
  try {
    try {
      const students = await Student.find().populate('userId', 'name email');
      return res.json(students);
    } catch (mongoError) {
      // Fall back to mock DB
      return res.json(mockDB.students);
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const getEligibleStudents = async (req, res) => {
  try {
    try {
      const students = await Student.find({ placementEligible: true }).populate('userId', 'name email');
      return res.json(students);
    } catch (mongoError) {
      // Fall back to mock DB
      const students = mockDB.students.filter(s => s.placementEligible);
      return res.json(students);
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const deleteStudent = async (req, res) => {
  try {
    const { studentId } = req.params;

    try {
      const student = await Student.findByIdAndDelete(studentId);
      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }
      return res.json({ message: 'Student deleted successfully' });
    } catch (mongoError) {
      // Fall back to mock DB
      const index = mockDB.students.findIndex(s => s._id === studentId);
      if (index === -1) {
        return res.status(404).json({ message: 'Student not found' });
      }
      mockDB.students.splice(index, 1);
      return res.json({ message: 'Student deleted successfully (Demo)' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const getMyStudentProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    try {
      const student = await Student.findOne({ userId }).populate('userId', 'name email');
      if (!student) {
        return res.status(404).json({ message: 'Student profile not found' });
      }
      return res.json(student);
    } catch (mongoError) {
      // Fall back to mock DB
      const student = mockDB.students.find(s => s.userId === userId);
      if (!student) {
        return res.status(404).json({ message: 'Student profile not found' });
      }
      return res.json(student);
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};
