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
