import { motion } from 'framer-motion';
import { CheckCircle2, Circle, AlertTriangle, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function TaskCard({ task }) {
  const statusColor = {
    completed: 'text-success border-success/30 bg-success/5',
    overdue: 'text-danger border-danger/30 bg-danger/5',
    pending: 'text-warn border-warn/30 bg-warn/5',
    'in-progress': 'text-accent border-accent/30 bg-accent/5',
  };

  return (
    <motion.div whileHover={{ scale: 1.01 }}
      className={`card p-4 border-l-4 ${statusColor[task.status] || ''}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs px-2 py-0.5 rounded-full bg-bg-border">Day {task.day}</span>
            {task.status === 'overdue' && (
              <span className="text-xs flex items-center gap-1 text-danger">
                <AlertTriangle className="w-3 h-3" /> Overdue – complete anytime
              </span>
            )}
          </div>
          <h3 className="font-semibold">{task.dsaTopic}</h3>
          <p className="text-sm text-gray-400 mt-0.5">🤖 {task.aimlTopic}</p>
          <div className="flex items-center gap-3 text-xs text-gray-500 mt-2">
            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />
              {new Date(task.scheduledDate).toLocaleDateString()}</span>
            {task.timeSpentMinutes > 0 && <span>⏱ {task.timeSpentMinutes} min</span>}
          </div>
        </div>
        <Link to={`/planner/${task.day}`}>
          {task.status === 'completed'
            ? <CheckCircle2 className="w-6 h-6 text-success" />
            : <Circle className="w-6 h-6 text-gray-500 hover:text-accent" />}
        </Link>
      </div>
    </motion.div>
  );
}
