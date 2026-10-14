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


## 최신 개발: 2026-10-14 원두 기반 Discovery

현재 feature/bean-discovery. 원두 선반/기기 파일 가져오기와 월픽·보유 원두 후보, 실제 브라우저 다국어 의미 모델 추천을 구현했다. UI·모델·로컬 테스트 검증은 change-log.md, 구현 범위/제약은 recommendation-direction.md 마지막 섹션을 따른다. 개인 원본 미수정/미공개, 비용은 무료만, Railway 실서버 미배포. Pages 배포 대상은 이 기능 브랜치로 변경했다. main 승격은 수행하지 않는다. 최신 원격 PR/CI/공개 검증은 후속 기록을 확인한다.


## 2026-10-13 — 운영 main / 개발 dev 분리

사용자가 완료된 개발 기능의 main 반영을 승인했다. PR #9까지의 dev 코드와 main/dev 분리 Pages workflow를 함께 반영한다. 운영은 /roast-and-reverb/, 개발은 /roast-and-reverb/dev/이며 두 브랜치를 각각 빌드한다. feature 직접 배포는 environment branch policy로 차단한다. main 반영만 사용자 확인을 받으며 이번 반영은 이미 승인됨. bean-discovery 미커밋 파일과 개인 원본은 보존했다. 프론트 19개 테스트와 개발 경로 빌드 통과. GitHub CI/배포 최종 결과는 후속 상태로 기록한다. 실제 백엔드 운영과 독립 데이터베이스 환경을 제공하는 변경은 아니다.


2026-10-14 최신 배포 방식: 원격 main의 운영/개발 분리를 통합했다. 이번 기능은 dev PR #12로 반영하고 /roast-and-reverb/dev/에 배포한다. feature 직접 배포를 중단했으며 main은 변경하지 않는다.


## 2026-10-14 최종 인수인계

PR #12 dev 병합 완료(a314370), 구현 442feec CI 전체 성공. dev의 Verify 38419921891 / Pages 38419921942 성공. 이번 기능의 공개 개발 진입은 https://gywns0418.github.io/roast-and-reverb/dev/#/recommend 이며 원두 관리는 /dev/#/beans. 운영 루트는 main 빌드이고 이번 기능을 main에 병합하지 않았다. Pages는 main/dev 각각 빌드하며 feature 정책을 제거했다. 실제 서버/YouTube API 키는 계속 미연결, 유료 비용 없음.

공개 개발 화면에서 실제 다국어 의미 AI 결과·모바일·원두 파일 가져오기/보유 후보 연결 확인. 개인 원본은 브라우저 안에서만 읽고 기기에 저장했다. QA 이미지는 개인 원두 가져오기 전 공개 월픽/체험 음악 조합만 포함한다. 다른 브라우저로 개인 원두 저장이 자동 전달되지 않는다. 세부 구현/제약은 recommendation-direction.md와 pairing-engine.md 최신 섹션, 검증은 change-log.md 마지막 항목. 현재 작업 브랜치는 feature/bean-discovery이며 후속 문서/QA 커밋은 이 브랜치에 보존한다.


## 2026-10-14 자동 원두 연결과 커피/음악 작성 분리

현재 feature/linked-beans-music는 origin/main에서 만들고 이전 bean-discovery 구현/인수인계 문서를 통합했다. beans.md는 한 번 파일 선택으로 FileSystemFileHandle을 IndexedDB에 저장하고 read 권한만으로 앱 진입/포커스/표시 중 15초마다 다시 읽는다. 권한 재요청은 사용자 버튼에서만 수행한다. 파일 수정/업로드 없음. 원본에서 제외된 항목은 미확인 보관, 수동 원두는 유지. Chrome/Edge 등 지원 브라우저 필요. 브라우저가 권한을 초기화하면 다시 허용해야 하며 다른 브라우저에 연결이 전달되지 않는다.

커피 작성에서 음악 필드를 제거하고 각각 저장한다. 커피 원두/산지/판매처 컵노트/내 관찰 맛을 가지고 실제 기존 곡 의미 AI 추천으로 이동한다. 음악 제작 설명은 규칙 기반 초안이고 실제 음악 생성은 아직 연결하지 않았다. 음악 생성 API는 무료 크레딧·서비스 조건과 키/서버가 필요하며 자동 결제를 하지 않는다. 자세한 검증/원격 반영은 change-log.md 최신 항목. main 배포 승인 규칙 유지, 실제 서버 미배포.


## 2026-10-14 최종 연결/작성 분리 반영

