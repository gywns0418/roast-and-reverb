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


최종 구현/QA source 81a0618의 Verify 38633649698 frontend/backend/deployment-image 성공. PR #21 dev 병합 6861681. dev Verify 38633928108 및 Pages 38633928042 성공. 공개 /dev/?v=81a0618#/studio에서 실제 신규 대화 카드와 서버 미연결 안내 확인. 로컬에서는 인증된 /companion/chat 실제 요청의 크레딧 오류와 이후 차단, 크레딧 없이 53초 기기 음악 생성, 모바일375=scroll375 확인. 키는 client build에 포함되지 않았다. 로컬 실행 중인 서버/화면은 127.0.0.1:8080/5184이며 저장된 테스트 계정은 QA용일 뿐 사용자 계정으로 간주하지 않는다. 실제 AI 답변 성공과 운영 서버 배포는 남아 있다. 공개 QA에 개인 원본 정보 없음. 최종 후속 문서/QA는 feature 브랜치에 보존한다.


## 2026-10-15 — 추천 음악 MusicBrainz / YouTube 공개 연결

현재 feature/public-music-connections는 main에서 분기하고 최신 dev/직전 인수인계를 통합했다. 사용자가 추천 후보 화면의 두 외부 연결을 요청했다. 공개 Pages에 MusicBrainz 직접 검색과 YouTube 공식 oEmbed 단일 영상 제목·채널 조회 연결. 키 없이 결과 미리보기→선택 추가→추천/청음실 후보 반영. 장르/아티스트/보컬 여부 미확인은 추정하지 않고 oEmbed HTML은 실행하지 않는다. 전체 YouTube 검색/재생목록 자동 목록은 서버·별도 YOUTUBE_API_KEY가 여전히 필요하다. 현재 키 없음, OpenAI 키 대체 불가.

실제 브라우저에서 첫 MusicBrainz503 정확 표시, 다음 일반 검색12결과 및 확인한 Norah Jones곡 추가, YouTube제목/채널 조회·선택 추가·새로고침·기준 음악/기본 추천 반영 확인. 모바일375=scroll375. 프론트55 테스트/build 통과. 입력검증·직렬화/1.1초/Web Locks·5분메모리캐시·15초timeout·HTML미사용·중복/화면종료 요청 보호. 자세한 제약과 공식근거 public-music-connections.md. Railway읽기 점검에서 기존 보류11개/live없음 확인, 변경/결제/배포하지 않았다. main 승격 없음, dev PR/배포는 후속 결과 참고.

## 2026-10-16 자동 유지관리

feature/monthly-refresh-20261016은 main에서 분기 후 최신 dev 통합. 개인 원본 변경 없음, 공개 10월 UFO 원두 57종(신규 5종) 및 기존 5종 판매 상태 갱신. 반복 수집 무변경 및 프론트55 테스트 통과. 실제 원본/개인 기록 미수정·미공개, main/서비스/결제/AI 키 변경 없음. 원격 PR 검사 및 dev Pages 결과를 최종 기준으로 확인한다. 유지관리 checkout: C:/Users/gywns/Documents/project/roast-reverb-maintenance-20261016.

최종source7f2f8d8 Verify38637302105 frontend/backend/deployment-image성공. PR#22 dev병합443fa19. devVerify38637569211 및 Pages38637568899 성공. 공개 /dev/?v=7f2f8d8#/recommend에서 MusicBrainz12검색결과와 YouTube단일영상제목·채널 실제조회 모두 확인. 공개검증에서는 개인 후보/일지/원두를 변경하지 않았다. QApublic-music-published.png는 개인 원두 영역을 제외한 연결 카드만 담았다. localQA추가곡은 개발용 후보이며 사용자 감상으로 학습하지 않았다. 최종문서/QA후속은 feature브랜치에 보존한다.


## 2026-10-16 — 콘텐츠와 실제 사용 경험 개선

현재 feature/service-readiness는 main에서 분기, 최신dev(자동 월픽57종 포함) 및 직전 최종문서/QA를 통합했다. continuity 충돌은 양쪽 기록을 모두 보존해 해결했다. 사용자 명확화: 개인 월구독을 생각하지만 가격표/결제화면이 아니라 돈을 낼 이유가 되는 콘텐츠·편의성 개선을 원함. 토스는 구상 단계, 현재 결제작업 제외.

/journey 자체 집필7감상가이드·관찰/계획 노트·반복 비교·명시적 청음실취향 적용·가이드별 연주설정 연결. 기존기능을 끊김없이 사용하도록 핵심탐색/도움말/시작선곡/빈새기록장/커피·음악·발견 초안/백업/로그인복귀/만료처리/모달/화면별로딩을 보완했다. 원래 저장한자료는 유지. 첫 사용자에게 예시 이력을 경험으로 꾸미지 않는다. 자세한 내용 service-experience.md.

