# Setup and deployment

[Documentation index](README.md) · [Stripe contract](STRIPE-INTEGRATION.md) · [Validation](VALIDATION.md)

## Build and preview

Use Node.js 20+ from the repository root; no package dependencies.

```sh
npm test
npm run build
npm run check
```

`public/` is generated and Git-ignored. A static preview is not the signup API: unavailable POSTs leave the form open with retained fields and support/retry options. Build before deployment. The explicit allowlist excludes internal docs/tests/receiver source; the build also generates a self-contained `_worker.js`, routing and headers.

## Existing Cloudflare Worker

Preserve the existing project/domain. `wrangler.json` declares Worker `alquimia`, entry `worker.js`, assets `public/`, binding `ASSETS`, and `keep_vars:true`. `/api/signup` is handled by the Worker; other requests delegate to assets.

Existing Git-connected Worker commands: build `npm run build`, deploy `npx wrangler deploy`. Confirm the actual dashboard setup rather than creating another project. This release publishes a review branch; it does not merge or deploy production.

Runtime names, never values in Git:

| Location | Settings |
| --- | --- |
| Cloudflare runtime | `GOOGLE_SIGNUP_URL` (receiver `/exec` URL); `SIGNUP_SHARED_SECRET` (secret) |
| Apps Script properties | `SPREADSHEET_ID`; matching `SIGNUP_SHARED_SECRET` |

Reuse existing deployed configuration. This release changes no secrets, Sheet IDs, Worker name or domain routes. Receiver source is unchanged. Old setup notes conflicted about activation; perform controlled verification before claiming live capture works.

## Receiver recovery / initial setup, only if needed

Use the Sheet owner's account and supplied `integrations/google-apps-script/Code.gs`/`appsscript.json`. Retain private `Clients` headers from `REGISTER_HEADERS`. Set script properties above; generate a secret securely, at least 32 characters. Deploy a web app executing as the owner, accessible to server requests, which are authenticated by HMAC. Use `/exec`, not `/dev`, in Cloudflare runtime. Keep the Sheet private. Script edits require a new deployment version. No such dashboard mutations were performed here.

## Controlled live verification

1. Check deployed `/api/signup` health; success proves configuration presence only.
2. Submit a labeled test signup with an operator-controlled email. Verify one private Sheet row and the original Stripe destination for each plan. Close checkout without paying when testing capture only.
3. Retry the same signup ID to check duplicate prevention; preserve operator payment/access fields.
4. Verify Stripe dashboard billing behavior. Annual copy describes 12-month access without inventing renewal terms.
5. Remove test records after review. Mark Paid only after verifying an actual transaction; invitations remain manual.

Automated tests use a mocked receiver, with no real records or credentials.

## Rollback and compatibility

Baseline: `b51dd8f78e1bb8129b8bf61bb9d8ceb12f85daa7`. Revert v5 commit(s) on the deployment branch, rebuild/redeploy with existing runtime settings; do not regenerate payment links/secrets. Baseline restores the older mixed-market UI and should be treated as temporary recovery.

The build retains Pages-compatible `_worker.js`/routing output, but the checked-in deployment is Workers with static assets. Use the existing production project's actual deployment type. Existing clean `/method` and `/about` canonicals match the sitemap; `.html` asset links remain functional.
