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


## 2026-10-13 가독성과 기록 흐름 개선

Discovery Studio를 유지하며 마지막에 usability.css를 적용한다. 본문 14~15px, 월픽 사실 정보 최소 12px, 녹색 보조 텍스트 대비, 44px 주요 조작 영역을 사용한다. 520px 이하의 원두 카드는 한 열로 읽으며 모바일 안내 레일은 숨겨 본문에 집중한다. 검색 포커스, 본문 건너뛰기, 상세/작성의 목록 복귀, 키보드 가능한 페어링 선택을 제공한다. 음악 기록은 예시 초기값 대신 빈 입력과 들은 날짜를 제공한다. 체험 계정 화면은 서버 미배포 안내와 기록장 복귀를 제공하고 가입/로그인 제출을 비활성화한다.
- 작성 폼은 구획 사이 24px 간격을 유지하고, 상세의 장식 아트워크 높이는 190px로 제한한다. 페어링 선택 결과는 데스크톱 2열, 모바일 1열이다.


## 2026-10-13 Editorial Sessions / 월픽 색감

사용자의 첨부 레퍼런스(햇살 아래 커피·레코드·헤드폰)와 어울리도록 built-in image_gen으로 5개 원본 브랜드 연출 이미지를 생성했다. 최종 서비스 자산은 frontend/public/images/{coffee,music,pairing,house,special}-editorial.webp. WebP 총 약 0.8MB로 제공하고 lazy loading한다. 실제 원두 사진이나 공식 앨범 커버로 표시하지 않는다. 원본 PNG는 C:/Users/gywns/.codex/generated_images/01a13571-f3da-71e3-b66a-ca69d0ffd6de에 보존한다. 기존 ritual-editorial.png를 덮어쓰지 않았다.

공통 RecordArtwork는 커피/음악/페어링 사진을 사용해 아카이브·상세·추천·소장품·리포트·안내 레일을 연결한다. 월픽 전체에서도 분류별 제목 구획, 카드 색띠/분류 배지/장면을 유지한다. 언스페셜티 블렌드 #b35537, 하우스 블렌드 #80603f, 싱글 #526849, 스페셜 싱글 #725685는 R&R 자체 분류색이다. 판매처의 **원두별 향미 HEX**는 이 분류색과 별도로 원문 그대로 사용한다. 컬러 스트립과 원형 팔레트, 보라/분홍/빨강/주황/노랑/초록/파랑/갈색/크림 필터를 제공한다. 색만으로 분류하지 않고 이름을 함께 표시한다. 드립백은 별도 보존한다.

### 생성 프롬프트 세트 (built-in, photorealistic-natural)

공통 제약: landscape 3:2, warm natural afternoon sunlight, crisp diagonal shadows, cream tabletop, tactile ceramics/paper/metal, contemporary premium editorial photography; no people, writing, branding, watermark or UI. Original brand scenes, not actual vendor products or official album covers.

- coffee: sculptural cream ceramic cup of black filter coffee, clear pour-over brewer with paper filter and glass server, roasted beans, olive linen; close inviting composition. 원본 exec-e5011a63-fca8-4f56-ade4-c2d8fa8fd176.png.
- music: black vinyl on minimalist charcoal turntable, burnt orange blank sleeve, brushed silver headphones, olive accent; quiet listening ritual. 원본 exec-5d086232-598b-47a6-abfe-1a02a99e777e.png.
- pairing: ivory coffee cup beside vinyl emerging from orange sleeve, glass carafe, silver headphones; equal emphasis on coffee/music; top-down angled composition. 원본 exec-094b25a3-9659-4175-af6c-f50eb19585b2.png.
- house: ivory espresso cup with dark black coffee, silver moka pot, folded unbranded kraft bag, roasted beans; warm caramel/chocolate palette, olive linen. 원본 exec-b59b41d5-0155-4bf6-840f-5edcd6846da9.png.
- special: two clear tasting glasses of amber filter coffee, silver cupping spoon, glass server, muted lavender cloth, blank notebook edge; refined intimate tasting scene. 원본 exec-bac6a4e4-602f-43ea-8101-13c88662ea7e.png.

판매처 색상은 https://unspecialty.com/product/detail.html?product_no=901 과 공개 UFO2/UFO2.json에서 확인했다. 아프리카노의 6247aa/cdb4db/ffb4a2 등은 그대로 보존한다. 색감별 필터 분류는 HSL 기반의 R&R 근사 분류이며 판매처가 지정한 의미 이름이라고 주장하지 않는다. 색상과 개별 컵노트의 대응을 임의로 일대일 연결하지 않는다.


## 2026-10-14 원두 선반과 발견형 추천

