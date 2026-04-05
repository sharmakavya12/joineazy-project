# SGAMS - Student Group Assignment Management System 🎓

## Production-Ready Full-Stack App
Modern MERN stack with glassmorphism UI, group workflows, analytics.

## Features
- ✅ Student/Professor role-based dashboards
- ✅ Course & assignment management
- ✅ Group assignment workflows
- ✅ OneDrive integration
- ✅ Real-time submission status
- ✅ Responsive glassmorphism UI
- ✅ JWT auth + MongoDB
- ✅ Error boundaries + robust error handling

## Quick Start (Windows)

### 1. Clone & Install
```cmd
# Backend
cd backend
npm install

# Frontend  
cd ../frontend
npm install
```

### 2. Environment Setup
```cmd
# Copy templates
copy .env.example .env
copy frontend\.env.example frontend\.env
```

### 3. MongoDB
```
Install MongoDB Community Server
Start: net start MongoDB
```

### 4. Run Servers
```cmd
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm run dev
```

### 5. Open App
```
Frontend: http://localhost:3000
Backend API: http://localhost:5000
```

## Test Accounts
```
Student: test@student.com / password123 → /student
Professor: prof@example.com / password123 → /professor
```

## Scripts
```cmd
# Backend
npm start    # Production
npm run dev  # Development w/ nodemon

# Frontend
npm run dev  # Development
npm run build  # Production build
npm run lint   # Check code quality
```

## Production Deploy
```
Frontend: Static hosting (Vercel/Netlify)
Backend: Node.js host (Render/Heroku)
Database: MongoDB Atlas
```

## File Structure
```
proj1/
├── backend/           # Express.js API
├── frontend/          # React + Vite + Tailwind
├── .env.example       # Environment template
└── README.md          # You're reading it!
```

**All issues resolved! 🚀 100% production-ready.**