PR #13 dev 병합 97aa292, PR #14 필드/파일 오류 표시 보완 dev 병합 5aa0f1b. 최신 source 888e451의 Verify 38556451107와 dev Verify 38556717483 / Pages 38556717494 성공. 원격 main 변경 없음. 개발 진입은 https://gywns0418.github.io/roast-and-reverb/dev/#/beans 와 /dev/#/coffee/write. 오래 열린 페이지의 캐시를 피하려면 새로고침하거나 ?v=888e451 뒤에 #/beans 경로로 열 수 있다.

공개 빌드의 지속 연결 버튼, 독립 커피 작성, 제작 설명, 새 선택 필드 46px 확인. 실제 최초 파일 선택/지속 권한은 사용자 Chrome/Edge에서 진행해야 하며 CUA native picker 자동 검증은 미완료다. 이 연결이 이미 허용됐다고 주장하지 않는다. 읽기/해시/재고/권한 상실은 테스트로 검증했다. 실제 AI 음원 생성은 아직 미연결, 컵노트·산지 기반 기존 곡 의미 추천과 규칙 제작 설명만 제공한다. 문서/QA 후속은 feature/linked-beans-music에 기록한다.


## 최신 개발: 2026-10-14 나의 청음실

현재 feature/personal-ritual. main에서 분기하고 이전 전체 구현/조사 문서를 통합했다. 사용자에게 선택/입력 도구를 넘어 취향을 기억하는 개인 경험을 제공하도록 /ritual과 /memories를 추가했다. 신규 홈 CTA→청음실의 조합 초대→실제 문장 의미 AI→조용한 시간→직접 감상→다음 초대 반영. 개인 기억과 취향 문장은 기기에 저장하고 실제 경험을 확인한 평가만 학습한다. 백업/복구/보관함/복원이 구현됐다. 자세한 모델·제약은 recommendation-direction.md, 디자인은 design-guide.md, 검증은 change-log.md 마지막 섹션.

무료 비용/원본 미수정·미공개/기기 내 추론 조건 유지. 실제 음원 생성은 약관·모델 설치가 아직 완료되지 않아 생성 기능으로 표시하지 않았다. 실제 서버 운영도 미배포다. 이번 구현의 원격 CI/PR/Pages는 최종 기록을 확인한다. main 승격은 수행하지 않는다.

## 2026-10-14 최종 공개 반영 — 개인 청음실

이번 사용자의 모든 권한 부여와 자동 진행 요청을 이 기능의 운영 반영 승인으로 해석하고 main 승격까지 완료했다. 위 이전 항목의 main 미반영 상태는 당시 기록이며 현재 상태는 이 항목을 따른다. 보호 원본 roast-and-reverb / coffe_brew_log는 수정·공개하지 않았고 유료 비용은 발생시키지 않았다.

PR #15(청음실)와 #17(익숙함/발견 반영)을 dev에 병합하고 PR #16으로 main에 반영했다. 최종 구현 source 17abcf1, dev c0cb859, main dc3a9fed30f863876da5ce0c2854f1bc1995ba28. 프론트 테스트 32개, build, production audit 0건, diff 검사 통과. main Verify 38566995953 / Pages 38566995804 성공. 공개 진입: https://gywns0418.github.io/roast-and-reverb/?v=17abcf1#/ritual

공개 main에서 월픽 후보를 선택하고 늦은 밤 독서·보컬 없는 음악이라는 문장으로 실제 E5 추론 성공을 확인했다(의미 AI · 지금 적은 분위기 반영). 390×844 모바일의 문서 너비/스크롤 너비가 일치했다. docs/qa/personal-room-public-desktop.png와 personal-room-public-mobile.png는 공개 월픽과 예시 상황만 담으며 개인 원본 이름·수량을 담지 않는다. 공개 검증에서 실제 사용자 감상을 추가하지 않았다. 로컬에서는 개인화 추론, 멈춤 후 새로고침 01:20 유지, 미확인 경험 학습 제외, 기억 보관/복원, 백업 병합 복구를 확인했다.

개인 원두·취향·감각 기억은 브라우저에 저장되므로 다른 브라우저에 자동 전달되지 않는다. 지속 beans.md 연결은 최초 파일 선택/권한 허용이 필요하며 native picker 권한 유지의 자동 검증은 미완료다. 실제 새 음원 생성·대화형 언어 모델·운영 서버·YouTube API 키는 미연결이다. 품질 검증에 실패한 대화 모델은 최종 제품에서 제거했다. 현재 개인화는 검증된 의미 AI와 직접 확인한 선호 평가를 사용한다.

작업 브랜치는 feature/personal-ritual. 이 최종 문서와 QA 후속 커밋은 해당 브랜치에 보존하며 공개 실행 코드는 위 main 배포다.

