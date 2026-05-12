import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../store/useAuth';
import toast from 'react-hot-toast';
import { Brain } from 'lucide-react';

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) return toast.error('Password ≥ 6 chars');
    setLoading(true);
    try {
      await signup(form.name, form.email, form.password);
      toast.success('Roadmap created! 🎉');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Signup failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <form onSubmit={submit} className="card p-8 w-full max-w-md">
        <div className="flex items-center gap-2 mb-6">
          <Brain className="w-8 h-8 text-accent" />
          <h1 className="text-2xl font-bold">Start your 60-day journey</h1>
        </div>
        <input className="input mb-3" placeholder="Full name"
          value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input className="input mb-3" type="email" placeholder="Email"
          value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input className="input mb-4" type="password" placeholder="Password (min 6)"
          value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <button disabled={loading} className="btn btn-primary w-full">
          {loading ? 'Creating...' : 'Create Account'}
        </button>
        <p className="text-sm text-gray-400 mt-4 text-center">
          Have an account? <Link to="/login" className="text-accent">Sign in</Link>
        </p>
      </form>
    </div>
  );
}
