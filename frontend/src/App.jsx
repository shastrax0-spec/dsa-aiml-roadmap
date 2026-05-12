import { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useAuth } from './store/useAuth';

import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import DailyPlanner from './pages/DailyPlanner';
import ProblemTracker from './pages/ProblemTracker';
import Analytics from './pages/Analytics';
import Resources from './pages/Resources';
import Profile from './pages/Profile';
import Settings from './pages/Settings';

export default function App() {
  const { fetchMe } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { fetchMe(); }, []);

  useEffect(() => {
    let last = '';
    const handler = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;
      const k = e.key.toLowerCase();
      if (last === 'g') {
        if (k === 'd') navigate('/dashboard');
        if (k === 'p') navigate('/planner');
        if (k === 'a') navigate('/analytics');
        if (k === 'r') navigate('/resources');
        last = '';
      } else {
        last = k;
        setTimeout(() => (last = ''), 800);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/planner" element={<DailyPlanner />} />
        <Route path="/planner/:day" element={<DailyPlanner />} />
        <Route path="/problems" element={<ProblemTracker />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}
