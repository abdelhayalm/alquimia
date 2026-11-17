# Álquimia design system — v5

[Documentation index](docs/README.md) · [Content and SEO](docs/CONTENT-AND-SEO.md)

## Direction

A living Egyptian Arabic academy and cultural community: dark editorial opening, original Hapi temple photography, papyrus reading sections and a learning tree connecting roots to expression. Preserve the supplied logo artwork exactly. The learning-tree SVG is a separate explanatory illustration.

## Tokens

| Token | Value / role |
| --- | --- |
| Black / ink | `#000000` / `#1A1A1A` |
| Papyrus / paper | `#F2EAD6` / `#FAF7EF` |
| Gold / gold ink | `#C9A24B` / `#73551D` |
| Lapis | `#2E5A8A`; supporting accent and focus |
| Muted / border | `#655F53` / `#D8CFBC` |
| Display / body | Georgia / Arial, Helvetica; no font downloads |
| Corners | 14px default; rounded controls, arch-shaped hero photo |
| Spacing | Section rhythm `clamp(72px,8vw,120px)`; fluid typography |

No new gradients, replacement logos, autoplay or scroll pinning. Gold texture belongs only to original artwork. Use purposeful imagery and clear hierarchy.

## Interaction and accessibility

Native word-family buttons, keyboard-operated learning tabs, FAQ details and enrollment dialog. Visible focus, descriptive labels, status announcements, reserved image dimensions, responsive images and lazy loading below the hero. Reduced-motion rules disable motion/smooth scrolling. Content/navigation remain available without JavaScript; enrollment offers WhatsApp contact as a fallback.

Mobile navigation has Menu/Close and Escape. Enrollment retains fields after failed saves and never bypasses capture. Browser checks at requested widths 320/390/768/1280px found no horizontal overflow after fixes. See [validation](docs/VALIDATION.md); this is not accessibility certification.

## Boundaries and references

Public offer: English/USD/Stripe only. Preserve both original USD links, signed receiver contract, mapping and manual confirmation/invitation. Keep internal docs and private settings out of `public/`.

Hapi Website, SEO and Online Marketing Toolkits, selected frontend-design/accessibility references and Vercel guidelines were applied. Exact source snapshots and selection rationale: [implementation plan](docs/IMPLEMENTATION-PLAN.md).
