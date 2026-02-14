import AcademicRecord from '../models/AcademicRecord.js';

export const createOrUpdateAcademicRecord = async (req, res) => {
  try {
    const { studentId } = req.params;
    const recordData = req.body;

    let record = await AcademicRecord.findOne({ studentId });

    if (record) {
      record = Object.assign(record, recordData);
      record.updatedAt = new Date();
      await record.save();
    } else {
      record = new AcademicRecord({ studentId, ...recordData });
      await record.save();
    }

    res.status(200).json({ message: 'Academic record updated', record });
  } catch (error) {
    res.status(500).json({ message: 'Error updating academic record', error: error.message });
  }
};

export const getAcademicRecord = async (req, res) => {
  try {
    const { studentId } = req.params;
    const record = await AcademicRecord.findOne({ studentId }).populate('studentId');

    if (!record) {
      return res.status(404).json({ message: 'Academic record not found' });
    }

    res.json(record);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching academic record', error: error.message });
  }
};

export const deleteAcademicRecord = async (req, res) => {
  try {
    const { studentId } = req.params;
    await AcademicRecord.deleteOne({ studentId });

    res.json({ message: 'Academic record deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting academic record', error: error.message });
  }
};
