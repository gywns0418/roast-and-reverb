CREATE TABLE member (
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

CREATE TABLE coffee_log (
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

CREATE TABLE music_log (
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

CREATE TABLE pairing (
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
