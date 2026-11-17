# Álquimia — English website v5.0.0

Egyptian Arabic through live learning, creativity, culture and community. English teaching, one full-access membership, US$25 monthly or US$250 for 12 months, using the existing Stripe Payment Links.

Review: [PR #2](https://github.com/abdelhayalm/alquimia/pull/2), branch `feat/english-website-v5`. Baseline main: `b51dd8f78e1bb8129b8bf61bb9d8ceb12f85daa7`. Publishing this branch does not confirm a production deployment. See [validation](docs/VALIDATION.md) for evidence and limitations.

## Start here

| Need | Read |
| --- | --- |
| Latest mission, offer, decisions and unfinished curriculum | [Project context](docs/PROJECT-CONTEXT.md) |
| Find the right file or task | [Documentation index](docs/README.md) |
| Scope, Skill Finder selections and Hapi toolkits | [Implementation plan](docs/IMPLEMENTATION-PLAN.md) |
| Voice, page structure, content and SEO | [Content and SEO](docs/CONTENT-AND-SEO.md) |
| Visual tokens and interaction rules | [Design system](DESIGN.md) |
| Preserve checkout and signup capture | [Stripe integration](docs/STRIPE-INTEGRATION.md) |
| Build, runtime setup, deployment and rollback | [Setup and deployment](docs/SETUP-AND-DEPLOYMENT.md) |
| Completed checks and remaining limits | [Validation](docs/VALIDATION.md) |
| Version history | [Changelog](CHANGELOG.md) |

## Work locally

Node.js 20+; no npm dependencies required.

```sh
npm test
npm run build
npm run check
```

Preview generated `public/`. A static preview displays the pages/form but cannot verify Worker-to-Google signup capture. Review the branch and runtime settings before production deployment.

## Source map

- `index.html`, `method.html`, `about.html`: English pages.
- `style.css`, `script.js`: responsive design, navigation, learning tree and word-family discovery.
- `checkout.css`, `checkout.js`, `payment-config.js`: enrollment dialog and fixed English/USD offers.
- `worker.js`, `integrations/signup-handler.js`: existing signed signup API.
- `integrations/google-apps-script/`: unchanged receiver; no credentials/member data.
- `integrations/build.mjs`: public-file allowlist and Worker bundle.
- `content/reviews.json`: approved, consented real reviews only; currently empty.
- `integrations/render-reviews.js`: build-time review rendering, no empty public section.
- `tests/`, `scripts/check-site.mjs`: behavioral tests and built-site checks.

Original artwork is retained. Historical `version4.css`, `pages.css`, `pages.js` and `cta.css` are excluded from the v5 public build.

## Checkout boundary

Private signup capture precedes Stripe handoff. Payment verification and community invitations remain manual. Exact original Payment Links and the receiver signature contract are preserved; secrets remain in runtime settings. Read-only link checks succeeded; live signup-to-Sheet operation was not verified. A saved signup is not a paid membership.
