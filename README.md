# Hallwicks Digital Redesign

Minimalist single-page Sites build for Hallwicks Design Limited, focused on
clinical interior architecture, heritage, services, selected works, and inquiry
flow.

## Requirements

- Node.js `>=22.13.0`
- npm

## Commands

```bash
npm install
npm run dev
npm run lint
npm run build
```

The project builds with `vinext` and the Sites Vite plugin. Deployment metadata
lives in `.openai/hosting.json`; D1 and R2 are intentionally unset because this
is a static brand site.

## Architecture

- Framework: Vite through `vinext`, with React Server Components and Sites-compatible build output.
- Animation: GSAP with `ScrollTrigger`, `SplitText`, and `Flip` registered in `lib/animation/gsap.ts`.
- Interaction: Lenis smooth scrolling via `components/animation/lenis-provider.tsx`, synced to GSAP's ticker.
- Visual system: DOM/CSS, `clip-path`, transforms, fixed-grid layering, and local bitmap project imagery.
- Content: Strapi REST API boundary in `lib/content/strapi.ts`, with local fallback data in `lib/content/fallback.ts`.

## Site Structure

- `app/page.tsx`: single-page narrative layout consuming typed content
- `app/globals.css`: Hallwicks visual system, Lenis CSS contract, and responsive rules
- `components/animation/`: client animation and interaction providers
- `components/`: page sections, header, galleries, icons, cursor, and utility UI
- `lib/animation/`: GSAP plugin registration and animation exports
- `lib/content/`: Strapi REST client, content types, and local fallback content
- `public/images/`: local clinical-interior bitmap assets
- `public/screenshot.jpeg`: canonical Sites preview image

## Content API

Set these environment variables when Strapi is ready:

```bash
STRAPI_API_URL=https://your-strapi-domain.com
STRAPI_API_TOKEN=optional-read-token
```

Without those variables, the site uses `fallbackSiteContent`, so builds remain
stable while the CMS model is being prepared.
