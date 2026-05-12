import Problem from '../models/Problem.js';
import User from '../models/User.js';

export const listProblems = async (req, res, next) => {
  try {
    const { difficulty, topic } = req.query;
    const q = { user: req.user._id };
    if (difficulty) q.difficulty = difficulty;
    if (topic) q.topic = new RegExp(topic, 'i');
    const problems = await Problem.find(q).sort({ solvedAt: -1 });
    res.json(problems);
  } catch (e) { next(e); }
};

export const addProblem = async (req, res, next) => {
  try {
    const p = await Problem.create({ ...req.body, user: req.user._id });
    await User.findByIdAndUpdate(req.user._id, { $inc: { totalProblemsSolved: 1 } });
    res.status(201).json(p);
  } catch (e) { next(e); }
};

export const updateProblem = async (req, res, next) => {
  try {
    const p = await Problem.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id }, req.body, { new: true });
    res.json(p);
  } catch (e) { next(e); }
};

export const deleteProblem = async (req, res, next) => {
  try {
    await Problem.deleteOne({ _id: req.params.id, user: req.user._id });
    await User.findByIdAndUpdate(req.user._id, { $inc: { totalProblemsSolved: -1 } });
    res.json({ ok: true });
  } catch (e) { next(e); }
};
