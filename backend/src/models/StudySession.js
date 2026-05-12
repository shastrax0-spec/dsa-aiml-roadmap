import mongoose from 'mongoose';

const studySessionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    date: { type: Date, required: true, default: Date.now },
    minutes: { type: Number, required: true },
    type: { type: String, enum: ['pomodoro', 'manual', 'task'], default: 'manual' },
    topic: { type: String, default: '' },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model('StudySession', studySessionSchema);
