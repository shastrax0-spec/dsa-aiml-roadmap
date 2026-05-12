// frontend/src/pages/Dashboard.jsx
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTasks } from '../store/useTasks';
import { useAuth } from '../store/useAuth';
import StatCard from '../components/StatCard';
import TaskCard from '../components/TaskCard';
import PomodoroTimer from '../components/PomodoroTimer';
import MotivationalQuote from '../components/MotivationalQuote';
import DailyResources from '../components/DailyResources';
import { CheckCircle2, Clock, Flame, Code2, TrendingUp, BookOpenCheck, Sparkles, Zap } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import api from '../api/axios';

// ─── XP & Streak helpers ──────────────────────────────────────────────────
function getTotalXP() {
  try {
    const progress = JSON.parse(localStorage.getItem('dsa_resource_progress')) || {};
    return Object.keys(progress).length * 10; // rough proxy
  } catch { return 0; }
}

export default function Dashboard() {
  const { today, pending, stats, loadAll } = useTasks();
  const { user } = useAuth();
  const [week, setWeek] = useState([]);
  const [xp, setXp] = useState(getTotalXP);

  useEffect(() => {
    loadAll();
    api.get('/analytics').then(({ data }) => setWeek(data.week)).catch(() => {});
  }, []);

  // Refresh XP every time localStorage changes (when user marks resources)
  useEffect(() => {
    const sync = () => setXp(getTotalXP());
    window.addEventListener('storage', sync);
    const id = setInterval(sync, 2000);
    return () => { window.removeEventListener('storage', sync); clearInterval(id); };
  }, []);

  const overdue = pending.filter((t) => t.status === 'overdue');

  return (
    <div className="space-y-6">
      {/* ── Welcome ── */}
      <div>
        <h1 className="text-3xl font-bold">Welcome back, {user?.name?.split(' ')[0]} 👋</h1>
        <p className="text-gray-400 mt-1">Here's your roadmap snapshot.</p>
        <p className="text-gray-300 mt-1">Created By ~Chittaranjan</p>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={Flame}        label="Current Streak"   value={`${user?.currentStreak || 0}d`} sub={`Best: ${user?.longestStreak || 0}d`} />
        <StatCard icon={CheckCircle2} label="Completed"        value={stats?.completed || 0}           sub={`of ${stats?.total || 60}`} />
        <StatCard icon={Code2}        label="Problems Solved"  value={user?.totalProblemsSolved || 0} />
        <StatCard icon={Zap}          label="Total XP"         value={xp}                             sub="Keep marking resources!" />
      </div>

      {/* ── Month Progress ── */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="card p-5">
          <h3 className="font-semibold mb-3">Month 1 — DSA + ML Foundations</h3>
          <ProgressBar percent={stats?.month1Progress || 0} />
        </div>
        <div className="card p-5">
          <h3 className="font-semibold mb-3">Month 2 — Advanced + Deep Learning</h3>
          <ProgressBar percent={stats?.month2Progress || 0} />
        </div>
      </div>

      {/* ── Chart + Pomodoro ── */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="card p-5 md:col-span-2">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" /> Weekly Study Hours
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={week}>
              <XAxis dataKey="date" stroke="#666" fontSize={11} />
              <YAxis stroke="#666" fontSize={11} />
              <Tooltip contentStyle={{ background: '#13131a', border: '1px solid #22222e' }} />
              <Bar dataKey="hours" fill="#7c5cff" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <PomodoroTimer />
      </div>

      {/* ── Motivational Quote ── */}
      <MotivationalQuote />

      {/* ── Overdue ── */}
      {overdue.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-3 flex items-center gap-2 text-danger">
            <Clock className="w-5 h-5" /> Overdue Tasks ({overdue.length}) — still accessible!
          </h2>
          <div className="grid md:grid-cols-2 gap-3">
            {overdue.slice(0, 4).map((t) => <TaskCard key={t._id} task={t} />)}
          </div>
        </div>
      )}

      {/* ── Today's Focus with Resources ── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <BookOpenCheck className="w-5 h-5" /> Today's Focus
          </h2>
          <div className="flex items-center gap-1.5 text-xs text-accent font-semibold bg-accent/10 px-3 py-1.5 rounded-full border border-accent/25">
            <Sparkles className="w-3.5 h-3.5" /> AI-Curated Resources
          </div>
        </div>

        {today.length === 0 ? (
          <div className="card p-6 text-gray-400">
            No tasks scheduled today. Catch up on pending tasks!
          </div>
        ) : (
          <div className="space-y-4">
            {today.map((t, i) => (
              <motion.div
                key={t._id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="space-y-2"
              >
                {/* Original task card */}
                <TaskCard task={t} />

                {/* Resources accordion below each task */}
                <DailyResources day={t.day} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── ProgressBar ─────────────────────────────────────────────────────────────
function ProgressBar({ percent }) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-400">Progress</span>
        <span className="font-semibold">{percent}%</span>
      </div>
      <div className="h-2.5 bg-bg-border rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-accent to-accent-glow transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
