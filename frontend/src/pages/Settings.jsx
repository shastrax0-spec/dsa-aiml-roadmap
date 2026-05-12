import { useState } from 'react';
import { useAuth } from '../store/useAuth';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Moon, Sun, Snowflake } from 'lucide-react';

export default function Settings() {
  const { user, fetchMe } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [dark, setDark] = useState(document.documentElement.classList.contains('dark'));

  const save = async () => {
    await api.put('/user/profile', { name });
    await fetchMe();
    toast.success('Profile updated');
  };

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    document.documentElement.classList.toggle('light', !next);
    api.put('/user/profile', { theme: next ? 'dark' : 'light' });
  };

  const freezeStreak = async () => {
    try {
      await api.post('/user/streak-freeze');
      await fetchMe();
      toast.success('Streak frozen for today!');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed');
    }
  };

  return (
    <div className="max-w-2xl space-y-5">
      <h1 className="text-3xl font-bold">Settings</h1>

      <div className="card p-5">
        <h3 className="font-semibold mb-3">Profile</h3>
        <input className="input mb-3" value={name} onChange={(e) => setName(e.target.value)} />
        <button onClick={save} className="btn btn-primary">Save</button>
      </div>

      <div className="card p-5 flex items-center justify-between">
        <div>
          <h3 className="font-semibold">Theme</h3>
          <p className="text-sm text-gray-400">Toggle dark / light mode</p>
        </div>
        <button onClick={toggleTheme} className="btn btn-ghost">
          {dark ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
        </button>
      </div>

      <div className="card p-5 flex items-center justify-between">
        <div>
          <h3 className="font-semibold flex items-center gap-2"><Snowflake className="w-4 h-4" /> Streak Freeze</h3>
          <p className="text-sm text-gray-400">You have {user?.streakFreezes || 0} freezes left</p>
        </div>
        <button onClick={freezeStreak} className="btn btn-primary">Use 1 Freeze</button>
      </div>

      <div className="card p-5">
        <h3 className="font-semibold mb-2">Keyboard Shortcuts</h3>
        <ul className="text-sm text-gray-400 space-y-1">
          <li><kbd className="px-2 py-0.5 bg-bg-border rounded">G</kbd> + <kbd className="px-2 py-0.5 bg-bg-border rounded">D</kbd> – Dashboard</li>
          <li><kbd className="px-2 py-0.5 bg-bg-border rounded">G</kbd> + <kbd className="px-2 py-0.5 bg-bg-border rounded">P</kbd> – Planner</li>
          <li><kbd className="px-2 py-0.5 bg-bg-border rounded">G</kbd> + <kbd className="px-2 py-0.5 bg-bg-border rounded">A</kbd> – Analytics</li>
          <li><kbd className="px-2 py-0.5 bg-bg-border rounded">G</kbd> + <kbd className="px-2 py-0.5 bg-bg-border rounded">R</kbd> – Resources</li>
        </ul>
      </div>
    </div>
  );
}
