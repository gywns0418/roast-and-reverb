INSERT INTO member (member_id, email, password, nickname, role, status)
VALUES (1, 'demo@roastreverb.local', '{noop}demo', '윤서', 'USER', 'ACTIVE');

INSERT INTO coffee_log (
  coffee_log_id, member_id, bean_name, roastery, origin_country, region, process,
  roast_level, brew_method, taste_note, acidity, sweetness, bitterness, body, aroma,
  memo, drink_date
)
VALUES
  (1, 1, '에티오피아 예가체프', 'Fritz', 'Ethiopia', 'Gedeo', 'Washed',
   'Light', '핸드드립', '재스민 향, 레몬 같은 산미', 5, 4, 1, 3, 5,
   '재스민 향, 레몬 같은 산미, 맑은 여운', '2026-07-09'),
  (2, 1, '케냐 AA', 'Mesh', 'Kenya', 'Nyeri', 'Washed',
   'Medium', '에어로프레스', '검붉은 과일, 단단한 바디', 4, 3, 2, 4, 4,
   '검붉은 과일, 단단한 바디, 선명한 산미', '2026-07-08'),
  (3, 1, '과테말라 안티구아', '센터커피', 'Guatemala', 'Antigua', 'Natural',
   'Dark', '프렌치프레스', '카카오, 묵직함', 2, 4, 4, 5, 3,
   '카카오, 묵직함, 긴 밤에 어울리는 농도', '2026-07-07');

INSERT INTO music_log (
  music_log_id, member_id, track_name, artist_name, album_name, genre, tags,
  listened_date, memo
)
VALUES
  (1, 1, 'Svefn-g-englar', 'Sigur Ros', 'Agaetis byrjun', 'Post-rock',
   '몽환적,차분함,공기감', '2026-07-09', '느리게 번지는 기타와 보컬 질감'),
  (2, 1, 'Avril 14th', 'Aphex Twin', 'Drukqs', 'Ambient',
   '섬세함,고요함,피아노', '2026-07-08', '짧고 맑은 피아노 스케치'),
  (3, 1, 'Blue in Green', 'Miles Davis', 'Kind of Blue', 'Jazz',
   '짙은,밤,여운', '2026-07-07', '느슨하고 깊은 밤의 트럼펫');

INSERT INTO pairing (
  pairing_id, member_id, coffee_log_id, music_log_id, mood_summary, mood_tags,
  pairing_score, pairing_text, ai_reason
)
VALUES
  (1, 1, 1, 1, '맑지만 축축한 오후', '플로럴,몽환적,차분함', 92,
   '밝은 산미와 넓게 번지는 사운드가 만나 맑지만 축축한 오후 같은 분위기를 만듭니다.',
   '예가체프의 플로럴한 향과 Sigur Ros의 공기감이 같은 방향의 여운을 만듭니다.'),
  (2, 1, 2, 2, '유리잔처럼 맑은 오전', '선명함,고요함,섬세함', 86,
   '검붉은 과일 같은 산미와 짧은 피아노 선율이 또렷하지만 조용한 감각을 만듭니다.',
   '케냐 AA의 산미와 피아노의 맑은 어택이 섬세한 집중감을 만듭니다.');

INSERT INTO collection (
  collection_id, member_id, title, artist_name, format, release_year, linked_pairing_id, note
)
VALUES
  (1, 1, 'Kind of Blue', 'Miles Davis', 'LP', 1959, NULL, '밤 시간대 페어링에 자주 등장'),
  (2, 1, 'Agaetis byrjun', 'Sigur Ros', 'CD', 1999, 1, '플로럴 계열 커피와 잘 맞음'),
  (3, 1, 'Drukqs', 'Aphex Twin', 'LP', 2001, 2, '섬세한 산미 기록과 연결');

INSERT INTO recommendation (
  recommendation_id, member_id, direction, source_title, target_title, reason, score
)
VALUES
  (1, 1, 'COFFEE_TO_MUSIC', '에티오피아 예가체프', 'Sigur Ros — Olsen Olsen',
   '플로럴한 산미와 넓게 퍼지는 사운드가 같은 방향의 공기감을 만듭니다.', 90),
  (2, 1, 'MUSIC_TO_COFFEE', 'Miles Davis — Blue in Green', '과테말라 안티구아 프렌치프레스',
   '묵직한 바디와 재즈의 늦은 밤 무드가 차분하게 겹칩니다.', 84);

-- Seed data for monthly pick recommender (member_id = 1, demo user)

