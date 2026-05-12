import { create } from 'zustand';
import api from '../api/axios';

export const useTasks = create((set, get) => ({
  tasks: [], pending: [], today: [], stats: null, loading: false,

  loadAll: async () => {
    set({ loading: true });
    try {
      const [t, p, today, stats] = await Promise.all([
        api.get('/tasks'),
        api.get('/tasks/pending'),
        api.get('/tasks/today'),
        api.get('/tasks/stats'),
      ]);
      set({ tasks: t.data, pending: p.data, today: today.data, stats: stats.data, loading: false });
    } catch (e) { set({ loading: false }); }
  },

  updateTask: async (day, payload) => {
    const { data } = await api.put(`/tasks/${day}`, payload);
    await get().loadAll();
    return data;
  },
}));
