# Documentation index

Current source release: **5.0.0 — 17 November 2026**. Review branch: `feat/english-website-v5`. Read [PROJECT-CONTEXT.md](PROJECT-CONTEXT.md) before changing the offer. New explicit Hapi decisions override old drafts; curriculum proposals remain marked.

| Task / question | Starting point | Related source |
| --- | --- | --- |
| Mission, offer and latest decisions | [Project context §§1–8](PROJECT-CONTEXT.md) | Home, Method, About |
| English rebuild scope/handoff | [Project context §9](PROJECT-CONTEXT.md#9-english-website-rebuild-and-github-handoff) | [Implementation plan](IMPLEMENTATION-PLAN.md) |
| Skills/toolkits and design rationale | [Implementation plan](IMPLEMENTATION-PLAN.md) | [Design](../DESIGN.md) |
| Copy, voice and metadata | [Content/SEO](CONTENT-AND-SEO.md) | HTML pages, sitemap |
| Payment links and signup contract | [Stripe integration](STRIPE-INTEGRATION.md) | `payment-config.js`, checkout, signup handler |
| Setup/build/deploy/rollback | [Setup](SETUP-AND-DEPLOYMENT.md) | Worker, build, Wrangler |
| Verification and limits | [Validation](VALIDATION.md) | Tests and site checks |
| Authentic reviews/showcase | [Content policy](CONTENT-AND-SEO.md#reviews-and-showcase) | `content/reviews.json`, review renderer |
| Release history | [Changelog](../CHANGELOG.md) | Git history |

Documentation, receiver source and tests are excluded from public assets. This repository is public: never commit secrets, private spreadsheet identifiers, learner records, unapproved reviews or consent records.

## Still to develop

Detailed tree curriculum/assessment; level placement; feedback capacity; workshop schedule; certificate/prize criteria; confirmed timetable. Operational review also needs controlled live signup-to-Sheet verification and billing-setting verification. These are not completed by the redesign.
