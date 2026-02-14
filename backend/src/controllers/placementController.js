import PlacementRecord from '../models/PlacementRecord.js';
import Student from '../models/Student.js';
import { mockDB, generateId } from '../config/mockDB.js';

export const createPlacementRecord = async (req, res) => {
  try {
    const { studentId, companyName, position, salaryOffered, driveDate, predictedOutcome } = req.body;

    try {
      const student = await Student.findById(studentId);
      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }

      const placementRecord = new PlacementRecord({
        studentId,
        companyName,
        position,
        salaryOffered,
        driveDate,
        predictedOutcome,
      });

      await placementRecord.save();

      return res.status(201).json({
        message: 'Placement record created successfully',
        placementRecord,
      });
    } catch (mongoError) {
      // Fall back to mock DB
      const record = {
        _id: generateId(),
        studentId,
        companyName,
        position,
        salaryOffered,
        driveDate,
        predictedOutcome,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockDB.placements.push(record);
      return res.status(201).json({
        message: 'Placement record created successfully (Demo)',
        placementRecord: record,
      });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const getPlacementRecord = async (req, res) => {
  try {
    const { recordId } = req.params;

    try {
      const record = await PlacementRecord.findById(recordId).populate('studentId');
      if (!record) {
        return res.status(404).json({ message: 'Placement record not found' });
      }
      return res.json(record);
    } catch (mongoError) {
      // Fall back to mock DB
      const record = mockDB.placements.find(r => r._id === recordId);
      if (!record) {
        return res.status(404).json({ message: 'Placement record not found' });
      }
      return res.json(record);
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const updatePlacementStatus = async (req, res) => {
  try {
    const { recordId } = req.params;
    const { status, actualOutcome, accuracy } = req.body;

    try {
      const record = await PlacementRecord.findByIdAndUpdate(
        recordId,
        {
          status,
          actualOutcome,
          accuracy,
          placementDate: status === 'selected' ? new Date() : null,
          updatedAt: Date.now(),
        },
        { new: true }
      ).populate('studentId');

      if (!record) {
        return res.status(404).json({ message: 'Placement record not found' });
      }

      if (actualOutcome === 'placed') {
        await Student.findByIdAndUpdate(record.studentId, { placementStatus: 'placed' });
      }

      return res.json({
        message: 'Placement status updated successfully',
        record,
      });
    } catch (mongoError) {
      // Fall back to mock DB
      const recordIndex = mockDB.placements.findIndex(r => r._id === recordId);
      if (recordIndex === -1) {
        return res.status(404).json({ message: 'Placement record not found' });
      }

      const record = {
        ...mockDB.placements[recordIndex],
        status,
        actualOutcome,
        accuracy,
        placementDate: status === 'selected' ? new Date() : null,
        updatedAt: new Date(),
      };
      mockDB.placements[recordIndex] = record;

      if (actualOutcome === 'placed') {
        const studentIndex = mockDB.students.findIndex(s => s._id === record.studentId);
        if (studentIndex !== -1) {
          mockDB.students[studentIndex].placementStatus = 'placed';
        }
      }

      return res.json({
        message: 'Placement status updated successfully (Demo)',
        record,
      });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const getStudentPlacements = async (req, res) => {
  try {
    const { studentId } = req.params;

    try {
      const records = await PlacementRecord.find({ studentId });
      return res.json(records);
    } catch (mongoError) {
      // Fall back to mock DB
      const records = mockDB.placements.filter(p => p.studentId === studentId);
      return res.json(records);
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const getAllPlacementRecords = async (req, res) => {
  try {
    try {
      const records = await PlacementRecord.find().populate('studentId');
      return res.json(records);
    } catch (mongoError) {
      // Fall back to mock DB
      return res.json(mockDB.placements);
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const deletePlacementRecord = async (req, res) => {
  try {
    const { recordId } = req.params;

    try {
      const record = await PlacementRecord.findByIdAndDelete(recordId);
      if (!record) {
        return res.status(404).json({ message: 'Placement record not found' });
      }
      return res.json({ message: 'Placement record deleted successfully' });
    } catch (mongoError) {
      // Fall back to mock DB
      const index = mockDB.placements.findIndex(r => r._id === recordId);
      if (index === -1) {
        return res.status(404).json({ message: 'Placement record not found' });
      }
      mockDB.placements.splice(index, 1);
      return res.json({ message: 'Placement record deleted successfully (Demo)' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};
