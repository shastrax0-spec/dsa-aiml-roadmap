import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTasks } from '../store/useTasks';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2, Save, Clock, Star } from 'lucide-react';
import toast from 'react-hot-toast';

export default function DailyPlanner() {
  const { day } = useParams();
  const { tasks, loadAll, updateTask } = useTasks();
  const [active, setActive] = useState(day ? +day : null);
  const [form, setForm] = useState({});

  useEffect(() => { tasks.length === 0 && loadAll(); }, []);
  useEffect(() => {
    if (active && tasks.length) {
      const t = tasks.find((x) => x.day === active);
      if (t) setForm({
        notes: t.notes || '', timeSpentMinutes: t.timeSpentMinutes || 0,
        difficultyRating: t.difficultyRating || 0, confidenceRating: t.confidenceRating || 0,
        revisionDone: t.revisionDone || false, status: t.status,
      });
    }
  }, [active, tasks]);

  if (!active) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-2">Daily Planner</h1>
        <p className="text-gray-400 mb-6">All 60 days are always accessible. Missed days never disappear.</p>
        <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
          {tasks.map((t) => (
            <motion.button key={t._id} whileHover={{ scale: 1.05 }} onClick={() => setActive(t.day)}
              className={`p-3 rounded-xl text-sm font-semibold border transition ${
                t.status === 'completed' ? 'bg-success/15 border-success/40 text-success' :
                t.status === 'overdue' ? 'bg-danger/10 border-danger/40 text-danger' :
                t.isToday ? 'bg-accent/15 border-accent/40 text-accent' :
                'bg-bg-card border-bg-border'
              }`}>
              {t.day}
            </motion.button>
          ))}
        </div>
      </div>
    );
  }

  const task = tasks.find((x) => x.day === active);
  if (!task) return <div>Loading...</div>;

  const save = async () => { await updateTask(active, form); toast.success('Saved!'); };
  const markComplete = async () => {
    await updateTask(active, { ...form, status: 'completed' });
    toast.success('🎉 Day complete! Revisions scheduled at +3, +7, +15 days.');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      <button onClick={() => setActive(null)} className="flex items-center gap-2 text-gray-400 hover:text-white">
        <ArrowLeft className="w-4 h-4" /> Back to all days
      </button>

      <div className="card p-6">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span className="px-3 py-1 rounded-full bg-accent/15 text-accent text-sm font-semibold">Day {task.day}</span>
          <span className="text-xs text-gray-400">Month {task.month}</span>
          {task.status === 'overdue' && <span className="text-xs text-danger">⚠ Overdue (still completable)</span>}
        </div>
        <h1 className="text-2xl font-bold">{task.dsaTopic}</h1>
        <p className="text-accent mt-1">🤖 {task.aimlTopic}</p>
        <p className="text-sm text-gray-500 mt-1">Scheduled: {new Date(task.scheduledDate).toLocaleDateString()}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="card p-5">
          <label className="text-sm text-gray-400">Notes</label>
          <textarea className="input mt-2 min-h-[120px]" value={form.notes || ''}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            placeholder="What did you learn today?" />
        </div>

        <div className="card p-5 space-y-3">
          <div>
            <label className="text-sm text-gray-400 flex items-center gap-1"><Clock className="w-4 h-4" /> Time spent (minutes)</label>
            <input type="number" className="input mt-1" value={form.timeSpentMinutes || 0}
              onChange={(e) => setForm({ ...form, timeSpentMinutes: +e.target.value })} />
          </div>
          <RatingPicker label="Difficulty" value={form.difficultyRating || 0}
            onChange={(v) => setForm({ ...form, difficultyRating: v })} />
          <RatingPicker label="Confidence" value={form.confidenceRating || 0}
            onChange={(v) => setForm({ ...form, confidenceRating: v })} />
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.revisionDone || false}
              onChange={(e) => setForm({ ...form, revisionDone: e.target.checked })} />
            <span className="text-sm">Revision done</span>
          </label>
        </div>
      </div>

      <div className="flex gap-3 flex-wrap">
        <button onClick={save} className="btn btn-ghost flex items-center gap-2">
          <Save className="w-4 h-4" /> Save Progress
        </button>
        {task.status !== 'completed' && (
          <button onClick={markComplete} className="btn btn-primary flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> Mark Complete
          </button>
        )}
      </div>
    </div>
  );
}

function RatingPicker({ label, value, onChange }) {
  return (
    <div>
      <label className="text-sm text-gray-400">{label}</label>
      <div className="flex gap-1 mt-1">
        {[1,2,3,4,5].map((n) => (
          <button key={n} onClick={() => onChange(n)} type="button">
            <Star className={`w-6 h-6 ${n <= value ? 'fill-accent text-accent' : 'text-gray-600'}`} />
          </button>
        ))}
      </div>
    </div>
  );
}
