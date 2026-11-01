# Roast & Reverb 개인정보·이용자 보호·접근성 점검

2026-11-01 · 사용자의 최종 범위: 최신 버전만이 아니라 **전체 버전**.

기존 9개 checkout에 공통 변경을 적용했다. 각 화면 구성과 저장 형식은 유지했다. 최신 main에서 분기한 `feature/privacy-accessibility`와 별도 `roast-reverb-privacy` worktree는 검토·PR용 통합본이다. 과거 브랜치를 최신 UI로 덮어쓰지 않았다. 기존 checkout들의 변경은 로컬 미커밋 상태이며, main 커밋·운영 배포 승인을 대신하지 않는다.

| 항목 | 조치 및 실제 범위 |
|---|---|
| 1 개인정보처리방침 | 항목·목적·브라우저/서버 구분·외부 처리·동의 보관·권리 행사·파기·아동 안내를 갱신. 국외이전의 계약상 국가/보관기간 및 호스팅 로그·백업 보관기간은 운영 계약 대조가 필요하다. 법률 적합성 전체를 인증한 문서가 아니다. |
| 2 이용약관 | 공개 정적 페이지, 계정/기록/권리/중단/이의제기/비용 안내. 로그인 전에도 서버 접근 허용. |
| 3 환불정책 | 현재 결제·자동갱신이 없음을 명시. 외부 판매처 구매와 구별. 미래 유료화의 사전 가격·갱신·해지·환불 안내 필요. |
| 4 쿠키정책 | localStorage·IndexedDB·모델 캐시·임시 인증 쿠키 및 삭제 범위 설명. |
| 5 쿠키 배너 | 필수만 사용/선택 설정에 같은 형태의 버튼 제공. YouTube는 기본 차단. 재진입·철회 지원. |
| 6 입력 동의 | 페이지/모달/Google 신규 가입 모두 미리 체크하지 않은 항목. 서버 직접 호출도 나이·약관·개인정보·현 정책버전 검사. 동의 이력은 별도 테이블에 시각과 함께 보관. 일반 일지 입력에 마케팅 동의를 강요하지 않음. |
| 7 최소 수집 | 실명·주소·전화번호·생년월일 추가 없음. 자유 입력에 민감정보 금지 안내. |
| 8 SDK | Google SDK는 명시적 준비 클릭 후 로드. YouTube iframe은 선택 허용+재생 조작 필요, 철회 시 제거. Google Fonts 자동 외부 호출 제거. 의미 모델과 외부 검색/AI는 기존 명시적 실행 경로를 유지. |
| 9 선택 유도 | 선택 미체크, 거절로 기록 기능을 막지 않음. 삭제는 범위 안내와 별도 확인. |
| 10 숨은 요금 | 현재 결제 코드/과금 흐름 없음. 서비스 비용과 외부 구매/통신 비용 구별. |
| 11 가짜 후기 | 검토한 서비스 화면에 실제 이용자로 위장한 후기 없음. 자체 연출 이미지와 원두 판매처 정보는 후기의 증거가 아님. |
| 12 근거 없는 주장 | 추천 유사도와 만족도 구별 기존 안내 유지. 가장 오래된 버전의 신규 체험 기록에 자동 예시 이력이 생기지 않도록 빈 상태로 변경, 고정 평균 통계는 실제 저장값 평균으로 변경. 기존 저장 이력의 진위를 추정해 삭제하지 않음. |
| 13 대체 텍스트 | 정보 이미지의 alt/role=img 설명과 장식 이미지의 빈 alt를 점검. 확인 화면에 alt 속성 없는 img 0개. 장식에 중복 설명을 추가하지 않음. |
| 14 대비 | 정책/동의/오류·보조문구/placeholder의 어두운 텍스트와 밝은 배경, 뚜렷한 초점 테두리. 새 동의창은 #203429 / #ffffff. 전체 과거 화면의 모든 색 조합에 대한 WCAG 인증은 아님. |
| 15 키보드 | 네이티브 button/checkbox/link/dialog 사용. 모달 배경 비활성, Tab 순환·Escape 닫기·열었던 버튼으로 초점 복귀. 기존 본문 건너뛰기 유지. |
| 16 사업자정보 | 사용자 제공 없음. 사업자번호·상호·주소를 꾸며 넣지 않음. 실제 유료 판매 전 확인 필요. |
| 17 아동 | 신규 가입 만 14세 이상 자가 확인, 서버 우회 차단. 생년월일 미수집. 법정대리인 동의 서비스를 제공하지 않으며 14세 미만 가입 불가. 자가 확인은 신원/연령 인증이 아님. |
| 18 수신 거부 | 현재 광고메일 발송·뉴스레터·구독 기능이 없어 비해당. 발송되지 않는 메일의 수신거부 링크나 성공 화면을 만들지 않음. 도입 시 발송 본문에 유효한 해지 경로가 필요. |
| 19 이용권 | 자체 연출 이미지의 제작 기록과 파일 해시 목록, 설치된 패키지의 라이선스 전문을 보존. 글꼴은 시스템 글꼴. 외부 음악은 공식 플레이어/링크. 사용자 사진·외부 미디어의 개별 권리를 새로 확보했다고 주장하지 않음. |
| 20 삭제 요청 | 모든 화면 아래 관리 버튼에서 운영자에게 삭제/열람/정정/처리정지 메일 작성. 사용자가 발송해야 접수. 현재 계정의 기기 자료 직접 삭제는 별도 확인 후 실행, 다른 계정/사이트 저장·인증·동의 선택 보존. 연결된 파일 핸들 해제. 서버 삭제를 즉시 자동 처리했다고 표시하지 않음. |

