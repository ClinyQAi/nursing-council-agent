# Build stage for frontend
FROM node:20-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# Production stage
FROM python:3.11-slim
WORKDIR /app

# Install Node.js for serving static files (or use Python to serve)
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy backend
COPY backend/ ./backend/
COPY requirements.txt ./

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy built frontend
COPY --from=frontend-build /app/frontend/dist ./frontend/dist

# Create data directory for conversations
RUN mkdir -p data/conversations

# Expose port (7860 is default for Hugging Face Spaces)
EXPOSE 7860

# Environment variables
ENV API_BACKEND=azure
ENV PYTHONUNBUFFERED=1

# Start command - backend serves frontend static files too
CMD ["python", "-m", "uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "7860"]