## 2026-10-15 — 한 잔의 사운드 / AI 연결 보류

현재 작업 브랜치는 `feature/coffee-sound-studio`. origin/main에서 분기하고 이전 작업의 인수인계 문서를 통합했다. 사용자 요청은 새로운 별도 서비스가 아니라 기존 Roast & Reverb 확장이다. /studio에 실제 기기 내 작곡·WAV 생성·재생·사운드 선반·설정 기억·백업/복원을 구현했다. 청음실과 커피 작성의 현재 원두 향미를 전달한다. 생성 엔진은 결정적 규칙 기반 작곡과 Web Audio 합성이며 생성형 AI 모델이라고 표시하지 않는다. 소리 요청은 8개 고정 표현을 처리한다. 자유로운 LLM 대화는 구현/연결되지 않았다.

OpenAI Developers 설치와 API 키 생성 의사는 사용자가 승인했으나, 저장 위치 확인 도구가 즉시 `not_approved / decline`을 반환했다. API 키 생성·저장·API 요청은 하지 않았다. 같은 승인 요청을 반복하지 않는다. 신고문은 저장소 밖 `../openai-key-confirmation-report.md`에 있으며 공식 신고는 제출하지 않았다. 원인(권한/자동 거절/UI 실패 등)은 아직 확인되지 않았다.

새 사운드는 브라우저 계정 범위의 로컬 저장소에 최대 24개 악보/시작값으로 보관한다. 실제 음원은 WAV 다운로드로 별도 보존하며, 브라우저 삭제 전 JSON 선반 백업이 필요하다. 개인정보를 서버에 전송하지 않는다. 이번 단계는 사용자의 '먼저 진행' 요청에 따른 키 없이 가능한 기능이며, 원래 요청의 생성형 AI 연결 완료로 취급하지 않는다. 개발 dev 반영 후 /dev/#/studio에서 확인한다. main 변경은 이번 작업에서 하지 않는다. CI/배포 최종 상태는 후속 기록을 확인한다.

사운드 PR #18 dev 병합 완료(3c9bf6e). 최종 source ce1ef24의 Verify 38622562623 성공, dev Verify 38622858039 / Pages 38622858060 성공. 공식 지원 채팅에 승인 창 오류의 비민감 재현 내용을 전달했으나 이메일/로그인을 요구하여 담당자 접수·티켓 번호는 받지 못했다. 키 생성은 계속 미완료다.

## 2026-10-15 — 전체 품질 점검

현재 `feature/project-quality-review`는 origin/main에서 분기하고 origin/dev 사운드 구현을 통합했다. /backup에 기기 통합 백업·항목 미리보기·교체 확인·검증·실패 시 롤백·손상 원문 보존을 추가. 계정 토큰/비밀번호/파일 접근 권한과 서버 일지는 제외한다. 복원 전에 현재 자료 백업과 교체 확인이 필요하다. 원두·음악·청음실·사운드 기기 자료와 체험 일지를 지원한다.

체험 저장소 손상 시 예시로 대체하거나 덮어쓰지 않고 오류를 보여준다. 저장 실패 시 메모리 변경/ID를 되돌린다. 삭제되거나 존재하지 않는 기록에 다른 기록을 대신 연결하지 않는다. 음악의 미입력 장르/태그는 미기록으로 유지한다. 음악 검색은 전체 기록을 조회하고 6곡씩 더 볼 수 있다. 관심 원두 저장 실패도 정확히 표시한다.

HTTP 비정상 JSON/실패 envelope/시간 초과를 성공으로 처리하지 않는다. 타임아웃 뒤 저장 완료 여부를 사용자가 확인하도록 안내한다. 서버의 이미지 공개 경로와 잘못된 입력 400/없는 정적 자료·일지 상세 404를 바로잡았다. 조회 중에는 예시 기록을 먼저 보여주지 않는다. 주요 13개 화면·가상 기기 백업 복원/실제 목록 재조회·390×844 가로 넘침 없음 확인. 프론트 46개, 서버 9개 테스트와 운영 프로필 회원가입/저장/재시작/재조회 통과, production npm audit 0건. CI/PR/배포 상태는 후속 기록을 확인한다. main 승격·Railway 운영 배포·외부 AI 연결은 하지 않았다.

최종 구현 00b072c의 Verify 38627074905 성공. PR #19 dev 병합 완료(cb9cc296). dev Verify 38627358297 / Pages 38627358347 성공. 공개 /dev/?v=00b072c#/backup에서 실제 새 백업 화면과 메뉴를 확인했다. QA project-review-public.png는 개인 자료를 표시하지 않는다. 상단 검색어를 검색 화면 안에서 바꿔도 입력/결과가 동기화됨을 로컬에서 추가 확인했다. 마지막 문서/QA 후속은 작업 feature 브랜치에 보존한다.

