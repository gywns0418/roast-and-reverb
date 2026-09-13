-- Monthly pick recommender schema.
-- Scoped to this feature only: the rest of the app's schema (member, coffee_log, ...)
-- is not yet defined on this branch (see docs/schema.sql for the full intended design).

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
