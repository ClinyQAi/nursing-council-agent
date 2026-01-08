#!/bin/bash

# Nursing Council Agent - Start script for Codespaces

echo "🩺 Starting Nursing Council Agent..."
echo ""

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "⚠️  No .env file found. Creating from .env.example..."
    cp .env.example .env
    echo "   Please edit .env with your Azure credentials!"
fi

# Install backend dependencies if needed
if [ ! -d "backend/__pycache__" ]; then
    echo "📦 Installing backend dependencies..."
    pip install -r requirements.txt
fi

# Install frontend dependencies if needed
if [ ! -d "frontend/node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    cd frontend && npm install && cd ..
fi

# Start backend
echo "🚀 Starting backend on port 8001..."
cd backend
python -m uvicorn main:app --host 0.0.0.0 --port 8001 --reload &
BACKEND_PID=$!
cd ..

# Wait a bit for backend to start
sleep 3

# Start frontend
echo "🚀 Starting frontend on port 5173..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "✅ Nursing Council Agent is running!"
echo "   Backend:  http://localhost:8001"
echo "   Frontend: http://localhost:5173"
echo ""
echo "📌 In Codespaces, make sure port 8001 is set to PUBLIC visibility!"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for Ctrl+C
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" SIGINT SIGTERM
wait
