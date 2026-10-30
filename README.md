# Álquimia — Website 4.2

This release adds a focused membership checkout while preserving the homepage, Method and About pages, original artwork, and ivory, charcoal and gold identity.

## Joining flow

Choose currency and plan, enter name, email, country and preferred weekly session language, then continue. The website saves the signup privately before opening the matching hosted checkout in the same browser tab. The dialog switches between English and Portuguese with the preferred session language.

| Currency | Monthly | Annual (12 months) | Provider | Annual saving vs 12 monthly payments |
| --- | --- | --- | --- | --- |
| USD | US$25 | US$250 | Stripe | US$50 |
| BRL | R$135 | R$1,345 | InfinitePay | R$275 |

These are fixed offers, not live currency conversions. The approved links are in `payment-config.js`. When changing an offer, update the payment provider, this configuration and the receiver's price validation. Billing settings remain managed by the owner. The supplied Stripe annual link currently displays a one-time US$250 payment; the site uses the exact link the owner selected.

## Activation status

Source and automated tests are ready. **Signup capture is not live until the Google receiver is deployed and two Cloudflare settings are added.** Without them the API returns a controlled unavailable response. The form keeps its values and offers retry and WhatsApp help. It never pretends a signup was saved or a payment completed.

The Google Drive connection in ChatGPT can manage the register, but does not authorize website visitors to write to it. The server integration below provides that separate authorization.

## Private client register

Use the private native Google Sheet created for this project. Keep the `Clients` tab and its row 1 headers unchanged. It starts empty.

New rows have `Awaiting confirmation` for payment and `Not invited` for NAS.com. Amount is the chosen offer, not evidence of money received. Country is an ISO two-letter code; dates use UTC. Payment reference, access date and notes are operator fields.

After checking payment in Stripe/InfinitePay, set payment status to `Paid` and add its transaction reference. After sending the NAS.com invitation, set access to `Invited` and enter the date. Duplicate retries never reset those fields.

Automatic payment reconciliation/webhooks are not enabled. Use the same email at signup and checkout to match InfinitePay payments. Stripe additionally receives an opaque signup ID as `client_reference_id`; its email is prefilled and remains editable. No card information is stored by this website or the register.

## Connect the Google receiver

The Drive connector cannot deploy Apps Script projects. Complete this once in the spreadsheet owner's Google account.

1. At `script.google.com`, create a standalone project named **Álquimia signup receiver**. Paste `integrations/google-apps-script/Code.gs` into `Code.gs`.
2. In project settings, show the manifest and use the supplied `appsscript.json`. Review the code before authorizing its Sheets scope.
3. Generate a random secret of at least 32 characters in a password manager. In **Project Settings → Script properties**, add:
   - `SPREADSHEET_ID`: the private register ID from its URL.
   - `SIGNUP_SHARED_SECRET`: the generated secret.
4. Select **Deploy → New deployment → Web app**. Execute as the owner, with access **Anyone**, so Cloudflare can reach the receiver. Requests still require a valid HMAC signature. The spreadsheet itself stays private.
5. Authorize the script and copy the deployed URL ending in `/exec`. Do not use the `/dev` test URL.
6. In the existing Cloudflare Pages project, add:
   - `GOOGLE_SIGNUP_URL`: the deployed `/exec` URL.
   - `SIGNUP_SHARED_SECRET`: the same secret as the script property.
7. Redeploy so these environment settings take effect.

Keep the secret on the server. Never put it in public JS, GitHub, spreadsheet cells or chat. Apps Script changes require **Deploy → Manage deployments → Edit → New version**.

## Build and deploy

No dependency installation is needed. From the repository root:

```sh
npm test
npm run build
```

The build produces `public/`: static pages, artwork, a self-contained `_worker.js` signup endpoint, routing and headers. Tests and Google setup source are excluded.

- **Existing Direct Upload project:** upload the contents of `public/` as a folder or ZIP. Cloudflare supports `_worker.js` with dashboard drag and drop. Keep the existing project/domain.
- **Git-integrated Pages:** build command `npm run build`, output directory `public`, no framework preset.
- `_routes.json` sends only `/api/*` to the Worker.

Do not upload the unbuilt repository ZIP as the website. Build first.

## Verify activation

1. Open `/api/signup` on the deployed domain. `{"ready":true}` checks configuration presence, not Google authorization or write success.
2. Submit one clearly marked test signup with an email you control. Verify exactly one row appears in `Clients` and the correct checkout opens. Close checkout without paying when only testing signup capture.
3. Check both currencies and plans show the expected amounts.
4. Confirm the receiver works without a visitor Google login, while the register remains private.
5. Remove the marked test row after review. Only mark Paid after verifying an actual payment.

## Data handling and failure behavior

- Required fields, countries, languages, plan and currency are validated on the server. Amount, provider and destination are derived there.
- Browser-supplied payment status or arbitrary checkout URLs are never trusted.
- Requests use same-origin JSON POST, bounded bodies, a hidden honeypot and signed, short-lived server-to-Google payloads.
- The receiver uses a lock, idempotent signup IDs, and best-effort cache limits of five new requests per client fingerprint and 100 globally per ten-minute bucket. Saved retries do not add records or reset operator fields. Raw IP addresses are not stored.
- Private records, the register ID and secrets are not returned by the API. There is no public record-reading endpoint.
- Formula-like names/emails are saved as literal text.
- The form keeps details in page memory, without localStorage or sessionStorage.
- No charge, WhatsApp message, email, or NAS.com invitation is sent automatically by the website.
- Missing setup or failed writes keep visitors on the form with retry and support. Checkout opens only after the receiver acknowledges the save.

## Source

`checkout.js` and `checkout.css` provide the form and currency selection. `payment-config.js` owns offers and routing. `integrations/signup-handler.js` provides the Cloudflare API. `integrations/google-apps-script/` contains the private Google receiver. `integrations/build.mjs` builds the site and Worker. `tests/signup.test.mjs` covers routing, failed saves, signatures, validation, literal text, rate limits and retries.

## References

- https://docs.stripe.com/payment-links/customize
- https://docs.stripe.com/payment-links/url-parameters
- https://developers.google.com/apps-script/guides/web
- https://developers.cloudflare.com/pages/get-started/direct-upload/