프론트61테스트/build/audit0/diff통과. 실제 로컬 초안 이동/새로고침 복원, 계획은완료0, 취향문장연결, guide03연주 bright88BPM/.4 반영, 모바일375=scroll375·추가메뉴접근 확인. QA용 계획만 저장하고 실제시음/청취를 확인하지 않았다. 공통초기JS산출물 약484→280KB. 사용자기록/유료계정/결제/키/상용서버/main 변경 없음. 운영 사용자 가치검증·월간콘텐츠반복공급·서버/복구/지원·상용데이터조건·실제결제는 여전히출시과제다. 원격검사/PR/Pages 결과는 후속기록 참고.

최종 공개 확인: source 0b2031c Verify 38911856918 frontend/backend/deployment-image 성공. PR #24를 dev에 병합(14c5f961)했고 dev Verify 38912028241의 세 job 및 Pages 38912028304 성공. 공개 /dev/?v=0b2031c#/journey에서 일곱 가이드·빈 발견 노트·개인화 시작점·음악 연결을 확인했다. 공개 사용자 기록은 변경하지 않았다. QA journey-published.png는 개인 자료 없는 초기 화면이다. GitHub 재연결 후 공식 커넥터로 PR 생성/병합 완료, 인증정보 직접 읽기는 재시도하지 않았다. main 승격/결제/상용 서버 배포 없음.

## 2026-10-16 — 정렬 규격과 핵심 전달 개선

feature/visual-rhythm은 main에서 분기 후 최신dev와 직전 최종QA 문서를 통합. 사용자 첨부의 월픽 숫자/라벨 높낮이와 청음실 두 카드의 틀어짐을 수정했다. 공통 산세리프·lining/tabular 숫자·44px 조작·8px 계열 간격, 카드 제목/요약/하단링크 기준선 적용. 원형/라벨/숫자는 동일 중앙선과 행높이, 두 카드 제목/링크 실제 좌표 일치 확인. 한국어 제목은 단어를 유지해 균형 줄바꿈.

7가이드별 고민→바라는 변화→구체 행동→남길 결과→CTA를 상단에 배치하고 긴 배경은 접어 읽기. 첫 시작과 노트 바로가기는 HashRouter 경로를 유지하고 제목/입력에 실제 포커스. 기존 관찰/계획 구분·저장·연주 연결 유지. 홈 첫 메시지도 효용/8분 시작으로 명확화. 가격/결제/가짜 구독/보장된 효과 없음. 5초 이해와 구독 전환 향상은 설계 목표이며 사용자 실험 결과로 주장하지 않는다.

61테스트/build 통과. 로컬 월픽 필터 실제작동·5개 분류버튼44px 및 원/라벨/숫자중앙 동일, 청음실 카드높이300.5px·제목/링크좌표 동일, 가이드시작/노트포커스 확인. 모바일390뷰포트375=scroll375. 개인자료 변경/시음/청취기록 생성 없음. dev PR/배포결과는 후속기록.

최종결과: source36cf02d Verify38914084623 전체성공, PR#25 dev병합5ccfd865. dev Verify38914389278 및 Pages38914389600 성공. 공개 /dev/?v=36cf02d#/journey의 문제/바람/행동/결과/CTA와 실제 제목포커스·경로유지 확인. rhythm-published.png 보관. 모바일 최종 한국어 단어 줄바꿈 screenshot 갱신. main 승격 없음, 공개 개인자료 미변경.

## 2026-10-16 — 대시보드 기록 행 붕괴 수정

feature/dashboard-record-layout main 분기 후 최신dev/직전QA 통합. 최근기록 map 안에 청음실 Link가 중첩되어 3열 grid에 4개 자식이 놓이는 원인을 확인. 배너는 목록 위 독립링크로 한 번만 렌더, 각 기록은 아이콘/본문/화살표만 유지. 기록 본문 min-width0 및 배너 반응형 보완. 기존 기록 변경/삭제 없음.

61테스트/build통과. 격리된 localhost5189에 실제 시음/청취가 아닌 명시적 개발QA 기록2개를 UI로 저장하여 혼합목록 확인. 중첩a0/배너1/행자식3, 데스크톱 본문436px, 모바일본문213px 및375=scroll375, 음악기록 클릭의 상세경로 확인. QA screenshot는 개발용 자료만 포함. 공개 사용자 저장소는 미변경. dev검사/배포는 후속기록.

최종: sourcea9c732b Verify38915055770 성공. PR#26 dev병합75b912a8. devVerify38915335796 세job 모두성공, Pages38915335908 성공. 공개 /dev/?v=a9c732b#/dashboard에서 독립배너1/중첩a0/빈목록 정상 확인. 기록보유 상태는 로컬 QA2개로 검증했고 공개사용자 기록을 생성하지 않았다. main 미반영.

## 2026-10-16 — 조사 근거 기반 행동 흐름 정리

