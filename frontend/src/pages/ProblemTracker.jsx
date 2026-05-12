import { useEffect, useState } from 'react';
import api from '../api/axios';
import { Plus, Trash2, ExternalLink, Filter } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function ProblemTracker() {
  const [problems, setProblems] = useState([]);
  const [filter, setFilter] = useState({ difficulty: '', topic: '' });
  const [form, setForm] = useState({ name: '', platform: 'LeetCode', difficulty: 'Easy', topic: '', link: '', timeTakenMinutes: 0 });
  const [show, setShow] = useState(false);

  const load = async () => {
    const params = {};
    if (filter.difficulty) params.difficulty = filter.difficulty;
    if (filter.topic) params.topic = filter.topic;
    const { data } = await api.get('/problems', { params });
    setProblems(data);
  };

  useEffect(() => { load(); }, [filter]);

  const add = async (e) => {
    e.preventDefault();
    if (!form.name || !form.topic) return toast.error('Name + topic required');
    await api.post('/problems', form);
    toast.success('Problem added!');
    setForm({ name: '', platform: 'LeetCode', difficulty: 'Easy', topic: '', link: '', timeTakenMinutes: 0 });
    setShow(false); load();
  };

  const del = async (id) => {
    await api.delete(`/problems/${id}`);
    toast.success('Deleted'); load();
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-3xl font-bold">Problem Tracker</h1>
        <button onClick={() => setShow(!show)} className="btn btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Problem
        </button>
      </div>

      {show && (
        <motion.form initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          onSubmit={add} className="card p-5 grid md:grid-cols-2 gap-3">
          <input className="input" placeholder="Problem name" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} />
          <input className="input" placeholder="Topic (e.g. Arrays)" value={form.topic} onChange={(e) => setForm({...form, topic: e.target.value})} />
          <select className="input" value={form.platform} onChange={(e) => setForm({...form, platform: e.target.value})}>
            {['LeetCode','GFG','Codeforces','HackerRank','Other'].map(p => <option key={p}>{p}</option>)}
          </select>
          <select className="input" value={form.difficulty} onChange={(e) => setForm({...form, difficulty: e.target.value})}>
            {['Easy','Medium','Hard'].map(d => <option key={d}>{d}</option>)}
          </select>
          <input className="input" placeholder="Link (optional)" value={form.link} onChange={(e) => setForm({...form, link: e.target.value})} />
          <input className="input" type="number" placeholder="Time taken (min)" value={form.timeTakenMinutes} onChange={(e) => setForm({...form, timeTakenMinutes: +e.target.value})} />
          <button className="btn btn-primary md:col-span-2">Save Problem</button>
        </motion.form>
      )}

      <div className="card p-4 flex flex-wrap gap-2 items-center">
        <Filter className="w-4 h-4 text-gray-400" />
        <select className="input max-w-[150px]" value={filter.difficulty} onChange={(e) => setFilter({...filter, difficulty: e.target.value})}>
          <option value="">All Difficulty</option>
          {['Easy','Medium','Hard'].map(d => <option key={d}>{d}</option>)}
        </select>
        <input className="input max-w-[200px]" placeholder="Filter by topic..."
          value={filter.topic} onChange={(e) => setFilter({...filter, topic: e.target.value})} />
        <span className="text-sm text-gray-400 ml-auto">{problems.length} problems</span>
      </div>

      <div className="grid gap-2">
        {problems.map((p) => (
          <motion.div key={p._id} whileHover={{ x: 4 }} className="card p-4 flex items-center justify-between gap-3">
            <div className="flex-1">
              <h3 className="font-semibold">{p.name}</h3>
              <div className="flex gap-2 mt-1 flex-wrap text-xs">
                <span className="px-2 py-0.5 rounded-full bg-bg-border">{p.platform}</span>
                <span className={`px-2 py-0.5 rounded-full ${
                  p.difficulty === 'Easy' ? 'bg-success/15 text-success' :
                  p.difficulty === 'Medium' ? 'bg-warn/15 text-warn' : 'bg-danger/15 text-danger'
                }`}>{p.difficulty}</span>
                <span className="px-2 py-0.5 rounded-full bg-accent/15 text-accent">{p.topic}</span>
                {p.timeTakenMinutes > 0 && <span className="text-gray-400">⏱ {p.timeTakenMinutes}m</span>}
              </div>
            </div>
            <div className="flex gap-2">
              {p.link && <a href={p.link} target="_blank" rel="noreferrer" className="btn btn-ghost p-2"><ExternalLink className="w-4 h-4" /></a>}
              <button onClick={() => del(p._id)} className="btn btn-ghost p-2 hover:text-danger"><Trash2 className="w-4 h-4" /></button>
            </div>
          </motion.div>
        ))}
        {problems.length === 0 && <div className="card p-6 text-center text-gray-400">No problems yet. Add your first!</div>}
      </div>
    </div>
  );
}
