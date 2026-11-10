# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
Anyone who needs a QR code now: sharing a link, a Wi-Fi note, a menu, a portfolio. Arrives with a URL or text on the clipboard, wants a good-looking code and a PNG in under a minute. No account.

## Product Purpose
Qraft is a free, client-side QR code generator. Paste a link or text, pick a pattern, ink color and size, generate, download a PNG. Success: the user leaves with a scannable, good-looking code without signing up.

## Positioning
Free, no sign-up, runs entirely in the browser (nothing is uploaded), with styled patterns (square, dots, rounded, classy, elegant) instead of the plain black grid.

## Capabilities and Constraints
- Stack: Next.js 16 App Router, React 19, Tailwind v4, framer-motion, @cheprasov/qrcode (error level H), canvas rendering, PNG download.
- Patterns: squares, dots, rounded, classy, elegant. Sizes: sm 150, md 200, lg 280 (exported at 2x). Six ink presets on white.
- Fonts are pinned by the user: Bricolage Grotesque and DM Sans only.
- Toasts must use the `sileo` library. Theme toggle must be a dropdown (light, dark, system).
- Routes, metadata, SEO assets, structured data and the copy "Encode anything into a scannable mark." stay.

## Brand Commitments
Name: Qraft. Built by Ashutosh Swamy (GitHub, LinkedIn, X, portfolio links kept in the footer).

## Evidence on Hand
No testimonials, usage numbers or customer logos exist. Do not fabricate any.

## Product Principles
- The generator is the page; no marketing filler between the visitor and the code.
- Everything runs locally; say so only where it is true.
- A QR code must stay scannable: light background, enough contrast, whatever the style.

## Accessibility & Inclusion
Keyboard operable controls, visible focus, WCAG AA contrast in both themes, reduced-motion respected.
