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
