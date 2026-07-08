# API 설계

## 회원

- POST /api/auth/join
- POST /api/auth/login
- POST /api/auth/logout
- GET /api/members/me
- PUT /api/members/me

## 커피 로그

- GET /api/coffee-logs
- POST /api/coffee-logs
- GET /api/coffee-logs/{id}
- PUT /api/coffee-logs/{id}
- DELETE /api/coffee-logs/{id}
- GET /api/coffee-logs/calendar
- GET /api/coffee-logs/statistics

## 음악 로그

- GET /api/music-logs
- POST /api/music-logs
- GET /api/music-logs/{id}
- PUT /api/music-logs/{id}
- DELETE /api/music-logs/{id}
- GET /api/music/search/lastfm
- GET /api/music/search/discogs

## AI 페어링

- GET /api/pairings
- POST /api/pairings
- GET /api/pairings/{id}
- DELETE /api/pairings/{id}
- POST /api/pairings/analyze
- POST /api/pairings/parse-natural-log
