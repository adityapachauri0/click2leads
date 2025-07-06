# Click2lead

A modern lead generation platform with separate frontend and backend architecture.

## Project Structure

```
click2lead/
├── frontend/          # Next.js frontend application
│   ├── app/          # Next.js app directory
│   ├── components/   # React components
│   ├── public/       # Static assets
│   └── ...
├── backend/          # Express.js backend API
│   ├── server.js     # Main server file
│   └── ...
└── package.json      # Root package.json with workspace configuration
```

## Setup

1. **Install dependencies for both frontend and backend:**
   ```bash
   npm run install:all
   ```

2. **Run development servers:**
   ```bash
   npm run dev
   ```
   This will start both frontend (http://localhost:3000) and backend (http://localhost:5000) servers.

## Individual Commands

### Frontend
```bash
cd frontend
npm run dev    # Development server
npm run build  # Production build
npm start      # Production server
```

### Backend
```bash
cd backend
npm run dev    # Development server with nodemon
npm start      # Production server
```

## Environment Variables

### Frontend (.env.local)
- Create `frontend/.env.local` for frontend environment variables

### Backend (.env)
- Create `backend/.env` with:
  - `PORT` - Server port (default: 5000)
  - `MONGODB_URI` - MongoDB connection string
  - `JWT_SECRET` - Secret for JWT tokens

## Git Repository Setup

This project is structured to avoid large file issues:
- Each folder (frontend/backend) has its own `.gitignore`
- `node_modules` are excluded from version control
- Build artifacts are ignored

To push to GitHub:
```bash
git add .
git commit -m "Initial commit with frontend/backend structure"
git remote add origin <your-github-repo-url>
git push -u origin master
```