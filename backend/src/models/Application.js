import mongoose from 'mongoose';

const ApplicationSchema = new mongoose.Schema({
  applicationId: {
    type: String,
    unique: true,
    default: () => new mongoose.Types.ObjectId().toString().slice(0, 8).toUpperCase(),
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  driveId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PlacementDrive',
    required: true,
  },
  applicationDate: {
    type: Date,
    default: Date.now,
  },
  applicationStatus: {
    type: String,
    enum: ['applied', 'shortlisted', 'selected', 'rejected', 'waitlist'],
    default: 'applied',
  },
  interviewRounds: [
    {
      roundNumber: Number,
      roundType: String, // 'technical', 'hr', 'group_discussion', etc.
      date: Date,
      result: {
        type: String,
        enum: ['pass', 'fail', 'pending'],
      },
      feedback: String,
    },
  ],
  finalResult: {
    type: String,
    enum: ['selected', 'rejected', 'pending'],
    default: 'pending',
  },
  offerLetter: String, // Offer letter URL or document
  salary: Number,
  lpa: Number,
  joiningDate: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Application = mongoose.model('Application', ApplicationSchema);
export default Application;
