# Roast & Reverb

커피와 음악을 함께 기록하는 React/Vite + Spring Boot/MyBatis 다이어리입니다.

## 다른 대화에서 이어가기

먼저 [프로젝트 맥락](docs/continuity.md)을 읽고 현재 브랜치를 확인하세요. [변경 이력](docs/change-log.md), [커피 기록 반영](docs/coffee-records.md), [도구·연구·필요한 사용자 도움](docs/tooling-and-research.md)을 함께 유지합니다. 프로젝트 전용 스킬은 `.agents/skills/roast-reverb-continuity/SKILL.md`입니다.

기존 `coffe_brew_log/logs/*.md`는 커피 로그의 **Markdown 기록 가져오기**에서 선택·미리보기 후 추가할 수 있습니다.

## 공개 체험

GitHub Pages는 브라우저에 저장하는 체험 프론트입니다. AI 결과는 예시이며 실제 계정 서버, 외부 음악 검색, 사용자 간 동기화를 제공하지 않습니다. 개인 기록은 브라우저 저장소를 지우면 삭제됩니다.

- `cd frontend && npm ci && npm run dev`
- 검증: `npm run test` / `npm run build`
- Pages: `.github/workflows/pages.yml`. feature/service-redesign 또는 main 변경 시 배포합니다. 해시 라우팅으로 새로고침과 하위 경로를 지원합니다.

## 서버 운영 구성

Docker와 Docker Compose가 설치된 서버에서 `.env.example`을 `.env`로 복사하고 `JWT_SECRET`을 충분히 긴 무작위 값(최소 32바이트)으로 설정한 뒤 `docker compose up -d --build`를 실행합니다. API 키는 서버 환경 변수에만 넣습니다.

프론트는 `http://127.0.0.1:8090`에 노출되고 Nginx가 `/api`를 내부 백엔드로 전달합니다. 공개 운영 시 HTTPS를 제공하는 프록시를 이 주소 앞에 연결하세요. 서버/도메인 비용을 자동 결제하지 않습니다.

운영 프로필은 `/data/roastreverb` 파일 DB와 `diary-data` 볼륨을 사용합니다. 예시 사용자/관리자 계정은 생성하지 않습니다. 백업은 서버를 정지한 상태에서 볼륨의 H2 파일을 복사하고 복구를 검증하세요. `docker compose down -v`는 데이터를 지우므로 사용하지 마세요. 다중 인스턴스 서비스에는 관리형 DB로의 이전이 필요합니다.

- 인증: JWT. 모든 기록 API는 인증을 요구하고 관리자 API는 ADMIN 역할을 요구합니다.
- `CLAUDE_API_KEY`, 선택적으로 `CLAUDE_MODEL`: 자연어 분석과 페어링. 키가 없거나 실패하면 503을 표시합니다.
- `LASTFM_API_KEY`, `DISCOGS_TOKEN`: 외부 음악 메타데이터 API.
- 현재 음악 검색 UI는 내 기록을 검색합니다. 비밀번호 복구 메일은 제공하지 않습니다.
- CI는 프론트 저장 테스트/빌드/의존성 검사와 Java 통합 테스트를 실행합니다.
- 백엔드: Java 21 + Maven 3.9 (`mvn -f backend/pom.xml verify`).

공개 체험 배포와 실제 서버 운영은 별도입니다. 이 저장소에는 운영용 Docker 구성이 포함되어 있지만 운영 서버와 API 키를 연결하기 전에는 실제 회원 서비스가 배포된 것이 아닙니다.

## Railway용 단일 서비스

루트 `Dockerfile`은 React 빌드를 Spring 서버에 포함합니다. `railway.json`은 `/data` 영구 볼륨을 요구하며 `PORT` 환경변수를 따릅니다. 서비스와 볼륨을 준비한 것과 실제 배포 완료는 구분합니다. 현재 상태와 요금/키 연결 요구사항은 [도구·연구 문서](docs/tooling-and-research.md)에 기록합니다.
