# English content, brand voice and SEO

[Documentation index](README.md) · [Project decisions](PROJECT-CONTEXT.md) · [Design](../DESIGN.md)

## Message hierarchy

**Offer:** Egyptian Arabic through a creative cultural community. **Experience:** decode the language, immerse in culture, transform through community. **Action:** join monthly/annual. **Evidence:** actual learning rhythm and illustrative activities; authentic reviews when available.

Warm, curious, precise and human. Describe practice rather than guaranteeing identity change, spiritual transformation or fluency. Egyptian Arabic stays central; relevant Standard Arabic supports understanding without becoming the foundation/main track. Explore Sufism, spiritual ideas and Abrahamic traditions without religious bias. Distinguish morphological roots from etymology; require specialist evidence for Ancient Egyptian origin claims.

## Page map

| Page | Purpose | Editorial search intent |
| --- | --- | --- |
| `/` | Offer, culture, method/word discovery, tree, rhythm, creative examples, founder, membership and FAQ | Learn Egyptian Arabic online; live lessons/community |
| `/method` | Practice cycle, skills, roots, varieties and cultural application | Egyptian Arabic learning method; immersion |
| `/about` | Hapi, mission and inclusive cultural philosophy | Álquimia academy/community; educator |

Intent phrases are editorial targeting, not keyword-volume research or ranking forecasts. Preserve canonical origin `https://egyptianarabic.alquimias.com`; preview URLs are not new public domains.

## Copy guardrails

- Public pages/form: English teaching, USD, Stripe only; no second-market references.
- US$25 monthly / US$250 for 12 months; identical full access, US$50 annual saving. No unsupported trial/refund/cancellation/renewal promises.
- Weekly 50-minute lesson, additional monthly gathering over 90 minutes, recorded workshops fortnightly. No unlimited personal tutoring promise.
- 3/6/12-month goals are illustrative beginner targets at 4–6 hours/week; adapt to starting level. Curriculum/assessment still developing, no fluency/certified-level guarantee.
- One-million mission is ambition, not current scale. No invented counts, scarcity, superior learning results or testimonials.
- Private classes are separate; guidance has no invented turnaround or unlimited 1:1 scope.

## Reviews and showcase

`content/reviews.json` is empty. The build omits reviews until approved authentic data exists. Entries require a real public quote, `consentToPublish:true`, `approved:true`, approved attribution and accurate `kind` (`membership` or `private-class`). Use renderer field definitions; keep contact details/consent records private. HTML is escaped; prior private-class feedback is labeled accurately.

The current showcase contains illustrative activities and existing imagery, labeled as such. Actual learner work requires permission and truthful provenance.

## Technical SEO and delivery

Unique titles/descriptions/canonicals, English metadata, Open Graph/Twitter image tags, one main heading and semantic links/sections. JSON-LD describes the real educational organization and website; no invented rating or certification. `robots.txt` excludes `/api/`; sitemap retains three existing canonical routes.

No new external font/tracker/animation dependency. Existing responsive WebP hero uses high fetch priority; below-fold images have dimensions/lazy loading. The public build excludes docs/receiver/tests/retired scripts. Site checks validate local links/assets/anchors and JSON-LD parsing.

See [validation](VALIDATION.md). No Lighthouse, field Core Web Vitals, indexation, Search Console, full screen-reader audit or ranking result was measured. Validate the live domain after deployment.
