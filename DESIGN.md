# Álquimia design system

## Direction
An Egyptian Arabic school with the character of a cultural meeting place. Preserve the original pyramid-and-book artwork, gold and black identity, and papyrus surfaces. Prioritize clear membership choices and a comfortable mobile reading experience.

## Tokens
- Black #000000: brand and navigation.
- Ink #24231e: primary text and dark actions.
- Egyptian gold #dfbc74: primary action and selected controls on dark surfaces.
- Gold ink #876327: readable accents on papyrus.
- Papyrus #f6f3eb and cream #eae4d6: reading surfaces.
- Georgia: editorial headings; Arial/Helvetica: interface and reading copy. Do not add font downloads merely for decoration.
- Actions: 12px corners, controls: 10px, panels/images: 16px. Circles are reserved for the learning-map concept.
- Actions: minimum 48px; compact touch controls: minimum 44px. Visible keyboard focus; selected control borders sit against the control.

## Interaction
No decorative arrows, ornamental numbering, glossy fills, heavy button shadows, scroll pinning, or continuously running decorative animations. Actual ordered learning steps retain their numbers. Keep calls to action centered, with gold primary actions and quieter outlined secondary actions. Hover lift is at most 2px and restricted to fine pointers.

Short once-only entrances use opacity and transform, last 260ms, and respect reduced motion, including preference changes while the page is open. Content is always visible if JavaScript or animation fails. Tabs, navigation and the signup dialog work with keyboard and touch.

## Mobile
Center hero and section headings; keep extended prose and form labels aligned for reading. Keep the learning map as a center circle followed by four circles in two columns. Use a compact menu panel, readable type and comfortable form controls. Check 320, 390, 768 and desktop widths whenever browser tooling permits.

## Integration boundaries
Preserve all four payment routes, prices, signup fields, signed Google receiver, and manual payment confirmation/community invitation. No payment or personal signup is required for a design verification.

## References applied
Hapi Website Design and Development Toolkit v1.1: START-HERE and WORKFLOW, Frontend Design, Review Animations, Web Quality Accessibility, and Webapp Testing. Their guidance is adapted to this existing HTML/CSS/JavaScript project.
