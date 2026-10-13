# Roast & Reverb 디자인 가이드

2026-10-13: 사용자의 전면 디자인 개선 요청에 따라 이전 Naturalist's Ledger 컨셉을 교체한다.

커피 × 음악 페어링 다이어리의 주제와 React/Vite 구조를 유지한다. 밝은 회백색 바탕, 짙은 녹색 잉크, 청록 액센트를 사용한다. 한국어 본문은 산세리프, 브랜드에만 세리프를 사용한다. 기록은 읽기 쉬운 목록으로, 입력은 충분한 간격과 명확한 레이블로 표현한다. 기존 종이 질감, 권호, 도감 라벨은 점진적으로 제거한다.

홈은 큰 한국어 제목과 비대칭 2열 구도, 앨범·레코드·커피의 CSS 아트워크로 서비스 성격을 드러낸다. 모바일은 한 열로 전환한다. 앱 화면은 흰 표면, 12px 모서리, 얇은 경계, 충분한 행 간격을 사용한다. 점수는 숫자 텍스트로 표현한다. 키보드 포커스와 reduced-motion을 지원한다.

참조: https://www.gdweb.co.kr/sub/search.asp , https://www.awwwards.com/websites/ . 넓은 여백과 선명한 타이포그래피의 구도를 참고하며 다른 사이트의 에셋을 복제하지 않는다.

공통 토큰과 신규 디자인은 frontend/src/styles/studio.css에 정의한다. 기존 main.css는 기존 컴포넌트의 레이아웃 호환성을 유지한다. 체험 모드임을 상시 표시하고, 실서버 오류를 예시 데이터나 성공으로 표시하지 않는다.

## 2026-10-13 내부 화면 전면 개선

사용자가 첫 화면과 내부 화면 사이의 품질 차이, 좁은 콘텐츠와 큰 빈 공간을 지적했다. 내부 디자인은 `frontend/src/styles/interior.css`에 추가한다. 홈의 studio.css와 기존 React 구조를 유지한다.

- 최대 1600px 콘텐츠, 40px 좌우 패딩, 녹색 활성 메뉴와 레코드 세션 사이드바. 대시보드 세션/수치/최근 기록/마지막 페어링/커피·음악 두 면을 배치한다.
- 커피 컵 카드, 음악 레코드 카드, 소장품 음반 선반, 페어링과 추천의 아트워크를 사용한다. `RecordArtwork`는 자체 CSS 그래픽이며 실제 앨범 표지가 아니다. 장식은 aria-hidden, 접근 가능한 제목은 본문에 둔다.
- 아카이브는 실제 조회 기록의 검색과 날짜 정렬을 지원한다. 비어 있는 경우 추가 카드와 첫 기록 안내를 배치한다. 개인 기록이나 측정값을 만들어 채우지 않는다.
- 작성·상세·가져오기·검색·프로필은 본문과 상황별 안내 영역을 사용한다. 폼 레이블을 보이게 하고 커피 폼의 기존 레이블은 중복하지 않는다.
- 월 리포트는 월 선택, 이전/다음 달, 일별 커피·음악 기록 수와 원두/아티스트 빈도를 보여준다. 미기록 달은 0, 임의 AI 코멘트나 점수는 표시하지 않는다.
- 아카이브/대시보드/리포트는 서버 기본 30건 제한을 피하도록 200건씩 페이지를 조회한다. 체험 저장소는 한 번 조회한다.
- 760px 이하는 가로 탐색, 520px 이하는 한 열 카드. 탐색 내부의 가로 스크롤과 페이지 전체의 가로 넘침을 구분한다. reduced-motion과 키보드 포커스를 유지한다.

디자인 개편으로 Railway 배포나 외부 API 연결 상태가 바뀌지 않는다.

## 2026-10-13 최신 디자인: Discovery Studio

사용자가 전면 수정과 현대적인 내부 디자인을 다시 요청했다. 이전 컵·레코드 반복 카드 개선 기록은 역사이며, 현재 기준은 discovery.css다. 검정에 가까운 탐색 영역, 밝은 중립색 본문, 올리브 활성 메뉴, 오렌지 편집 사진을 사용한다. 세리프는 작은 브랜드에만 남기고 한국어 제목/본문은 산세리프로 읽기 쉽게 구성한다.

실제로 확인한 참고 내부 화면:
- [Awwwards White Coffee](https://www.awwwards.com/sites/white-coffee), [Moon Ride 상품 상세](https://www.awwwards.com/inspiration/moon-ride-coffeee-white-coffee): 큰 제품 영역과 우측 구매/정보 영역, 명확한 타이포그래피 계층을 참고했다.
- [GDWEB 카누 한정판 사례](https://www.gdweb.co.kr/sub/view.asp?Txt_fgbn=5&str_no=27796&Txt_word=): 커피 산지를 크게 보여주는 대비와 정보 구획을 참고했다.

참고 사이트의 디자인/이미지를 복제하지 않았다. 월픽은 실제 자료가 담긴 카드·검색·분류·비교·상세 모달을 중심으로 재구성했다. 홈과 대시보드에는 자체 브랜드 연출 이미지를 사용하고 대시보드에서 실제 당월 카탈로그로 연결한다. 상세·작성·리포트·인증도 공통 색/타이포/상호작용을 적용한다. 경로 이동 때 스크롤을 초기화한다.

### 자체 이미지 기록

imagegen 스킬의 built-in image_gen 도구 사용. 결과는 `frontend/public/images/ritual-editorial.png`에 저장했다. API 키나 추가 다운로드는 필요하지 않았다. 원두나 특정 로스터리의 실사 사진이라고 표시하지 않는다.

사용한 최종 프롬프트:
> Use case: photorealistic-natural. Asset type: original editorial hero photograph for Roast & Reverb, a modern Korean coffee and music journal. Wide 3:2 landscape. Top-down slightly angled art-directed still life: warm ivory ceramic cup of black filter coffee, a black vinyl record partly inside a plain burnt-orange sleeve, brushed silver over-ear headphones, a small glass pour-over carafe on a warm cream desk. Bright natural afternoon sun, long crisp diagonal shadows, tactile paper, ceramic and metal textures, muted warm neutral palette with punchy burnt-orange accent and charcoal. Sophisticated contemporary magazine photography, no rustic clutter, no people, no logos, no writing, no watermark, no web UI. Balanced composition with the cup at lower center and headphones to the right, no artificial coffee foam. This is brand editorial art, not a real product photograph.
