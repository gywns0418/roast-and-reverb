export const coffeeLogs = [
  {
    id: 1,
    date: "2026.07.09",
    bean: "에티오피아 예가체프",
    roastery: "Fritz",
    origin: "Gedeo, Ethiopia",
    process: "Washed",
    roast: "Light",
    brew: "핸드드립",
    acidity: 5,
    sweetness: 4,
    bitterness: 1,
    body: 3,
    aroma: 5,
    memo: "재스민 향, 레몬 같은 산미, 맑은 여운"
  },
  {
    id: 2,
    date: "2026.07.08",
    bean: "케냐 AA",
    roastery: "Mesh",
    origin: "Nyeri, Kenya",
    process: "Washed",
    roast: "Medium",
    brew: "에어로프레스",
    acidity: 4,
    sweetness: 3,
    bitterness: 2,
    body: 4,
    aroma: 4,
    memo: "검붉은 과일, 단단한 바디, 선명한 산미"
  },
  {
    id: 3,
    date: "2026.07.07",
    bean: "과테말라 안티구아",
    roastery: "센터커피",
    origin: "Antigua, Guatemala",
    process: "Natural",
    roast: "Dark",
    brew: "프렌치프레스",
    acidity: 2,
    sweetness: 4,
    bitterness: 4,
    body: 5,
    aroma: 3,
    memo: "카카오, 묵직함, 긴 밤에 어울리는 농도"
  }
];

export const musicLogs = [
  {
    id: 1,
    date: "2026.07.09",
    track: "Svefn-g-englar",
    artist: "Sigur Ros",
    album: "Agaetis byrjun",
    genre: "Post-rock",
    source: "Last.fm",
    tags: ["몽환적", "차분함", "공기감"],
    memo: "느리게 번지는 기타와 보컬 질감"
  },
  {
    id: 2,
    date: "2026.07.08",
    track: "Avril 14th",
    artist: "Aphex Twin",
    album: "Drukqs",
    genre: "Ambient",
    source: "MusicBrainz",
    tags: ["섬세함", "고요함", "피아노"],
    memo: "짧고 맑은 피아노 스케치"
  },
  {
    id: 3,
    date: "2026.07.07",
    track: "Blue in Green",
    artist: "Miles Davis",
    album: "Kind of Blue",
    genre: "Jazz",
    source: "Discogs",
    tags: ["짙은", "밤", "여운"],
    memo: "느슨하고 깊은 밤의 트럼펫"
  }
];

export const pairings = [
  {
    id: 1,
    date: "2026.07.09",
    coffee: "에티오피아 예가체프",
    music: "Svefn-g-englar",
    artist: "Sigur Ros",
    score: 92,
    tags: ["플로럴", "몽환적", "차분함"],
    mood: "맑지만 축축한 오후",
    text: "밝은 산미와 넓게 번지는 사운드가 만나 맑지만 축축한 오후 같은 분위기를 만듭니다. 플로럴한 향은 음악의 공기감과 잘 맞고, 진하게 내린 농도가 감정선을 깊게 잡아줍니다."
  },
  {
    id: 2,
    date: "2026.07.08",
    coffee: "케냐 AA",
    music: "Avril 14th",
    artist: "Aphex Twin",
    score: 86,
    tags: ["선명함", "고요함", "섬세함"],
    mood: "유리잔처럼 맑은 오전",
    text: "검붉은 과일 같은 산미와 짧은 피아노 선율이 만나 또렷하지만 조용한 감각을 만듭니다."
  }
];

export const monthlyReport = {
  summary: "이번 달에는 밝은 산미의 커피와 몽환적인 음악을 함께 기록한 날이 많았습니다.",
  favoriteCoffee: "에티오피아 예가체프",
  favoriteArtist: "Sigur Ros",
  frequentMood: "몽환적",
  stats: [
    { label: "기록한 날", value: "18일" },
    { label: "AI 페어링", value: "12개" },
    { label: "주요 무드", value: "몽환적" },
    { label: "평균 점수", value: "88" }
  ]
};

export const recommendations = [
  {
    id: 1,
    title: "예가체프와 함께 들을 음악",
    target: "Sigur Ros - Olsen Olsen",
    reason: "플로럴한 산미와 넓게 퍼지는 사운드가 같은 방향의 공기감을 만듭니다."
  },
  {
    id: 2,
    title: "Blue in Green과 어울리는 커피",
    target: "과테말라 안티구아 프렌치프레스",
    reason: "묵직한 바디와 재즈의 늦은 밤 무드가 차분하게 겹칩니다."
  }
];

export const collections = [
  { id: 1, title: "Kind of Blue", artist: "Miles Davis", format: "LP", score: 84, note: "밤 시간대 페어링에 자주 등장" },
  { id: 2, title: "Agaetis byrjun", artist: "Sigur Ros", format: "CD", score: 92, note: "플로럴 계열 커피와 잘 맞음" },
  { id: 3, title: "Drukqs", artist: "Aphex Twin", format: "LP", score: 86, note: "섬세한 산미 기록과 연결" }
];
