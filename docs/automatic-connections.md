# Automatic connections and REA review

Implemented 2026-10-15 (Asia/Seoul). This extends the existing service and its existing monthly heartbeat; it does not create another service.

## What no longer needs repeated forwarding

- The local caretaker discovers the already authorized `beans.md` source under the sibling coffee project. `scripts/connection-snapshot.mjs` reads it without modification and keeps paths/hashes/counts only in ignored `.local/connection-snapshot.json`. A repeated run correctly reported no source change. No private names, quantities or file contents entered public seed data.
- `scripts/sync-monthly-picks.mjs` discovers the supported vendor's current monthly links itself. During this run, one product availability changed to sold-out. The collector preserved 52 items and vendor flavor colors and added a separately observed JSON-fetch timestamp. Its next run reported changed:false.
- Existing browser connections reread the authorized file on visible polling/return. A restored inventory now repairs from the unchanged source too, while manual entries survive. Browser permissions still require the initial user grant; native caretaker access cannot grant website access.
- The /connections page shows browser file state, public-source timestamps and device counts. It rereads the published catalog on entry/focus/every 15 minutes. It does not claim a native file was already connected to that browser.

## REA evidence and confirmed changes

[REA's static JavaScript workflow](https://github.com/morluto/rea/blob/main/docs/javascript-artifact-reconstruction.md) was executed with rea-agents 6.5.0. Selected sources: beanFileStore.js, ritualStore.js, monthlyCatalog.js, semanticClient.js and discoveryStore.js. Both runs parsed five sources with zero parse failures. Other inventoried files are outside scope; structural/semantic graphs alone do not prove runtime execution or a full security audit.

- Initial analysis: `ev_797e3262cb86e75f09b5b80553dd1a059cf499acc28b4b3134026c75065812a0`.
- File-sync feature trace: `ev_c849ad2d6f7734c253461fbb93b781328414b21ebceee14edaace0366e00a170`.
- Final analysis: `ev_2b775fd6a1d122e778b0827ed9f79ef939ce3078b1f41a105db196c5d20b3b8a`.

The traced paths guided source review; behavioral tests established the actual defects/fixes:

1. A source hash alone did not establish that its rows were still present after backup restoration. Added an inventory signature and forced source parsing only when the shelf differs. Reconciliation preserves manual beans and marks removed source rows unknown.
2. Semantic worker errors referenced a global current worker. A late error from a retired worker could affect a replacement. Requests now carry their owning worker; retirement settles only owned pending requests. Sending failures settle immediately and allow a fresh worker on retry. Tests cover stale errors, shared-worker timeout and retry after send failure.

`scripts/rea-review.ps1` pins the analyzer and reuses evidence only when both the selected source hashes and evidence file match the recorded state. Full evidence stays ignored locally. It neither registers a new global MCP server nor starts native-binary providers.

## Skill and daily routine

The canonical skill lives in `.agents/skills/roast-reverb-autopilot/`. A discoverable local skill was installed under the user's Codex skills directory and points to the maintained project instructions. Both passed Skill Creator validation. It directs future work to available sources and relevant official tool documentation rather than asking for readable files or discoverable links again.

Existing heartbeat `automation` was updated from monthly refresh to **daily 09:00 Asia/Seoul**, keeping its existing target chat. It inspects connected sources, refreshes public monthly data, follows useful REA/tooling findings through tests/dev PRs/deployment, and stays quiet when unchanged. It should report meaningful updates, new failures or genuinely required actions only, without repeating the same key-approval blocker.

This is a local Codex heartbeat: the PC and app must be running. It is not an always-on cloud daemon. Main promotion, paid upgrades, private-source publication and duplicate service creation remain outside automatic maintenance. Open-ended AI/key provisioning is still unresolved.

## Verification

50 frontend tests and Vite production build passed. New tests cover unchanged-file repair, manual-item preservation, stale worker errors, immediate send failure and retry, and shared timeout settlement. Source snapshot and REA review each ran twice to check no-change behavior. New UI was inspected at desktop and 390×844; mobile document clientWidth=scrollWidth=375. Actual first native file selection/permission is not claimed as automatically verified. CI/PR/public deployment outcomes are recorded in continuity.
