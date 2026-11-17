# English website v5 implementation plan

Date: 17 November 2026 (America/Sao_Paulo). Baseline: `b51dd8f78e1bb8129b8bf61bb9d8ceb12f85daa7`.

## Scope and sequence
1. Preserve the existing Stripe payment links, signup endpoint, signed receiver protocol and manual access flow; record a baseline and run existing tests.
2. Rebuild the homepage, method and about pages in the existing HTML/CSS/JavaScript stack. Keep existing routes and original logo assets.
3. Constrain this site's public configuration, form and API validation to USD / English. Preserve the Google receiver source as a compatibility boundary, without changing its deployed configuration.
4. Verify signup behavior, build output, English-only copy, local links/metadata, responsive layout, keyboard access and reduced motion within available tools.
5. Publish a review branch/PR to the existing repository, with indexed documentation and a rollback reference. Production deployment follows review; no production payment or signup is generated for QA.

## Design decisions before implementation
- **Subject:** a living Egyptian Arabic academy and cultural community; primary action: join monthly or annually.
- **Memorable element:** a rooted learning tree with user-selected 3/6/12-month stages. Keep the rest visually restrained.
- **Palette:** black `#000000`, papyrus `#F2EAD6`, aged gold `#C9A24B`, gold ink `#73551D`, lapis `#2E5A8A`, dark ink `#1A1A1A`. No gradients; preserve existing gold texture inside original logo artwork.
- **Type:** Georgia for display, Arial/Helvetica for compact readable body/interface text; Arabic uses the device's Arabic-capable serif fallback. No external font dependency.
- **Composition:** dark hero with Hapi's existing temple image, alternating papyrus reading sections, a light learning-tree spread, a compact monthly learning rhythm, creative activity examples and simple pricing.
- **Interaction:** native dialog for enrollment, accessible native buttons for examples/stages, native details for FAQ. No autoplay, scroll pinning, or hiding content until animation runs.
- **Copy:** warm, precise, curious, human. Egyptian Arabic first, thoughtful cultural/spiritual exploration, realistic goals and transparent inclusion. No invented learner statistics, reviews, scarcity or learning superiority.

## Skills selected using Skill Finder
No new skill packages were installed. Existing Hapi references cover the task, avoiding overlapping installations.

| Resource | Applied scope | Source |
| --- | --- | --- |
| Find Skills for ChatGPT (installed adaptation) | Capability discovery and smallest useful selection | Vercel Labs origin; installed ChatGPT-compatible adaptation |
| Hapi Website Toolkit: START-HERE / WORKFLOW | Existing stack, brand preservation, mobile and integration-first implementation | `abdelhayalm/Hapi-Website-Toolkit-GPTSkill` at `06630adc16d07a42ac0ffb2f4de42a88d4f19056` |
| Packaged Anthropic frontend-design | Visual direction, restrained composition and specific copy | `resources/anthropic-web/skills/frontend-design/SKILL.md`, Apache-2.0 snapshot in the toolkit |
| Packaged Web Quality accessibility | Semantics, focus, forms, dialogs, reduced motion | `resources/web-quality/skills/accessibility/SKILL.md`, MIT as declared in snapshot |
| Vercel Web Interface Guidelines | UI verification; current guidelines read from upstream | `https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md` |
| Hapi SEO Toolkit | Technical metadata, canonicals, crawlability, asset delivery and evidence | `abdelhayalm/Hapi-SEO-Toolkit` at `c669dc555f913633aa5197eaeaccf49e3f32db3b` |
| Hapi Online Marketing Toolkit | Offer, brand voice, conversion, journey QA | `abdelhayalm/Hapi-Online-Marketing-Toolkit` at `ac4e8777edcbb470ea04c171b1b9863af4532e32` |

Public skill discovery checked skills.sh marketing options. No external skill was selected solely from a search result; the applied skill instructions were read from Hapi's existing toolkit. Runtime/browser limitations are recorded in VALIDATION.md, not presented as successful audits.

## Content and journey
Homepage: clear offer → cultural meaning → practical method/root example → learning tree → weekly/monthly rhythm → illustrative creative activities → educator → included benefits/pricing → joining steps → FAQ → closing invitation. Reviews are rendered only when approved authentic data is present. Method/About keep their existing canonical routes and deepen the homepage without duplicating it.

## Brand voice
Warm and welcoming (invite experimentation); precise (state actual format and price); thoughtful (depth through examples); playful (word discovery without forced jokes). Prefer “practice”, “create”, “discover”, “grow”, “community”. Do not promise effortless mastery, universal transformation, or specific comparative learning gains.
