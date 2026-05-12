import mongoose from 'mongoose';

const problemSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true },
    platform: { type: String, enum: ['LeetCode', 'GFG', 'Codeforces', 'HackerRank', 'Other'], default: 'LeetCode' },
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
    topic: { type: String, required: true },
    link: { type: String, default: '' },
    timeTakenMinutes: { type: Number, default: 0 },
    solvedAt: { type: Date, default: Date.now },
    needsRevision: { type: Boolean, default: false },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model('Problem', problemSchema);