feature/focused-service-flow main 분기 후 최신dev/최종QA통합. Baymard버튼/NNg점진적공개/홈가치 문서 직접 확인, focused-experience.md에 출처와 적용 판단 기록. 추천/청음실/가이드/음악제작의 기본작업과 선택옵션 분리, 추천 즉시기본실행·결과포커스·듣기CTA1, 홈구체효용 추가. 14경로 데스크톱/모바일 초기구조 넘침/중첩0, 77JSX검사, 실제추천3결과·선택옵션/입력유지 확인. AST회귀검사2추가, 총63테스트/build/audit0. 신규API키/대화요청/원본자료/운영개인기록/가격/결제/main 변경 없음. 전환효과는 아직측정하지 않음. dev검사/배포결과는후속기록.

최종: source9888809 Verify38916955868 성공. PR#27 dev병합56581660. devVerify38917145584/Pages38917145583 모두성공. 공개 /dev/?v=9888809#/recommend에서 월픽 범위만 선택하여 실제추천3결과/결과포커스/중첩0 확인. 공개 원두/음악/일지 저장소 변경 없음. focused-published.png는 공개월픽과시작선곡만 포함, 개인보유원두/원본정보없음. main 승격없음.

## 2026-10-16 — 대시보드 우선 탐색

feature/dashboard-first main 분기후 최신dev/직전최종QA통합. 사용자 요청으로 대시보드를 접힌기타메뉴에서 기본메뉴 맨앞으로 이동. 공통로고도 대시보드 연결, 주요메뉴 aria-label, 전페이지 동일순서 유지. 대시보드 제목을 실제메뉴명과 일치시키고 기록현황을 맨위에 배치·목록/리포트 링크로 연결. 첫기록없음은 감상가이드, 기록보유자는 커피작성·최근기록 중심 안내. 로딩중 수치를0이아닌 대시로 표시. 월픽홍보는 기록현황뒤, 시각영역 축소.

추가로 직접읽은자료: NNg https://www.nngroup.com/articles/hamburger-menus/ (핵심탐색 가시성), https://www.nngroup.com/articles/consistency-and-standards/ (예측가능한표현), W3C https://www.w3.org/WAI/WCAG22/Understanding/consistent-navigation.html (반복탐색 상대순서일관성). 정보단서 글은 검색요약확인만, 본문2회timeout으로 본문을읽었다고주장하지않음. 기능별선택옵션의점진적공개와 핵심메뉴가시성을 구분해 적용했다. 전체WCAG준수나 전환향상을 검증했다는뜻아님.

63테스트/build통과. 로컬 빈기록 시작/기록1개 보유상태 안내변화, 커피현황 클릭/로고복귀/모바일대시보드 첫위치 및 넘침0/중첩0 확인. 격리localhost5191의 기록은 실제시음아닌 명시QA자료. 공개개인자료/원본/키/결제/main 변경없음. dev PR/배포는후속기록.

최종: source6cc4faa Verify38918719455 전체성공. PR#28 dev병합10ae3787. devVerify38919011988/Pages38919011734 성공. 공개 /dev/?v=6cc4faa#/dashboard에서 첫메뉴대시보드·로고dashboard·기록현황링크4/중첩0 확인. dashboard-first-published.png는 빈기록 초기화면만 보관. 개인보유원두영역/원본자료 미포함·공개사용자저장소 미변경. main미승격.

## 2026-10-17 — 실제 서버 배포와 가져오기 호환성

기존 Railway 프로젝트의 서버 및 /data 영구볼륨 배포 성공. https://roast-and-reverb-production.up.railway.app 에서 실제 계정 UI 제공, 익명 개인기록 API401 확인. 서버소스는 검증된 dev90885b2a에 고정해 임의후속push 자동배포를 막는다. main미승격/유료업그레이드없음.

실서버에서 공개정적월픽401 및 긴분쇄도설명 VARCHAR60 저장오류를 재현하고 수정. 정확한 /data/monthly-picks.json만 공개, 나머지data와기록API인증유지. grind_size TEXT 비절단기존DB마이그레이션 및 합성장문인증API왕복테스트추가. .dockerignore .local제외. 개인원본/가져오기자료/계정정보/화면증거는 무시된로컬위치에만 보관하고 저장소에추가하지않음.

PR#29 sourcec822f79 Verify38989619289 성공/dev병합b299853b. PR#30 source21cf85d Verify38989866412 전체성공/dev병합90885b2a. devVerify38989997816 및 Pages38989997756 성공. Railway배포69599fa4-d2ca-42a8-98a6-5699e99fbf14 성공·영구볼륨유지. 운영 healthz200/정적월픽200/익명coffee401 재확인. 실계정로그인 후 가져오기·새로고침서버조회·동일원본재선택중복차단 검증 완료. 구체개인자료/수량/인증정보는 공개문서에기록하지않음. 운영환경은 사용자확인된Trial로 유료지속운영/자동업그레이드승인을뜻하지않는다.


