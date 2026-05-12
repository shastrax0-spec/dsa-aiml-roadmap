import Resource from '../models/Resource.js';

export const list = async (req, res, next) => {
  try {
    const resources = await Resource.find({ $or: [{ user: null }, { user: req.user._id }] });
    res.json(resources);
  } catch (e) { next(e); }
};

export const create = async (req, res, next) => {
  try {
    const r = await Resource.create({ ...req.body, user: req.user._id });
    res.status(201).json(r);
  } catch (e) { next(e); }
};

export const remove = async (req, res, next) => {
  try {
    await Resource.deleteOne({ _id: req.params.id, user: req.user._id });
    res.json({ ok: true });
  } catch (e) { next(e); }
};
