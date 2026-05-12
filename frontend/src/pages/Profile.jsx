import { useAuth } from '../store/useAuth';
import { useTasks } from '../store/useTasks';
import { useEffect } from 'react';
import { Flame, Award, Code2, Clock } from 'lucide-react';
import StatCard from '../components/StatCard';

export default function Profile() {
  const { user } = useAuth();
  const { stats, loadAll } = useTasks();
  useEffect(() => { loadAll(); }, []);

  return (
    <div className="space-y-5 max-w-3xl">
      <div className="card p-6 flex items-center gap-4">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-accent to-pink-500 flex items-center justify-center text-3xl font-bold">
          {user?.name?.[0]?.toUpperCase()}
        </div>
        <div>
          <h1 className="text-2xl font-bold">{user?.name}</h1>
          <p className="text-gray-400">{user?.email}</p>
          <p className="text-sm text-gray-500 mt-1">Started: {new Date(user?.startDate).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard icon={Flame} label="Current Streak" value={`${user?.currentStreak || 0}d`} />
        <StatCard icon={Award} label="Longest Streak" value={`${user?.longestStreak || 0}d`} />
        <StatCard icon={Code2} label="Problems Solved" value={user?.totalProblemsSolved || 0} />
        <StatCard icon={Clock} label="Total Hours" value={`${Math.floor((user?.totalStudyMinutes || 0) / 60)}h`} />
      </div>

      <div className="card p-5">
        <h3 className="font-semibold mb-3">Roadmap Progress</h3>
        <p className="text-4xl font-bold">{stats?.progressPercent || 0}%</p>
        <p className="text-gray-400 mt-1">{stats?.completed || 0} of {stats?.total || 60} days completed</p>
      </div>
    </div>
  );
}
