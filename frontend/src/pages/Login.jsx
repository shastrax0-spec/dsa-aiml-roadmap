import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../store/useAuth';
import toast from 'react-hot-toast';
import { Brain } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return toast.error('Fill all fields');
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <form onSubmit={submit} className="card p-8 w-full max-w-md">
        <div className="flex items-center gap-2 mb-6">
          <Brain className="w-8 h-8 text-accent" />
          <h1 className="text-2xl font-bold">Welcome back</h1>
        </div>
        <input className="input mb-3" type="email" placeholder="Email"
          value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input className="input mb-4" type="password" placeholder="Password"
          value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <button disabled={loading} className="btn btn-primary w-full">
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
        <p className="text-sm text-gray-400 mt-4 text-center">
          New here? <Link to="/signup" className="text-accent">Create an account</Link>
        </p>
      </form>
    </div>
  );
}
