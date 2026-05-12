import RevisionSchedule from '../models/RevisionSchedule.js';

export const listRevisions = async (req, res, next) => {
  try {
    const due = await RevisionSchedule.find({ user: req.user._id, completed: false })
      .populate('task', 'day dsaTopic aimlTopic').sort({ dueDate: 1 });
    res.json(due);
  } catch (e) { next(e); }
};

export const completeRevision = async (req, res, next) => {
  try {
    const r = await RevisionSchedule.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { completed: true, completedAt: new Date() }, { new: true });
    res.json(r);
  } catch (e) { next(e); }
};
