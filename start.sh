#!/bin/bash

echo "🚀 Starting Click2Leads Application..."
echo "================================="

# Start backend server
echo "📦 Starting backend server on port 5000..."
cd backend
node server.js &
BACKEND_PID=$!
echo "✅ Backend server started (PID: $BACKEND_PID)"

# Wait a bit for backend to start
sleep 2

# Start frontend server
echo "🎨 Starting frontend server on port 3000..."
cd ../frontend
npm start &
FRONTEND_PID=$!
echo "✅ Frontend server started (PID: $FRONTEND_PID)"

echo "================================="
echo "🎉 Application is running!"
echo "📍 Frontend: http://localhost:3000"
echo "📍 Backend: http://localhost:5000"
echo "📍 Health Check: http://localhost:5000/health"
echo ""
echo "Press Ctrl+C to stop all servers"

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID