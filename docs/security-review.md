# Security verification record — 2026-10-17

Scope: existing Roast & Reverb. Only the authorized production origin receives low-volume GET/OPTIONS probes; accounts, records and provider settings are not changed there. Write/attack scenarios run in isolated databases and containers. This is an engineering security review, not a certification or an independent penetration test.

The sequence follows [OWASP WSTG](https://wstg.owasp.org/stable/4-Web_Application_Security_Testing/): map the application and trust boundaries, inspect source and dependencies, test authentication/authorization/session controls, scan an isolated deployment, retest fixes, then check production configuration. [ZAP baseline](https://www.zaproxy.org/docs/docker/baseline-scan/) is passive; its unauthenticated crawler does not replace two-account API tests or authenticated browser testing.

## Findings and changes

- Disclosure controls: give the arrow its own column, 12px gap and 48px touch target; preserve native keyboard toggle and visible focus.
- Password change accepted a new password without checking the current one. Require reauthentication and increment an account authentication version so earlier tokens stop working.
- Logout previously cleared the browser but left the bearer token valid. Revoke a SHA-256 token fingerprint in persistent storage, expire old entries, and call the endpoint from visible logout controls. If offline, the browser can still clear local login; server revocation cannot be promised until reachable.
- Collection links accepted another member's pairing ID. Verify ownership for create/update and constrain the join as defense in depth.
- Add bounded single-instance authentication rate limits and input length checks before password hashing. This is not a distributed anti-abuse system or a replacement for an edge service.
- Add CSP, Referrer-Policy, Permissions-Policy and Google-compatible opener policy. Production CORS permits the configured service origin, not local development sites. Existing HSTS, frame denial and nosniff remain enabled.
- Spring Boot 3.4.1 is outside OSS support. Upgrade to supported 4.1.1 with compatible MyBatis 4.0 and the official Jackson 2 compatibility module. Test existing H2 records/sessions across the upgrade before release.

## Evidence gates

| Stage | Implementation / evidence |
| --- | --- |
| UX | Desktop/mobile browser walkthrough; arrow gap, toggle/focus, forms, navigation and overflow checks |
| Frontend | Unit tests/build, React output escaping and URL validation tests, npm dependency audit |
| Source | Manual mapper/auth/SSRF/secret handling review; tracked-source known-credential pattern check (never prints credentials) |
| API | Existing tests plus SecurityAuditTest: two-user records, foreign reference, injection string, current password, token tampering/revocation, CORS and headers |
| Lifecycle | Production profile with isolated H2: pre-upgrade record and bearer token, new-version startup, retrieval, protected OAuth cookie, logout, restart and token rejection |
| Runtime dependencies | Trivy runtime image: reports HIGH/CRITICAL and gates fixable findings; unfixed/other severities require separate review |
| DAST | ZAP passive baseline on isolated container; warnings require review and are not automatically called exploits |
| Production | scripts/security-readonly.mjs: explicit GET/OPTIONS paths, no login attempts, mutations, brute force or load tests |

## Remaining limits

No stress/DoS tests or unrestricted active scans run against production. MFA, password-account email ownership/recovery, cross-device discovery synchronization, off-platform backup recovery, edge abuse controls and an independent authenticated penetration test remain separate release work. Browser bearer tokens are still in local storage: CSP/escaping reduce XSS exposure, but HttpOnly session migration is not claimed. Supporting multiple replicas requires shared rate-limit storage. Dependency scanners and tests cannot prove absence of vulnerabilities. Final CI, scan findings and production retest results are recorded below after execution.

## Executed evidence

- [Verify run 39041267101](https://github.com/gywns0418/roast-and-reverb/actions/runs/39041267101), commit `a422ddf`: frontend 73/73 and backend 28/28 passed; frontend production build, npm runtime audit and tracked-source credential pattern check passed.
- The lifecycle test built the previous Boot 3.4.1 application, created an isolated account/record, opened the same database with Boot 4.1.1, accepted the previous session and retained the record. OAuth challenge cookie flags and durable logout rejection after a second restart passed.
- Initial runtime scan found eight distinct fixable HIGH/CRITICAL CVEs across Jackson 2/3 and Tomcat. Same-line patch updates to Jackson 2.21.7/3.1.7 and Tomcat 11.0.27 removed all findings in the configured fixable HIGH/CRITICAL gate. This is not a claim about unfixed or lower-severity issues.
- ZAP baseline: 62 rule passes, zero configured failures, five warning rule groups. JSON contains eight alert types because related CSP/isolation alerts share rule groups. Raw reports are retained as the private CI artifact `isolated-security-reports` for seven days.
- Before deployment, production read-only probes passed 17/22: missing CSP, Referrer-Policy, Permissions-Policy and COOP, plus local-origin CORS acceptance. All probed private/configuration paths and malformed credentials were denied. Production retest is required after deployment.
- Chrome responsive checks at 390px and 1440px confirmed a 12px arrow gap, approximately 50px disclosure height, keyboard Enter toggle, visible focus and no horizontal overflow. Previous mobile layout checks also cover 320px forms/menu behavior. Browser emulation does not replace physical iOS/Android testing.

## Reviewed passive warnings (still open unless noted)

| Alert | Assessment / next hardening step |
| --- | --- |
| CSP wildcard | HTTPS cover images and model CDN subdomains remain permitted; executable scripts are limited to self and named Google hosts. Narrow image/CDN destinations or proxy approved covers in a later change. Not dismissed as a false positive. |
| CSP inline styles | Existing React dynamic artwork/progress styles and Google UI need inline styling. Script `unsafe-inline` is not allowed. Move styles to classes/nonces before removing this exception. |
| Missing SRI | The finding points to the dynamic Google Fonts CSS in index.html. A stable integrity hash cannot be assumed for that response; self-host licensed font files to remove this dependency. |
| COOP | `same-origin-allow-popups` deliberately preserves Google popup login, as described in [Google GIS setup](https://developers.google.com/identity/gsi/web/guides/get-google-api-clientid#cross_origin_opener_policy). Strict cross-origin isolation is not claimed. |
| COEP / CORP | CORP is now `same-origin` for service resources. Full COEP isolation is not enabled: external embeds, cover images and Google UI require compatibility testing before enforcing it. |
| Modern Web Application | Informational: hash-routed SPA requires additional authenticated/manual coverage, supplied partly by API and browser checks. |
| Non-Storable Content | Informational: `no-store` protects authenticated responses. Do not make personal responses publicly cacheable to silence this notice. |

The release has concrete fixes and repeatable regression gates, but the open medium-level CSP/SRI warnings, local-storage session design, account recovery and independent authenticated review remain important before a broad paid launch.

Compatibility follow-up: the semantic worker previously depended on CDN/blob runtime factories, which the new script CSP would block. Its lockfile-pinned ONNX factory/WASM are now served as same-origin Vite assets, with the factory blob cache disabled. No script CDN or blob exception was added; model weights still download from the existing approved Hugging Face hosts. The unused jsDelivr connection allowance was removed.

Isolated Chrome execution under the enforced CSP completed real inference on a public Korean example: 384-dimensional vector, no console errors/warnings. The test created no service account or record.

2026-10-18 follow-up: the next runtime scan detected an additional fixable HIGH OS finding, libexpat CVE-2026-77214 (2.8.5-r0; fixed in 2.9.0-r0). The release gate blocked deployment. Refresh the Alpine runtime packages during image build, then rerun the image scanner and startup/lifecycle checks; do not suppress the advisory. See the [maintainer's release notice](https://blog.hartwork.org/posts/expat-2-9-0-released/).