## 2026-10-17 — 대시보드 전환 로딩·Google 인증 준비

feature/dashboard-social-login을 main에서 분기하고 최신dev 통합. 조회 완료 전 첫 방문 안내/빈 기록을 표시하던 문제를 대시보드 전체 loading gate로 수정. 공통 커피·음악 파형과 진행선, reduced-motion 지원. Layout 내부 Suspense로 메뉴 유지. 실제 로딩 여부에 따라 종료하며 임의 진행률/최소 대기는 넣지 않았다.

Google GIS 공식 버튼·공개키 검증·issuer/audience/만료/인증 이메일/5분 단회 nonce·Origin 검증·기존 JWT 발급 구현. 이메일 자동 병합 금지, 로그인한 회원만 기존 기록장에 Google identity 연결. social_identity 추가 migration으로 기존 DB 보존. GOOGLE_CLIENT_ID 없으면 버튼/Google SDK 로딩 없음. client secret 불필요. 공식 운영 조건·카카오 테스트/운영 앱 구분·개인 개발자 비즈 앱 조건은 docs/social-login.md 참조. Google Cloud 로그인은 사용자 직접 완료했지만 OAuth 등록/승인/실제 Google 로그인은 아직 미완료. 지원 연락처와 정책 페이지 등 브랜드 검증 요건 남음. 기존 Railway 서버/volume 사용, 유료 업그레이드 없음.

로컬 프론트64 테스트/build 통과. 로딩 desktop/mobile 시각 확인, private .local/dashboard-loading.png. 백엔드 인증 통합4개 추가(거부·재사용·클레임·기존 기록 보존). 초기CI에서 새 테스트 컨텍스트와 기존 H2 시드 충돌을 발견해 테스트DB를 분리했다. PR#31 CI/배포 최종 결과는 후속 기록. main 미반영.


최종: PR#31 source839def3 Verify38991083041 세job 성공, dev병합d21b29a. dev Verify38991237347/Pages38991237400 성공. 기존 Railway service에 정확한 dev SHA를 pin하여 deployment0e46e65c-b03f-45f4-ba91-a9624653a1b7 SUCCESS. /healthz200, /api/auth/google/config200(enabledfalse, clientId빈값), 익명 /api/coffee401 확인. 운영 UI에서 메뉴를 유지하는 새 로딩과 조회 후 기존 계정 대시보드 확인. 배포 직후 일시적인 fetch실패는 재시도 후 정상 조회. 개인 원본/기록 변경 없음, main 미반영.

Google Cloud 사용자 로그인 확인. 개요와 클라이언트 페이지 모두 ‘로드할 수 없습니다’ 재현, 재시도도 실패. 신규 전용 프로젝트 생성 시도는 완료 확인이 없어 생성했다고 주장하지 않았고 목록에는 기존 기본 프로젝트 둘만 확인. 다른 브라우저에서 이어서 작업할 수 있도록 사용자에게 알림. 실제 OAuth client 생성·GOOGLE_CLIENT_ID 등록·브랜드 승인·실계정 Google 로그인 검증은 아직 남아 있음. 후속 작업은 프로젝트 목록을 다시 확인한 뒤 진행하며 중복 생성하지 않는다.


## 2026-10-17 — 음악 가져오기 조작 간격

feature/music-import-spacing main 분기 후 최신dev/직전인계 통합. 링크 입력과 가져오기 버튼을 별도 grid로 묶어12px 간격, 직접추가 form은16px gap, 목록붙여넣기 textarea와 action-row12px 간격. 음악후보 영역 및 음악 제작설명의 복사 버튼(12px)에만 적용. 여정·청음실·사운드 보관·월 선택의 인접 조합은 기존 gap 확인. 로컬 build 및 desktop/mobile DOM 실측(12px/직접추가16px, 가로넘침0). 기존 자료·외부연결 설정 변경 없음. PR/CI/배포 결과 후속 기록.


최종: PR#32 source81e372a Verify38991534671 성공, dev병합1fe5db2. devVerify38991653959/Pages38991654023 성공. 기존Railway source를 해당SHA로 pin, deployment3313896b-8dbb-45a7-914e-11d841928dea SUCCESS. 실제 운영 /#/recommend 링크 가져오기12px/직접추가16px DOM실측 확인. .local/music-import-spacing-live.png는 빈 입력 UI 캡처, 개인자료 미변경. main미반영.


## 2026-10-17 — Google 운영 로그인 활성화

