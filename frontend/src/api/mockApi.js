const today = "2026-07-11";

let coffeeSeq = 4;
let musicSeq = 4;
let pairingSeq = 3;
let collectionSeq = 4;

const coffeeLogs = [
  {
    coffeeLogId: 1,
    memberId: 1,
    beanName: "에티오피아 게데오 첼베사",
    roastery: "Fritz",
    originCountry: "Ethiopia",
    region: "Gedeo",
    process: "Washed",
    roastLevel: "Light",
    brewMethod: "Hand drip",
    tasteNote: "자스민, 레몬, 맑은 산미",
    acidity: 5,
    sweetness: 4,
    bitterness: 1,
    body: 3,
    aroma: 5,
    memo: "밝은 산미와 긴 여운이 남는 컵",
    drinkDate: "2026-07-09"
  },
  {
    coffeeLogId: 2,
    memberId: 1,
    beanName: "케냐 AA 니에리",
    roastery: "Mesh",
    originCountry: "Kenya",
    region: "Nyeri",
    process: "Washed",
    roastLevel: "Medium",
    brewMethod: "Aeropress",
    tasteNote: "검붉은 과일, 단단한 바디",
    acidity: 4,
    sweetness: 3,
    bitterness: 2,
    body: 4,
    aroma: 4,
    memo: "선명한 산미와 밀도감",
    drinkDate: "2026-07-08"
  }
];

const musicLogs = [
  {
    musicLogId: 1,
    memberId: 1,
    trackName: "Svefn-g-englar",
    artistName: "Sigur Ros",
    albumName: "Agaetis byrjun",
    genre: "Post-rock",
    tags: "몽환적, 차분함, 공간감",
    memo: "느리게 번지는 기타와 보컬 질감",
    listenedDate: "2026-07-09"
  },
  {
    musicLogId: 2,
    memberId: 1,
    trackName: "Avril 14th",
    artistName: "Aphex Twin",
    albumName: "Drukqs",
    genre: "Ambient",
    tags: "섬세함, 고요함, 피아노",
    memo: "짧고 맑은 피아노 스케치",
    listenedDate: "2026-07-08"
  }
];

const pairings = [
  {
    pairingId: 1,
    memberId: 1,
    coffeeLogId: 1,
    musicLogId: 1,
    moodSummary: "맑지만 깊게 가라앉는 오후",
    moodTags: "플로럴, 몽환적, 차분함",
    pairingScore: 92,
    pairingText: "밝은 산미와 넓게 번지는 사운드가 만나 조용한 여운을 만듭니다.",
    aiReason: "커피의 플로럴한 향과 음악의 공간감이 같은 방향으로 이어집니다.",
    createdAt: "2026-07-09T12:00:00"
  },
  {
    pairingId: 2,
    memberId: 1,
    coffeeLogId: 2,
    musicLogId: 2,
    moodSummary: "선명하지만 조용한 집중",
    moodTags: "선명함, 고요함, 섬세함",
    pairingScore: 86,
    pairingText: "검붉은 과일 같은 산미와 짧은 피아노 울림이 차분하게 겹칩니다.",
    aiReason: "커피의 밀도와 음악의 간결함이 서로를 흐리지 않습니다.",
    createdAt: "2026-07-08T12:00:00"
  }
];

const collections = [
  { collectionId: 1, title: "Kind of Blue", artistName: "Miles Davis", format: "LP", pairingScore: 84, note: "밤 시간 페어링에 자주 등장" },
  { collectionId: 2, title: "Agaetis byrjun", artistName: "Sigur Ros", format: "CD", pairingScore: 92, note: "플로럴 계열 커피와 잘 맞음" },
  { collectionId: 3, title: "Drukqs", artistName: "Aphex Twin", format: "LP", pairingScore: 86, note: "섬세한 산미 기록과 연결" }
];

const recommendations = [
  {
    recommendationId: 1,
    title: "게데오 첼베사와 함께 들을 음악",
    targetTitle: "Sigur Ros - Olsen Olsen",
    reason: "밝은 산미와 넓은 공간감이 같은 결로 이어집니다.",
    score: 91
  },
  {
    recommendationId: 2,
    title: "Blue in Green과 어울리는 커피",
    targetTitle: "과테말라 안티구아 프렌치프레스",
    reason: "묵직한 바디와 재즈의 밤 무드가 차분하게 겹칩니다.",
    score: 84
  }
];

function bodyOf(options = {}) {
  if (!options.body) return {};
  try {
    return JSON.parse(options.body);
  } catch {
    return {};
  }
}

function pathOnly(path) {
  return path.split("?")[0];
}

