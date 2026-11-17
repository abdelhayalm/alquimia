# Stripe integration preservation reference

## Navigation
[Documentation index](README.md) · [Project brief](PROJECT-CONTEXT.md) · [Setup](SETUP-AND-DEPLOYMENT.md) · [Validation](VALIDATION.md)

## Baseline and preserved links
Baseline source: `b51dd8f78e1bb8129b8bf61bb9d8ceb12f85daa7`, `payment-config.js` and `integrations/signup-handler.js`.

| Plan | USD amount | Exact existing public Payment Link |
| --- | --- | --- |
| Monthly | 25 | https://buy.stripe.com/9B614n4Y0epPbY25NW4AU01 |
| Annual / 12 months | 250 | https://buy.stripe.com/4gM6oHbmochH7HM4JS4AU02 |

The link URLs and amounts are preserved. No new Stripe product, price, subscription, webhook or payment was created. Both Payment Link URLs returned HTTP 200 during read-only checks on 17 November 2026; this does not verify a completed transaction or dashboard billing configuration. Historical documentation reports the annual link as one-time; the website must not invent auto-renewal behavior.

## Existing contract
1. Browser POSTs same-origin JSON to `/api/signup` with `signupId`, `name`, `email`, ISO `country`, `language`, `membership`, `currency`, and empty honeypot `website`.
2. English v5 fixes language to `English` and currency to `USD`. Only `monthly` / `annual` are accepted. The server derives the amount/provider/destination; client prices/status/URLs are ignored.
3. Worker signs a bounded receiver payload using HMAC-SHA256 and sends it to the configured Google Apps Script. No card data passes through this app.
4. The receiver acknowledges the same signup ID. Only then does the API return `{saved:true, signupId, checkoutUrl}`.
5. Stripe link parameters remain `client_reference_id=<opaque signup UUID>`, `prefilled_email=<email>`, `locale=en`.
6. Browser validates the returned Stripe origin/path against the selected configured link before redirecting in the same tab.
7. Payment confirmation and community invitations remain manual. A saved signup is not a successful payment.

## Configuration ownership
Cloudflare runtime names: `GOOGLE_SIGNUP_URL`, `SIGNUP_SHARED_SECRET`. Apps Script properties: `SPREADSHEET_ID`, `SIGNUP_SHARED_SECRET`. Values stay in their runtime dashboards; never commit them or member records. The shared secret must match both sides. The private Sheet `Clients` headers and idempotency behavior are unchanged.

`integrations/google-apps-script/Code.gs` and `appsscript.json` remain byte-for-byte at the baseline. The deployed receiver may accept legacy markets; the English site's own config/API now restricts the request before signing it. This avoids requiring receiver redeployment during a frontend migration. A future separate market needs its own operational separation; it is outside this release.

## Failure behavior to preserve
Missing runtime configuration → 503; failed/malformed receiver acknowledgment → 502; rate limit → 429; duplicate-ID conflict → 409. No checkout URL on failure. Keep entered values for retry and expose human support. No fallback may silently bypass signup capture or imply payment success.

## Migration guardrails
- Preserve the two link paths, server-derived amounts, UUID correlation, payload/signature, field names and register headers.
- Keep `keep_vars:true`, Worker name, domain configuration and secret names unchanged.
- Build only an explicit allowlist of public assets. Do not publish docs, tests, receiver code or retired multilingual assets.
- Run `npm test` and `npm run build`; verify both plans with a mocked receiver and browser handoff boundary. Do not submit real member data or a live charge for QA.
- Deployment health GET was inaccessible (HTTP 403) from this runtime on 17 November 2026, so live signup-to-Sheet operation is **not verified** by this release. Existing source documentation itself was inconsistent about activation; do not call it verified working based on the old README.
- To roll back, restore the baseline commit/tree and rebuild with the existing runtime values. See CHANGELOG.md and VALIDATION.md for release-specific evidence.
