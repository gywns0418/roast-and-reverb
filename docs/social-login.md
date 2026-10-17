# Google 로그인 운영 준비 (2026-10-17)

구현: Google Identity Services의 공식 버튼 → 서버가 발급한 5분 단회 nonce → Google 공개키로 RS256 서명·issuer·audience·만료·이메일 인증·nonce 검증 → 기존 서비스 JWT. Google API 접근/refresh token은 요청·저장하지 않는다. 계정 구분은 Google subject를 사용하며 이메일이 같은 기존 기록장에 자동 연결하지 않는다. 기존 회원은 이메일 로그인 후 마이페이지에서 인증된 본인 기록장에 연결한다. 운영 DB는 추가 social_identity 테이블만 생성하며 기존 기록을 보존한다.

등록 전에는 버튼과 외부 Google 스크립트를 노출/로드하지 않는다. 활성화는 운영자가 콘솔 설정을 확인한 뒤 서버 GOOGLE_CLIENT_ID에 공개 웹 클라이언트 ID를 넣으면 된다. client secret은 이 방식에서 사용하지 않는다. GOOGLE_CLIENT_ID는 비밀키가 아니다. APP_PUBLIC_ORIGIN은 기본 운영 Railway origin이며 도메인을 바꾸면 함께 변경한다. 로그인 challenge/complete는 해당 Origin과 커스텀 헤더를 요구하고 HttpOnly/Secure/SameSite=Lax 임시 세션을 사용한다. 단일 인스턴스 인메모리 세션이므로 배포 중 인증은 다시 시작할 수 있다. JWT/Google credential은 URL에 넣지 않는다.

## 운영 전 등록

1. Google Cloud 프로젝트의 Google Auth Platform에서 External 앱으로 등록. 실제 서비스명, 지원 이메일, 운영자 연락처 지정.
2. 웹 애플리케이션 OAuth client 생성. Authorized JavaScript origins에 `https://roast-and-reverb-production.up.railway.app` 등록. 팝업 GIS 방식이므로 redirect callback URI는 사용하지 않는다.
3. 로그인에는 openid/email/profile 기본 정보만 사용. Drive, Gmail 등 권한은 요청하지 않는다.
4. 실제 개인정보 처리방침·약관·지원 연락처·삭제 방법을 공개하고 앱과 일치시킨다. 브랜드 검증에는 소유권 확인 가능한 도메인 등이 필요하므로 Railway 제공 하위 도메인으로 브랜드 검증 가능하다고 단정하지 않는다. 도메인과 운영자 정보의 실제 등록 전에는 승인 완료로 표시하지 않는다.
5. Publishing status를 Production으로 전환하고 필요한 브랜드 검증을 신청. 운영 GOOGLE_CLIENT_ID 설정 후 실제 계정으로 신규 로그인·기존 기록장 연결·재로그인을 확인. 개인정보/약관의 사업자 정보는 추측해서 작성하지 않는다.

## 공식 확인

- [Google 앱 상태](https://developers.google.com/identity/protocols/oauth2/production-readiness/overview): External Testing 일반 한도는100명이나 openid/email/profile만 요청하면 allowlist 예외. Published 민감/제한 scope 미검증 앱의100명 한도와 기본 로그인은 구분해야 한다. 개인용 서비스라는 이유만으로 운영 불가한 것은 아니다.
- [브랜드 검증](https://developers.google.com/identity/protocols/oauth2/production-readiness/brand-verification): 운영 도메인 소유, 공개 서비스/정책 페이지 등 브랜드 요건 확인 필요. 최종 승인은 Google 판단.
- [서버 검증](https://developers.google.com/identity/gsi/web/guides/verify-google-id-token), [JS nonce/공식 버튼](https://developers.google.com/identity/gsi/web/reference/js-reference).
- [카카오 앱 종류](https://developers.kakao.com/docs/ko/app-setting/app): 테스트 앱은 멤버 전용이고 운영에는 원본 앱 키를 사용. 사업자번호가 없는 개인 개발자도 본인인증·약관 동의 후 개인 개발자 비즈 앱 전환 가능.
- [카카오 동의항목](https://developers.kakao.com/docs/ko/kakaologin/utilize): 닉네임 기본 제공, 이메일은 비즈/테스트 앱 권한. 카카오싱크·친구·메시지 검수와 기본 로그인을 혼동하지 않는다. 이번 구현은 Google을 우선하며 카카오 버튼은 만들지 않았다.

현재 확인: Railway 변수명에 GOOGLE_CLIENT_ID 없음. Google Cloud 사용자 로그인은 확인했으나 OAuth 개요·클라이언트 화면에 로드 오류가 반복됨. 콘솔 등록/브랜드 검증은 아직 미확인이며 실제 Google 인증 성공을 주장하지 않는다.
