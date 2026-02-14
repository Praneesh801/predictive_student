import PlacementRecord from '../models/PlacementRecord.js';
import Student from '../models/Student.js';
import { mockDB } from '../config/mockDB.js';

export const getPlacementStats = async (req, res) => {
  try {
    try {
      const totalRecords = await PlacementRecord.countDocuments();
      const placedCount = await PlacementRecord.countDocuments({ actualOutcome: 'placed' });
      const notPlacedCount = await PlacementRecord.countDocuments({ actualOutcome: 'rejected' });

      const placementRate = totalRecords > 0 ? (placedCount / totalRecords) * 100 : 0;

      return res.json({
        totalRecords,
        placedCount,
        notPlacedCount,
        placementRate: placementRate.toFixed(2),
      });
    } catch (mongoError) {
      // Fall back to mock DB
      const totalRecords = mockDB.placements.length;
      const placedCount = mockDB.placements.filter(p => p.actualOutcome === 'placed').length;
      const notPlacedCount = mockDB.placements.filter(p => p.actualOutcome === 'rejected').length;

      const placementRate = totalRecords > 0 ? (placedCount / totalRecords) * 100 : 0;

      return res.json({
        totalRecords,
        placedCount,
        notPlacedCount,
        placementRate: placementRate.toFixed(2),
      });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const getStudentStats = async (req, res) => {
  try {
    try {
      const totalStudents = await Student.countDocuments();
      const eligibleStudents = await Student.countDocuments({ placementEligible: true });
      const placedStudents = await Student.countDocuments({ placementStatus: 'placed' });

      const avgCGPA = await Student.aggregate([
        {
          $group: {
            _id: null,
            avgCGPA: { $avg: '$cgpa' },
          },
        },
      ]);

      return res.json({
        totalStudents,
        eligibleStudents,
        placedStudents,
        averageCGPA: avgCGPA[0]?.avgCGPA.toFixed(2) || 0,
      });
    } catch (mongoError) {
      // Fall back to mock DB
      const totalStudents = mockDB.students.length;
      const eligibleStudents = mockDB.students.filter(s => s.placementEligible).length;
      const placedStudents = mockDB.students.filter(s => s.placementStatus === 'placed').length;

      const avgCGPA = mockDB.students.length > 0
        ? (mockDB.students.reduce((sum, s) => sum + s.cgpa, 0) / mockDB.students.length).toFixed(2)
        : 0;

      return res.json({
        totalStudents,
        eligibleStudents,
        placedStudents,
        averageCGPA,
      });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const getPredictionAccuracy = async (req, res) => {
  try {
    try {
      const records = await PlacementRecord.find({ accuracy: { $exists: true } });

      if (records.length === 0) {
        return res.json({
          totalPredictions: 0,
          averageAccuracy: 0,
        });
      }

      const totalAccuracy = records.reduce((sum, record) => sum + record.accuracy, 0);
      const avgAccuracy = (totalAccuracy / records.length * 100).toFixed(2);

      return res.json({
        totalPredictions: records.length,
        averageAccuracy: avgAccuracy,
      });
    } catch (mongoError) {
      // Fall back to mock DB
      const records = mockDB.placements.filter(p => p.accuracy !== undefined);

      if (records.length === 0) {
        return res.json({
          totalPredictions: 0,
          averageAccuracy: 0,
        });
      }

      const totalAccuracy = records.reduce((sum, record) => sum + record.accuracy, 0);
      const avgAccuracy = (totalAccuracy / records.length * 100).toFixed(2);

      return res.json({
        totalPredictions: records.length,
        averageAccuracy: avgAccuracy,
      });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const getTrendAnalysis = async (req, res) => {
  try {
    try {
      const trends = await PlacementRecord.aggregate([
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m', date: '$driveDate' } },
            count: { $sum: 1 },
            placed: { $sum: { $cond: [{ $eq: ['$actualOutcome', 'placed'] }, 1, 0] } },
          },
        },
        { $sort: { _id: 1 } },
      ]);

      return res.json(trends);
    } catch (mongoError) {
      // Fall back to mock DB
      const trendMap = {};
      mockDB.placements.forEach(p => {
        if (p.driveDate) {
          const date = new Date(p.driveDate);
          const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          if (!trendMap[key]) {
            trendMap[key] = { _id: key, count: 0, placed: 0 };
          }
          trendMap[key].count++;
          if (p.actualOutcome === 'placed') {
            trendMap[key].placed++;
          }
        }
      });

      const trends = Object.values(trendMap).sort((a, b) => a._id.localeCompare(b._id));
      return res.json(trends);
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};


export const getPlacementAnalytics = async (req, res) => {
  try {
    try {
      const students = await Student.find();

      const stats = {
        total: students.length,
        highBand: 0,
        mediumBand: 0,
        lowBand: 0,
        placed: 0,
        notPlaced: 0,
        rejected: 0,
        averageSalary: 0,
        bandDistribution: {
          high: 0,
          medium: 0,
          low: 0,
        },
        placementRate: 0,
        lastYearStats: {}
      };

      let totalSalary = 0;
      let salaryCount = 0;

      students.forEach(student => {
        // Band distribution
        if (student.eligibilityBand === 'High') stats.highBand++;
        else if (student.eligibilityBand === 'Medium') stats.mediumBand++;
        else stats.lowBand++;

        // Placement status
        if (student.placementStatus === 'placed') stats.placed++;
        else if (student.placementStatus === 'rejected') stats.rejected++;
        else stats.notPlaced++;

        // Placed company
        if (student.placedCompany && student.placedSalary) {
          totalSalary += student.placedSalary;
          salaryCount++;
        }
      });

      // Calculate statistics
      stats.bandDistribution = {
        high: Math.round((stats.highBand / stats.total) * 100),
        medium: Math.round((stats.mediumBand / stats.total) * 100),
        low: Math.round((stats.lowBand / stats.total) * 100),
      };
      stats.placementRate = Math.round((stats.placed / stats.total) * 100);
      stats.averageSalary = salaryCount > 0 ? Math.round(totalSalary / salaryCount) : 0;

      // Top companies
      stats.topCompanies = [];

      // Top offers
      stats.topOffers = [];

      return res.json(stats);
    } catch (mongoError) {
      // Fall back to mock DB
      const students = mockDB.students || [];

      const stats = {
        total: students.length,
        highBand: 0,
        mediumBand: 0,
        lowBand: 0,
        placed: 0,
        notPlaced: 0,
        rejected: 0,
        bandDistribution: { high: 0, medium: 0, low: 0 },
        placementRate: 0,
        averageSalary: 0,
      };

      if (students.length === 0) return res.json(stats);

      let totalSalary = 0;
      let salaryCount = 0;

      students.forEach(student => {
        if (student.eligibilityBand === 'High') stats.highBand++;
        else if (student.eligibilityBand === 'Medium') stats.mediumBand++;
        else stats.lowBand++;

        if (student.placementStatus === 'placed') stats.placed++;
        else if (student.placementStatus === 'rejected') stats.rejected++;
        else stats.notPlaced++;

        if (student.placedCompany && student.placedSalary) {
          totalSalary += student.placedSalary;
          salaryCount++;
        }
      });

      stats.bandDistribution = {
        high: Math.round((stats.highBand / stats.total) * 100),
        medium: Math.round((stats.mediumBand / stats.total) * 100),
        low: Math.round((stats.lowBand / stats.total) * 100),
      };
      stats.placementRate = Math.round((stats.placed / stats.total) * 100);
      stats.averageSalary = salaryCount > 0 ? Math.round(totalSalary / salaryCount) : 0;

      stats.topCompanies = [];
      stats.topOffers = [];

      return res.json(stats);
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};
