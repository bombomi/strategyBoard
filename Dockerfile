# Build Frontend
FROM node:20-alpine as frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Build Backend
FROM gradle:8.5-jdk17 as backend-build
WORKDIR /app/backend
COPY backend/ ./
RUN gradle build --no-daemon

# Final Stage
FROM openjdk:17-slim
WORKDIR /app

# Copy backend
COPY --from=backend-build /app/backend/build/libs/*.jar ./backend.jar

# Copy frontend build
COPY --from=frontend-build /app/frontend/dist ./frontend/dist

# Install nginx
RUN apt-get update && \
    apt-get install -y nginx && \
    rm -rf /var/lib/apt/lists/*

# Configure nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Expose ports
EXPOSE 3000 8080

# Start script
COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

CMD ["/app/start.sh"] 