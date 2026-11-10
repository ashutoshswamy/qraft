# SEO Action Plan: qraft.ashutoshswamy.in

Single-page site (1 URL). Audit run inline; specialist subagents skipped (nothing to crawl, local/ecommerce/backlink agents N/A).

## Critical
1. **Deploy local changes.** Live HTML still points og:image/twitter:image at `/og-image.png`; local code uses `/og-image.jpg` (live `/og-image.jpg` = 404). Uncommitted. Commit + push → Vercel redeploy.

## High
2. **Thin content (38 words).** Fixed locally: FAQ section (H2 + 5 Q&A) added in `app/page.tsx`.
3. **No FAQ/feature structured data.** Fixed locally: `FAQPage` JSON-LD; `WebApplication` gained `image`, `featureList`, `browserRequirements`.

## Medium
4. Sitemap `lastModified: new Date()` changes every build → crawlers distrust it. Set a fixed date or drop it.
5. Manifest lacks `description`, `start_url`, `id`, maskable icon.
6. Only 1 URL. Intent pages (e.g. `/wifi-qr-code-generator`, `/url-qr-code-generator`) would capture long-tail queries — needs product decision.
7. Submit site in Google Search Console + Bing Webmaster; request indexing after deploy.
8. Backlinks: link from ashutoshswamy.in portfolio + GitHub repo README + Product Hunt/directories.

## Low
9. `llms.txt` absent (optional; Google ignores).
10. Cache-Control `max-age=0, must-revalidate` on static assets in `public/` — add long cache via `headers()`.

## Passing
HTTPS+HSTS, 200s, canonical `/`, robots.txt + sitemap valid, single H1, title 36 chars, description ok, OG/Twitter complete, theme-color, viewport, lang, security headers (CSP, XFO, nosniff), Vercel edge cache, 0.6s TTFB, fonts via next/font.
