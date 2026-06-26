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
- Content: PHP/MySQL Featured Works API boundary in `lib/content/php-api.ts`, with local fallback data in `lib/content/fallback.ts`.

## Site Structure

- `app/page.tsx`: single-page narrative layout consuming typed content
- `app/globals.css`: Hallwicks visual system, Lenis CSS contract, and responsive rules
- `components/animation/`: client animation and interaction providers
- `components/`: page sections, header, galleries, icons, cursor, and utility UI
- `lib/animation/`: GSAP plugin registration and animation exports
- `lib/content/`: PHP API client, optional Strapi client, content types, and local fallback content
- `backend/`: upload this PHP/MySQL editor and API folder to the PHP server
- `archive/`: old source artifacts, including the original HTML and archived Strapi experiment
- `invoice-ninja/`: Invoice Ninja quote template/reference files
- `public/images/`: local clinical-interior bitmap assets
- `public/screenshot.jpeg`: canonical Sites preview image

## Content API

Set this environment variable when the PHP API is live:

```bash
HALLWICKS_API_URL=https://hallwicks.com/api/featured-works.php
```

Without this variable, the site uses `fallbackSiteContent`, so builds remain
stable while the PHP backend is being prepared.

The PHP/MySQL editor lives in `backend/`. Upload the contents of this folder to
the existing PHP host:

```bash
cp backend/config.example.php backend/config.php
# import backend/schema.sql into MySQL
```

Then open `/admin/login.php` on the PHP host to manage Featured Works.
