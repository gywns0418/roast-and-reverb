# Roast & Reverb — 다음 대화를 위한 작업 맥락

최종 갱신: 2026-10-13 (Asia/Seoul)

## 반드시 유지할 주제

Roast & Reverb는 **커피 기록 × 음악 청취 기록을 연결하는 취향 다이어리**다. 한 잔의 추출 조건과 맛, 실제로 들은 곡·아티스트·무드를 기록하고 사용자가 조합을 선택한다. AI는 구조화와 페어링 설명을 돕지만 관찰이나 음악 이력을 만들어내지 않는다. 커피만 먼저 기록하고 나중에 음악을 연결할 수 있다.

## 이 문서를 읽은 뒤 확인할 것

1. 현재 checkout의 `git status --short`, `git branch --show-current`, 원격 브랜치 상태를 확인한다. 이 문서의 상태보다 실제 Git과 배포 상태가 우선한다.
2. 작업에 맞는 문서만 추가로 읽는다: 커피 형식은 [coffee-records.md](coffee-records.md), 도구·계정·연구는 [tooling-and-research.md](tooling-and-research.md), 변경 이력은 [change-log.md](change-log.md), 디자인은 [design-guide.md](design-guide.md).
3. 기존 실제 기록의 날짜·시간·측정값·취향을 추정해서 채우지 않는다. 미기록 값은 미기록으로 유지한다.
4. 실제 API 실패를 데모 로그인, 예시 데이터, 이메일 발송 성공, AI 분석 성공으로 바꾸지 않는다.
5. 작업을 마칠 때 변경 파일, 검증 결과, 남은 문제, Git/PR/배포 상태와 필요한 사용자 행동을 이 문서와 변경 이력에 갱신한다. 비밀키·토큰은 문서에 적지 않는다.

## 작업 폴더와 Git 상태

- 원격: `https://github.com/gywns0418/roast-and-reverb.git`
- 현재 구현 checkout: `C:/Users/gywns/Documents/project/roast-and-reverb-service`
- 공유 원본 checkout: `C:/Users/gywns/Documents/project/roast-and-reverb`
- 개인 커피 원본: `C:/Users/gywns/Documents/project/coffe_brew_log`
- 현재 작업: `feature/interior-studio`. `origin/main`에서 생성한 뒤 `feature/coffee-records-handoff`의 구현과 배포 취소 문서를 통합했다. 이전 커피 기능 PR #4는 dev 병합 완료.
- 후속 커밋: `bf19b6a`, dev PR #4 생성. `8242f44`에서 프론트·서버·운영 재시작·컨테이너 실행 CI와 Pages 배포가 모두 성공했다. PR #4의 현재 병합 상태는 링크와 원격 Git을 확인한다.
- 이전 작업: 커밋 `6413f54`, `7feb820`, `180a153`, `bc06e0c`; PR #2는 `dev`에 병합됨. PR #3은 이전 디자인/배포 구성의 `main` 반영용이며 현재 후속 변경 전체를 담는다고 가정하지 않는다.
- 원본 checkout에는 월픽 관련 미커밋 변경 5개가 있다. 이 checkout의 파일이나 브랜치를 덮어쓰지 않는다. 별도 checkout을 계속 사용한다.
- 작업 단위마다 `main`에서 새 feature 브랜치를 만든다. `feature → dev` PR과 병합은 기존 사용자 승인 범위에서 진행할 수 있다. `main` PR·병합은 현재 사용자 지시와 원본 AGENTS 규칙을 함께 확인하며, `dev` 전체를 무조건 승격하지 않는다.

## 현재 구현

React 19/Vite 프론트와 Spring Boot/MyBatis/H2 서버를 유지한다. 기존 대시보드, 커피·음악 로그, 페어링, 취향 리포트, 추천, 컬렉션, 월픽 페이지가 있다.

- 홈과 공통 UI는 밝은 회백색·짙은 녹색·청록 디자인. CSS 아트워크는 자체 제작이고 외부 디자인 에셋을 복제하지 않았다.
- GitHub Pages는 **명시적인 체험 모드**다. 기록은 해당 브라우저 저장소에 남고 AI 결과·추천 일부는 예시다. 실제 계정이나 동기화를 제공하는 서버가 아니다.
- 실제 서버 모드는 JWT 인증과 ADMIN 권한, 회원별 데이터 격리, 페어링 연결 대상 소유권을 검사한다. 프로필 응답에 비밀번호 해시를 내보내지 않는다.
- AI 키가 없어도 커피를 저장할 수 있다. 실제 AI 분석 불가 시 503을 표시한다. 비밀번호 복구 메일은 아직 구현되지 않았다.
- 운영 프로필은 `/data/roastreverb` 파일 DB, `WRITE_DELAY=0`, 예시 회원 없는 초기화를 사용한다. 단일 인스턴스 구성이다.
- 커피 상세 추출 기록, 기존 Markdown 가져오기, 부분 수정 시 추출 정보 보존을 이번 작업에 추가했다.

