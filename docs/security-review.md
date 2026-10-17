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
