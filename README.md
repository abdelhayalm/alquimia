# Álquimia — Website Version 4

This package updates Version 3 while preserving the original gold, black, and warm ivory identity, logo artwork, portrait, temple photo, membership prices, and WhatsApp joining process.

## What changed

- **Why learn Egyptian Arabic?** A shorter introduction connects Egyptian Arabic with travel, friendship, work, and the Arab world’s diverse cultures. Four circular themes surround “Learning Egyptian Arabic,” joined by fine gold paths and gentle decorative motion.
- **The Álquimia experience:** Three curved panels introduce sound and speaking, culture and creativity, and community practice. They rise in order during a pinned scroll scene on tall desktop screens. On phones, tablets, and short windows, they follow the ordinary vertical reading flow and reveal as they enter view. The scene opens from a rounded canvas to the full page width.
- **More than lessons:** Decode, Immerse, and Transform appear together in a single-line moving subtitle. The separate repeated three-row block is removed.
- **Meet your educator:** Hapi’s first-person biography includes years of teaching worldwide and online, more than 2,000 students, research into Egyptian culture, authentic materials, structured teaching, edutainment, and weekly learning with Hapi and the Álquimia team. These experience claims come from the founder’s supplied description.
- **Membership:** A brief annual invitation replaces the long annual explanation, duplicate payment-help block, and repeated three-step joining section. Detailed payment and NAS.com onboarding instructions remain in the form and FAQ.
- **Closing invitation:** A newly generated, softly defocused Nile scene adds atmosphere behind the existing call to join. The dark overlay keeps the text readable.
- A Pause motion control and operating-system reduced-motion support are included. No scrolling gesture is intercepted. The mobile shortcut hides while the final CTA is visible.

## Offer and joining process

One membership, two payment choices: US$25 for one month or US$250 for twelve months. Annual members pay the equivalent of ten monthly payments, save US$50, and help the school and community plan ahead. Access is the same for both choices.

Choose a plan, enter a name, email, and preferred weekly session language, then review and send the prepared WhatsApp message to **+55 61 99959-8410**. Payment is arranged directly with Álquimia. NAS.com access and group/meeting invitations are added manually after payment confirmation. The website does not take card payments, charge automatically, send messages automatically, or store submitted details.

English and Portuguese sessions are separate each week. Private classes remain separate and are arranged directly with Álquimia. The previously requested pricing bullet “Arrange payment directly with Hapi” is retained; WhatsApp drafts address the Álquimia team.

## Use on Cloudflare Pages

Upload **Alquimia-Website-V4.zip** as a new deployment in the existing direct-upload Pages project. `index.html` and the assets are at the ZIP root. No build command or dependency installation is required for the uploaded package. Review the resulting deployment before using it as the public version.

This delivery is a website package. It has not been pushed to GitHub or deployed into the user’s Cloudflare account.

## Files

- `index.html` — content and accessible page structure
- `style.css` — retained visual identity and established layouts
- `version4.css` — Version 4 responsive layouts and animations
- `script.js` — navigation, activity tabs, membership form, WhatsApp drafts, motion controls, and scroll sequence
- `assets/alquimia-horizontal-original.jpg` — original logo, unchanged
- `assets/alquimia-stacked-original.jpg` — original logo, unchanged
- `assets/hapi-portrait-original.jpg` — original portrait, unchanged
- `assets/egypt-temple-enhanced.png` — retained temple image
- `assets/nile-dusk-cta.png` — new decorative background, 2172 × 724 pixels

## Verification completed

- JavaScript syntax check.
- All local images, stylesheets, anchors, IDs, SVG references, form labels, and accessibility references resolve.
- All image dimension declarations match the files; the four retained image files match Version 3 byte for byte.
- New solid-background text colors meet a minimum contrast of 4.5:1.
- Simulated-DOM checks use the production HTML and script: both plans in English and Portuguese, validation, safe message previews, correct WhatsApp number, manual NAS.com wording, annual CTA entry, keyboard activity tabs, navigation resizing, modal dismissal/focus return, and mobile shortcut visibility.
- Simulated scroll states verify first/second/third reveal order, a fully expanded final canvas, pause/resume, reduced-motion fallback, small/short-screen fallback, and suspension of animation updates when off-screen.
- Responsive source review covers narrow phone layouts through desktop layouts. The full pinned scene is enabled only at a viewport width of at least 1000 pixels and a height of at least 740 pixels.

**Verification limit:** A live browser preview was not available in this session. Actual rendered desktop/mobile appearance, scrolling on physical devices, and the external WhatsApp handoff still need a visual check after upload. Simulated-DOM checks do not replace browser rendering tests.

## Copy reference

SOAS describes Egyptian Arabic as widely understood across the Arab world because of Egyptian film, music, and television. The page uses “widely understood,” without claiming universal understanding or guaranteed fluency across dialects.
https://www.soas.ac.uk/study/find-course/arabic-colloquial-egyptian-beginners-course

## CTA artwork

Generated with the built-in image-generation tool using the supplied Nile image as a mood and composition reference. The original reference was not modified. The image is a decorative illustration of a place and mood, not a documentary location photograph.

Final generation prompt:

> Use case: photorealistic-natural. Asset type: a wide atmospheric background photograph for the closing call-to-action of Álquimia, an Egyptian Arabic culture and learning community. Input image 1 is a visual reference for the Nile-at-dusk mood and composition, not a target that needs exact replication. Create a new panoramic scene inspired by it: a quiet Nile waterfront at blue hour with the last amber sunset, a traditional Egyptian felucca with a pale triangular sail on the far right, subtle palms and an old stone terrace with one glowing pierced brass lantern at the left edge, a distant Egyptian riverfront with small warm lights. Restrained antique gold, deep charcoal, muted olive-black and warm sandstone, suited to the original gold-on-black brand. Compose for a full-width website banner, landscape approximately 3:1, with a generous dark uncluttered center for an HTML heading and button. It will sit behind readable cream text. Apply a beautiful gentle optical defocus throughout; recognizable Egyptian silhouettes and reflected light but no sharp busy details. Soft cinematic depth, believable natural lighting, refined and welcoming, not fantasy or a tourism poster. No text, letters, typography, brand marks, borders, watermark, or people.