## 배포를 구분할 것

- 공개 체험: `https://gywns0418.github.io/roast-and-reverb/`
- 두 컨테이너 로컬/서버 구성: `compose.yaml` + 프론트 Nginx + 백엔드 Dockerfile.
- Railway용 단일 컨테이너: 루트 `Dockerfile`이 프론트를 빌드해 Spring 정적 리소스로 포함한다. `railway.json`에 `/healthz`, `/data` 필수 마운트, 단일 replica, idle sleep, CPU 1 / RAM 500MB 한도를 선언했다.
- Railway 연결은 확인했다. 프로젝트·서비스·200MB 볼륨·운영 환경변수를 **배포 전 대기 상태**로 준비 중이다. 실제 배포 승인/요금 범위 확인 전에는 서버가 운영 중이라고 말하지 않는다.
- Railway 프로젝트: `5b3ed910-315b-42fa-bdfc-f1531a692c75`; production 환경: `368c4b5f-8d55-4353-b11c-89c5745616aa`; 서비스: `b2f33a1e-c31f-4cfc-9cea-9a0ebac62881`.
- JWT 키는 생성해 Railway의 대기 환경변수에 넣었으며 저장소·이 문서에는 포함하지 않는다. Claude/Last.fm/Discogs 키는 아직 연결하지 않았다.

## 검증 명령

```powershell
npm.cmd run test --prefix frontend
npm.cmd run build --prefix frontend
$env:JAVA_HOME = 'C:/Program Files/Java/jdk-21'
mvn -B -f backend/pom.xml verify
node backend/scripts/verify-production.mjs
```

이 Windows PC의 기본 PATH Java는 10일 수 있다. Java 21을 명시한다. 로컬 Maven을 설치하지 않았으면 이전 작업에서 받은 임시 Maven은 `$env:TEMP/rr-maven/apache-maven-3.9.11/bin/mvn.cmd`에 있다. CI는 Java 21과 Maven을 사용한다.

브라우저에서는 기록 작성·수정·가져오기·새로고침 유지와 모바일 가로 넘침을 확인한다. CI는 프론트 테스트/빌드, Java 통합 테스트, 운영 프로필 저장 후 서버 재시작 검사와 배포 이미지 빌드를 수행한다.

## 남은 작업의 우선순위

1. 사용자가 Trial/Free 플랜에서 무료 크레딧만 사용하도록 허용했다. 유료 전환·추가 결제는 허용하지 않았다. Railway accept-deploy 호출은 도구의 최종 승인 단계에서 취소되어 적용되지 않았다. 다시 실행하려면 해당 배포 작업의 최종 승인이 필요하다. 실행 후 health, 회원가입, 저장·재시작·재조회와 HTTPS를 확인한다.
2. 실제 AI 및 외부 음악 검색 키를 서버 환경변수로 연결한다. 음악 검색 UI는 현재 내 기록 검색이며 외부 API 검색 UX 연결은 별도 작업이다.
3. 월픽 취향 규칙을 회원이 직접 관리하도록 한다. 소유자의 디카페인/다크 로스팅 선호를 모든 회원의 고정 취향으로 만들지 않는다.
4. 브라우저 체험 데이터의 내보내기/복구, 서버 백업·복구 검증, 계정 복구를 구현한다. 저장소가 삭제되거나 체험 크레딧이 끝나도 개인 기록을 잃지 않도록 해야 한다.

## 새 대화에 붙일 짧은 요청

> Roast & Reverb를 이어서 작업해 주세요. 먼저 `roast-and-reverb-service/docs/continuity.md`와 현재 Git 상태를 확인해 주세요. 주제는 음악 × 커피이며, 실제 커피 기록은 `coffe_brew_log`를 참고합니다. 변경 내역과 남은 작업도 프로젝트 문서에 갱신해 주세요.


## 내부 화면 개선 (2026-10-13)

대시보드 세션·실기록 수치·최근 기록, 커피/음악 아카이브 검색·정렬 카드, 페어링과 소장품 아트워크, 월별 실기록 그래프와 빈도 순위, 작성/상세의 안내 영역을 적용했다. 기준은 design-guide.md 내부 개선 섹션을 따른다. Pages 자동 배포 대상은 feature/interior-studio로 이동했다. Railway는 배포 승인 취소 상태를 유지한다.

내부 개편은 커밋 b594be0과 dev PR #5에 담았다: https://github.com/gywns0418/roast-and-reverb/pull/5 . 공개 내부 진입 주소는 https://gywns0418.github.io/roast-and-reverb/#/dashboard . Pages 배포 성공과 실제 공개 화면 확인 완료. 현재 PR 병합 여부는 원격 상태를 확인한다.

## 최신 후속 작업: Discovery / 월픽 자동 수집

