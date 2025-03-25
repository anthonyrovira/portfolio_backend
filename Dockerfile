# Build stage
FROM node:20-alpine AS builder

# Copy package files
COPY . /app/backend

WORKDIR /app/backend

# Install dependencies
RUN npm install

# Build TypeScript
RUN npm run build

# Production stage
FROM node:20-alpine AS production

WORKDIR /app/backend

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm install --omit=dev

# Copy built files from builder
COPY --from=builder /app/backend/dist ./dist

# Start the application
CMD ["npm", "start"]