Chrome 연결 후 전용프로젝트 roast-and-reverb 확인. 기존 micro-atrium-371108의 MusicEmotion 앱은 미변경. 사용자 명시적 정책동의/클라이언트 생성/연결 승인에 따라 웹클라이언트 생성, JavaScript origin은 기존 Railway 운영origin만. GOOGLE_CLIENT_ID만 서버 설정(비밀키미사용), 세범위email/profile/openid만 선언. 공개홈/개인정보처리방침/도메인 등록 후 Google 콘솔 ‘프로덕션 단계’ 확인. 브랜드 이름/로고 검증 별도이며 심사승인됐다고 주장하지 않음.

feature/google-login-public-policy main 분기·최신dev 통합. privacy.html과 공개경로 허용/홈·공통footer·로그인 링크 추가. 기존 회원의 Google연결 조회API 및 새로고침시 연결표시 유지. PR#33 source9b4a555 Verify39012993355 성공, dev병합03a1ba3. devVerify39013113865/Pages39013113886 성공. 첫CI Docker의 NuGet 다운로드ETIMEDOUT은 재시도로 성공했고 관련없는 dependency수정은 하지 않음. Railway deployment6e616a69-a12e-4296-9b54-f2b0fbd7daa8 SUCCESS. privacy.html200/config200/익명개인상태401/익명일지401. 실제 기존계정 Google연결·새로고침·로그아웃 후 Google 재로그인 및 기록유지 확인. 계정선택팝업은 CDP입력timeout으로 사용자가 직접선택했고 이후 동일회원UI 확인. 캡처와 개인계정상세는 .local에만 저장. 공개시드/개인원본/main 변경 없음.


## 2026-10-17 — 커피에서 시작하는 음악과 감상

사용자가 독립 음악일지보다 커피에 맞는 음악 매칭/제작과 통합 감상을 요청했고 새 운영주소 https://roast-and-reverb.up.railway.app/#/journey 에 적용하도록 승인했다. feature/coffee-led-music은 origin/main에서 분기한 후 최신dev d68c714 통합. 별도 worktree roast-reverb-coffee-led 사용.

여정 진입→커피 선택→기존음악 매칭 또는 기기내 연주제작→함께 감상→커피 단일요청 저장. brewDetails.soundtrack에 곡/출처/매칭방식 또는 재현가능한 작곡recipe, momentNote에 직접 적은 감상 저장. 별도 음악일지/페어링 레코드 자동생성 없음. 기존 음악기록 유지·보관함에서 합산조회·커피상세로 연결. 새 음악은 직접 청취확인 전 리포트의 들은음악에 포함하지 않는다. 생성형 AI음원은 연결하지 않았고 규칙기반 작곡임을 명시한다. AI 의미매칭은 기존기기모델을 선택사용, 신규키/결제/외부개인자료전송 없음.

로컬 프론트66테스트/build/audit0, 서버21테스트 및 production 저장·재시작·재조회 통과. 브라우저에서 매칭3곡/선택/통합감상저장/새로고침/부분수정/청취확인/음악보관함 연결 확인. QA는 격리localhost의 명시테스트자료이며 운영개인기록은 수정하지 않는다. CI/PR/Railway 최종 배포와 공개검증은 후속기록을 따른다. main미반영·기존서비스/영구볼륨/Google설정 유지.

## 2026-10-17 — 지난 추출 조건으로 다음 잔 기록

최신dev951acb1의 커피중심 음악흐름 및 Railway ad9497f3 SUCCESS 확인 후 main에서 feature/repeat-coffee-brew 분기·dev통합. 커피상세의 중복 수정버튼을 통합하고 ‘이 조건으로 다시 내리기’ 추가. 작성화면은 자동초안덮어쓰기 없이 명시적으로 레시피를 불러오고 이전초안으로 되돌리기/추출조건 차이표 제공. 날짜는 오늘로 새로 준비하고 이전맛평가·음악청취·감상·실제추출량·기록시간은 복사하지 않는다. 원본수정 없이 새기록저장 흐름 유지.

프론트68테스트/build 성공. 격리localhost5197에서 검증용기록 생성→조건불러오기→초안복구→온도92→90변경 비교→새기록저장 확인. 모바일390px 가로넘침없음. 운영개인자료변경없음. CI/PR/배포결과는 후속기록.

## 2026-10-17 — 중앙 원두 회전 로딩 오버레이

기존 인라인 파형/진행선을 공통 fixed 오버레이로 교체. body portal로 기본 화면 위를 덮고 중앙에 원두SVG의 입체회전/그림자 표시. 반투명 배경blur, 로딩 동안 root inert 및 body scroll lock, 중복로딩 수명관리와 종료시 원래상태복구. reduced-motion시 정적원두. 실제 요청 종료시 해제하며 인위적 지연없음. 로컬68테스트/build 성공, 임시QA화면에서 전체뷰포트bounds/모바일390 중앙좌표195,422/가로넘침없음/해제후inert 및 overflow복구 확인. QA HTML 삭제, 개인자료변경없음. PR/CI/배포결과후속기록.

## 2026-10-17 — 홈 하단 구체화 및 모바일 전용 사용 흐름