function findCoffee(id) {
  return coffeeLogs.find((item) => String(item.coffeeLogId) === String(id)) || coffeeLogs[0];
}

function findMusic(id) {
  return musicLogs.find((item) => String(item.musicLogId) === String(id)) || musicLogs[0];
}

function enrichPairing(pairing) {
  const coffee = findCoffee(pairing.coffeeLogId);
  const music = findMusic(pairing.musicLogId);
  return {
    ...pairing,
    beanName: coffee.beanName,
    brewMethod: coffee.brewMethod,
    drinkDate: coffee.drinkDate,
    trackName: music.trackName,
    artistName: music.artistName,
    albumName: music.albumName,
    listenedDate: music.listenedDate
  };
}

function createCoffee(payload) {
  const item = {
    coffeeLogId: coffeeSeq++,
    memberId: 1,
    beanName: payload.beanName || "오늘의 커피",
    roastery: payload.roastery || "Roast & Reverb",
    originCountry: payload.originCountry || "",
    region: payload.region || "",
    process: payload.process || "",
    roastLevel: payload.roastLevel || "Medium",
    brewMethod: payload.brewMethod || "Hand drip",
    tasteNote: payload.tasteNote || payload.memo || "",
    acidity: Number(payload.acidity ?? 3),
    sweetness: Number(payload.sweetness ?? 3),
    bitterness: Number(payload.bitterness ?? 2),
    body: Number(payload.body ?? 3),
    aroma: Number(payload.aroma ?? 3),
    memo: payload.memo || payload.tasteNote || "",
    drinkDate: payload.drinkDate || today
  };
  coffeeLogs.unshift(item);
  return item;
}

function createMusic(payload) {
  const item = {
    musicLogId: musicSeq++,
    memberId: 1,
    trackName: payload.trackName || "Untitled Track",
    artistName: payload.artistName || "Unknown Artist",
    albumName: payload.albumName || "",
    genre: payload.genre || "Ambient",
    tags: payload.tags || "차분함, 기록",
    memo: payload.memo || "",
    listenedDate: payload.listenedDate || today
  };
  musicLogs.unshift(item);
  return item;
}

function createCollection(payload) {
  const item = {
    collectionId: collectionSeq++,
    title: payload.title || "Untitled",
    artistName: payload.artistName || payload.artist || "Unknown Artist",
    format: payload.format || "LP",
    pairingScore: Number(payload.pairingScore ?? payload.score ?? 0),
    note: payload.note || ""
  };
  collections.unshift(item);
  return item;
}

function createPairing(payload) {
  const item = {
    pairingId: pairingSeq++,
    memberId: 1,
    coffeeLogId: payload.coffeeLogId || coffeeLogs[0].coffeeLogId,
    musicLogId: payload.musicLogId || musicLogs[0].musicLogId,
    moodSummary: payload.moodSummary || "조용히 이어지는 페어링",
    moodTags: payload.moodTags || "차분함, 균형감",
    pairingScore: Number(payload.pairingScore ?? 88),
    pairingText: payload.pairingText || "커피의 질감과 음악의 무드가 자연스럽게 이어집니다.",
    aiReason: payload.aiReason || "예시 데이터 기반 AI 분석입니다.",
    createdAt: new Date().toISOString()
  };
  pairings.unshift(item);
  return enrichPairing(item);
}

