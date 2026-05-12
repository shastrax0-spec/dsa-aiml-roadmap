import { useEffect, useState } from 'react';
import api from '../api/axios';
import {
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip,
  PieChart, Pie, Cell, Legend, LineChart, Line, CartesianGrid
} from 'recharts';
import { Download } from 'lucide-react';
import jsPDF from 'jspdf';
import toast from 'react-hot-toast';

const COLORS = ['#22c55e', '#f59e0b', '#ef4444'];

export default function Analytics() {
  const [data, setData] = useState(null);

  useEffect(() => { api.get('/analytics').then(({ data }) => setData(data)); }, []);
  if (!data) return <div>Loading analytics...</div>;

  const exportPDF = () => {
    const pdf = new jsPDF();
    pdf.setFontSize(20); pdf.text('DSA + AI/ML Progress Report', 15, 20);
    pdf.setFontSize(12);
    pdf.text(`Total Problems: ${data.totalProblems}`, 15, 35);
    pdf.text('Topic Completion:', 15, 50);
    data.topics.forEach((t, i) => pdf.text(`- ${t.topic}: ${t.percent}%`, 20, 60 + i * 7));
    pdf.save('progress-report.pdf');
    toast.success('PDF exported!');
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-3xl font-bold">Analytics</h1>
        <button onClick={exportPDF} className="btn btn-primary flex items-center gap-2">
          <Download className="w-4 h-4" /> Export PDF
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card title="Weekly Study Hours">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={data.week}>
              <CartesianGrid strokeDasharray="3 3" stroke="#22222e" />
              <XAxis dataKey="date" stroke="#666" fontSize={11} />
              <YAxis stroke="#666" fontSize={11} />
              <Tooltip contentStyle={{ background: '#13131a', border: '1px solid #22222e' }} />
              <Line type="monotone" dataKey="hours" stroke="#7c5cff" strokeWidth={3} dot={{ fill: '#7c5cff' }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Problems by Difficulty">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={data.byDifficulty} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {data.byDifficulty.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: '#13131a', border: '1px solid #22222e' }} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card title="Topic Completion %">
        <ResponsiveContainer width="100%" height={Math.max(300, data.topics.length * 25)}>
          <BarChart data={data.topics} layout="vertical">
            <XAxis type="number" stroke="#666" />
            <YAxis dataKey="topic" type="category" stroke="#666" fontSize={11} width={120} />
            <Tooltip contentStyle={{ background: '#13131a', border: '1px solid #22222e' }} />
            <Bar dataKey="percent" fill="#7c5cff" radius={[0, 6, 6, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card title="90-day Activity Heatmap">
        <div className="grid grid-cols-[repeat(15,1fr)] sm:grid-cols-[repeat(30,1fr)] gap-1">
          {data.heatmap.map((d, i) => (
            <div key={i} title={`${d.date}: ${d.count} sessions`}
              className={`aspect-square rounded ${
                d.count === 0 ? 'bg-bg-border' :
                d.count === 1 ? 'bg-accent/30' :
                d.count === 2 ? 'bg-accent/60' : 'bg-accent'
              }`} />
          ))}
        </div>
      </Card>
    </div>
  );
}

const Card = ({ title, children }) => (
  <div className="card p-5">
    <h3 className="font-semibold mb-3">{title}</h3>
    {children}
  </div>
);
