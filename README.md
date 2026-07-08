# Roast & Reverb

커피 기록과 음악 청취 기록을 연결해 AI 페어링 인사이트, 취향 리포트, 추천을 제공하는 포트폴리오용 풀스택 프로젝트 초안입니다.

## 구성

- `frontend`: React + Vite SPA
- `backend`: Spring Boot + MyBatis 백엔드 골격
- `docs`: DB/API/개발 로드맵 문서

## VS Code에서 열기

```bash
cd C:\Users\gywns\Documents\project\roast-and-reverb
code .
```

## 프론트 실행

```bash
cd frontend
npm install
npm run dev
```

## 백엔드 실행

```bash
cd backend
./mvnw spring-boot:run
```

Windows에서 Maven Wrapper가 없으면 로컬 Maven으로 실행하세요.

```bash
mvn spring-boot:run
```

## API 키 환경 변수

- `LASTFM_API_KEY`
- `DISCOGS_TOKEN`
- `MUSICBRAINZ_APP_NAME`
- `CLAUDE_API_KEY`
