# 추천 음악 외부 연결

공개 Pages의 기기 모드에서 MusicBrainz 곡 검색과 YouTube 단일 영상 공개 정보 조회를 지원한다. 별도 서버·OpenAI 키·YouTube Data API 키 없이 사용할 수 있다. 결과 미리보기에서 직접 추가한 곡만 기기 후보에 저장하고 기존 추천·청음실 후보에 연결한다. 청취 일지는 자동 생성하지 않는다.

- MusicBrainz: 공식 `/ws/2/recording/` JSON 검색, 최대 12개 결과. 검색어만 전송한다. 키 없는 공개 메타데이터 API이고 실제 음원은 제공하지 않는다. 아티스트·곡명·원문 링크를 보존하고 장르가 없으면 미기록이다.
- YouTube: 공식 `/oembed`로 입력한 단일 영상의 제목과 채널만 조회한다. 채널은 아티스트로 추정하지 않는다. 음악 카테고리·실제 곡명·장르·보컬 여부는 미확인이다. 반환 HTML/iframe은 실행하거나 삽입하지 않는다. 영상 재생은 사용자가 링크를 연 뒤 직접 한다.
- 재생목록 파라미터가 붙은 watch 링크는 선택한 영상으로 처리한다. 전체 목록을 가져오려면 `/playlist?list=...` 링크를 사용한다.
- YouTube 전체 검색·공개 재생목록 항목 조회는 기존 인증 서버와 `YOUTUBE_API_KEY`가 있어야 한다. 키가 없을 때 전체 검색은 비활성화하고, 목록 조회는 명확한 오류를 보여준다. OpenAI 키로 대체하지 않는다.

MusicBrainz 요청은 직렬화하고 요청 전 1.1초 간격을 둔다. Web Locks 지원 브라우저에서는 같은 출처의 탭들이 하나의 잠금을 공유한다. 잠금 미지원 환경은 탭 내부에서만 제한된다. 브라우저 직접 연결은 기본 브라우저 User-Agent를 사용하며 기존 서버 연결 모드는 앱 식별 User-Agent를 사용한다. 대규모 운영이나 공유 IP에서는 중앙 서버의 전역 제한을 사용해야 한다. 같은 입력은 메모리에서 최대 5분/40개 캐시하고 실패는 캐시하지 않는다. 15초 timeout, 2MB 응답 제한, 입력·출력 검증, 중복 요청 방지·화면 종료 후 결과 무시를 적용했다. 자동 재시도·외부 계정 연결·개인 파일 전송은 없다.

2026-10-15 실제 확인: MusicBrainz 첫 요청은 일시적 503을 정확히 표시했다. 별도 일반 검색은 성공해 12개 결과를 표시했고 Norah Jones / Come Away With Me를 직접 추가했다. YouTube 공개 Lofi Girl 영상 제목·채널 조회 성공, 후보 추가·새로고침 보존·기준 음악과 기본 추천에 반영 확인. 390×844에서 문서 clientWidth/scrollWidth 모두 375였다. 프론트55개 테스트와 build 통과. Railway는 기존 보류된 변경 11개만 있으며 live 서버가 없음을 읽기 확인했고 배포/새 서비스/결제 변경은 하지 않았다.

근거: [MusicBrainz API](https://musicbrainz.org/doc/MusicBrainz_API), [oEmbed 공식 제공자 목록](https://oembed.com/providers.json), [YouTube Data API 인증 안내](https://developers.google.com/youtube/registering_an_application).
