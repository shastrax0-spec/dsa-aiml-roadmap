// frontend/src/components/DailyResources.jsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown, Play, BookOpen, Code2, Zap, Clock,
  ExternalLink, Star, Trophy, CheckCircle2, Circle,
  Flame, Youtube, FileText, Target, Brain
} from 'lucide-react';
import { getResourcesByDay, difficultyConfig, platformConfig } from '../data/roadmapData';

// ─── LocalStorage helpers ───────────────────────────────────────────────────
const STORAGE_KEY = 'dsa_resource_progress';

function loadProgress() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
  catch { return {}; }
}
function saveProgress(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// ─── Sub-components ─────────────────────────────────────────────────────────

function VideoCard({ video, dayKey }) {
  const progressKey = `${dayKey}_video_${video.url}`;
  const [watched, setWatched] = useState(() => !!loadProgress()[progressKey]);

  const toggle = (e) => {
    e.preventDefault();
    const next = !watched;
    setWatched(next);
    const p = loadProgress();
    if (next) p[progressKey] = true; else delete p[progressKey];
    saveProgress(p);
  };

  return (
    <motion.div
      whileHover={{ y: -3, boxShadow: '0 8px 32px rgba(124,92,255,0.18)' }}
      className={`relative rounded-xl overflow-hidden border transition-all duration-300 ${
        watched ? 'border-accent/60 bg-accent/5' : 'border-white/8 bg-white/3'
      }`}
      style={{ backdropFilter: 'blur(12px)' }}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          onError={(e) => { e.target.style.display = 'none'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        {/* Duration badge */}
        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-0.5 rounded-md font-mono">
          {video.duration}
        </div>
        {watched && (
          <div className="absolute top-2 right-2 bg-accent rounded-full p-0.5">
            <CheckCircle2 className="w-4 h-4 text-white" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <div className="flex items-center gap-2 mb-2">
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
            style={{ backgroundColor: video.color }}
          >
            {video.initials[0]}
          </div>
          <span className="text-xs font-semibold" style={{ color: video.color }}>
            {video.creator}
          </span>
        </div>
        <p className="text-sm font-medium text-white/90 leading-snug mb-3 line-clamp-2">
          {video.title}
        </p>
        <div className="flex gap-2">
          <a
            href={video.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-accent text-white text-xs font-semibold
                       hover:bg-accent/80 transition-colors"
          >
            <Play className="w-3 h-3 fill-white" /> Watch Now
          </a>
          <button
            onClick={toggle}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              watched
                ? 'border-accent/60 text-accent bg-accent/10'
                : 'border-white/15 text-gray-400 hover:border-accent/40 hover:text-accent'
            }`}
          >
            {watched ? '✓ Done' : 'Mark'}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function PracticeCard({ problem, dayKey }) {
  const progressKey = `${dayKey}_prob_${problem.url}`;
  const [solved, setSolved] = useState(() => !!loadProgress()[progressKey]);

  const diffColor = {
    Easy:   'text-emerald-400 bg-emerald-400/10 border-emerald-400/30',
    Medium: 'text-amber-400 bg-amber-400/10 border-amber-400/30',
    Hard:   'text-rose-400 bg-rose-400/10 border-rose-400/30',
  };

  const toggle = () => {
    const next = !solved;
    setSolved(next);
    const p = loadProgress();
    if (next) p[progressKey] = true; else delete p[progressKey];
    saveProgress(p);
  };

  const pConf = platformConfig[problem.platform] || { color: '#7c5cff', bg: 'bg-accent/10' };

  return (
    <motion.div
      whileHover={{ x: 3 }}
      className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-300 ${
        solved ? 'border-emerald-500/40 bg-emerald-500/5' : 'border-white/8 bg-white/3 hover:border-white/15'
      }`}
    >
      <button onClick={toggle} className="shrink-0">
        {solved
          ? <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          : <Circle className="w-5 h-5 text-gray-500 hover:text-accent transition-colors" />}
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-xs font-bold" style={{ color: pConf.color }}>{problem.platform}</span>
          <span className={`text-xs px-1.5 py-0.5 rounded border font-medium ${diffColor[problem.difficulty]}`}>
            {problem.difficulty}
          </span>
        </div>
        <p className={`text-sm font-medium truncate ${solved ? 'line-through text-gray-500' : 'text-white/90'}`}>
          {problem.title}
        </p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <div className="flex items-center gap-1 text-xs text-amber-400 font-semibold">
          <Zap className="w-3 h-3" /> +{problem.xp}
        </div>
        <a
          href={problem.url}
          target="_blank"
          rel="noopener noreferrer"
          className="p-1.5 rounded-lg bg-accent/15 text-accent hover:bg-accent/30 transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </motion.div>
  );
}

function NotesCard({ note }) {
  const typeIcon = { PDF: '📄', Article: '📝', Tool: '🛠️', Course: '🎓' };
  return (
    <motion.a
      href={note.url}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.02 }}
      className="flex items-center gap-3 p-3 rounded-xl border border-white/8 bg-white/3
                 hover:border-accent/40 hover:bg-accent/5 transition-all group"
    >
      <span className="text-xl">{typeIcon[note.type] || '📎'}</span>
      <div className="flex-1">
        <p className="text-sm font-medium text-white/90 group-hover:text-accent transition-colors">{note.title}</p>
        <p className="text-xs text-gray-500">{note.type}</p>
      </div>
      <ExternalLink className="w-4 h-4 text-gray-600 group-hover:text-accent transition-colors" />
    </motion.a>
  );
}

function RevisionChip({ point }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium
                 bg-accent/10 border border-accent/25 text-accent/90 hover:bg-accent/20 cursor-default transition-all"
    >
      <Flame className="w-3 h-3" /> {point}
    </motion.div>
  );
}

// ─── Section accordion ───────────────────────────────────────────────────────
function Section({ icon: Icon, label, count, color, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-white/6 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/3 transition-colors"
      >
        <div className={`p-1.5 rounded-lg`} style={{ backgroundColor: `${color}15` }}>
          <Icon className="w-4 h-4" style={{ color }} />
        </div>
        <span className="font-semibold text-sm text-white/90">{label}</span>
        <span className="ml-auto text-xs text-gray-500 mr-2">{count} items</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }}>
          <ChevronDown className="w-4 h-4 text-gray-500" />
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-1">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────
export default function DailyResources({ day, embedded = false }) {
  const [expanded, setExpanded] = useState(false);
  const resource = getResourcesByDay(day);

  if (!resource) return null;

  const diff = difficultyConfig[resource.difficulty] || difficultyConfig.Beginner;
  const dayKey = `day_${day}`;

  // Compute completion stats
  const progress = loadProgress();
  const totalProblems = resource.practice.length;
  const solvedProblems = resource.practice.filter(
    (p) => !!progress[`${dayKey}_prob_${p.url}`]
  ).length;
  const totalVideos = resource.youtube.length;
  const watchedVideos = resource.youtube.filter(
    (v) => !!progress[`${dayKey}_video_${v.url}`]
  ).length;

  const completionPct = Math.round(
    ((solvedProblems + watchedVideos) / (totalProblems + totalVideos)) * 100
  );

  return (
    <motion.div
      layout
      className={`rounded-2xl border transition-all duration-300 ${
        expanded
          ? 'border-accent/40 shadow-[0_0_40px_rgba(124,92,255,0.12)]'
          : 'border-white/8'
      }`}
      style={{
        background: 'linear-gradient(135deg, rgba(124,92,255,0.06) 0%, rgba(19,19,26,0.95) 100%)',
        backdropFilter: 'blur(16px)',
      }}
    >
      {/* ── Header ── */}
      <div className="p-4">
        {/* Top row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="text-xs px-2 py-0.5 rounded-md bg-bg-border text-gray-400 font-mono">
                Day {resource.day}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded-full border font-semibold ${diff.color} ${diff.bg} ${diff.border}`}>
                {resource.difficulty}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/25 text-amber-400 font-semibold flex items-center gap-1">
                <Zap className="w-3 h-3" /> {resource.xp} XP
              </span>
            </div>
            <h3 className="font-bold text-white leading-snug">{resource.title}</h3>
            <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
              <Brain className="w-3 h-3" /> ML: {resource.aimlTopic}
            </p>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <Clock className="w-3.5 h-3.5 text-gray-500" />
            <span className="text-xs text-gray-400 font-medium">{resource.duration}</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-3">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>{solvedProblems}/{totalProblems} problems · {watchedVideos}/{totalVideos} videos</span>
            <span className="text-accent font-semibold">{completionPct}%</span>
          </div>
          <div className="h-1.5 bg-bg-border rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-accent to-purple-400"
              initial={{ width: 0 }}
              animate={{ width: `${completionPct}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Creator badges */}
        <div className="flex items-center gap-2 flex-wrap mb-3">
          {resource.youtube.map((v) => (
            <div
              key={v.creator}
              className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold border"
              style={{
                color: v.color,
                borderColor: `${v.color}40`,
                backgroundColor: `${v.color}10`,
              }}
            >
              <span
                className="w-4 h-4 rounded-full flex items-center justify-center text-white text-[9px] font-bold"
                style={{ backgroundColor: v.color }}
              >
                {v.initials[0]}
              </span>
              {v.creator}
            </div>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => { setExpanded(!expanded); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              expanded
                ? 'bg-accent text-white'
                : 'bg-accent/15 text-accent border border-accent/30 hover:bg-accent/25'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            {expanded ? 'Close Resources' : 'View Resources'}
            <motion.span animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.25 }}>
              <ChevronDown className="w-3.5 h-3.5" />
            </motion.span>
          </button>
          <a
            href={resource.youtube[0]?.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/15 text-red-400
                       border border-red-500/30 text-xs font-semibold hover:bg-red-500/25 transition-colors"
          >
            <Youtube className="w-3.5 h-3.5" /> Watch
          </a>
          <a
            href={resource.practice[0]?.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/15 text-emerald-400
                       border border-emerald-500/30 text-xs font-semibold hover:bg-emerald-500/25 transition-colors"
          >
            <Code2 className="w-3.5 h-3.5" /> Practice
          </a>
          {resource.notes[0] && (
            <a
              href={resource.notes[0].url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/15 text-blue-400
                         border border-blue-500/30 text-xs font-semibold hover:bg-blue-500/25 transition-colors"
            >
              <FileText className="w-3.5 h-3.5" /> Notes
            </a>
          )}
        </div>
      </div>

      {/* ── Expanded Accordion ── */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="border-t border-white/6 p-4 space-y-3">

              {/* Videos */}
              <Section icon={Youtube} label="🎥 Video Lectures" count={resource.youtube.length} color="#ef4444" defaultOpen>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-2">
                  {resource.youtube.map((v) => (
                    <VideoCard key={v.url} video={v} dayKey={dayKey} />
                  ))}
                </div>
              </Section>

              {/* Practice */}
              <Section icon={Code2} label="💻 Practice Problems" count={resource.practice.length} color="#22c55e">
                <div className="space-y-2 mt-2">
                  {resource.practice.map((p) => (
                    <PracticeCard key={p.url} problem={p} dayKey={dayKey} />
                  ))}
                </div>
              </Section>

              {/* Notes */}
              <Section icon={BookOpen} label="📝 Notes & Resources" count={resource.notes.length} color="#3b82f6">
                <div className="space-y-2 mt-2">
                  {resource.notes.map((n) => (
                    <NotesCard key={n.url} note={n} />
                  ))}
                </div>
              </Section>

              {/* Revision */}
              <Section icon={Flame} label="🔥 Revision Topics" count={resource.revision.length} color="#f59e0b">
                <div className="flex flex-wrap gap-2 mt-2">
                  {resource.revision.map((r) => (
                    <RevisionChip key={r} point={r} />
                  ))}
                </div>
              </Section>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}