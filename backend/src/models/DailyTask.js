import mongoose from 'mongoose';

/**
 * Tasks NEVER auto-delete. Missed days remain pending forever
 * until the user actively marks them complete.
 */
const dailyTaskSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    day: { type: Number, required: true },
    month: { type: Number, enum: [1, 2], required: true },
    scheduledDate: { type: Date, required: true },
    dsaTopic: { type: String, required: true },
    aimlTopic: { type: String, required: true },
    problems: [{ title: String, link: String, difficulty: String }],
    resources: [{ title: String, link: String, source: String }],
    status: { type: String, enum: ['pending', 'in-progress', 'completed', 'overdue'], default: 'pending', index: true },
    completedAt: { type: Date, default: null },
    notes: { type: String, default: '' },
    timeSpentMinutes: { type: Number, default: 0 },
    difficultyRating: { type: Number, min: 0, max: 5, default: 0 },
    confidenceRating: { type: Number, min: 0, max: 5, default: 0 },
    revisionDone: { type: Boolean, default: false },
  },
  { timestamps: true }
);

dailyTaskSchema.index({ user: 1, day: 1 }, { unique: true });

export default mongoose.model('DailyTask', dailyTaskSchema);
