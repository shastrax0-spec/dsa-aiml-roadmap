import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    title: { type: String, required: true },
    link: { type: String, required: true },
    source: { type: String, enum: ['Striver','GFG','CodeWithHarry','ShraddhaKhapra','CampusX','CodeBasics','Other'], default: 'Other' },
    category: { type: String, enum: ['DSA','AI/ML','Math','General'], default: 'DSA' },
    topic: { type: String, default: '' },
    tags: [String],
  },
  { timestamps: true }
);

export default mongoose.model('Resource', resourceSchema);
