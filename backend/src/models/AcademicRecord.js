import mongoose from 'mongoose';

const AcademicRecordSchema = new mongoose.Schema({
  recordId: {
    type: String,
    unique: true,
    default: () => new mongoose.Types.ObjectId().toString().slice(0, 8).toUpperCase(),
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
    unique: true,
  },
  tenthPercentage: {
    type: Number,
    min: 0,
    max: 100,
  },
  twelfthPercentage: {
    type: Number,
    min: 0,
    max: 100,
  },
  currentSemester: {
    type: Number,
    min: 1,
    max: 8,
  },
  projectDetails: {
    type: [
      {
        title: String,
        description: String,
        technologies: [String],
        link: String,
      },
    ],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const AcademicRecord = mongoose.model('AcademicRecord', AcademicRecordSchema);
export default AcademicRecord;
