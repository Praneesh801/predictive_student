import mongoose from 'mongoose';

const PlacementRecordSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  companyName: {
    type: String,
    required: true,
  },
  position: {
    type: String,
    required: true,
  },
  salaryOffered: {
    type: Number,
    required: true,
  },
  driveDate: {
    type: Date,
    required: true,
  },
  placementDate: {
    type: Date,
  },
  status: {
    type: String,
    enum: ['selected', 'rejected', 'pending'],
    default: 'pending',
  },
  predictedOutcome: {
    type: String,
    enum: ['likely_to_be_placed', 'unlikely_to_be_placed'],
  },
  actualOutcome: {
    type: String,
    enum: ['placed', 'rejected'],
  },
  accuracy: {
    type: Number,
    min: 0,
    max: 1,
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

const PlacementRecord = mongoose.model('PlacementRecord', PlacementRecordSchema);
export default PlacementRecord;
