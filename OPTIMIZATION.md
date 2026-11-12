# Verdesia optimization delivery

Prepared locally on 12 November 2026. The indexable production artifact is in `dist/`. Nothing has been committed or deployed. The live Netlify site is unchanged.

## What changed

The site remains static HTML/CSS/JavaScript. Build-only tools generate optimized assets and ten complete French/Darija pages. There is no new browser framework, runtime package, image service or hosting subscription.

| Priority | Confirmed finding | Implemented change |
| --- | --- | --- |
| P0 | The homepage cover was a 2,490,270-byte PNG stored with a `.jpg` extension. Its HTML was already eager and high priority. | Correctly typed lossless WebP; matching image preload. Covers retain native resolution to protect sharpness when cropped to a text-dependent height. |
| P0 | Large photographs had no responsive candidates. The palm photo was 6000 × 4000. | 91 lossless delivery variants across 39 referenced images; responsive selection below the cover; existing lazy loading retained. The smaller original is retained when WebP cannot save bytes. |
| P0 | All five public pages explicitly contained `noindex,nofollow`. Public robots and sitemap URLs returned 404. | Approved production mode permits indexing; preview mode stays blocked. Canonicals, ten sitemap URLs, language alternates and factual LocalBusiness metadata are generated. |
| P1 | Assets were revalidated on each visit; Netlify already provided Brotli and ETags. | Content-hashed asset URLs with one-year immutable browser caching. HTML retains Netlify's revalidation behavior. No service worker or stale HTML cache. |
| P1 | Four stylesheets and three unminified scripts were delivered. | CSS consolidated in its original order and minified; scripts minified and deferred. All CSS rules and font files retained. |
| P1 | Darija content depended on browser translation. | Static `/ar/` pages with Darija text, RTL, reciprocal hreflang and distinct metadata. Live switching still preserves form fields and selected files. |
| P1 | Some images lacked dimensions. | Missing width/height attributes added without replacing existing aspect declarations or changing layout markup. |

Videos remain byte-for-byte originals, with `preload="none"`, controls and visibility-based playback. All 30 project photographs and three videos remain available. Original photographs, videos, fonts and four source stylesheets are unchanged.

No CSS purging, lossy photographic recompression, font replacement, image removal or redesign was used. These choices prioritize the required appearance and quality over a synthetic score.

## File size results

Decimal MB/KB are used below. These are file measurements, not Lighthouse results.

| Asset | Before | Final delivery | Reduction |
| --- | ---: | ---: | ---: |
| Homepage cover, full 1280 × 720 resolution | 2,490,270 B | 1,304,436 B | 47.6% |
| Palm photo, example 400px responsive candidate | 1,957,318 B | 145,136 B | 92.6% |
| Combined CSS, before transport compression | 136,823 B | 130,967 B | 4.3% |

The palm example applies only when the browser selects that candidate. Larger displays receive larger candidates; the original 6000px photo remains available. CSS's main benefit is request consolidation; its byte saving is modest.

The following conservative model selects responsive candidates for **all homepage images after scrolling**, with a cold cache. The original referenced image total was 5,923,097 bytes. Estimated page totals include Brotli text and all seven font files. They exclude HTTP overhead and externally served content, and are not actual browser transfers.

| Viewport / pixel ratio | Final image bytes | Image reduction | Estimated complete homepage |
| --- | ---: | ---: | ---: |
| 390px / 1 | 2,793,497 | 52.8% | 2.91 MB |
| 390px / 2 | 3,327,351 | 43.8% | 3.45 MB |
| 390px / 3 | 3,823,299 | 35.5% | 3.94 MB |
| 1440px / 1 | 4,134,011 | 30.2% | 4.26 MB |
| 1440px / 2 | 4,737,263 | 20.0% | 4.86 MB |

Lazy loading can reduce initial transfer below these whole-page totals. The full-resolution homepage cover alone remains 1.30 MB. A universal sub-2 MB whole-page result cannot be claimed while retaining these quality safeguards. Repeat visits can reuse unchanged hashed assets; that saving depends on browser cache retention. No visitor capacity or Netlify Free allowance is guaranteed.

## Validation completed

- `npm run check`: all five source pages, links, contact data and 584 reversible translated strings.
- `npm run check:dist`: ten production pages; 626 local resource/route references; indexing directives, sitemap, language alternates, metadata, dimensions, priorities and media. French body structure and wording match the source; source CSS and original asset hashes match the saved baseline.
- `npm run check:images`: all 91 variants exactly match the reference decoded pixels at their output sizes. Resizing is compared with the same reference resize; this does not assert identical browser rasterization at every viewport.
- Runtime DOM tests execute the built scripts across all ten pages: FR/AR round trips, navigation, dialogs, image/video lightbox, accumulated file selections, deduplication, removal, retained form data and native file sharing without an extra site confirmation. No messages were sent.
- Local HTTP checks: all ten routes and referenced assets returned 200; Brotli delivery, video byte ranges (206/416), MIME types and exclusion of source files passed. The local preview server adds `noindex` even when previewing the indexable artifact.
- Dependency audit reported zero vulnerabilities. Git whitespace checks passed.

The earlier reported mobile score of 66 and LCP of 13.7 seconds were supplied in the audit request. The oversized eager cover is a confirmed transfer problem and a plausible contributor to LCP, but its share of the measured delay was not traced. Browser automation became unavailable and PageSpeed's API returned a quota error, so no new browser screenshots, network waterfall, Lighthouse score or Core Web Vitals are claimed. A 100% visual rendering match has not been independently verified in a browser.

## Build and review

Use Node.js 22 and run:

```text
npm ci
npm run build
npm run check
npm run check:dist
npm run check:images
npm run preview
```

The preview is at `http://localhost:5180`. On this checkout the saved pre-optimization version is available at `/baseline/` for comparison. Build reports and cached variants are in ignored `.preview/`; they are not published. Run `node scripts/measure-transfer.cjs` to reproduce the transfer model.

`npm run build:production` prepares the approved indexable artifact locally and never publishes it. The default build is non-indexable outside Netlify's production context. `netlify.toml` publishes only `dist/`, runs artifact checks, and keeps branch/deploy previews non-indexable. A future production deployment will enable indexing; it is a separate action.

Before deployment, compare the baseline and optimized versions in a browser at matching desktop/mobile viewports and languages, including the menu, FAQ, galleries, lightbox and quote uploads. After an approved deployment, verify Netlify's actual cache/robots headers and redirects, test the sitemap and canonicals, and rerun mobile Lighthouse under equivalent conditions. Browser transfer and LCP measurements are still needed to assess the stated 90+/2.5-second targets.
