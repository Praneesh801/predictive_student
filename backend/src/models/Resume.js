import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema({
  studentName: { type: String, default: 'Anonymous' },
  fileName: { type: String, required: true },
  originalName: { type: String },
  extractedText: { type: String, default: '' },
  score: { type: Number, default: 0, min: 0, max: 100 },
  grade: { type: String, default: 'F' },
  scoreBreakdown: {
    education: { type: Number, default: 0 },
    technicalSkills: { type: Number, default: 0 },
    experience: { type: Number, default: 0 },
    projects: { type: Number, default: 0 },
    certifications: { type: Number, default: 0 },
    softSkills: { type: Number, default: 0 }
  },
  feedback: [{ type: String }],
  strengths: [{ type: String }],
  improvements: [{ type: String }],
  keywords: [{ type: String }]
}, { timestamps: true });

const Resume = mongoose.model('Resume', resumeSchema);
export default Resume;
