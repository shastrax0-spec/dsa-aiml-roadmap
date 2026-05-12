import { create } from 'zustand';
import api from '../api/axios';

export const useAuth = create((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  loading: true,

  login: async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    set({ user: data.user, token: data.token });
  },
  signup: async (name, email, password) => {
    const { data } = await api.post('/auth/signup', { name, email, password });
    localStorage.setItem('token', data.token);
    set({ user: data.user, token: data.token });
  },
  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null });
  },
  fetchMe: async () => {
  const token = localStorage.getItem('token');
  if (!token) return set({ loading: false, user: null, token: null });
  try {
    const { data } = await api.get('/auth/me');
    set({ user: data.user, token, loading: false });
  } catch {
    // Only logout if token is truly invalid (401)
    localStorage.removeItem('token');
    set({ user: null, token: null, loading: false });
  }
},
}));
