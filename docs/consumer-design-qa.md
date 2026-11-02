# 소비자 가치 전달 수정 QA

final result: passed

모바일 후속 QA: 예전 모바일 규칙 `.simple-home .simple-intro img`가 안내 그림까지 숨기고 있었다(P2). 안내 그림으로 한정한 display/크기 규칙으로 복구했고 첫 방문용 작은 그림은 즉시 로드한다. desktop 이미지와 기존 모바일 배열을 유지한다.

기준은 기존 Writing Desk의 색·그림·두 열 구성을 유지하면서 가치 제안과 실제 탐색 경로를 보완하는 것이다. 이번 감사에서 캡처한 운영 첫 화면과 로컬 구현을 동일 1265×712, 빈 입력 상태로 home-comparison.jpg에 함께 배치해 검토했다. 제목은 두 줄, 주요 작성 동작과 보조 월픽 링크는 명확히 분리됐으며 기존 그림·단계·보관 안내를 유지했다.

초기 모바일 QA에서 항상 열린 월픽 안내가 180px가량의 공간을 차지해 상품 탐색을 지연했다(P2). 기본 접힘 details와 44px summary로 수정했다. 재캡처 mobile-monthly-final.png에서 검색·관심·필터와 첫 카드 상단이 390×844에 들어온다. 가로 넘침은 없다. 안내 펼치기는 실제 내용을 드러낸다.

입력 예시는 aria-describedby로 연결됐다. 기존 자연어 미리보기에 원문과 고소·초콜릿 태그가 표시됨을 확인했다. 로컬 테스트 자료를 운영 개인 기록에 저장하지 않았다. 일반 링크·버튼·details의 키보드 동작 구조를 유지했으나 스크린리더 실기기 검증은 하지 않았다. 실제 소비자 효과는 이 시각/기능 QA로 입증할 수 없다.

증거: .local/consumer-review/home-before.png, home-after.png, home-comparison.jpg, preview-after.png, mobile-monthly-after.png(초기), mobile-monthly-final.png(수정 후). frontend 105 tests 및 최종 Vite build 통과.
