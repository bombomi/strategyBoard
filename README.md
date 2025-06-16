# Strategy Board

**✅ 누구나 아래 명령만으로 바로 실행! (자동화/표준화 보장)**

```bash
# 1. 저장소 클론
 git clone https://github.com/bombomi/strategy-board.git
 cd strategy-board

# 2. 도커 빌드 및 실행
 docker build -t strategy-board .
 docker run -d --name strategy-board-container -p 3000:3000 -p 8080:8080 strategy-board
```

- 모든 빌드/실행/포트/정적파일/프록시/DB 초기화가 자동화되어 있습니다.
- `start.sh`, `run.sh`, `nginx.conf`, `Dockerfile` 등 표준화된 설정으로 누구나 동일하게 실행됩니다.
- 자세한 설명은 아래를 참고하세요.

전략 게시판 프로젝트입니다. Spring Boot 백엔드와 TypeScript + React 프론트엔드로 구성된 풀스택 애플리케이션입니다.

## 🚀 빠른 실행 (Docker)

### 전체 애플리케이션 실행
```bash
# 실행 스크립트 권한 부여 (최초 한번만)
chmod +x run.sh

# 애플리케이션 실행
./run.sh
```

### 수동 Docker 실행
```bash
# 도커 이미지 빌드
docker build -t strategy-board .

# 도커 컨테이너 실행
docker run -d --name strategy-board-container -p 3000:3000 -p 8080:8080 strategy-board
```

## 🌐 접속 주소

- **프론트엔드**: http://localhost:3000
- **백엔드 API**: http://localhost:8080/api/board

## 📋 주요 기능

- **페이징 vs 무한스크롤**: 두 가지 데이터 로딩 전략을 실시간으로 전환
- **50,000개 테스트 데이터**: 대용량 데이터 처리 성능 테스트
- **전략 패턴**: 확장 가능한 아키텍처 구현
- **커서 기반 페이지네이션**: 효율적인 무한스크롤 구현

## 🏗️ 프로젝트 구조

```
strategy-board/
├── backend/                 # Spring Boot 백엔드
│   ├── src/                # 소스 코드
│   ├── build.gradle        # Gradle 빌드 설정
│   └── settings.gradle     # Gradle 프로젝트 설정
│
├── frontend/               # TypeScript + React 프론트엔드
│   ├── src/               # 소스 코드
│   ├── public/           # 정적 파일
│   ├── package.json      # npm 패키지 설정
│   └── tsconfig.json     # TypeScript 설정
│
├── Dockerfile             # 도커 설정
├── nginx.conf            # Nginx 설정
├── start.sh              # 컨테이너 내부 실행 스크립트
└── run.sh                # 외부 실행 스크립트
```

## 🛠️ 기술 스택

### 백엔드
- Spring Boot 3.4.4
- Java 17
- Gradle
- Spring Data JPA
- H2 Database
- Lombok

### 프론트엔드
- TypeScript 5.8.3
- React 19.1.0
- Vite 6.3.5
- Material-UI 7.1.1
- Axios 1.9.0

### 인프라
- Docker
- Nginx
- Multi-stage Build

## 🏃 개별 실행 방법

### 백엔드 실행
```bash
cd backend
./gradlew bootRun
```

### 프론트엔드 실행
```bash
cd frontend
npm install
npm run dev
```

## 🔧 개발 환경

- **포트**: 프론트엔드(3000), 백엔드(8080)
- **데이터베이스**: H2 (인메모리)
- **초기 데이터**: 애플리케이션 시작 시 50,000개 게시글 자동 생성

## 📊 성능 특징

- **페이징 전략**: 오프셋 기반 페이지네이션
- **무한스크롤 전략**: 커서 기반 페이지네이션으로 일정한 성능 보장
- **대용량 데이터**: 50,000개 데이터 기준 최적화

## 🏗️ 아키텍처 특징

- **전략 패턴**: 런타임에 데이터 로딩 방식 전환
- **의존성 주입**: Spring의 DI를 활용한 전략 관리
- **타입 안전성**: TypeScript로 컴파일 타임 오류 방지
- **확장성**: 새로운 로딩 전략 추가 용이