## 적용 버전과 검증

| 기존 checkout | 프런트 테스트 | 빌드 |
|---|---:|---|
| roast-and-reverb | 34 | 통과 |
| roast-and-reverb-service | 83 | 통과 |
| roast-reverb-maintenance-20261023 | 83 | 통과 |
| roast-reverb-maintenance-20261024 | 83 | 통과 |
| roast-reverb-simple-flow | 84 | 통과 |
| roast-reverb-complete-service | 87 | 통과 |
| roast-reverb-mobile-journal | 88 | 통과 |
| roast-reverb-monthly-core | 92 | 통과 |
| roast-reverb-content-density | 92 | 통과 |

최신 통합본 프런트 92테스트/build 통과. 백엔드는 전체 소스·테스트·pom 해시로 구분한 3개 구현 계열의 대표를 Maven verify했다. 구버전 Boot 3.4.1, 별도 bean-template 계열, 최신 Boot 4.1.1을 포함한다. 직접 API 요청의 동의 누락·false·과거 버전 거절과 DB의 동의 시각/버전 저장을 검사한다. 최신 운영 프로필의 가입·인증 저장·재시작·로그인·영속 기록 재조회 검증도 통과했다. 별도 bean-template 계열의 기존 한국어 파일 응답 테스트는 응답을 UTF-8로 읽도록 수정했다.

로컬 브라우저: 초기 외부 script 0/iframe 0, 필수만 선택 뒤 배너 해제, 설정 재진입 시 선택 미체크, 삭제 확인 전 버튼 비활성, Escape 초점 복귀. 390×844 override에서 실제 clientWidth=scrollWidth=375, dialogWidth=339. 증거: [모바일 동의창](qa/privacy-mobile.png). 실제 계정·개인 기록·메일을 삭제/전송하지 않았다.

검토 문서와 정책 생성은 `scripts/apply-privacy-review.py`, 패키지 고지/자산 목록은 `scripts/collect-license-notices.py`. 이 스크립트는 명시적으로 승인된 로컬 버전들을 수정하므로 다른 프로젝트에 무분별하게 실행하지 않는다.

## 운영 전 남은 확인

- 운영자의 실사업자 정보(해당 시), 개인정보 책임자 연락체계, 국외이전 근거·사업자별 계약상 보관기간, 서버 백업/로그 파기 주기 확정.
- 외부 음악·상품 설명·업로드 사진의 개별 권리. 자체 제작 기록은 외부 권리의 포괄적 보증이 아니다.
- 법정대리인 동의가 필요한 아동 가입이나 마케팅 메일을 도입할 경우 별도 구현.
- 과거 버전별 배포 주소는 checkout 수와 같지 않다. 운영 main과 개발 dev를 구분하며 과거 브랜치 전부를 한 환경으로 덮어 배포하지 않는다.

