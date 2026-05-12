# 🚀 DSA + AI/ML Roadmap Tracker

Full-stack productivity app for tracking a 60-day DSA + AI/ML learning roadmap.

## ✨ Features
- 60-day curated DSA + AI/ML roadmap auto-provisioned on signup
- **Missed tasks NEVER disappear** – complete them anytime
- Spaced repetition (3/7/15-day revisions auto-scheduled)
- Streaks, freezes, heatmap, weekly graphs
- Pomodoro timer + study session tracking
- JWT auth, dark/light mode, PDF export, keyboard shortcuts (G+D / G+P / G+A / G+R)
- Mobile-first responsive UI

## 🛠 Setup

### Backend
```bash
cd backend
cp .env.example .env   # fill MONGO_URI + JWT_SECRET
npm install
npm run seed           # preload default resources
npm run dev
```

### Frontend
```bash
cd frontend
cp .env.example .env   # set VITE_API_URL=http://localhost:5000/api
npm install
npm run dev
```

Open http://localhost:5173

## 🚀 Deployment

### Backend → Render
1. New Web Service · Build: `npm install` · Start: `npm start`
2. Add env vars from `.env.example`

### Frontend → Vercel
1. Import repo · Framework: Vite
2. Env: `VITE_API_URL=<render-url>/api`

## 🔑 Key Logic
Missed-day handling lives in `backend/src/controllers/task.controller.js` → `decorateStatus()`.
Tasks are NEVER deleted – they just get a virtual `overdue` status while remaining fully editable.

## 📜 License
MIT
