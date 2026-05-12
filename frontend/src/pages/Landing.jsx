import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain, Rocket, Target, TrendingUp } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex justify-between p-6 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <Brain className="w-7 h-7 text-accent" />
          <span className="font-bold text-lg">DSA + AI/ML Tracker</span>
        </div>
        <div className="flex gap-3">
          <Link to="/login" className="btn btn-ghost">Login</Link>
          <Link to="/signup" className="btn btn-primary">Get Started</Link>
        </div>
      </header>

      <section className="flex-1 max-w-4xl mx-auto px-6 text-center py-16">
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-7xl font-bold leading-tight">
          Master <span className="bg-gradient-to-r from-accent to-pink-400 bg-clip-text text-transparent">DSA + AI/ML</span><br />
          in 60 days.
        </motion.h1>
        <p className="text-gray-400 text-lg mt-6 max-w-xl mx-auto">
          A guided 2-month roadmap with daily tasks, spaced repetition, streaks, and beautiful analytics.
          Missed a day? No problem – tasks never disappear.
        </p>
        <div className="flex gap-3 justify-center mt-8">
          <Link to="/signup" className="btn btn-primary text-lg px-6 py-3">Start Free</Link>
          <Link to="/login" className="btn btn-ghost text-lg px-6 py-3">Sign In</Link>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mt-20">
          {[
            { icon: Target, t: 'Daily Roadmap', d: '60-day curated plan covering DSA + ML fundamentals' },
            { icon: Rocket, t: 'Never Lose Progress', d: 'Missed tasks stay accessible. Finish whenever.' },
            { icon: TrendingUp, t: 'Smart Analytics', d: 'Streaks, heatmaps, charts and spaced repetition' },
          ].map((f, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }} className="card p-6 text-left">
              <f.icon className="w-8 h-8 text-accent mb-3" />
              <h3 className="font-semibold mb-1">{f.t}</h3>
              <p className="text-sm text-gray-400">{f.d}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