## 2026-10-15 — REA 추가 점검과 자동 연결

`feature/autonomous-connections`는 main에서 분기하고 최신 dev와 직전 인수인계를 통합했다. 사용자 요청은 자료/도구 링크를 계속 수동 전달하는 부담을 줄이는 것이다. REA 6.5.0으로 연결 관련 소스 5개를 실제 분석·추적했고, 백업 복원 후 원본 동기화 누락과 의미 worker 소유권/실패 복구를 재현 테스트로 보완했다. 자세한 근거·범위·제약은 automatic-connections.md.

읽기 전용 connection-snapshot은 기존 허용된 원두 원본을 자동 발견하며 개인정보는 .local에만 보관한다. REA 검사 스크립트는 변경이 없으면 재사용한다. 기존 월픽 heartbeat를 매일 09:00 KST의 자동 연결·유지관리로 확장했고 글로벌 자동 선택 스킬 roast-reverb-autopilot도 설치/검증했다. PC/Codex 실행 필요, 개인 자료 미공개, 무료 비용·dev 자동 반영·main 확인 규칙 유지. 같은 키 승인 거절을 반복하지 않는다.

/connections에서 브라우저 파일 상태와 게시된 원문 확인 시각, 개인 기기 자료를 표시한다. 브라우저 최초 파일 선택/권한은 여전히 사용자 소유이며 native 파일 접근과 다르다. 이번 실제 공개 월픽 수집에서 한 원두 품절 상태를 갱신했고 52항목 유지·두 번째 실행 changed:false 확인. 테스트 50개/빌드·소스/REA no-change 재사용·모바일 넘침 없음 검증. 원격 CI/PR/Pages 최종 상태는 후속 기록을 확인한다. 실제 LLM/음원 생성 모델·Railway 운영 배포는 여전히 미완료다.

최종 구현 9782de1의 Verify 38631019516에서 frontend/backend/deployment-image 전부 성공. PR #20 dev 병합 완료(0c63de6b). dev Verify 38631291702 / Pages 38631291478 성공. 공개 /dev/?v=9782de1#/connections에서 연결 화면·52개 공개 항목·실제 원문/JSON 확인 시각을 확인했다. public QA 이미지는 개인 기기 수치가 보이는 하단을 제외했다. 로컬 heartbeat ACTIVE/매일 09:00 확인, 실제 미래 예약 실행은 아직 발생하지 않았다. 최종 문서/QA는 feature 브랜치에 보존한다.


## 2026-10-15 — API 키 확인 후 사운드 AI 연결

현재 feature/studio-ai-companion은 origin/main에서 분기하고 최신 dev 및 직전 인수인계를 통합했다. 사용자 생성 키는 승인된 .env.local에 존재하며 값 노출 없이 서버 환경에서만 사용한다. 실제 최소 Responses 요청은 429 credit_balance_exhausted / insufficient_quota로 실패했다. 이전 저장 승인 창 차단은 해결된 것으로 .local 상태를 갱신했고 현재 차단은 잔액 소진이다. 자동 결제/키 재생성/같은 실패 반복을 하지 않는다.

인증된 companion status/chat API와 스튜디오 자유 대화 UI, 구조화된 음악 설정 제안·직접 적용, 입력/출력 제한·시간 초과·크레딧 차단·권한/거절 처리 구현. AI는 대화와 설정을 제안하며 실제 연주는 기존 규칙 작곡/Web Audio 합성이다. 원두 파일/전체 일지 미전송. 대화는 화면 내 일시 보관. 공개 Pages는 기기 모드이고 실제 서버 운영 배포는 아직 없으므로 AI 대화 사용 불가 상태를 정확히 표시한다.

로컬 실행기는 승인된 키를 backend에만 전달하고 loopback 서버+화면을 실행하며 별도 .local DB를 사용한다. 실제 로컬 회원가입/인증 및 status 키 설정 확인, 프론트50/서버14 테스트·빌드·production 저장/재시작/재조회·audit0 통과. 실행 중 Windows JAR 잠금 문제를 확인해 실행용 사본 사용으로 수정하고 재빌드 성공. 실제 모델 답변 성공은 크레딧 소진 때문에 미검증이다. 자세한 운영 방법은 ai-companion.md. main 승격/유료 운영 변경 없음. 원격 PR/배포 결과는 후속 기록을 따른다.
