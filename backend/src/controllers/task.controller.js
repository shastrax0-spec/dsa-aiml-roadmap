import DailyTask from '../models/DailyTask.js';
import RevisionSchedule from '../models/RevisionSchedule.js';
import User from '../models/User.js';

const decorateStatus = (task) => {
  const t = task.toObject();
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const scheduled = new Date(task.scheduledDate); scheduled.setHours(0, 0, 0, 0);
  if (task.status === 'pending' && scheduled < today) t.status = 'overdue';
  t.isToday = scheduled.getTime() === today.getTime();
  t.isPast = scheduled < today;
  return t;
};

export const getAllTasks = async (req, res, next) => {
  try {
    const tasks = await DailyTask.find({ user: req.user._id }).sort({ day: 1 });
    res.json(tasks.map(decorateStatus));
  } catch (e) { next(e); }
};

export const getTodayTasks = async (req, res, next) => {
  try {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);
    const tasks = await DailyTask.find({
      user: req.user._id, scheduledDate: { $gte: today, $lt: tomorrow },
    });
    res.json(tasks.map(decorateStatus));
  } catch (e) { next(e); }
};

export const getPendingTasks = async (req, res, next) => {
  try {
    const tasks = await DailyTask.find({
      user: req.user._id, status: { $in: ['pending', 'in-progress'] },
    }).sort({ day: 1 });
    res.json(tasks.map(decorateStatus));
  } catch (e) { next(e); }
};

export const getTaskByDay = async (req, res, next) => {
  try {
    const task = await DailyTask.findOne({ user: req.user._id, day: +req.params.day });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(decorateStatus(task));
  } catch (e) { next(e); }
};

export const updateTask = async (req, res, next) => {
  try {
    const task = await DailyTask.findOne({ user: req.user._id, day: +req.params.day });
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const fields = ['notes', 'timeSpentMinutes', 'difficultyRating', 'confidenceRating', 'revisionDone', 'status'];
    fields.forEach((f) => req.body[f] !== undefined && (task[f] = req.body[f]));

    const wasCompleted = task.status === 'completed';
    if (req.body.status === 'completed' && !wasCompleted) {
      task.completedAt = new Date();
      const intervals = [3, 7, 15];
      const revisions = intervals.map((i) => ({
        user: req.user._id, task: task._id, interval: i,
        dueDate: new Date(Date.now() + i * 24 * 60 * 60 * 1000),
        topic: `${task.dsaTopic} + ${task.aimlTopic}`,
      }));
      await RevisionSchedule.insertMany(revisions);

      const user = await User.findById(req.user._id);
      const today = new Date(); today.setHours(0, 0, 0, 0);
      const last = user.lastActiveDate ? new Date(user.lastActiveDate) : null;
      if (last) last.setHours(0, 0, 0, 0);
      if (!last) user.currentStreak = 1;
      else {
        const diff = (today - last) / (1000 * 60 * 60 * 24);
        if (diff === 0) {} else if (diff === 1) user.currentStreak += 1;
        else user.currentStreak = 1;
      }
      user.longestStreak = Math.max(user.longestStreak, user.currentStreak);
      user.lastActiveDate = today;
      user.totalStudyMinutes += task.timeSpentMinutes || 0;
      await user.save();
    }

    await task.save();
    res.json(decorateStatus(task));
  } catch (e) { next(e); }
};

export const getStats = async (req, res, next) => {
  try {
    const tasks = await DailyTask.find({ user: req.user._id });
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === 'completed').length;
    const month1 = tasks.filter((t) => t.month === 1);
    const month2 = tasks.filter((t) => t.month === 2);
    res.json({
      total, completed, pending: total - completed,
      progressPercent: total ? Math.round((completed / total) * 100) : 0,
      dsaPercent: total ? Math.round((completed / total) * 100) : 0,
      aimlPercent: total ? Math.round((completed / total) * 100) : 0,
      month1Progress: month1.length ? Math.round((month1.filter((t) => t.status === 'completed').length / month1.length) * 100) : 0,
      month2Progress: month2.length ? Math.round((month2.filter((t) => t.status === 'completed').length / month2.length) * 100) : 0,
    });
  } catch (e) { next(e); }
};