feature/mobile-discovery-layout을 main에서 분기하고 최신dev96c68c7통합. 홈의 반복 2열문장/과도한여백을 커피·음악·감상의 실제기록 예시 및8분가이드와 다음추출연결로 재구성. 모바일전용 mobile.css를 마지막에 적용. 하단5개빠른메뉴/네이티브dialog 전체메뉴(ESC닫기·초점복귀·이동시닫기)/접이식상단검색 추가. 1열폼/16px입력/44px조작/기기하단안전영역/본문여백과기록저장동선 조정. 데스크톱전체메뉴 유지.

프론트68테스트/build 성공. 로컬320/390px에서 홈·대시보드·커피작성·전체메뉴·검색 실제UI 확인, 가로넘침없음/입력16px/메뉴이동시닫기/ESC후전체메뉴로초점복귀 검증. 1440px홈2열·넘침없음 확인. 운영개인자료변경없음. 스크린샷은 .local/mobile-*.png와home-discovery-desktop.png. PR/배포결과후속기록.

## 2026-10-17 — 새 작곡 다양화와 최소2초 공통로딩

main에서 feature/fresh-music-loading-duration 분기·최신dev9d69287통합. 짧은요청/AI설정적용이 기존seed를유지하던흐름을 새seed/v2작곡으로 변경하고 명시적인 ‘같은선율에설정반영’만 유지. v2는 선율·화음진행·베이스패턴·리듬·중간구간·음역을 seed로변화. 직전seed재사용방지와 새제목 제공. v1저장악보는 기존알고리즘과version을그대로유지(원본dev악보SHA256고정검증). 재생/편집시해당version전달. 생성형AI음원연결은아니며 기존기기합성방식확장.

공통 LoadingHost/controller로 요청표시와 오버레이수명을분리. 빠른완료도최소2000ms표시하고 2초를넘는 실제작업은완료까지유지. 중첩요청/타이머취소/해제후기존배경복구 처리. 음악생성에도같은로딩적용. 가짜진행률/2초후작업강제종료없음.

프론트72테스트/build성공. 새배열다양성/구버전해시/레이어편집시선율유지/짧은·긴·중첩로딩가상시계검증. 격리localhost5200에서서로다른WAV생성/별도보관/보관곡다시듣기의동일seed 및 생성로딩표시 확인. 실제사용자음악·기록미변경. PR/배포결과후속기록.

## 2026-10-18 — 보안 검증 및 모바일 정렬 후속

PR #41(dev merge 18768c8): 현재 비밀번호 재확인·인증버전 갱신, 영속 로그아웃 폐기목록, 타 회원 페어링 연결 차단, 단일 인스턴스 인증 요청 제한, 보안 헤더/운영 CORS, Boot4.1.1/MyBatis4 및 패치된 Jackson/Tomcat 반영. 최신 코드 c477e51 Verify39041781824의 프런트73/서버28, 이전 Boot3.4.1 DB·세션 업그레이드와 재시작 유지, 격리 이미지/Trivy/ZAP 모두 성공. 알려진 자격증명 패턴 검사 성공(전체 비밀정보 감사 아님). 상세 잔여 CSP/SRI/세션 설계 제한은 security-review.md. 동일 CSP의 실제 기기 내 모델 추론384차원 성공. 실제 회원 비밀번호·기록 변경 없음. 아직 운영 반영 전이며 최종 모바일 후속까지 묶어 배포 예정.

사용자의 로딩 우측 치우침 제보에 명시적1열 minmax(0,1fr)/화면 너비·동적높이/컨텐츠 최소폭0/최대400px·중앙여백으로 보강. 320px 격리 홈 오버레이 중심160px, 높이740 중심370px 확인. 원두 회전과2초최소표시 유지. 월픽 ‘모든 색’에 혼합 원형색상환 추가. 모바일 분류메뉴를 가로스크롤에서 같은크기3열로, 색상필터는4열(360이하3열)·48px로 정리. 390px에서 분류너비109px/높이48px, 색상너비78px 동일. 홈320/390 가로넘침없음. 73프런트 테스트/build 성공. 실제 iOS/Android 실기기 검증은 별도. 운영 결과는 후속 기록.
## 2026-10-18 자동 유지관리

main 분기 feature/monthly-refresh-20261018에서 최신dev통합. 개인 원본 snapshot 변경없음. 공식당월수집57종 유지, 기존2종 품절·1종 판매가능 상태로 변경. 반복수집 changed:false. 공개데이터만 변경, 코드수정없어 REA 재분석없음. 개인자료/기존checkout/main/유료/키 미변경. PR/검사/게시 결과는 후속기록과 원격을 확인한다.

## 2026-10-18 — 한 줄의 첫 체험 진행