현재 브랜치는 feature/discovery-monthly-sync다. main에서 생성하고 이전 interior-studio 구현을 통합했다. 월픽 수집/자동 작업은 docs/monthly-source.md, 새 디자인은 docs/design-guide.md 마지막 섹션을 읽는다. 실제 10월 유에프오커피 52개 자료와 source endpoint, 링크 가져오기/비교/상세/관심 원두를 구현했다. 월간 자동 작업은 이 대화에 연결됐고 PC와 앱이 실행 중이어야 한다. Pages 배포 대상은 현재 기능 브랜치와 feature/monthly-refresh-*다. Railway 운영 상태는 그대로 미배포다.

현재 작업의 dev PR은 #6이다: https://github.com/gywns0418/roast-and-reverb/pull/6 . 공개 월픽 진입은 https://gywns0418.github.io/roast-and-reverb/#/monthly-pick . 최신 CI/배포/병합 상태는 원격 확인이 우선이다.


## 최신 작업: 내부 사용성 점검

feature/usability-audit는 origin/main에서 분기하고 PR #6 구현을 통합했다. PR #6은 dev 병합 완료(9d37b6d). Discovery 디자인은 usability.css로 가독성과 모바일 조작을 보완했다. 변경/검증 상세는 change-log.md 마지막 섹션을 확인한다. 음악 날짜 선택, 키보드 페어링 선택, 전체 기록 기반 마이페이지, 체험 인증 안내가 적용됐다. Pages workflow는 이 feature 브랜치와 monthly-refresh-*를 허용한다. main 승격은 수행하지 않는다. Railway는 실제 미배포이며 비용 조건은 무료 크레딧만 유지한다. 실제 관리자 로그인 UI, 실서버/외부 음악 API 및 백업/복구는 후속 과제다.


최종 확인: 구현 9fa5342의 Verify(38406582421)와 Pages(38406575199) 성공. PR #7은 dev에 병합 완료, dev merge SHA fff4d04. 공개 음악 작성 24px 폼 간격/날짜 입력과 모바일 월픽 52카드·1열·넘침 없음 확인. docs/qa의 공개 화면 이미지는 검증 증거이며 개인 기록을 포함하지 않는다. 후속 문서 커밋에는 동일 결과와 QA 이미지만 포함한다. 서버 운영 완료로 해석하지 않는다.
- 검증 기록/QA 이미지 전달용 PR #8도 dev 병합 완료(04a0ef5). 작업 종료 브랜치 feature/usability-audit, 작업트리 clean. 마지막 상태 기록은 feature 브랜치의 문서 후속 커밋에 보존한다.


## 최신 작업: Editorial / 색감 월픽 / R&R 엔진

feature/editorial-pairing-engine. 5개 새 브랜드 이미지, 전체 월픽의 분류별 색상 구획과 원문 HEX 팔레트/9색 필터, R&R 무료 로컬 페어링 분석·피드백 선호 학습을 추가했다. 엔진 구현/제약은 pairing-engine.md, 원문 색상은 monthly-source.md, 이미지 프롬프트/경로는 design-guide.md, 검증은 change-log.md 마지막 섹션. 실제 서버 미배포, 개인 원본 보호, 무료 크레딧만 허용 조건 유지. main 승격은 수행하지 않는다. 현재 공개 코드/PR/CI는 원격을 확인한다.
- dev PR #9 생성. 공개 월픽/페어링 엔진 적용 확인, 최신 실행 코드 8430929 Pages 성공. 카드 사진과 분류색·팔레트·필터의 공개 증거는 docs/qa/editorial-monthly-*.jpg, pairing-engine-public.jpg. 최신 CI/병합 상태는 원격 확인을 우선한다.
- 최종 PR #9 dev 병합 완료(17c7ece). 구현 8430929 Pages 성공/공개 확인, 후속 테스트·문서·QA 커밋 04838e4 Verify 성공(19개 프론트 테스트 포함); 실행 코드 동일. 해당 후속 Pages 재배포는 마지막 조회 queued이며 공개 실행 변경은 이미 적용됐다. 작업 브랜치 feature/editorial-pairing-engine, 상태 기록은 후속 문서 커밋에 보존. 실제 서버는 계속 미배포, 유료 결제/배포 없음.


## 최신 사용자 피드백: 원두 이미지 / 추천 후보 확대

현재 연출 사진은 인위적이라는 피드백. 원두만의 실제 매크로/권한 확인 사진 또는 원문 색감 중심 정보를 선호하는 방향을 제안했다. 선택식 페어링보다 보유 원두+월픽+접근 가능한 외부 플레이리스트에서 상황에 맞는 조합을 발견하는 흐름을 검토했다. beans.md는 구조 확인만 했으며 원본/개인 내용은 공개하지 않았다. YouTube 시청 이력은 공식 API 접근 불가, 재생목록/검색은 별도 키/연결 필요. 상세 조사와 미구현 범위는 recommendation-direction.md. 이번 문서 브랜치 feature/recommendation-direction은 main에서 분기하고 기존 구현을 통합했다. 사이트 실행 변경 없음.
