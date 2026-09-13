CREATE TABLE IF NOT EXISTS member (
  member_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(120) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  nickname VARCHAR(60) NOT NULL,
  profile_image VARCHAR(500),
  role VARCHAR(20) NOT NULL DEFAULT 'USER',
  status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS coffee_log (
  coffee_log_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  member_id BIGINT NOT NULL,
  bean_name VARCHAR(120) NOT NULL,
  roastery VARCHAR(120),
  origin_country VARCHAR(80),
  region VARCHAR(120),
  process VARCHAR(80),
  roast_level VARCHAR(40),
  brew_method VARCHAR(60),
  water_temp INT,
  grind_size VARCHAR(60),
  brew_time INT,
  taste_note VARCHAR(500),
  acidity INT,
  sweetness INT,
  bitterness INT,
  body INT,
  aroma INT,
  memo TEXT,
  image_url VARCHAR(500),
  drink_date DATE NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS music_log (
  music_log_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  member_id BIGINT NOT NULL,
  track_name VARCHAR(200) NOT NULL,
  artist_name VARCHAR(200) NOT NULL,
  album_name VARCHAR(200),
  genre VARCHAR(80),
  tags VARCHAR(500),
  lastfm_track_url VARCHAR(500),
  discogs_release_id VARCHAR(80),
  cover_image_url VARCHAR(500),
  listened_date DATE NOT NULL,
  memo TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS pairing (
  pairing_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  member_id BIGINT NOT NULL,
  coffee_log_id BIGINT NOT NULL,
  music_log_id BIGINT NOT NULL,
  mood_summary VARCHAR(500),
  mood_tags VARCHAR(500),
  pairing_score INT,
  pairing_text TEXT,
  ai_reason TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS collection (
  collection_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  member_id BIGINT NOT NULL,
  title VARCHAR(200) NOT NULL,
  artist_name VARCHAR(200) NOT NULL,
  format VARCHAR(20) NOT NULL,
  release_year INT,
  cover_image_url VARCHAR(500),
  linked_pairing_id BIGINT,
  note VARCHAR(500),
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS recommendation (
  recommendation_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  member_id BIGINT NOT NULL,
  direction VARCHAR(30) NOT NULL,
  source_title VARCHAR(200) NOT NULL,
  target_title VARCHAR(200) NOT NULL,
  reason TEXT,
  score INT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS external_api_log (
  api_log_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  member_id BIGINT,
  provider VARCHAR(60) NOT NULL,
  endpoint VARCHAR(500),
  request_summary VARCHAR(500),
  response_status INT,
  success BOOLEAN NOT NULL DEFAULT TRUE,
  error_message TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_coffee_log_member_date ON coffee_log(member_id, drink_date DESC);
CREATE INDEX IF NOT EXISTS idx_music_log_member_date ON music_log(member_id, listened_date DESC);
CREATE INDEX IF NOT EXISTS idx_pairing_member_created ON pairing(member_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_collection_member_format ON collection(member_id, format);
CREATE INDEX IF NOT EXISTS idx_recommendation_member_direction ON recommendation(member_id, direction);

-- Monthly pick recommender feature (feature/monthly-pick-recommend)
CREATE TABLE IF NOT EXISTS monthly_pick (
  monthly_pick_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  member_id BIGINT NOT NULL,
  pick_month VARCHAR(7) NOT NULL,
  roastery VARCHAR(120) NOT NULL,
  source_url VARCHAR(500),
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS monthly_pick_option (
  option_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  monthly_pick_id BIGINT NOT NULL,
  raw_text VARCHAR(500) NOT NULL,
  origin VARCHAR(120),
  producer VARCHAR(120),
  variety VARCHAR(120),
  process VARCHAR(120),
  dark_roast BOOLEAN NOT NULL DEFAULT FALSE,
  decaf BOOLEAN NOT NULL DEFAULT FALSE,
  sold_out BOOLEAN NOT NULL DEFAULT FALSE,
  already_purchased BOOLEAN NOT NULL DEFAULT FALSE,
  score INT,
  score_reason VARCHAR(1000),
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 구성가능한 취향 규칙: POSITIVE/CAUTION만 저장한다.
-- 다크로스트/디카페인 하드제외는 규칙화하지 않고
-- monthly_pick_option.dark_roast / decaf 컴럼으로 고정 처리한다(MonthlyPickScorer 참고).
CREATE TABLE IF NOT EXISTS taste_rule (
  taste_rule_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  member_id BIGINT NOT NULL,
  rule_type VARCHAR(20) NOT NULL,
  tag VARCHAR(60) NOT NULL,
  match_keywords VARCHAR(500) NOT NULL,
  weight INT NOT NULL,
  reason VARCHAR(300),
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_monthly_pick_member ON monthly_pick(member_id);
CREATE INDEX IF NOT EXISTS idx_monthly_pick_option_pick ON monthly_pick_option(monthly_pick_id);
CREATE INDEX IF NOT EXISTS idx_taste_rule_member ON taste_rule(member_id);