INSERT INTO taste_rule (member_id, rule_type, tag, match_keywords, weight, reason) VALUES
  (1, 'POSITIVE', 'favorite_producer', 'Mulugeta Muntasha,물루게타 문타샨,물루게타 문타사,Tamiru Tadesse,타미루 타데세', 3, '이미 구매해서 만족도 높았던 프로듀서(같은 생산자, 다른 로스터리/랟트)'),
  (1, 'POSITIVE', 'heavy_rotation_pattern', 'Ethiopia 74158 washed,Kenya SL28,Kenya SL34', 2, '로그에 반복 구매/기록된 패턴 — 케냐 SL28/34 이아가즈 에스테이트(9회 기록), 에티오피아 74158 워시드/내추럴(#10 물루게타 문타사 휴레, 7회 기록으로 가장 많이 마신 원두 중 하나)'),
  (1, 'POSITIVE', 'geisha_variety', '게이샤,Geisha,Gesha', 1, '파나마/콜롬비아 게이샤 등 다수 구매 이력 — 광범위하게 선호하는 품종으로 보임'),
  (1, 'POSITIVE', 'washed_process', '워시드,Washed', 1, '문서에 ''워시드는 상대적으로 클린하고 차분함'' 서술 — 깔끔함이 ''부드럽게 이어지는 복합적인 맛'' 선호와 충돌하지 않는다고 보고 약한 가중치로만 반영'),
  (1, 'CAUTION', 'extreme_fermentation', '애너로빅,Anaerobic,콜드 퍼먼테이션,콜드룸,72Hr', -1, '사용자는 ''선명하게 분리된 개별 노트보다 부드럽게 이어지는 복합적인 맛''을 선호함을 명시적으로 밝힘 — 강한 발효/애너로빅 처리는 틀에 발효향이 뒤게 분리된 노트로 튀는 경향이 있어 감점 (확실한 거부가 아니라 ''확인 필요'' 플래그)');

INSERT INTO monthly_pick (monthly_pick_id, member_id, pick_month, roastery, source_url) VALUES
  (1, 1, '2026-09', '해월커피', 'https://unspecialty.com/product/detail.html?product_no=851');

