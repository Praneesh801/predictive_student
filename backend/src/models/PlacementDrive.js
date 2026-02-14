import mongoose from 'mongoose';

const PlacementDriveSchema = new mongoose.Schema({
  driveId: {
    type: String,
    unique: true,
    default: () => new mongoose.Types.ObjectId().toString().slice(0, 8).toUpperCase(),
  },
  companyName: {
    type: String,
    required: true,
  },
  driveDate: {
    type: Date,
    required: true,
  },
  registrationDeadline: Date,
  eligibilityCriteria: {
    type: {
      minCGPA: Number,
      maxArrears: Number,
      allowedDepartments: [String],
      allowedYears: [String],
    },
    default: {},
  },
  location: String,
  venue: String,
  jobRole: String,
  packageOffered: Number,
  numberOfPositions: Number,
  description: String,
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
    default: 'upcoming',
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

const PlacementDrive = mongoose.model('PlacementDrive', PlacementDriveSchema);
export default PlacementDrive;
