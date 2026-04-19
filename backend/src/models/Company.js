import mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true }, // e.g., 'Software Engineer'
  description: { type: String, default: '' },
  criteria: {
    minCGPA: { type: Number, default: 0 },
    minSkills: [{ type: String }],
    batch: [{ type: String }], // e.g., ['2024', '2025']
  },
  package: { type: String, default: '' }, // e.g., '6.5 LPA'
  date: { type: Date, default: Date.now },
  deadline: { type: Date },
  registrations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const Company = mongoose.model('Company', companySchema);
export default Company;
