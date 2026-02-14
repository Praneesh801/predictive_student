import mongoose from 'mongoose';

const CompanySchema = new mongoose.Schema({
  companyId: {
    type: String,
    unique: true,
    default: () => new mongoose.Types.ObjectId().toString().slice(0, 8).toUpperCase(),
  },
  companyName: {
    type: String,
    required: true,
    unique: true,
  },
  eligibilityCGPA: {
    type: Number,
    min: 0,
    max: 10,
  },
  maxArrearLimit: {
    type: Number,
    default: 0,
  },
  jobRole: {
    type: [String],
    default: [],
  },
  packageOffered: {
    type: [
      {
        role: String,
        lpa: Number,
        currency: { type: String, default: 'INR' },
      },
    ],
    default: [],
  },
  website: String,
  industry: String,
  location: String,
  contactPerson: String,
  contactEmail: String,
  contactPhone: String,
  description: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Company = mongoose.model('Company', CompanySchema);
export default Company;
