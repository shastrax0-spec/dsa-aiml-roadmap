import { motion } from 'framer-motion';
export default function StatCard({ icon: Icon, label, value, sub }) {
  return (
    <motion.div whileHover={{ y: -3 }} className="card p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-400">{label}</p>
          <p className="text-3xl font-bold mt-1">{value}</p>
          {sub && <p className="text-xs text-gray-500 mt-1">{sub}</p>}
        </div>
        <div className="p-3 rounded-xl bg-accent/15 text-accent">
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </motion.div>
  );
}
