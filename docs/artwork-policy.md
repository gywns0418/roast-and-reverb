# 2026-11-01 artwork policy and source record

Mode: built-in image_gen. No API key or external paid image provider. Original PNGs are preserved in the local Codex generated_images directory; committed derivatives are optimized WebP. These are original illustrative scenes, not vendor product photos or ingredient claims. Existing peach, grape and lemon illustrations remain unchanged.

## New individual blend artwork

### 944-b228b3af9
Output: frontend/public/images/beans/944-b228b3af9.webp
Original: C:/Users/gywns/.codex/generated_images/01a1972d-51b4-7eb2-9a16-63fd2837bd5e/exec-3a0ab115-9eeb-4eb8-a513-ac30ef191b47.png
Prompt:
> Use case: illustration-story. Standalone upright 3:4 botanical watercolor tasting-note illustration for a coffee catalog card. STYLE REFERENCE: attached peach-and-berry art only; match its warm cream #f6e9de background, delicate natural watercolor, centered compact composition and generous empty margins. Subject for coffee 카카오 크림: an elegant still life of a few milk chocolate squares, a small soft mound of cocoa powder, two hazelnuts (one open), and a vanilla pod with a tiny vanilla blossom. Only these listed tasting-note objects, muted warm browns and natural greens, refined botanical illustration. No text, logos, packaging, UI, borders, coffee beans, wine bottles or product photography. This is a flavor metaphor, not an ingredient claim. Output one individual artwork.

### 944-b325c3fb5
Output: frontend/public/images/beans/944-b325c3fb5.webp
Original: C:/Users/gywns/.codex/generated_images/01a1972d-68b0-77c3-aca4-6d65d207ebbf/exec-c556a829-2c3f-4827-81c0-35018e689a17.png
Prompt:
> Use case: illustration-story. One standalone upright 3:4 botanical watercolor illustration for a coffee tasting-note card. STYLE REFERENCE only: supplied peach-and-berries image; match its delicate botanical watercolor realism, gentle paper texture, soft natural edges, cream #f6e9de background, fresh but muted palette and generous empty padding. Subject based strictly on tasting notes tomato, redcurrant, grapefruit, herbs, brown sugar: depict one ripe red tomato with a cut half, a delicate redcurrant sprig, and a small pink grapefruit wedge, with a restrained herb sprig. Center the compact still life in the middle 65 percent of canvas with airy blank top and bottom. This is a flavor metaphor, not coffee ingredients or a product photo. No text, logos, labels, coffee beans, containers, packaging, UI, borders or watermark. Create only this single illustration.

## Shared bean and guide illustrations
Common art: frontend/public/images/beans/common-bean.webp (360×480). Two sculptural green/olive coffee beans, one large tilted bean with a smaller lower-right bean, preserving the original two-bean composition. Delicate botanical watercolor, warm cream #f6e9de paper, generous margins. No text, logo, packaging or UI. This is illustrative bean art, not a product photo.
Original: exec-eebf9773-6f50-406c-8579-e8d436124e66.png

Guide art: frontend/public/images/guide-{cup,music,save}.webp (320×320). Same watercolor/cream/green family; cup with blank notebook and pencil; green headphones with record and coffee sprig; green-spined open archive notebook with blank card and leaf. No text/UI/logos. Adjacent step descriptions carry the full accessible meaning, so the images are decorative with empty alt.
Originals: exec-af952997-5e26-4bc6-8980-d0ac59220425.png, exec-9f16578d-f38f-4adb-aa66-841d95f0961d.png, exec-c9e30948-cbf0-4b2c-bcf7-64d72b1ad83b.png in Codex generated_images/01a1946a-f606-7b13-84ac-3745206cdacf.

Unused individual illustrations created before the user's scope correction remain ignored under .local/artwork-completion/unused and are not published. Never resume the abandoned all-beans job queues.

## Maintenance
Run node scripts/check-illustration-coverage.mjs from repo root. Exit 2 means a new/changed unspecialty blend needs source-grounded image review. All other categories must retain the shared bean asset. The scheduled routines also review home, dashboard, forms, records, settings, tools and mobile; they cannot silently merge main or restart Railway.

## 2026-11-02 dashboard-only transparent edit
Built-in image_gen edit of existing common-bean.webp, with transparent_background=true. Result is RGBA with alpha0–255, optimized to360×480 WebP preserving alpha. Output: frontend/public/images/beans/common-bean-cutout.webp. Existing monthly shared asset remains unchanged. Original: C:/Users/gywns/.codex/generated_images/01a1946a-f606-7b13-84ac-3745206cdacf/exec-9c7b3650-1cd1-4009-94f0-f92a723be6e0.png.
Prompt:
> Edit target: the attached existing two green coffee beans watercolor artwork. Remove only the flat warm cream/peach paper background completely to true alpha transparency. Preserve the exact two-bean composition, colors, texture, watercolor edges and botanical realism. No new objects, no text, no white rectangle, no background surface or cast shadow. Standalone transparent cutout for an existing white website panel. Keep generous but modest transparent padding around the beans. Output an RGBA PNG.
