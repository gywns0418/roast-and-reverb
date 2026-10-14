# 사운드 대화 연결

기존 `/studio`의 자유 대화는 인증된 Spring 서버의 `GET /api/companion/status`, `POST /api/companion/chat`를 사용한다. 키는 서버의 `OPENAI_API_KEY`, 모델은 `OPENAI_MODEL`(기본 gpt-4.1-mini)이다. 브라우저나 Git에 키를 넣지 않는다. 구현은 [OpenAI Responses 구조화 출력 공식 문서](https://developers.openai.com/api/docs/guides/structured-outputs?api-mode=responses)를 따른다.

AI는 짧은 한국어 답변과 검증 가능한 음악 설정을 제안한다. 사용자가 제안을 적용하면 기존 결정적 작곡·Web Audio 합성 엔진이 WAV를 만든다. 음원 생성 모델·보컬 생성이라고 주장하지 않는다. 원두 원본·전체 일지·취향 저장소는 전송하지 않으며 보내는 문장, 현재 설정, 최근 대화 최대 8개만 전송한다. 화면을 떠나면 대화는 지워진다. `store:false`는 Responses 저장을 끄는 설정이며 제공자의 모든 로그 보존을 없애는 보장은 아니다.

입력 1200자/대화 8개, 출력 600토큰, 연결 8초/요청 30초, 전체 동시 호출 1개, 같은 계정 5초 간격으로 제한한다. 자동 재시도는 없다. 크레딧 소진은 일반 속도 제한과 구별해 503을 반환하고 이후 호출을 차단한다. 잔액/권한 변경 뒤 서버를 재시작한다. 키 존재만으로 실제 모델 응답이 성공했다고 표시하지 않는다.

## 로컬 실행

승인된 저장 위치는 저장소 루트의 무시된 `.env.local`이다. 기존 키를 다시 생성하지 않는다.

1. Java 17 이상으로 `mvn -f backend/pom.xml package` 실행.
2. `node scripts/start-ai-local.mjs` 실행. Windows에서 Java 경로가 다르면 `JAVA_HOME`을 설치 경로로 지정한다.
3. `http://127.0.0.1:5184/#/studio`를 열고 로컬 서버 계정을 사용한다.

실행기는 키를 백엔드 자식 프로세스 환경에만 전달하고 Vite 환경에서 비밀 관련 변수를 제외한다. 서버는 127.0.0.1:8080, 화면은 5184로 제한한다. 기존 개인 파일과 다른 서비스 DB는 수정하지 않으며 로컬 서버 일지는 무시된 `.local/ai-server/diary`에 저장한다. Ctrl+C로 이 실행기의 두 프로세스를 종료한다. 포트가 이미 사용 중이면 종료한다.

## 확인된 상태 / 2026-10-15

사용자가 생성한 `.env.local` 키로 최소 실제 Responses 요청을 수행했다. API가 HTTP 429, `credit_balance_exhausted` / `insufficient_quota`를 반환했다. 실제 생성형 답변 성공은 미검증이며 새 키 생성이나 자동 결제는 하지 않는다. 잔액 확인: [OpenAI API 결제](https://platform.openai.com/settings/organization/billing). 간단한 실험 모델 선택지로 gpt-6-luna도 있으나 모델 변경은 소진된 잔액을 해결하지 않는다.

공개 GitHub Pages는 기기 모드이므로 서버 미연결 안내와 기기 작곡을 제공한다. API 키를 추가하는 것만으로 정적 호스팅에 서버가 생기지 않는다. Railway 운영 서버 배포와 main 승격은 이번 변경에 포함하지 않는다.
