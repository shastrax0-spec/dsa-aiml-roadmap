import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import DailyTask from '../models/DailyTask.js';
import { ROADMAP } from '../seed/roadmapData.js';

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '30d' });

const provisionRoadmap = async (userId, startDate) => {
  const tasks = ROADMAP.map((r) => {
    const scheduled = new Date(startDate);
    scheduled.setDate(scheduled.getDate() + (r.day - 1));
    return {
      user: userId, day: r.day, month: r.month, scheduledDate: scheduled,
      dsaTopic: r.dsa, aimlTopic: r.aiml, problems: [], resources: [],
    };
  });
  await DailyTask.insertMany(tasks);
};

export const signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'All fields required' });
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: 'Email already in use' });
    const user = await User.create({ name, email, password, startDate: new Date() });
    await provisionRoadmap(user._id, user.startDate);
    res.status(201).json({
      token: signToken(user._id),
      user: { id: user._id, name: user.name, email: user.email, startDate: user.startDate },
    });
  } catch (e) { next(e); }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ message: 'Invalid credentials' });
    res.json({
      token: signToken(user._id),
      user: { id: user._id, name: user.name, email: user.email, startDate: user.startDate, theme: user.theme },
    });
  } catch (e) { next(e); }
};

export const me = async (req, res) => { res.json({ user: req.user }); };
