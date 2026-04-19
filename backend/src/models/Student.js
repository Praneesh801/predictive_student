import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true },
  rollNumber: { type: String, unique: true, sparse: true },
  email: { type: String, default: '' },
  department: { type: String, default: 'Computer Science' },
  placementStatus: {
    type: String,
    enum: ['not_applied', 'applied', 'placed', 'not_placed', 'ai_needed'],
    default: 'not_applied'
  },
  companyPlaced: { type: String, default: '' },
  batch: { type: String, default: '2024' },
  registeredCompanies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Company' }]
}, { timestamps: true });

const Student = mongoose.model('Student', studentSchema);
export default Student;
