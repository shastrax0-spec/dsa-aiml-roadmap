import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Calendar, Code2, BarChart3,
  BookOpen, Settings, User, LogOut, Flame, Brain
} from 'lucide-react';
import { useAuth } from '../store/useAuth';

const nav = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/planner', label: 'Daily Planner', icon: Calendar },
  { to: '/problems', label: 'Problems', icon: Code2 },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/resources', label: 'Resources', icon: BookOpen },
  { to: '/profile', label: 'Profile', icon: User },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 hidden md:flex flex-col p-5 border-r border-bg-border bg-bg-card/40 backdrop-blur">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-accent-glow flex items-center justify-center">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="font-bold">DSA + AI/ML</div>
            <div className="text-xs text-gray-400">Roadmap Tracker</div>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          {nav.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl transition ${
                  isActive ? 'bg-accent/15 text-accent border border-accent/30' : 'hover:bg-bg-card text-gray-300'
                }`}>
              <Icon className="w-5 h-5" /> {label}
            </NavLink>
          ))}
        </nav>

        <div className="card p-3 mb-3 flex items-center gap-2">
          <Flame className="text-orange-400 w-5 h-5" />
          <div className="text-sm">
            <div className="font-semibold">{user?.currentStreak || 0} day streak</div>
            <div className="text-xs text-gray-400">Keep it going!</div>
          </div>
        </div>

        <button onClick={() => { logout(); navigate('/login'); }}
          className="btn btn-ghost flex items-center gap-2 justify-center">
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </aside>

      <div className="md:hidden fixed top-0 inset-x-0 z-20 bg-bg-card/90 backdrop-blur border-b border-bg-border p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain className="w-6 h-6 text-accent" />
          <span className="font-bold">Tracker</span>
        </div>
        <button onClick={() => { logout(); navigate('/login'); }}>
          <LogOut className="w-5 h-5" />
        </button>
      </div>

      <main className="flex-1 p-5 md:p-8 pt-20 md:pt-8 overflow-x-hidden pb-24 md:pb-8">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <Outlet />
        </motion.div>

        <div className="md:hidden fixed bottom-0 inset-x-0 bg-bg-card border-t border-bg-border flex justify-around py-2 z-20">
          {nav.slice(0, 5).map(({ to, icon: Icon }) => (
            <NavLink key={to} to={to} className={({ isActive }) =>
              `p-2 ${isActive ? 'text-accent' : 'text-gray-400'}`}>
              <Icon className="w-5 h-5" />
            </NavLink>
          ))}
        </div>
      </main>
    </div>
  );
}
