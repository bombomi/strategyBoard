#!/bin/bash

# Strategy Board 컨테이너 내부 실행 스크립트 (LF, UTF-8, 실행권한 보장)

set -e

echo "🚀 Strategy Board 애플리케이션을 시작합니다..."

# Start Spring Boot application in background
echo "📦 Spring Boot 애플리케이션을 시작합니다..."
java -jar /app/backend.jar &

# Wait for Spring Boot to be ready
echo "⏳ Spring Boot 시작을 기다립니다..."
sleep 10

# Start nginx in background
echo "🌐 Nginx를 시작합니다..."
nginx &

echo "✅ 모든 서비스가 시작되었습니다!"
echo "🌐 프론트엔드: http://localhost:3000"
echo "🔗 API: http://localhost:8080/api/board"

# Keep the container running by following the Spring Boot logs
tail -f /dev/null 