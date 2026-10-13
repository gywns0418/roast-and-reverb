# 도구·연구 근거·사용자 도움이 필요한 부분

확인일: 2026-10-13. 외부 서비스 요금·정책·플러그인 상태는 사용할 때 다시 확인한다.

## 현재 도구와 추가 설치 판단

| 도구 | 확인한 상태 | 역할 / 필요한 행동 |
| --- | --- | --- |
| Git/GitHub API | 기존 Git 인증으로 저장소 읽기·쓰기 가능 | 커밋·PR·Pages에는 추가 설치 불필요. 별도 GitHub 커넥터의 연결 상태와 구분 |
| Railway 플러그인 | 현재 workspace 조회와 프로젝트 준비 성공 | Spring 서버 호스팅 후보. 실제 운영 전에 계정 요금/크레딧과 허용 비용 범위 확인 |
| 브라우저 도구 | 기존 도구 사용 가능 | 화면·모바일·실제 입력 검증. 추가 브라우저 자동화 스킬 설치 불필요 |
| PyYAML | 스킬 검증용 임시 폴더에만 설치 | 서버/서비스 사용에 필수인 패키지가 아님 |
| skill-creator | 기본 제공 스킬 사용 | 프로젝트 전용 `roast-reverb-continuity` 스킬 생성 |
| 외부 '디자인/커피/풀스택' 스킬 묶음 | 설치하지 않음 | 현재 작업에 필수 아님. 임의 스킬을 대량 다운로드하지 않음 |

