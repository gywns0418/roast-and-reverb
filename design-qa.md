# Monthly Library design QA

Reference: selected option 2, exec-5847c535-72ad-471c-afe6-a0c0e0de6421.png (1487횞1058). Existing React product, original palette and source data preserved.

## Initial comparison
Evidence: .local/library-qa/comparison-before.png; source and implementation combined at same 1487횞1058 viewport.
- P1: Missing botanical flavor assets in leading cards. Generate and place peach/berry, grape and lemon illustrations with honest alt text. Existing information artwork remains for other beans.
- P2: Long filter panel pushes options below viewport. Reduce filter spacing; mobile must expose collapsible filters and show cards sooner.
- P2: Selected category underline spans full panel. Limit visual emphasis to text underline and check.

Initial result: blocked.

## Preserved production constraints
Keep device-storage notice, category headings, original navigation/fonts, full actual prices/sale status, archive/favorites/compare and all 56 actual beans. Mock's invented product prices and unavailable beans are not production data. No fake ratings.

Second comparison: .local/library-qa/comparison-after.png. Botanical assets now placed, filter density improved, mobile toggle unexpectedly visible on desktop (P2). Fix with page-scoped display rule, then recapture.

## Final comparison
Evidence: .local/library-qa/comparison-final.png (reference left, implementation right, both1487×1058); mobile-final.png390×844.
- Typography: existing Korean sans-serif/brand retained, readable title/price, complete wrapping.
- Layout: left filters and two-column cards reproduce selected composition. Production storage notice, actual longer names and category headings intentionally add space. Mobile collapses filters with labeled aria-expanded toggle and uses1column.
- Colors: original cream/white/green, tiny terracotta checks/underlines and unmodified vendor HEX.
- Image quality: three generated botanical illustrations fit slots without distortion and include honest alt; other beans retain original informational artwork. Final images all load, duplicate announcements removed.
- Content: actual prices, available/upcoming states and all56 beans retained. Mock-only product facts excluded.
- Interactions: house category4; empty search0 and recovery text; reset56; mobile toggle opens/closes, category works; detail opens/closes. No overflow390 (content375), no error logs on clean reload.
- Earlier P1/P2 findings resolved. P3: more botanical illustrations possible later; remaining original artwork intentionally preserved.

Checklist: layout, palette, images, data, desktop/mobile and primary interactions checked;102tests and build passed.

final result: passed


# Cross-screen consistency QA — 2026-11-01
Visual direction: user's selected option2, extended through existing page layouts and source assets. Not a pixel clone of the monthly page onto unrelated tasks. Current-run source screenshots: .local/all-screen-audit/01–28; private screenshots remain local.
Initial combined comparisons: compare-core.png, compare-forms.png, compare-discover.png, compare-tools.png (before left/after right, same1280 viewport, raster1265×712).
- Resolved: inconsistent header/card system,32px fields, heavy filled selection, hidden tools, oversized search action, unclear empty-state copy.
- P2 remaining: journey still has two large introduction sections; compress bridge. Legacy monthly hero stays too tall despite smaller type; inspect actual child heights. Single legacy series selection uses full-width underline; remove redundant singleton tab.
- Source state differs on Beans: existing user data on deployed origin vs empty local origin, intentionally not copied or fabricated. Compare shell/controls, do not claim exact populated card parity.
Current cross-screen result: blocked pending fixes and mobile/interaction checks.


## Cross-screen final comparison
Combined current-run sources/implementation: compare-core.png, compare-forms.png, compare-discover.png, compare-tools.png, then compare-final.png after fixes. Focused full-size settings/forms and mobile-final-review.png also inspected. Source layout on unrelated routes is retained rather than cloned from the monthly route; selected option2 supplies palette/card/selection rhythm.
- Fonts/typography: original brand and Korean sans serif preserved;28px desktop24px mobile headings,16px inputs, readable labels/full wrapping.
- Spacing/layout: shared14px card corners, clear gaps,44px controls; left/right tool groups open; compact report/ritual/journey/legacy introductions. No horizontal overflow in24 mobile routes (390 viewport,375 content).
- Colors/tokens: original cream/white/green retained; terracotta underline only for selected filters/presets. No new overall recolor.
- Images: existing source art and accessible captions preserved; current monthly botanical assets still load. No new approximated artwork. Private populated bean screenshot not copied into local data or uploaded.
- Copy/content: accurate local-mode pairing/import wording; starter-track count not hardcoded; honest empty search and collection add action; all source data and storage untouched.
- Interactions: record card preview works without save;LP/CD aria-pressed toggles; collection add route; search with no stored songs; sound preset aria-pressed; tools navigation; privacy dialog opens/closes. No browser error logs.
- Earlier P2 journey/legacy height fixed and recaptured on desktop/mobile; singleton legacy selector removed, unavailable global/small not rendered; archive records retained. Mobile music-search loading capture rejected and replaced by settled final state.
- P3: small decorative editorial graphics intentionally retained, additional custom imagery not needed. Saved-record detail and administrator visual states not verified in absence of applicable account/records.

Final checklist: existing functions/data preserved;29 audit states recorded;24 mobile paths checked; visual comparisons accepted; regression tests/build required before publication.

final result: passed

Final contrast correction: form boundaries retain existing --rr-line (#74836d), rather than a lighter card separator. Text/field focus contrast retained; no data/control behavior changes.
