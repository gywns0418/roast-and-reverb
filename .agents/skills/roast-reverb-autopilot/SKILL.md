---
name: roast-reverb-autopilot
description: Automatically discover authorized Roast & Reverb source changes, refresh public coffee catalogs, and investigate regressions using REA. Use for this project's recurring maintenance and requests to reduce manual data forwarding.
---

# Roast & Reverb autopilot

The user wants existing sources connected, not repeated requests to paste files or explain the project. Start with actual Git state and `docs/continuity.md`, then use the project's scripts to discover available inputs.

## Sources and operating modes

- `node scripts/connection-snapshot.mjs` locates `beans.md` under the already authorized sibling `coffe_brew_log` directory, reads it without modification, and records private file hashes and inventory counts in ignored `.local/connection-snapshot.json`. Read the discovered original when its changes are relevant; do not ask the user to re-upload a readable file. Never publish raw private content, paths or inventory as seed data.
- Browser file permissions belong to that browser. Native file access does not grant web-page access. The existing persistent connection needs one initial file selection; reuse granted read permission thereafter. Never automate a grant or promise access after the browser revokes it. Explain a lost connection once and keep stored inventory.
- `node scripts/sync-monthly-picks.mjs` discovers the supported vendor's current monthly product links and validates public data before writing. Missing products, failed downloads or changed markup must preserve previous data. This script needs no API key or user-supplied monthly links.
- `scripts/rea-review.ps1` runs pinned REA 6.5.0 against five connection/worker/storage modules only when their SHA-256 fingerprints change. Results stay under ignored `.local/rea/`; use `-Force` to renew evidence deliberately. Static scope is partial: REA is not a proof that the entire app or runtime is correct. Verify a suspected defect with source inspection and behavior tests before patching.

## Recurring maintenance

Run the source snapshot in the canonical project checkout first. Before a public-catalog script writes tracked files, prepare an isolated maintenance checkout following AGENTS branch rules: new feature branch from main, integrate the latest dev implementation, then refresh public data there and compare changes. Preserve all existing user edits in every shared checkout. Test and publish through a dev PR. Main promotion still needs its existing explicit approval.

When sources change, connect them to the existing coffee/music/room flows without inventing consumption, recorded dates, taste measurements, or listening history. Local private sources remain private; browser updates use the authorized file handle. For meaningful code changes run relevant frontend tests/build, and backend tests when server code changes. Follow PR checks and the existing Pages deployment to terminal status before claiming publication.

Discover useful development information proactively: check REA's official repository/package releases and the project's dependency advisories when tooling or failures warrant it. Read the relevant official documentation yourself instead of asking for links the agent can find. Adopt a new tool or version only when it solves an observed project need and the resulting change passes verification; do not turn maintenance into arbitrary dependency churn.

Unchanged sources or the same known unavailable connection should finish quietly. Notify only on a meaningful update, new failure, completed publication or user action that is truly needed. Keep a blocker fingerprint in ignored local state to avoid repeated API-key approval loops. Recheck a blocker only after its state changes or the user asks.

The authorized budget is free services/available free credits. Do not upgrade a plan, create a duplicate service, or auto-purchase access. Actual AI credentials, server operation and browser permissions remain distinct states. Update continuity with verified outcomes, not intended actions.