새 스킬은 `.agents/skills/roast-reverb-continuity/SKILL.md`에 있다. 저장소와 함께 유지되며, 이 프로젝트 작업에서 현재 맥락·원본 커피 규칙·변경 이력을 읽도록 안내한다. [Codex 스킬 공식 문서](https://learn.chatgpt.com/docs/build-skills)는 저장소의 `.agents/skills` 위치를 안내한다. 다른 체크아웃에는 해당 브랜치의 파일이 있어야 발견된다.

## Railway 준비 상태와 비용

[프로젝트 열기](https://railway.com/project/5b3ed910-315b-42fa-bdfc-f1531a692c75)

현재 서비스·200MB `/data` 볼륨·운영 환경변수·GitHub 소스를 배포 전 대기 변경으로 준비했다. 대기 변경은 11개이고, 초기 코드 커밋 `bf19b6a`에 소스를 고정했다. 신규 소스 커밋으로 갱신할 때 실제 검증된 SHA를 사용한다. 실제 실행 인스턴스나 공개 운영 URL이 확인되기 전에는 운영 완료로 기록하지 않는다. 컨테이너 한 개에 프론트와 API를 함께 넣어 별도 프론트 서버 비용과 CORS 설정을 줄이는 구성을 적용했다.

- `railway.json`: Docker 빌드, `/healthz`, 필수 `/data`, replica 1, CPU 1, RAM 500MB, 유휴 정지, 제한된 재시작.
- JWT 키는 Railway 환경변수에만 준비. AI/음악 API 키는 미설정.
- 최초 서비스가 대기 상태일 때 설정 API가 인스턴스를 찾지 못했으므로, 동등한 배포 설정을 공식 JSON 스키마가 지원하는 `railway.json`에 선언했다.
- **CPU/RAM 제한과 유휴 정지는 월 비용 상한이 아니다.** 과금/크레딧 조건은 계정에서 별도로 확인해야 한다.
- 공식 문서 확인 시 Free는 월 $1 크레딧, Hobby는 월 $5 기본 요금에 사용량 과금 조건이 있다. 무료로 Spring 서버를 무기한 운영할 수 있다고 보장하지 않는다. [공식 요금](https://docs.railway.com/pricing/plans), [비용 제어](https://docs.railway.com/pricing/cost-control)
- 실제 배포 시 사용자가 허용하는 비용 범위를 확인하고 대기 변경을 적용한다. 유료 업그레이드나 결제 동의는 대신 수행하지 않는다.

공식 구성 근거: [Spring Boot 배포](https://docs.railway.com/guides/spring-boot), [Config as Code](https://docs.railway.com/config-as-code), [JSON 스키마](https://railway.com/railway.schema.json).

## 사용자 도움이 필요한 항목

1. 서버 실행 비용을 무료/체험 크레딧 안으로 제한할지, 유료 예산을 허용할지 결정. 실제 계정의 크레딧·플랜도 확인해야 한다.
2. 실제 AI를 사용하려면 `CLAUDE_API_KEY`를 Railway 서비스 환경변수에 추가. 키를 MD·Git·프론트 번들에 넣지 않는다. 키가 없어도 직접 커피·음악 기록은 가능하다.
3. 외부 음악 검색에는 `LASTFM_API_KEY`, 선택적으로 `DISCOGS_TOKEN` 설정. 현재 검색 화면은 내 기록 검색이다.
4. 원본에서 누락된 실제 추출량·시간·드리퍼와 실제로 들은 곡은 사용자의 확인이 필요하다. 57개 기록을 가져올 수 있다는 사실만으로 누락 측정값을 채울 수는 없다.

## 확인한 연구 / 코드에 반영한 판단

### 커피

- Batali, Ristenpart, Guinard (2020), *Brew temperature, at fixed brew strength and extraction, has little impact on the sensory profile of drip brew coffee*. [원문 DOI](https://doi.org/10.1038/s41598-020-73341-4), [연구자 저장소 PDF](https://pages.uoregon.edu/chendon/coffee_literature/old_literature/2020%20Sci.%20Rep.%2C%20Brew%20Control%20UC%20Davis.pdf)
  - TDS와 추출 수율을 맞춘 87/90/93℃ 조건의 결과다. 모든 온도·모든 원두·가정용 레시피로 일반화하지 않는다.
  - 적용: 온도만으로 결과를 설명하지 않고 물량·추출 시간·실제 추출량과 관찰을 함께 기록한다. 측정하지 않은 TDS나 수율은 계산하지 않는다.
- [World Coffee Research Sensory Lexicon](https://worldcoffeeresearch.org/read-more/news/174-world-coffee-research-sensory-lexicon)
  - 향·맛·질감을 구체적으로 구분하는 참고 자료다. 사용자 비유를 실제 성분이나 객관적 평가로 바꾸지 않는다.
  - 적용: 향미·후미·식으면서 변화와 원문 감각 표현을 보존한다. 렉시콘 PDF/그림 전체나 유료 플레이버 휠을 복제하지 않는다.
- 개인 기록 템플릿의 온도별 쓴맛 원인·리텐션 정상범위 등은 검증된 보편 법칙으로 채택하지 않았다. 측정값과 조건을 먼저 보존한다.

### 음악

- [Last.fm track.search](https://www.last.fm/api/show/track.search): 곡·아티스트 메타데이터 검색용이며 API 키가 필요하다. 음악 재생 권한을 제공한다고 간주하지 않는다.
- [Last.fm 이용 안내](https://www.last.fm/api): 상업/연구 이용은 별도 연락 안내가 있다. 실제 상업 운영으로 전환할 때 정책을 확인한다.
- 적용: 원본 커피 기록에는 곡이 없으므로 가져오기 과정에서 음악을 생성하지 않는다. 커피 상세에서 **내 음악과 연결하기**로 사용자가 실제 기록을 선택한다.

### 디자인과 연속 작업

- [GDWEB](https://www.gdweb.co.kr/sub/search.asp), [Awwwards](https://www.awwwards.com/websites/): 구도·여백·타이포그래피 참고. 실제 디자인 기준은 이 저장소의 `docs/design-guide.md`다.
- [Codex 스킬](https://learn.chatgpt.com/docs/build-skills), [스킬과 플러그인의 역할](https://developers.openai.com/plugins/concepts/skills): 프로젝트 맥락은 짧은 스킬과 필요한 MD 참조로 유지한다. 스킬은 호스팅 계정이나 API 키를 대신 제공하지 않는다.
