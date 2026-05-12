import mongoose from 'mongoose';

const revisionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    task: { type: mongoose.Schema.Types.ObjectId, ref: 'DailyTask', required: true },
    interval: { type: Number, enum: [3, 7, 15], required: true },
    dueDate: { type: Date, required: true, index: true },
    completed: { type: Boolean, default: false },
    completedAt: { type: Date, default: null },
    topic: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model('RevisionSchedule', revisionSchema);
