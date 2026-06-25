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

## Site Structure

- `app/page.tsx`: single-page narrative layout
- `app/globals.css`: Hallwicks visual system and responsive rules
- `public/images/`: local clinical-interior bitmap assets
- `public/screenshot.jpeg`: canonical Sites preview image