feature/first-cup-experience를 main에서 분기하고 최신dev0b4f362통합. 첫 화면·대시보드·기록 작성에 ‘오늘의 커피는 어땠나요?’ 한 칸 입력, 확인 전 카드 미리보기, 선택형 상세기록을 연결. 예시는 실제 기록으로 자동저장하지 않음. 기존 기록을 노트/원두봉투 CSS 진열장으로 표시, 링크로 원본 상세열기. 실제측정값/듣기완료는 생성하지 않음. 시작음악 공식업로드 확인·같은화면플레이어/선택·대표3곡큐를 구현 중이며 실제 임베드 재생 가능 여부를 검증한다.

인증 companion/cup API는 한 문장만 structured output/store:false로 전달하고 추출값의 원문포함을 서버에서 검증. 기존대화와 요청슬롯·쿨다운·크레딧차단 공유. 키없는경우 원문카드로 보관 가능. 사용자가 기존 .env.local 키의 Railway OPENAI_API_KEY 연결을 명시적으로 승인했으며, 값 노출없이 UI로 추가·봉인하여 운영 pending changes로 준비했다. 최종 검증코드와 함께 적용 예정. 실제 API 크레딧/답변 성공은 아직 확인 전. 자동결제/키신규생성/요금제변경 없음.


## 2026-10-18 — 글로벌·스몰 월픽 자동 발견과 시리즈 전환

main에서 feature/monthly-pick-editions 분기 후 최신 dev7f147f5 통합. 공식 상품930/945 확인, 기존 정규57종에 글로벌 Loquat9종·스몰 언더빈34종 추가. 일반커피월픽 제목만 찾던 발견기를 세 시리즈·당월 판매기간으로 확장(머신/이전달 제외), 반복수집 changed:false. 스몰의 공식 데이터 CDN d22c6ea6lqg2pi.cloudfront.net만 정확한 호스트로 허용하며 다른 CloudFront 도메인은 거부. 서버 링크갱신도 글로벌/스몰 제목·판매일 파싱을 지원. 탭 전환시 상품·출처·기간·필터·비교선택 일치, 모바일 같은크기64px 버튼. 글로벌 공개JSON에 없는 컵노트/가격/산지는 추측하지 않고 미기재·원문확인 표시. 프런트77테스트/build 검증, 서버검사는 CI에서 이어 확인.

별도 체험화면+봉인키 운영배포는 사용자가 다시 명시적으로 승인했으나 accept-deploy 도구가 또 승인없음으로 취소. 우회 배포하지 않고 열린 Railway의 Deploy 직접누르기를 async요청. 키 봉인·pending 및 기존운영 보존. 월픽 PR/게시 결과와 운영 결과는 후속확인.

## 2026-10-18 대시보드 로딩 중앙 정렬 보강

main에서 feature/dashboard-loading-center 분기·dev7403b79 통합. 일반PC 재현에서는 기존 오버레이도 중앙이었으나 확대/모바일 visual viewport 변화에 대응하도록 실제보이는화면 offset/width/height를 구독해 고정오버레이에 반영. 내부내용은 화면50%/50%+translate로 중앙 고정해 페이지 그리드와분리. body portal/배경inert/원두회전/최소2초 유지. 모바일·PC(브라우저90%확대상태)에서 visual1600x1000중심800,500 및355.555x822.222중심177.777,411.111 확인. 프런트77/build/비밀정보패턴검사 성공. 운영반영은 PR검사후진행.

## 2026-10-18 한국 선곡·개인 음악 선택 진행

main에서 feature/korean-music-selection 분기·dev6ce6559 통합. YouTube공식 정책/시청기록API제한을 확인(docs/youtube-music-use.md). 한국공식업로드5곡으로기본선곡·청음실시작후보교체, 기존개인기록유지. 공개oEmbed로5곡모두게시자·제목확인. 한국선곡/내음악/내플리 구분, R&R계정기록·기기후보와직접공유한공개목록지원. GoogleOAuth청취기록연동으로표시하지않음. 계정변경시플레이어재마운트, 재생목록링크계정별기기저장·백업·연결해제, 비공식쿠키없음. 화면밖/비활성탭플레이어해제. 무료재생과저작권유지표시. 한국가요공식vs상업허용BGM옵션질문에는현재답변없어미리안내한공식가요방향으로진행. 프런트79/build/비밀정보패턴검사성공. localhost5206에서아이유·AKMU실제pause버튼/재생시간확인, 다른3곡은공식메타확인·추가재생검증중. 문서의법적검토는음원권리관계무분쟁보증아님. 운영검사는후속진행.

## 2026-10-22 자동 유지관리

