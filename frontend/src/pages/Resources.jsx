// frontend/src/pages/Resources.jsx
// Full resources page - lists all roadmap days with expandable resource accordions

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, BookOpen, Zap, Trophy } from 'lucide-react';
import DailyResources from '../components/DailyResources';
import { roadmapData, difficultyConfig } from '../data/roadmapData';

const FILTERS = ['All', 'Beginner', 'Intermediate', 'Advanced'];
const CATEGORIES = ['All', 'DSA', 'AI/ML'];

export default function Resources() {
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState('All');
  const [category, setCategory] = useState('All');

  const filtered = roadmapData.filter((r) => {
    const matchSearch =
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.tags.some((t) => t.toLowerCase().includes(search.toLowerCase())) ||
      r.aimlTopic.toLowerCase().includes(search.toLowerCase());
    const matchDiff = difficulty === 'All' || r.difficulty === difficulty;
    const matchCat  = category === 'All' || r.category === category;
    return matchSearch && matchDiff && matchCat;
  });

  // Load progress for stats
  let totalXP = 0;
  try {
    const p = JSON.parse(localStorage.getItem('dsa_resource_progress')) || {};
    totalXP = Object.keys(p).length * 10;
  } catch {}

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <BookOpen className="w-7 h-7 text-accent" /> Learning Resources
          </h1>
          <p className="text-gray-400 mt-1">
            Curated resources for every topic — videos, notes, and practice problems.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="card px-4 py-2 flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-bold text-amber-400">{totalXP} XP</span>
          </div>
          <div className="card px-4 py-2 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-accent" />
            <span className="text-sm font-semibold">{filtered.length} Topics</span>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="card p-4 flex flex-wrap gap-3 items-center">
        {/* Search */}
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search topics, tags..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-bg-border border border-bg-border rounded-lg pl-9 pr-4 py-2
                       text-sm text-white placeholder-gray-500 focus:outline-none focus:border-accent/50 transition-colors"
          />
        </div>

        {/* Difficulty filter */}
        <div className="flex gap-1 bg-bg-border rounded-lg p-1">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setDifficulty(f)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                difficulty === f
                  ? 'bg-accent text-white shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Category filter */}
        <div className="flex gap-1 bg-bg-border rounded-lg p-1">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                category === c
                  ? 'bg-accent text-white shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Resources list */}
      {filtered.length === 0 ? (
        <div className="card p-10 text-center text-gray-400">
          No topics match your filters.
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((r, i) => (
            <motion.div
              key={r.day}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <DailyResources day={r.day} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}