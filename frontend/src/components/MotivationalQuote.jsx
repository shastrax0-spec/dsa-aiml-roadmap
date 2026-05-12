import { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';

const QUOTES = [
  'The expert in anything was once a beginner.',
  'Consistency beats intensity. Show up daily.',
  "Don't watch the clock; do what it does. Keep going.",
  'Code is like humor. When you have to explain it, it is bad.',
  'First, solve the problem. Then, write the code.',
  'Every algorithm you learn rewires your brain.',
  'AI is the new electricity. – Andrew Ng',
  "You don't have to be great to start, but you have to start to be great.",
];

export default function MotivationalQuote() {
  const [q, setQ] = useState('');
  useEffect(() => {
    const idx = new Date().getDate() % QUOTES.length;
    setQ(QUOTES[idx]);
  }, []);
  return (
    <div className="card p-5 bg-gradient-to-br from-accent/10 to-transparent border-accent/30">
      <div className="flex gap-3">
        <Sparkles className="w-5 h-5 text-accent shrink-0 mt-0.5" />
        <p className="text-sm italic">"{q}"</p>
      </div>
    </div>
  );
}
