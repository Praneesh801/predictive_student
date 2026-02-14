import mongoose from 'mongoose';

const PredictionSchema = new mongoose.Schema({
  predictionId: {
    type: String,
    unique: true,
    default: () => new mongoose.Types.ObjectId().toString().slice(0, 8).toUpperCase(),
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  placementProbability: {
    type: Number,
    min: 0,
    max: 100,
    required: true,
  },
  readinessCategory: {
    type: String,
    enum: ['High', 'Medium', 'Low'],
    required: true,
  },
  skillGapAnalysis: {
    type: {
      academicGap: String,
      technicalGap: String,
      softSkillsGap: String,
      recommendations: [String],
    },
    default: {},
  },
  predictionDate: {
    type: Date,
    default: Date.now,
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

const Prediction = mongoose.model('Prediction', PredictionSchema);
export default Prediction;