export async function mockRequest(path, options = {}) {
  const method = (options.method || "GET").toUpperCase();
  const route = pathOnly(path);
  const payload = bodyOf(options);

  await new Promise((resolve) => setTimeout(resolve, 120));

  if (route === "/auth/login" || route === "/auth/join" || route === "/members/me") {
    return { memberId: 1, email: payload.email || "demo@roastreverb.local", nickname: payload.nickname || "slow brew", role: "ADMIN" };
  }
  if (route === "/auth/logout") return { ok: true };

  if (route === "/coffee" && method === "GET") return coffeeLogs;
  if (route === "/coffee" && method === "POST") return createCoffee(payload);
  if (route.startsWith("/coffee/") && route !== "/coffee/calendar" && route !== "/coffee/statistics") {
    const id = route.split("/")[2];
    if (method === "PUT") return { updated: true, ...findCoffee(id), ...payload, coffeeLogId: Number(id) };
    if (method === "DELETE") return { deleted: true };
    return findCoffee(id);
  }
  if (route === "/coffee/calendar") return coffeeLogs.map((item) => ({ drinkDate: item.drinkDate, logCount: 1 }));
  if (route === "/coffee/statistics") return { totalCount: coffeeLogs.length, avgAcidity: 4, avgSweetness: 3.5, avgBitterness: 1.5, avgBody: 3.5, avgAroma: 4 };

  if (route === "/music" && method === "GET") return musicLogs;
  if (route === "/music" && method === "POST") return createMusic(payload);
  if (route.startsWith("/music/") && route !== "/music/tags/recent") {
    const id = route.split("/")[2];
    if (method === "PUT") return { updated: true, ...findMusic(id), ...payload, musicLogId: Number(id) };
    if (method === "DELETE") return { deleted: true };
    return findMusic(id);
  }
  if (route === "/music/tags/recent") return [{ tags: "몽환적, 차분함", usageCount: 3 }, { tags: "고요함, 피아노", usageCount: 2 }];

  if (route === "/pairing" && method === "GET") return pairings.map(enrichPairing);
  if (route === "/pairing" && method === "POST") return createPairing(payload);
  if (route === "/pairing/latest") return enrichPairing(pairings[0]);
  if (route === "/pairing/recent-crate") {
    return [
      ...coffeeLogs.map((item) => ({ itemType: "coffee", itemId: item.coffeeLogId, recordedDate: item.drinkDate, title: item.beanName, description: item.memo, catalogNo: `no. ${String(item.coffeeLogId).padStart(3, "0")}` })),
      ...musicLogs.map((item) => ({ itemType: "music", itemId: item.musicLogId, recordedDate: item.listenedDate, title: `${item.artistName} - ${item.trackName}`, description: item.memo, catalogNo: `no. ${String(item.musicLogId).padStart(3, "0")}` }))
    ];
  }
  if (route === "/pairing/analyze") {
    return {
      moodSummary: "밝은 산미와 넓은 잔향",
      moodTags: "플로럴, 몽환적, 차분함",
      pairingScore: 90,
      pairingText: "커피의 산미와 음악의 잔향이 같은 속도로 퍼집니다.",
      aiReason: "예시 Claude 분석 응답입니다."
    };
  }
  if (route === "/pairing/parse-natural-log") {
    return {
      coffee: { beanName: "에티오피아 게데오 첼베사", brewMethod: "Hand drip", roastLevel: "Light", tasteNote: "플로럴, 밝은 산미", memo: "플로럴, 밝은 산미" },
      music: { trackName: "Svefn-g-englar", artistName: "Sigur Ros", genre: "Post-rock", tags: "몽환적, 차분함", memo: "몽환적, 차분함" }
    };
  }
  if (route.startsWith("/pairing/")) {
    const id = route.split("/")[2];
    if (method === "DELETE") return { deleted: true };
    return enrichPairing(pairings.find((item) => String(item.pairingId) === String(id)) || pairings[0]);
  }

  if ((route === "/collection" || route === "/collections") && method === "POST") return createCollection(payload);
  if (route === "/collection" || route === "/collections") return collections;
  if (route === "/recommend" || route === "/recommendations") return recommendations;

  if (route === "/report/monthly") {
    return {
      summary: { latestMoodSummary: "이번 달은 밝은 산미의 커피와 몽환적인 음악이 자주 만났습니다.", coffeeDays: 18, pairingCount: 12, avgPairingScore: 88 },
      favoriteCoffees: [{ beanName: "에티오피아 게데오 첼베사" }],
      favoriteArtists: [{ artistName: "Sigur Ros" }],
      moodStats: [{ moodTags: "몽환적" }]
    };
  }
  if (route === "/report") return [];

  if (route === "/admin/dashboard") return { memberCount: 128, coffeeLogCount: 1842, musicLogCount: 1536, pairingCount: 923, apiErrorCount: 0 };
  if (route === "/admin/members") return [
    { memberId: 1, email: "slow@example.com", nickname: "slow brew", role: "ADMIN", status: "ACTIVE", updatedAt: "2026-07-09" },
    { memberId: 2, email: "night@example.com", nickname: "night cup", role: "USER", status: "ACTIVE", updatedAt: "2026-07-08" }
  ];
  if (route === "/admin/api-logs") return [
    { apiLogId: 1, provider: "Claude", endpoint: "PAIRING_ANALYSIS", requestSummary: "PAIRING_ANALYSIS", success: true, createdAt: "2026-07-09" },
    { apiLogId: 2, provider: "Claude", endpoint: "NATURAL_LOG_PARSE", requestSummary: "NATURAL_LOG_PARSE", success: true, createdAt: "2026-07-08" }
  ];
  if (route === "/admin/statistics/daily") return [
    { statDate: "2026-07-09", coffeeCount: 2, musicCount: 2, pairingCount: 1 },
    { statDate: "2026-07-08", coffeeCount: 1, musicCount: 1, pairingCount: 1 }
  ];

  return {};
}
