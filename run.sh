#!/bin/bash

echo "🚀 Strategy Board 애플리케이션을 시작합니다..."

# 도커 이미지 빌드
echo "📦 도커 이미지를 빌드하고 있습니다..."
docker build -t strategy-board .

# 실행 중인 컨테이너가 있다면 중지
docker stop strategy-board-container 2>/dev/null || true
docker rm strategy-board-container 2>/dev/null || true

# 도커 컨테이너 실행
echo "🏃 도커 컨테이너를 시작합니다..."
docker run -d --name strategy-board-container -p 3000:3000 -p 8080:8080 strategy-board

echo "✅ 애플리케이션이 시작되었습니다!"
echo "🌐 프론트엔드: http://localhost:3000"
echo "🔗 API: http://localhost:8080/api/board"
echo ""
echo "📝 로그 확인: docker logs -f strategy-board-container"
echo "🛑 중지: docker stop strategy-board-container" 