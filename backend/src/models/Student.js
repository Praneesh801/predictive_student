import mongoose from 'mongoose';

const StudentSchema = new mongoose.Schema({
  studentId: {
    type: String,
    unique: true,
    default: () => new mongoose.Types.ObjectId().toString().slice(0, 8).toUpperCase(),
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  registerNumber: {
    type: String,
    unique: true,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  cgpa: {
    type: Number,
    required: true,
    min: 0,
    max: 10,
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
  diplomaPercentage: {
    type: Number,
    min: 0,
    max: 100,
  },
  arrearCount: {
    type: Number,
    default: 0,
    min: 0,
  },
  arrearHistory: [String],
  email: {
    type: String,
    required: true,
  },
  phone: String,
  // Technical Skills and Knowledge
  technicalSkills: [String],
  coreSubjectKnowledge: {
    type: String,
    enum: ['Poor', 'Average', 'Good', 'Excellent'],
    default: 'Average',
  },
  codingSkillLevel: {
    type: String,
    enum: ['Poor', 'Average', 'Good', 'Excellent'],
    default: 'Average',
  },
  certifications: [String],
  internships: {
    type: Number,
    default: 0,
  },
  projects: [String],
  // Soft Skills
  aptitudeSkillLevel: {
    type: String,
    enum: ['Poor', 'Average', 'Good', 'Excellent'],
    default: 'Average',
  },
  communicationSkillLevel: {
    type: String,
    enum: ['Poor', 'Average', 'Good', 'Excellent'],
    default: 'Average',
  },
  softSkillsRating: {
    type: String,
    enum: ['Poor', 'Average', 'Good', 'Excellent'],
    default: 'Average',
  },
  // Placement Preparation
  mockInterviewPerformance: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
  resumeQualityRating: {
    type: String,
    enum: ['Poor', 'Average', 'Good', 'Excellent'],
    default: 'Average',
  },
  // Extra-Curricular
  leadershipExperience: {
    type: Boolean,
    default: false,
  },
  workshopsHackathonsParticipation: {
    type: Number,
    default: 0,
  },
  areaOfInterest: [String],
  // Placement History
  previousPlacementAttempts: {
    type: Number,
    default: 0,
  },
  previousCompaniesApplied: [String],
  placementDriveParticipation: [String],
  // Predictions and Status
  predictedPlacementProbability: {
    type: Number,
    default: 0,
    min: 0,
    max: 1,
  },
  eligibilityBand: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Low',
  },
  placementStatus: {
    type: String,
    enum: ['not_placed', 'placed', 'rejected', 'offer_received'],
    default: 'not_placed',
  },
  placedCompany: String,
  placedSalary: Number,
  placedLPA: Number,
  placedDate: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Student = mongoose.model('Student', StudentSchema);
export default Student;
