import StudySession from '../models/StudySession.js';
import User from '../models/User.js';

export const addSession = async (req, res, next) => {
  try {
    const s = await StudySession.create({ ...req.body, user: req.user._id });
    await User.findByIdAndUpdate(req.user._id, { $inc: { totalStudyMinutes: s.minutes } });
    res.status(201).json(s);
  } catch (e) { next(e); }
};

export const listSessions = async (req, res, next) => {
  try {
    const sessions = await StudySession.find({ user: req.user._id }).sort({ date: -1 }).limit(50);
    res.json(sessions);
  } catch (e) { next(e); }
};
