import User from '../models/User.js';

export const updateProfile = async (req, res, next) => {
  try {
    const { name, theme, avatar } = req.body;
    const u = await User.findByIdAndUpdate(req.user._id,
      { ...(name && { name }), ...(theme && { theme }), ...(avatar !== undefined && { avatar }) },
      { new: true });
    res.json(u);
  } catch (e) { next(e); }
};

export const useStreakFreeze = async (req, res, next) => {
  try {
    const u = await User.findById(req.user._id);
    if (u.streakFreezes <= 0) return res.status(400).json({ message: 'No freezes left' });
    u.streakFreezes -= 1;
    u.lastActiveDate = new Date();
    await u.save();
    res.json(u);
  } catch (e) { next(e); }
};
