#!/bin/bash
# Quick update script for Codespaces
# Run this to pull latest changes and restart the server

echo "🔄 Pulling latest changes..."
git pull

echo "📦 Installing any new dependencies..."
uv sync
cd frontend && npm install && cd ..

echo "🚀 Restarting the application..."
echo "Run ./start.sh to start the server"
