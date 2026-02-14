import Application from '../models/Application.js';
import Student from '../models/Student.js';
import PlacementDrive from '../models/PlacementDrive.js';

export const createApplication = async (req, res) => {
  try {
    const { studentId, driveId } = req.body;

    // Check if student and drive exist
    const student = await Student.findById(studentId);
    const drive = await PlacementDrive.findById(driveId);

    if (!student || !drive) {
      return res.status(404).json({ message: 'Student or Drive not found' });
    }

    // Check if student already applied
    const existingApp = await Application.findOne({ studentId, driveId });
    if (existingApp) {
      return res.status(400).json({ message: 'Student already applied for this drive' });
    }

    const application = new Application({ studentId, driveId });
    await application.save();

    res.status(201).json({ message: 'Application submitted', application });
  } catch (error) {
    res.status(500).json({ message: 'Error creating application', error: error.message });
  }
};

export const getApplicationsByStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    const applications = await Application.find({ studentId })
      .populate('driveId')
      .sort({ applicationDate: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching applications', error: error.message });
  }
};

export const getApplicationsByDrive = async (req, res) => {
  try {
    const { driveId } = req.params;
    const applications = await Application.find({ driveId })
      .populate('studentId')
      .sort({ applicationDate: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching drive applications', error: error.message });
  }
};

export const getApplicationById = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const application = await Application.findById(applicationId)
      .populate('studentId')
      .populate('driveId');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.json(application);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching application', error: error.message });
  }
};

export const updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { applicationStatus, finalResult } = req.body;

    const application = await Application.findByIdAndUpdate(
      applicationId,
      { applicationStatus, finalResult },
      { new: true }
    )
      .populate('studentId')
      .populate('driveId');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.json({ message: 'Application status updated', application });
  } catch (error) {
    res.status(500).json({ message: 'Error updating application', error: error.message });
  }
};

export const addInterviewRound = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const roundData = req.body;

    const application = await Application.findById(applicationId);

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    application.interviewRounds.push(roundData);
    await application.save();

    res.json({ message: 'Interview round added', application });
  } catch (error) {
    res.status(500).json({ message: 'Error adding interview round', error: error.message });
  }
};

export const deleteApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;

    await Application.findByIdAndDelete(applicationId);
    res.json({ message: 'Application deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting application', error: error.message });
  }
};

export const getApplicationStats = async (req, res) => {
  try {
    const total = await Application.countDocuments();
    const selected = await Application.countDocuments({ finalResult: 'selected' });
    const rejected = await Application.countDocuments({ finalResult: 'rejected' });

    res.json({
      total,
      selected,
      rejected,
      pending: total - selected - rejected,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stats', error: error.message });
  }
};
