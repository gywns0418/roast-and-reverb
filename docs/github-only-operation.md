# GitHub Pages 운영 전환 — 2026-11-01

운영 URL: https://gywns0418.github.io/roast-and-reverb/

사용자가 GitHub만 운영하고 Railway는 사용하지 않도록 명시적으로 요청했다. Pages 배포는 main/dev 모두 `VITE_USE_REAL_API=false`를 유지한다. 기존 기록 storage key를 보존하므로 같은 브라우저의 기록을 초기화하지 않는다.

| 기능 | 현재 동작 |
| --- | --- |
| 커피·음악·페어링·컬렉션 | 브라우저 저장, 편집·삭제·백업. 삭제된 커피/음악에 연결된 페어링도 제거 |
| 통계·리포트 | 실제 저장한 기록으로 계산, 예시 인원·사용 이력 제거 |
| 원두 파일·사진·월픽·관심 목록 | 기존 기기 저장과 GitHub 공개 카탈로그 사용 |
| 페어링·취향 추천 | 특성 유사도·직접 남긴 피드백·선택한 기기 내 의미 모델 사용 |
| 자연어 한 줄 정리 | 원문 맛·추출 방법만 추출하는 로컬 규칙, 원두/로스터리 추측 없음 |
| 음악 생성·설정 도우미 | 기기 합성 엔진 및 규칙 제안, OpenAI API 호출 없음 |
| 음악 검색·재생 | MusicBrainz 공개 검색/영상 링크, 선택적 YouTube 재생. 목록은 파일·붙여넣기로 가져오기 |
| 회원가입·인증·자동 동기화 | 제공하지 않음. 가입 없는 기록장과 파일 백업으로 대체 |
| 관리자 회원·API 요청 로그 | 서버 계정/외부 AI 요청 없음. 가짜 사용자/성공 이력 없음 |

GitHub Pages는 정적 호스팅이므로 상시 백엔드·비밀 키 기반 외부 AI·계정 동기화를 제공하지 않는다. GitHub Actions를 API 서버로 사용하지 않는다. 외부 공개 음악/모델/상품 자료는 사용자 요청에 따라 해당 제공자에서 받을 수 있으므로 모든 네트워크 요청이 GitHub만을 향한다는 뜻은 아니다.

## Railway 상태

- 기존 활성 배포 a94b9c58 실행 중단. 서비스 UI `Service is offline` 확인.
- GitHub 소스 repo/branch/commit 연결 해제 3개 변경 적용 완료. 이후 describe-service에서 source 없음, latest deployment none, get-staged-changes 없음 확인.
- 서비스/변수/도메인/200MB coffee-music-diary 볼륨은 데이터 보호를 위해 보존. 볼륨 저장 비용/크레딧 소모 가능성이 남으므로 ‘Railway 리소스 완전 삭제’나 ‘비용 0’으로 표현하지 않는다.
- 기존 서버 자료는 브라우저로 자동 이전하지 않았다. 비밀번호/키/DB 내용을 읽거나 공개 저장소에 넣지 않았다.

## 검증

- 프론트엔드 97개 테스트 통과: 저장 실패 롤백, 손상 자료 보호, 수정 후 재모듈화 복원, 삭제 관계 정리, 실제 통계, 월픽 근거 부족 점수 보류, 로컬 문장 추출 포함.
- Vite 운영 빌드 성공. 백엔드 코드는 변경하지 않았음.
- UI와 Pages 배포 결과는 배포 완료 뒤 continuity에 기록.


### GitHub 전용 운영 게시 확인 — 2026-11-01
- dev PR #68 병합: 0586314fb0ab69546e57934abbf7020cb25c9d7f.
- main PR #69 병합: 9ae4556ce6be3bd0951ef256bfedaafb915ca082. 현재 사용자 요청을 GitHub 운영 전환의 명시적 승인으로 적용.
- 기능 코드 head ad2efbcaf0d72febcd56b033e353027ced7134cf의 Verify 41268597174 성공. main Verify 41268813331 성공(frontend/backend/deployment-image), main Pages 41268813304 성공, dev Pages 41268805813 성공.
- 운영 /#/mypage에서 GitHub Pages·기기 저장·규칙 도우미 안내 확인. 공개 카탈로그 2026-11 비로소커피 56종 확인.
- 로컬 브라우저 QA: 문장 맛/방법 추출→저장→새로고침 후 유지, 음악 설정 65 BPM/여운85% 제안→1:02 연주/WAV 생성, 전체 기기 백업 다운로드 확인. 개인 백업과 QA 자료는 공개 저장소에 올리지 않음.
- npm audit --omit=dev --audit-level=high: 0 vulnerabilities. security-source-check 통과(전체 비밀정보 감사라는 의미는 아님). 프론트 97 tests 성공.
- Railway는 실행 중단, 소스 연결 없음, 최신 배포 없음, 보류 변경 없음. 기존 200MB 볼륨 보존. 원본 계정 자료 자동 이전/삭제 없음. 저장소 보관 비용 가능성은 남음.
- 증거 화면은 격리 worktree .local/github-only-production.png 및 .local/railway-stopped.png. 기존 다른 버전 checkout의 미커밋 변경은 그대로 보존.
