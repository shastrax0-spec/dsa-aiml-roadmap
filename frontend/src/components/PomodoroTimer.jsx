import { useEffect, useState } from 'react';
import { Play, Pause, RotateCcw, Timer } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function PomodoroTimer() {
  const [seconds, setSeconds] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState('focus');

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setSeconds((s) => {
      if (s <= 1) {
        clearInterval(id);
        if (phase === 'focus') {
          api.post('/sessions', { minutes: 25, type: 'pomodoro' }).catch(() => {});
          toast.success('🎉 Focus session complete!');
          setPhase('break'); return 5 * 60;
        } else {
          toast('Break over – back to work!');
          setPhase('focus'); return 25 * 60;
        }
      }
      return s - 1;
    }), 1000);
    return () => clearInterval(id);
  }, [running, phase]);

  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold flex items-center gap-2"><Timer className="w-4 h-4" /> Pomodoro</h3>
        <span className="text-xs px-2 py-0.5 rounded-full bg-accent/15 text-accent capitalize">{phase}</span>
      </div>
      <div className="text-5xl font-bold text-center my-4 font-mono">{m}:{s}</div>
      <div className="flex gap-2 justify-center">
        <button onClick={() => setRunning(!running)} className="btn btn-primary flex items-center gap-2">
          {running ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          {running ? 'Pause' : 'Start'}
        </button>
        <button onClick={() => { setRunning(false); setSeconds(25*60); setPhase('focus'); }}
          className="btn btn-ghost"><RotateCcw className="w-4 h-4" /></button>
      </div>
    </div>
  );
}
