# ==========================================
# 1. Build Stage: Compile React 19 Frontend
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy root package files
COPY package*.json ./
RUN npm ci || npm install

# Copy source code and build frontend
COPY . .
RUN npm run build

# ==========================================
# 2. Production Stage: Lightweight Node.js Server
# ==========================================
FROM node:20-alpine AS runner

WORKDIR /app

# Set production environment
ENV NODE_ENV=production
ENV PORT=5000

# Install backend production dependencies
COPY backend/package*.json ./backend/
RUN cd backend && (npm ci --omit=dev || npm install --omit=dev)

# Copy backend application code
COPY backend ./backend

# Copy compiled frontend dist from builder stage
COPY --from=builder /app/dist ./dist

EXPOSE 5000

# Start unified server
CMD ["node", "backend/server.js"]
