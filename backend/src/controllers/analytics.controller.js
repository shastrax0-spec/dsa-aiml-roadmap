import DailyTask from '../models/DailyTask.js';
import Problem from '../models/Problem.js';
import StudySession from '../models/StudySession.js';

export const getAnalytics = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const tasks = await DailyTask.find({ user: userId });
    const problems = await Problem.find({ user: userId });
    const sessions = await StudySession.find({ user: userId }).sort({ date: 1 });

    const week = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(); d.setHours(0,0,0,0); d.setDate(d.getDate() - i);
      const next = new Date(d); next.setDate(next.getDate() + 1);
      const mins = sessions.filter((s) => s.date >= d && s.date < next).reduce((sum, s) => sum + s.minutes, 0);
      week.push({ date: d.toISOString().slice(5, 10), hours: +(mins / 60).toFixed(2) });
    }

    const byDifficulty = ['Easy', 'Medium', 'Hard'].map((d) => ({
      name: d, value: problems.filter((p) => p.difficulty === d).length,
    }));

    const topicMap = {};
    tasks.forEach((t) => {
      const topic = (t.dsaTopic || '').split(' - ')[0] || t.dsaTopic;
      topicMap[topic] = topicMap[topic] || { topic, total: 0, done: 0 };
      topicMap[topic].total++;
      if (t.status === 'completed') topicMap[topic].done++;
    });
    const topics = Object.values(topicMap).map((t) => ({
      ...t, percent: Math.round((t.done / t.total) * 100),
    }));

    const heatmap = [];
    for (let i = 89; i >= 0; i--) {
      const d = new Date(); d.setHours(0,0,0,0); d.setDate(d.getDate() - i);
      const next = new Date(d); next.setDate(next.getDate() + 1);
      const count = sessions.filter((s) => s.date >= d && s.date < next).length;
      heatmap.push({ date: d.toISOString().slice(0, 10), count });
    }

    res.json({ week, byDifficulty, topics, heatmap, totalProblems: problems.length });
  } catch (e) { next(e); }
};
