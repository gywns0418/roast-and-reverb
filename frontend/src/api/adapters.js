function pick(source, keys, fallback = "") {
  for (const key of keys) {
    if (source?.[key] !== undefined && source?.[key] !== null) return source[key];
  }
  return fallback;
}

export function formatDate(value) {
  if (!value) return "";
  return String(value).replaceAll("-", ".").slice(0, 10);
}

export function splitTags(value) {
  if (Array.isArray(value)) return value;
  if (!value) return [];
  return String(value).split(",").map((tag) => tag.trim()).filter(Boolean);
}

export function adaptCoffeeLog(item = {}) {
  return {
    id: pick(item, ["id", "coffeeLogId", "coffee_log_id"]),
    date: formatDate(pick(item, ["date", "drinkDate", "drink_date"])),
    bean: pick(item, ["bean", "beanName", "bean_name"]),
    roastery: pick(item, ["roastery"]),
    origin: [pick(item, ["origin", "originCountry", "origin_country"]), pick(item, ["region"])]
      .filter(Boolean)
      .join(", "),
    process: pick(item, ["process"]),
    roast: pick(item, ["roast", "roastLevel", "roast_level"]),
    brew: pick(item, ["brew", "brewMethod", "brew_method"]),
    acidity: Number(pick(item, ["acidity"], 0)),
    sweetness: Number(pick(item, ["sweetness"], 0)),
    bitterness: Number(pick(item, ["bitterness"], 0)),
    body: Number(pick(item, ["body"], 0)),
    aroma: Number(pick(item, ["aroma"], 0)),
    memo: pick(item, ["memo", "tasteNote", "taste_note"]),
    raw: item
  };
}

export function adaptMusicLog(item = {}) {
  return {
    id: pick(item, ["id", "musicLogId", "music_log_id"]),
    date: formatDate(pick(item, ["date", "listenedDate", "listened_date"])),
    track: pick(item, ["track", "trackName", "track_name"]),
    artist: pick(item, ["artist", "artistName", "artist_name"]),
    album: pick(item, ["album", "albumName", "album_name"]),
    genre: pick(item, ["genre"]),
    source: pick(item, ["source"], "기록"),
    tags: splitTags(pick(item, ["tags"])),
    memo: pick(item, ["memo"]),
    raw: item
  };
}

export function adaptPairing(item = {}) {
  return {
    id: pick(item, ["id", "pairingId", "pairing_id"]),
    date: formatDate(pick(item, ["date", "createdAt", "created_at", "drinkDate", "drink_date"])),
    coffee: pick(item, ["coffee", "beanName", "bean_name"]),
    music: pick(item, ["music", "trackName", "track_name"]),
    artist: pick(item, ["artist", "artistName", "artist_name"]),
    score: Number(pick(item, ["score", "pairingScore", "pairing_score"], 0)),
    tags: splitTags(pick(item, ["tags", "moodTags", "mood_tags"])),
    mood: pick(item, ["mood", "moodSummary", "mood_summary"]),
    text: pick(item, ["text", "pairingText", "pairing_text"]),
    reason: pick(item, ["reason", "aiReason", "ai_reason"]),
    brew: pick(item, ["brew", "brewMethod", "brew_method"]),
    raw: item
  };
}

export function adaptCollection(item = {}) {
  return {
    id: pick(item, ["id", "collectionId", "collection_id"]),
    title: pick(item, ["title"]),
    artist: pick(item, ["artist", "artistName", "artist_name"]),
    format: pick(item, ["format"]),
    score: Number(pick(item, ["score", "pairingScore", "pairing_score"], 0)),
    note: pick(item, ["note"]),
    raw: item
  };
}

export function adaptRecommendation(item = {}) {
  return {
    id: pick(item, ["id", "recommendationId", "recommendation_id"]),
    title: pick(item, ["title", "sourceTitle", "source_title"]),
    target: pick(item, ["target", "targetTitle", "target_title"]),
    reason: pick(item, ["reason"]),
    score: Number(pick(item, ["score"], 0)),
    raw: item
  };
}

export function adaptMonthlyReport(payload = {}) {
  const summary = payload.summary || {};
  const favoriteCoffee = payload.favoriteCoffees?.[0];
  const favoriteArtist = payload.favoriteArtists?.[0];
  const mood = payload.moodStats?.[0];

  return {
    summary: summary.latestMoodSummary || summary.latest_mood_summary || "이번 달 기록이 조금 더 쌓이면 무드를 정리해드릴게요.",
    favoriteCoffee: favoriteCoffee?.beanName || favoriteCoffee?.bean_name || "기록 없음",
    favoriteArtist: favoriteArtist?.artistName || favoriteArtist?.artist_name || "기록 없음",
    frequentMood: mood?.moodTags || mood?.mood_tags || "기록 없음",
    stats: [
      { label: "기록한 날", value: `${summary.coffeeDays ?? summary.coffee_days ?? 0}일` },
      { label: "AI 페어링", value: `${summary.pairingCount ?? summary.pairing_count ?? 0}개` },
      { label: "주요 무드", value: mood?.moodTags || mood?.mood_tags || "없음" },
      { label: "평균 점수", value: Math.round(summary.avgPairingScore ?? summary.avg_pairing_score ?? 0) }
    ],
    raw: payload
  };
}
