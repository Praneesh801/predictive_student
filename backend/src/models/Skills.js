import mongoose from 'mongoose';

const SkillsSchema = new mongoose.Schema({
  skillId: {
    type: String,
    unique: true,
    default: () => new mongoose.Types.ObjectId().toString().slice(0, 8).toUpperCase(),
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  technicalSkills: {
    type: [String],
    default: [],
  },
  communicationLevel: {
    type: String,
    enum: ['Poor', 'Average', 'Good', 'Excellent'],
    default: 'Average',
  },
  aptitudeLevel: {
    type: String,
    enum: ['Poor', 'Average', 'Good', 'Excellent'],
    default: 'Average',
  },
  codingLevel: {
    type: String,
    enum: ['Poor', 'Average', 'Good', 'Excellent'],
    default: 'Average',
  },
  certificationDetails: {
    type: [String],
    default: [],
  },
  internshipDetails: {
    type: [
      {
        company: String,
        duration: String,
        role: String,
        description: String,
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

const Skills = mongoose.model('Skills', SkillsSchema);
export default Skills;