공식 참고: [개인정보보호위원회 처리방침 작성지침 안내](https://pipc.go.kr/np/cop/bbs/selectBoardArticle.do?bbsId=BS074&mCode=C020010000&nttId=10125), [개인정보 포털](https://www.privacy.go.kr/), [W3C 최소 명도 대비](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html), [W3C WCAG 키보드 기준](https://www.w3.org/TR/WCAG21/#keyboard).

Git/PR/배포의 최종 결과는 아래에 검증 후 추가한다.


## 최종 Git·검사·게시 결과

- 구현 커밋 `095d1d5`, [PR #64](https://github.com/gywns0418/roast-and-reverb/pull/64)는 dev 병합 완료(`ed67c1a`).
- PR Verify [41256387219](https://github.com/gywns0418/roast-and-reverb/actions/runs/41256387219) 전체 성공: 프런트/서버/이미지 기동·읽기전용 보안검사·Trivy·ZAP 포함.
- dev Verify [41256686771](https://github.com/gywns0418/roast-and-reverb/actions/runs/41256686771) 및 Pages [41256686781](https://github.com/gywns0418/roast-and-reverb/actions/runs/41256686781) 성공.
- [공개 개발판](https://gywns0418.github.io/roast-and-reverb/dev/#/auth/join)에서 정책 5개 HTTP 200/11월1일 시행일 확인. 개인정보 설정의 선택 미체크/삭제 비활성 확인. [게시 증거](qa/privacy-published.png).
- 운영 main은 `b38412c` 유지. 운영 개인정보 페이지의 10월17일 방침 유지 확인. 실제 Railway 회원 서버 배포는 수행하지 않았다.
- REA 6.5.0의 기존 연결 모듈 5개 정적 분석은 parseFailures=0. 새 개인정보 기능을 포함한 전체 앱의 실행 검증이나 보안 인증이 아니다.
- 기존 9개 버전 변경은 각 원래 checkout에서 미커밋 상태로 유지. 검토용 변경 파일과 원래 branch/base SHA manifest를 로컬 `.local/all-versions-privacy-changes.zip`에 보관. 이 묶음에 DB·환경변수·개인 기록을 넣지 않았다.
- 이 최종 문서/게시 캡처 후속은 실행 코드와 별개로 보존하며 새 main 승격을 수행하지 않는다.


## 2026-11-01 운영 배포 완료

사용자가 이 대화에서 ‘운영배포’를 명시적으로 승인했다. [PR #65](https://github.com/gywns0418/roast-and-reverb/pull/65)를 dev → main으로 병합했으며 운영 SHA는 `ce7f742630b5e2f1109d36e10251b5be15dc39c6`이다. main과 검증된 dev의 파일 차이는 없다.

- PR Verify [41260517719](https://github.com/gywns0418/roast-and-reverb/actions/runs/41260517719) 성공.
- main Verify [41260530152](https://github.com/gywns0418/roast-and-reverb/actions/runs/41260530152) 전체 성공: 프런트·서버·이미지·Trivy·ZAP 포함.
- 운영 Pages [41260530185](https://github.com/gywns0418/roast-and-reverb/actions/runs/41260530185) 성공.
- [운영 사이트](https://gywns0418.github.io/roast-and-reverb/)에서 개인정보/약관/환불/쿠키/권리 안내 및 라이선스 전문 모두 HTTP 200. 운영 개인정보처리방침 시행일 2026년11월1일 확인.
- 공개 운영 UI에서 선택적 재생 미체크, 삭제 확인 전 버튼 비활성, Enter로 설정 열기/Escape 닫기 후 원래 설정 버튼으로 초점 복귀 확인. 해당 화면의 외부 출처 script 0, iframe 0.
- [운영 게시 증거](qa/privacy-production.png). 개인 기록 삭제·메일 발송은 수행하지 않았다.
- 이번 배포는 기존 GitHub Pages 운영 사이트에 대한 것이다. Railway 회원 서버 배포·키 변경·결제·요금제 변경은 수행하지 않았다.
- 사업자정보·외부 권리·국외이전 및 백업 보관 조건의 기존 확인 항목은 그대로 남는다.


## 2026-11-01 Railway 갱신 시도 — 인증 복구 필요

사용자가 Railway 배포도 명시적으로 요청했다. 새 서비스/유료 플랜을 만들지 않고 기존 프로젝트와 서비스를 확인했다.

- Railway 플러그인 읽기 요청이 `UNAUTHORIZED / requires reauthentication`으로 거절됨. 설치된 CLI는 없음. 비밀키나 브라우저 인증 토큰을 추출하지 않았다.
- 기존 Chrome 로그인으로 서비스 화면 열람 가능. 프로젝트 `5b3ed910-315b-42fa-bdfc-f1531a692c75`, production `368c4b5f-8d55-4353-b11c-89c5745616aa`, 서비스 `b2f33a1e-c31f-4cfc-9cea-9a0ebac62881`.
- 실제 기존 운영 URL은 https://roast-and-reverb.up.railway.app/ . 서버는 Online이며 활성 배포 `a94b9c58-8e78-4af5-83d6-d086301edf7a`는 PR50 기반의 13일 전 배포로 표시됨. `coffee-music-diary` 볼륨 연결 유지. 체험 크레딧 잔여 표시 확인, 유료 변경 없음.
- Source Repo는 같은 저장소, branch는 dev이나 화면에 `Auto deploy unavailable / Could not load branches` 표시. 재조회와 저장소 검색도 실패. 기존 배포의 Redeploy는 옛 버전 재배포이므로 실행하지 않음. 소스/볼륨/환경변수/계정 변경 없음.
- 공개 읽기 확인: `/healthz` 200, `/privacy.html` 200이지만 11월1일 새 정책 없음, `/terms.html` 401. 새 개인정보 기능이 Railway에 게시됐다고 주장하지 않는다.
- Codex Railway 앱 재연결을 사용자에게 요청했으며 응답 대기. 현재 브라우저 탭을 handoff로 보존. [연결 오류 증거](qa/railway-connection-blocked.png).
- 병행 작업으로 origin/main이 `0e3de67`(PR67 11월월픽)까지 이동했다. 인증 복구 뒤 최신 main의 CI와 변경 범위를 다시 확인하고 개인정보 기능·11월 데이터를 함께 보존하는 배포 SHA를 선택한다.