원두 카드의 인위적인 연출 사진을 원두 두 알의 형태·산지·품종과 판매처 원문 팔레트를 결합한 SVG 정보 그래픽으로 교체했다. 실제 상품 사진이라고 표시하지 않는다. 음악·페어링과 홈의 기존 브랜드 장면은 유지한다. 월픽의 분류 색상/컵노트/전체 분류 구획/색감 필터는 보존한다. 내 원두 선반은 재고 상태를 텍스트로 함께 표시하고, 추천은 자연어 상황 입력과 원두·음악 후보 범위를 중심으로 구성한다. 데스크톱 추천 3열, 모바일 1열.


## 2026-10-14 독립 작성과 한 잔의 소리

커피 작성은 빈 실제 입력값과 보유 원두 선택으로 시작한다. 커피 사실/판매처 컵노트/관찰 맛을 구분한다. 음악 필드는 독립 음악 작성으로 이동했다. 커피 작성 오른쪽은 컵노트 기반 기존 곡 AI 추천과 음악 제작 설명을 연결하며 화면 1000px 이하에서 1열. 음악 제작 설명은 실제 음원으로 표시하지 않는다. 내 원두는 지속 연결 상태·최근 확인·권한 재허용/해제/다시 읽기를 한 구역에 제공한다.


## 2026-10-14 나의 청음실 / 감각의 기억

신규 진입은 나의 청음실(/ritual). 음악·커피를 행정적인 입력에서 한 조합의 초대와 실제 감상으로 연결한다. 첫 방문에도 공식 카탈로그 월픽과 편집 기본 선곡을 바로 보여주고, 분위기 한 문장으로 실제 기기 내 의미 AI를 실행한다. AI 실행 전 기본 초대는 규칙 기반으로 명시한다.

기존 크림/올리브와 판매처 색감을 유지하며, 사진 대신 CSS 레코드·빛/그림자·색띠로 하나의 장면을 구성한다. 초대는 데스크톱 아트/원두/곡 2열, 모바일 1열. 조용한 세션은 어두운 올리브와 8/15/30분 경과 표시를 사용하고 재생은 사용자 선택으로 새 창에서 수행한다. 회전은 prefers-reduced-motion에서 중단한다. 체류 시간을 실제 청취나 추출로 표시하지 않는다.

나의 취향 문장/좋았던 감상을 모델 입력에 반영하고, 실제로 마시고 들었다고 확인한 평가만 선호 모델을 학습한다. 돌아오면 사용자가 실제 남긴 문장을 다시 보여준다. 감각의 기억(/memories)은 실제 저장 항목/확인된 향미 빈도/백업/복원/복원 가능한 보관함을 제공한다. 가입·파일 가져오기·기록 작성은 첫 초대의 필수 조건이 아니다. 개인 원두가 있으면 보유 원두를 우선 사용하며, 월픽은 미보유라고 명확히 표시한다.

## 2026-10-25 — 덜어낸 기본 경험

사용자 최신요청이기존의정보량확대보다우선한다. 첫화면은짧은효용설명/하나의시작버튼/3단계안내/입력카드로이어진다. 기능별영문라벨·강한장식·통계·중복CTA를줄인다. 기본탐색3개와설정,모바일4개탭. 음악은한줄미리보기뒤에선택적으로펼친다. 이전도구는설정의접힌목록으로보존한다. simple-flow.css가마지막스타일로적용되며새이미지생성없이기존자체브랜드장면을재사용한다. 개인자료나저장형식을변경하지않는다.

## 전체 경험 정리 후속

complete-flow.css를마지막에적용. 기록은감상/선택음악/접힌기술정보순서,수정은세필드부터. 원두는검색가능한가격/컵노트카드와기본시리즈선택,설정은백업/핵심자료/도움말. 보조도구는보관함에서의도적으로연다. 메인/인증/백업까지간격·타입·조작높이를통일한다. 기능/자료의보존과사용자기본노출을구분한다.

## 모바일 단일 기록장 후속

mobile-journal.css는760px이하에서만모바일상단중복/3개하단탐색/목록내작성·수정/접힌검색/카드2줄미리보기를적용한다. input16px/조작44px이상/안전영역유지. 데스크톱기본UI는기존유지. 모바일은중간카드미리보기단계없이입력원문을저장하며플레이어는선택적으로만연다.

2026-10-30: 간소화에서도 월픽은 핵심 메뉴로 유지. 3시리즈→원두카드→설명/관심/비교의 한 화면 흐름. 모바일 기록/월픽/설정3메뉴 유지. 기존노트·가져오기는 접힌 자료관리로 보존.