INSERT INTO monthly_pick_option (monthly_pick_id, raw_text, origin, producer, variety, process, dark_roast, decaf, sold_out, already_purchased, score, score_reason) VALUES
  (1, '타미루 삼촌네 달콤한 포도 (언스페셜티 블렌드)', NULL, NULL, NULL, NULL, FALSE, FALSE, TRUE, FALSE, 5, NULL),
  (1, '호세 삼촌네 산뜻한 라임 (언스페셜티 블렌드)', NULL, NULL, NULL, NULL, FALSE, FALSE, FALSE, TRUE, 5, NULL),
  (1, '피터슨 아저씨네 향긋한 꽃다발 (언스페셜티 블렌드)', NULL, NULL, NULL, NULL, FALSE, FALSE, TRUE, FALSE, 5, NULL),
  (1, '타미루 삼촌네 달콤한 포도 ver.2 (언스페셜티 블렌드)', NULL, NULL, NULL, NULL, FALSE, FALSE, FALSE, FALSE, 5, NULL),
  (1, '아키니 이모네 상큼한 체리 (언스페셜티 블렌드)', NULL, NULL, NULL, NULL, FALSE, FALSE, FALSE, FALSE, 5, NULL),
  (1, '파우스트 삼촌네 달콤한 복숭아 (언스페셜티 블렌드)', NULL, NULL, NULL, NULL, FALSE, FALSE, FALSE, FALSE, 5, NULL),
  (1, '[기획상품] 경험 Set 1: 온두라스와 에티오피아', NULL, NULL, NULL, NULL, FALSE, FALSE, TRUE, FALSE, 5, NULL),
  (1, '[기획상품] 경험 Set 2: 볼리비아와 파나마', NULL, NULL, NULL, NULL, FALSE, FALSE, FALSE, FALSE, 5, NULL),
  (1, '추석 선물 세트', NULL, NULL, NULL, NULL, FALSE, FALSE, FALSE, FALSE, 5, NULL),
  (1, '해월 다크 로스트 블렌드 (하우스 블렌드)', NULL, NULL, NULL, NULL, TRUE, FALSE, FALSE, FALSE, NULL, NULL),
  (1, '해월 미디엄 로스트 블렌드 (하우스 블렌드)', NULL, NULL, NULL, NULL, FALSE, FALSE, FALSE, FALSE, 5, NULL),
  (1, '#1-1 르완다 부산제 버번 워시드 (라이트 로스팅)', 'Rwanda', NULL, 'Bourbon', 'Washed', FALSE, FALSE, FALSE, FALSE, 6, 'washed_process(워시드):+1'),
  (1, '#1-2 르완다 부산제 버번 워시드 (다크 로스팅)', 'Rwanda', NULL, 'Bourbon', 'Washed', TRUE, FALSE, FALSE, FALSE, NULL, NULL),
  (1, '#2 에티오피아 구지 우라가 시코 쿠루메 데가 내추럴 스위스 워터 디카페인', 'Ethiopia Guji', NULL, NULL, 'Natural (Swiss Water Decaf)', FALSE, TRUE, FALSE, FALSE, NULL, NULL),
  (1, '#3 케냐 니에리 카모코 SL28 SL34 PB 풀리 워시드', 'Kenya Nyeri', NULL, 'SL28/SL34', 'Washed', FALSE, FALSE, TRUE, FALSE, 6, 'washed_process(워시드):+1'),
  (1, '#4 에티오피아 구지 함벨라 티르티라 고요 쿠루메 데가 내추럴', 'Ethiopia Guji', NULL, NULL, 'Natural', FALSE, FALSE, FALSE, FALSE, 5, NULL),
  (1, '#5-1 케냐 모란 셀렉션 SL28 SL34 AA TOP 워시드 (라이트 로스팅)', 'Kenya', NULL, 'SL28/SL34', 'Washed', FALSE, FALSE, FALSE, FALSE, 6, 'washed_process(워시드):+1'),
  (1, '#5-2 케냐 모란 셀렉션 SL28 SL34 AA TOP 워시드 (다크 로스팅)', 'Kenya', NULL, 'SL28/SL34', 'Washed', TRUE, FALSE, FALSE, FALSE, NULL, NULL),
  (1, '#6 에티오피아 부르사 시다마 아르베고나 물루게타 문타샤 74158 워시드', 'Ethiopia Sidama', 'Mulugeta Muntasha', '74158', 'Washed', FALSE, FALSE, FALSE, TRUE, 9, 'favorite_producer(Mulugeta Muntasha):+3; washed_process(워시드):+1'),
  (1, '#7 에티오피아 니구세 게메다 시다마 부라 두완초 74158 내추럴', 'Ethiopia Sidama', NULL, '74158', 'Natural', FALSE, FALSE, FALSE, FALSE, 5, NULL),
  (1, '#8 케냐 난디 챕상고 힐스 SL28 바티안 애너로빅 내추럴', 'Kenya Nandi', NULL, 'SL28/Batian', 'Anaerobic Natural', FALSE, FALSE, FALSE, FALSE, 4, 'extreme_fermentation(애너로빅):-1'),
  (1, '#9 에티오피아 구지 우라비스트 74110 애너로빅 워시드', 'Ethiopia Guji', NULL, '74110', 'Anaerobic Washed', FALSE, FALSE, FALSE, FALSE, 5, 'washed_process(워시드):+1; extreme_fermentation(애너로빅):-1'),
  (1, '#10 에티오피아 알로 시다마 벤사 무라고 듀메 74158 워시드', 'Ethiopia Sidama Bensa', NULL, '74158', 'Washed', FALSE, FALSE, FALSE, TRUE, 6, 'washed_process(워시드):+1'),
  (1, '#11 콜롬비아 사르사 시드라 애너로빅 워시드 (플로럴 심포니)', 'Colombia', NULL, NULL, 'Anaerobic Washed', FALSE, FALSE, TRUE, FALSE, 5, 'washed_process(워시드):+1; extreme_fermentation(애너로빅):-1'),
  (1, '#21 에티오피아 니구세 게메다 시다마 부라 몰케 74158 워시드', 'Ethiopia Sidama', NULL, '74158', 'Washed', FALSE, FALSE, FALSE, FALSE, 6, 'washed_process(워시드):+1'),
  (1, '#12 콜롬비아 엘 디비소 핑크 버번 모스토 워시드', 'Colombia', NULL, 'Pink Bourbon', 'Washed', FALSE, FALSE, FALSE, FALSE, 6, 'washed_process(워시드):+1'),
  (1, '#13 에티오피아 알로 시다마 벤사 하마쇼 케베나 74158 내추럴', 'Ethiopia Sidama Bensa', NULL, '74158', 'Natural', FALSE, FALSE, FALSE, FALSE, 5, NULL),
  (1, '#14 온두라스 핑카 엘 푸엔테 파카마라 워시드', 'Honduras', NULL, 'Pacamara', 'Washed', FALSE, FALSE, TRUE, FALSE, 6, 'washed_process(워시드):+1'),
  (1, '#15 에티오피아 시다마 부라 카라모 74158 애너로빅 내추럴 (언더쉐이드 드라이)', 'Ethiopia Sidama', NULL, '74158', 'Anaerobic Natural', FALSE, FALSE, FALSE, FALSE, 4, 'extreme_fermentation(애너로빅):-1'),
  (1, '#16 콜롬비아 핀카 베타니아 게이샤 X4 워시드', 'Colombia', NULL, 'Geisha', 'Washed', FALSE, FALSE, FALSE, FALSE, 7, 'geisha_variety(게이샤):+1; washed_process(워시드):+1'),
  (1, '#28 에티오피아 시다마 벤사 하마쇼 74158 내추럴', 'Ethiopia Sidama Bensa', NULL, '74158', 'Natural', FALSE, FALSE, FALSE, FALSE, 5, NULL),
  (1, '#17 케냐 예리하르 셀렉션 SL28 SL34 AA TOP 워시드', 'Kenya', NULL, 'SL28/SL34', 'Washed', FALSE, FALSE, FALSE, FALSE, 6, 'washed_process(워시드):+1'),
  (1, '#18 에티오피아 시다마 벤사 코코세 바샤 베켈레 74112 74158 내추럴', 'Ethiopia Sidama', NULL, '74112/74158', 'Natural', FALSE, FALSE, FALSE, FALSE, 5, NULL),
  (1, '#19 과테말라 엘 모리또 파카마라 워시드', 'Guatemala', NULL, 'Pacamara', 'Washed', FALSE, FALSE, FALSE, FALSE, 6, 'washed_process(워시드):+1'),
  (1, '#20 콜롬비아 사르사 도냐 마리나 게이샤 애너로빅 워시드 (컴페티션 랏)', 'Colombia', NULL, 'Geisha', 'Anaerobic Washed', FALSE, FALSE, FALSE, FALSE, 6, 'geisha_variety(게이샤):+1; washed_process(워시드):+1; extreme_fermentation(애너로빅):-1'),
  (1, '#31 온두라스 산타 루시아 카소나 게이샤 워시드', 'Honduras', NULL, 'Geisha', 'Washed', FALSE, FALSE, TRUE, FALSE, 7, 'geisha_variety(게이샤):+1; washed_process(워시드):+1'),
  (1, '#32 콜롬비아 CGLE 세로 아줄 게이샤 내추럴 (컴페티션 랏)', 'Colombia', NULL, 'Geisha', 'Natural', FALSE, FALSE, FALSE, FALSE, 6, 'geisha_variety(게이샤):+1'),
  (1, '#33 볼리비아 센다 살바예 파카마라 워시드 (케냐 프로세스)', 'Bolivia', NULL, 'Pacamara', 'Washed (Kenya process)', FALSE, FALSE, TRUE, FALSE, 6, 'washed_process(워시드):+1'),
  (1, '#34 에티오피아 시다마 벤사 알로 타미루 2021 CoE #1 Lot 74158 애너로빅 내추럴', 'Ethiopia Sidama Bensa', 'Tamiru Tadesse', '74158', 'Anaerobic Natural', FALSE, FALSE, FALSE, FALSE, 7, 'favorite_producer(Tamiru Tadesse):+3; extreme_fermentation(애너로빅):-1'),
  (1, '#35 페루 아마조나스 루야 산타 테레사 게이샤 내추럴', 'Peru', NULL, 'Geisha', 'Natural', FALSE, FALSE, FALSE, FALSE, 6, 'geisha_variety(게이샤):+1'),
  (1, '#36 콜롬비아 CGLE 라 에스페란자 부에노스 아이레스 게이샤 워시드', 'Colombia', NULL, 'Geisha', 'Washed', FALSE, FALSE, FALSE, FALSE, 7, 'geisha_variety(게이샤):+1; washed_process(워시드):+1'),
  (1, '#37 볼리비아 핀카 이사벨 로사리오 게이샤 워시드', 'Bolivia', NULL, 'Geisha', 'Washed', FALSE, FALSE, FALSE, TRUE, 7, 'geisha_variety(게이샤):+1; washed_process(워시드):+1'),
  (1, '#38 멕시코 산타 크루즈 게이샤 내추럴', 'Mexico', NULL, 'Geisha', 'Natural', FALSE, FALSE, TRUE, FALSE, 6, 'geisha_variety(게이샤):+1'),
  (1, '#39 파나마 누구오 게이샤 워시드 #1057', 'Panama', NULL, 'Geisha', 'Washed', FALSE, FALSE, TRUE, FALSE, 7, 'geisha_variety(게이샤):+1; washed_process(워시드):+1'),
  (1, '#40 파나마 아시엔다 라 에스메랄다 엘 벨로 두라스노 게이샤 워시드 (4FB)', 'Panama', 'Hacienda La Esmeralda', 'Geisha', 'Washed', FALSE, FALSE, TRUE, FALSE, 7, 'geisha_variety(게이샤):+1; washed_process(워시드):+1'),
  (1, '#41 파나마 아시엔다 라 에스메랄다 엘 벨로 구아보 게이샤 콜드룸 내추럴 (4NC)', 'Panama', 'Hacienda La Esmeralda', 'Geisha', 'Cold Room Natural', FALSE, FALSE, FALSE, FALSE, 5, 'geisha_variety(게이샤):+1; extreme_fermentation(콜드룸):-1'),
  (1, '#66 과테말라 엘 인헤르또 로스 노갈레스 레전더리 게이샤 워시드 (2026 옥션 랏)', 'Guatemala', NULL, 'Geisha', 'Washed', FALSE, FALSE, FALSE, FALSE, 7, 'geisha_variety(게이샤):+1; washed_process(워시드):+1'),
  (1, '#67 과테말라 엘 인헤르또 라스 밀파스 레전더리 게이샤 내추럴 (2026 옥션 랏)', 'Guatemala', NULL, 'Geisha', 'Natural', FALSE, FALSE, FALSE, FALSE, 6, 'geisha_variety(게이샤):+1'),
  (1, '#42 온두라스 산타 루시아 트라이앙글로 게이샤 워시드', 'Honduras', NULL, 'Geisha', 'Washed', FALSE, FALSE, FALSE, FALSE, 7, 'geisha_variety(게이샤):+1; washed_process(워시드):+1'),
  (1, '#43 파나마 잰슨 라스 라구나스 게이샤 워시드 GSH 26-137', 'Panama', NULL, 'Geisha', 'Washed', FALSE, FALSE, FALSE, FALSE, 7, 'geisha_variety(게이샤):+1; washed_process(워시드):+1'),
  (1, '#44 파나마 잰슨 라스 라구나스 게이샤 내추럴 GNH 26-217', 'Panama', NULL, 'Geisha', 'Natural', FALSE, FALSE, FALSE, FALSE, 6, 'geisha_variety(게이샤):+1'),
  (1, '#45 과테말라 라스 마카다미아스 게이샤 2871 내추럴 (2025 CoE 엑조틱 내추럴 & 허니 #1)', 'Guatemala', NULL, 'Geisha', 'Natural/Honey', FALSE, FALSE, FALSE, FALSE, 6, 'geisha_variety(게이샤):+1'),
  (1, '#46 과테말라 라 레포르마 게이샤 워시드', 'Guatemala', NULL, 'Geisha', 'Washed', FALSE, FALSE, FALSE, FALSE, 7, 'geisha_variety(게이샤):+1; washed_process(워시드):+1'),
  (1, '#49 파나마 아길라 페랄타 알라만다 게이샤 워시드', 'Panama', NULL, 'Geisha', 'Washed', FALSE, FALSE, FALSE, FALSE, 7, 'geisha_variety(게이샤):+1; washed_process(워시드):+1'),
  (1, '#50 에티오피아 카라모 시다마 부라 아제나 74158 콜드 퍼먼테이션 72Hr 다크룸 내추럴', 'Ethiopia Sidama', NULL, '74158', 'Cold Fermentation Natural', FALSE, FALSE, FALSE, FALSE, 4, 'extreme_fermentation(콜드 퍼먼테이션):-1'),
  (1, '#51 페루 엘 미라도르 게이샤 워시드 Lot.4', 'Peru', NULL, 'Geisha', 'Washed', FALSE, FALSE, TRUE, FALSE, 7, 'geisha_variety(게이샤):+1; washed_process(워시드):+1'),
  (1, '#52 파나마 나인티 플러스 게이샤 내추럴 NP 15 DEC', 'Panama', 'Ninety Plus', 'Geisha', 'Natural', FALSE, FALSE, TRUE, FALSE, 6, 'geisha_variety(게이샤):+1'),
  (1, '#62 에티오피아 시다마 벤사 알로 타미루 우정 74158 콜드룸 내추럴', 'Ethiopia Sidama Bensa', 'Tamiru Tadesse', '74158', 'Cold Room Natural', FALSE, FALSE, TRUE, TRUE, 7, 'favorite_producer(Tamiru Tadesse):+3; extreme_fermentation(콜드룸):-1'),
  (1, '#63 에티오피아 시다마 벤사 알로 타미루 우정 74158 콜드룸 워시드', 'Ethiopia Sidama Bensa', 'Tamiru Tadesse', '74158', 'Cold Room Washed', FALSE, FALSE, FALSE, TRUE, 8, 'favorite_producer(Tamiru Tadesse):+3; washed_process(워시드):+1; extreme_fermentation(콜드룸):-1'),
  (1, '#53 파나마 엘리다 에스테이트 부엘타 게이샤 워시드', 'Panama', 'Elida Estate', 'Geisha', 'Washed', FALSE, FALSE, FALSE, FALSE, 7, 'geisha_variety(게이샤):+1; washed_process(워시드):+1'),
  (1, '#54 멕시코 산타 크루즈 게이샤 허니', 'Mexico', NULL, 'Geisha', 'Honey', FALSE, FALSE, FALSE, FALSE, 6, 'geisha_variety(게이샤):+1'),
  (1, '#55 과테말라 로스마 포사 게이샤 워시드', 'Guatemala', NULL, 'Geisha', 'Washed', FALSE, FALSE, FALSE, FALSE, 7, 'geisha_variety(게이샤):+1; washed_process(워시드):+1'),
  (1, '#56 엘살바도르 엘 코나카스테 게이샤 내추럴', 'El Salvador', NULL, 'Geisha', 'Natural', FALSE, FALSE, FALSE, FALSE, 6, 'geisha_variety(게이샤):+1'),
  (1, '#57 엘살바도르 엘 코나카스테 게이샤 워시드', 'El Salvador', NULL, 'Geisha', 'Washed', FALSE, FALSE, FALSE, FALSE, 7, 'geisha_variety(게이샤):+1; washed_process(워시드):+1'),
  (1, '#58 파나마 나인티 플러스 게이샤 내추럴 NP 18 MAR', 'Panama', 'Ninety Plus', 'Geisha', 'Natural', FALSE, FALSE, FALSE, FALSE, 6, 'geisha_variety(게이샤):+1'),
  (1, '#59 코스타리카 산 이시드로 라브라도르 엘 세드로 게이샤 워시드', 'Costa Rica', NULL, 'Geisha', 'Washed', FALSE, FALSE, FALSE, FALSE, 7, 'geisha_variety(게이샤):+1; washed_process(워시드):+1'),
  (1, '#60 파나마 아시엔다 라 에스메랄다 하라미요 노리아 게이샤 워시드 (5FB)', 'Panama', 'Hacienda La Esmeralda', 'Geisha', 'Washed', FALSE, FALSE, FALSE, FALSE, 7, 'geisha_variety(게이샤):+1; washed_process(워시드):+1'),
  (1, '해월 다크 로스트 블렌드 드립백 (12g*5ea)', NULL, NULL, NULL, NULL, TRUE, FALSE, FALSE, FALSE, NULL, NULL),
  (1, '해월 미디엄 로스트 블렌드 드립백 (12g*5ea)', NULL, NULL, NULL, NULL, FALSE, FALSE, FALSE, FALSE, 5, NULL),
  (1, '에티오피아 게덱 라레사 월리쇼 데가 워시드 드립백 (12g*5ea)', 'Ethiopia', NULL, NULL, NULL, FALSE, FALSE, FALSE, FALSE, 6, 'washed_process(워시드):+1'),
  (1, '에티오피아 시다마 벤사 하마쇼 74158 내추럴 드립백 (12g*5ea)', 'Ethiopia Sidama Bensa', NULL, NULL, NULL, FALSE, FALSE, FALSE, FALSE, 5, NULL),
  (1, '케냐 무랑가 탕가이니 SL28 SL34 AA TOP 워시드 드립백 (12g*5ea)', 'Kenya', NULL, NULL, NULL, FALSE, FALSE, FALSE, FALSE, 6, 'washed_process(워시드):+1');

ALTER TABLE monthly_pick ALTER COLUMN monthly_pick_id RESTART WITH 2;
