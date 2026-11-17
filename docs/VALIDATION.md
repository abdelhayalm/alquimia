# v5 validation record

[Documentation index](README.md) · [Stripe integration](STRIPE-INTEGRATION.md)

Date: **17 November 2026, America/Sao_Paulo**. Source release `5.0.0`; branch `feat/english-website-v5`; baseline `b51dd8f78e1bb8129b8bf61bb9d8ceb12f85daa7`. Source/build/browser evidence, not production enrollment/payment certification.

## Completed

| Check | Result / scope |
| --- | --- |
| `npm test` | 11 pass: offers/URLs, English/USD restriction, validation/signatures, receiver failures, rate limits, duplicate safety, literal-text handling and approved review rendering/escaping |
| `npm run build` | Pass: allowlisted public assets and bundled Worker |
| `npm run check` | Pass: English/USD scope, exact Stripe paths, links/assets/anchors, image attributes, unique IDs/headings/canonicals, JSON-LD parsing, sitemap and build exclusions |
| Original assets / integration | Original images retained; receiver, signup handler, Worker entry and Wrangler config unchanged against baseline |
| Desktop browser | Home, Method/About visually reviewed; word-family controls and 3/6/12-month tabs work |
| Responsive browser | Requested iframe widths 320/390/768/1280px; client widths 305/375/753/1265px due to scrollbar; scroll width equals client width after fixes |
| Keyboard | Tree arrow-key selection; mobile Menu/Escape; native dialog, focus styles and labels checked |
| Enrollment UI | Monthly/annual amounts update; country selection; annual dialog reviewed at 390px |
| Unavailable local signup | Synthetic QA details: failure retained fields, re-enabled form and did not redirect; no real record/payment |
| Public scope | Browser text/built output checked for other-market offers; document language English |
| Original Stripe links | Both returned HTTP 200 on read-only requests; no checkout completed |

Static-preview POST failure is expected without Worker service; successful capture/checkout URL generation is covered by mocked-receiver tests.

## Limits and follow-up

- Live `/api/signup` returned HTTP 403 to this runtime. That does not establish whether the live receiver works or fails. Signup-to-Sheet operation remains unverified; see [controlled procedure](SETUP-AND-DEPLOYMENT.md).
- No payment, Stripe dashboard change, billing/renewal verification, webhook activation, secret change, message/email or invitation performed.
- No Lighthouse/axe score, full screen-reader audit, OS reduced-motion emulation, field performance, search-indexation or device-lab run. Reduced-motion rules and semantics were checked in source; no formal compliance claim.
- Genuine reviews await approved data. Tree assessment, timetable, feedback capacity and prize/certificate criteria remain product work.
- This is a GitHub review branch; main/production are not merged or redeployed by this review.

## GitHub / Cloudflare result after publication

PR: https://github.com/abdelhayalm/alquimia/pull/2. Implementation `77bed1fad8b005471b4cc59b228ebda5c391bcd3`; indexed handoff `cfdf5ff6e903a0b0a53f655e86e59977be4c7b63`.

GitHub publication succeeded and the PR is mergeable, but Cloudflare's automatic **Workers Builds: alquimia** check failed on both v5 commits. The same check also reports failure for baseline main `b51dd8f78e1bb8129b8bf61bb9d8ceb12f85daa7`. This is evidence of an existing failure on main, not proof of a shared root cause. No preview deployment URL was returned. GitHub's check output exposes a dashboard log link but no error text; opening it reached Cloudflare sign-in. The root cause could not be established without authenticated build logs. Do not describe Cloudflare preview/production as deployed or CI as green. Local tests/build/site checks remain passing.

Failed build details: https://dash.cloudflare.com/5d1229dc9a73c905fb6d2f2695ad34fd/workers/services/view/alquimia/production/builds/9648e307-6f91-417b-9378-e9420cf18250