main에서 feature/monthly-refresh-20261022 분기·최신dev통합. 개인원본snapshot변경없음. 공식당월발견수집: 스몰언더빈34→35종(#39추가), 판매상태19종변경/영문명2종정정. 정규UFO57종유지·판매상태7종/원문수정시각3종갱신. 이전글로벌Loquat9종보존. 반복수집 changed:false, 전체101종/기존ID삭제없음. 실행코드변경없으므로REA재분석없음. 원본/기존checkout/키/결제/main미변경. PR검사·게시결과후속기록.

## 2026-10-23 자동 월픽 점검

main분기 feature/monthly-refresh-20261023 최신dev통합. 공식스몰언더빈 신규디카페인블렌드1종(35→36), 기존3종판매상태변경. 정규57·글로벌9 보존, 전체102종·기존ID삭제없음. 재수집changed:false, 상품배열의기존순서를유지해불필요한diff축소. 개인원본의변경정보는로컬snapshot에만보관하고원문/수량은게시하지않음. 파일권한은브라우저별기존연결규칙유지. 실행코드미변경·REA재분석없음. main/유료/키/기존checkout미변경. 검증·PR·게시결과후속기록.

## 2026-10-24 자동 유지관리

main분기 feature/monthly-refresh-20261024에서 최신dev통합. 개인원본snapshot변경없음. 공식언더빈1종판매가능→품절만변경,3시리즈102종/기존ID모두보존. 반복수집changed:false,상품배열기존순서유지. 코드미변경·REA재분석없음. 원본/기존checkout/main/키/유료미변경. PR·검사·게시결과후속기록.

## 2026-10-25 기능 축소와 한 줄 흐름

feature/simple-coffee-flow는 main에서 분기·최신dev통합. 사용자 요청에 따라 기본메뉴를 오늘의한잔/내기록/원두둘러보기3개+설정으로축소. 소개→같은페이지입력포커스→기록확인→선택음악→저장→지난기록으로단순화. 음악은원문미리보기후명시적으로펼칠때마운트,자동재생없음. 대시보드통계/추천/홍보/중복진열장제거,기록목록은검색가능한한줄감상중심. 상단곡검색/중복작성버튼/상세페이지장식레일제거. 기존도구·저장자료·라우트는설정의접힌이전도구로보존. 원본파일과저장스키마미변경.

82테스트/build통과,초기화면단일입력·음악지연노출·축소메뉴회귀검사추가. 실제localhost5210에서명시QA문장(실제시음아님)+밤편지선택저장/내기록재조회/소개버튼입력포커스확인. 모바일390에서375=scroll375,설정기존도구열기확인. REA5연결모듈분석성공(부분범위). main승격/유료/키/실사용자기록변경없음. devPR/배포결과후속기록.

## 2026-10-25 전체 간소화/운영 반영 후속

feature/complete-simple-service는 main분기·최신dev통합. 사용자 전체개선/운영반영 요청으로 이번작업의 main승격을승인범위로해석. 상세/수정/원두탐색/음악목록·상세/설정/백업/도움말/인증/보조도구공통을정리. 보존·실행검증·범위와한계는complete-service-review.md.85프런트테스트/build/audit0·REA제한분석,32경로데스크톱/모바일초기구조와실제저장·수정·백업복원·검색·상세초점복귀확인. Railway읽기는재인증필요UNAUTHORIZED라회원서버운영검증불가. Pages체험운영과별개로보고한다. 원본/키/유료/실사용자기록미변경. PR/배포결과후속기록.

## 2026-10-30 모바일 단일 기록장

feature/mobile-single-journal은main분기. 앞선운영간소화의모바일후속으로기록/원두/설정3개메뉴,목록내작성·한번저장·카드펼침·인라인감상수정을구현. 중간미리보기/오늘과기록의왕복/모바일상단중복영역제거. 상세초안state/평가·추출·음악·기존저장키보존.86프런트테스트/build/audit0·REA제한분석,실제격리QA저장/수정/음악보존/hash유지·초점,3폭18구조검사성공. 자세한범위mobile-journal.md. 원본/키/유료/실사용자기록미변경. PR/운영게시후속기록.

## 2026-10-30 월픽 핵심 복구
feature/monthly-pick-core: 모바일 3메뉴 기록/월픽/설정 유지. 월픽3시리즈·설명·관심저장·교차비교·링크가져오기·기존개인노트 보존. 상세 범위/90테스트/모바일검증은 monthly-core.md. 사용자의 운영간소화 수정 후속이며 자동main승격규칙 변경없음. PR/게시결과 후속기록.

## 2026-10-30 화면 밀도 보완
사용자 핵심요구: 기능단순화와별개로화면은꽉차게. feature/content-density(main분기): 공통폭/여백,월픽가로카드/도구모음,빈기록소개+기존입력,설정2열.90테스트/build·모바일12검사성공. 상세 content-density.md. 기존데이터/메뉴보존·PR/게시결과후속기록.

화면밀도보완 게시완료: PR62dev/63main, 운영b38412c.90테스트/build·모바일12/데스크톱6구조검사·PR/main검사전체성공. Pages41027659589성공·운영모바일가로카드/넘침없음확인. content-density.md 및 density-production 캡처참고.
