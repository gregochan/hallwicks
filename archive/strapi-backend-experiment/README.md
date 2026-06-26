# Hallwicks Strapi Backend

Strapi powers the editable **Featured Works** section of the Hallwicks site.

## Run Locally

```bash
cp backend/.env.example backend/.env
npm --prefix backend install
npm run strapi:dev
```

Open `http://localhost:1337/admin`, create the first admin user, then add
entries under **Content Manager → Featured Work**.

## Featured Work Fields

- `title`: project title shown below the image
- `meta`: location, typology, year, or other technical label text
- `image`: uploaded project image
- `imageUrl`: optional URL fallback, useful while migrating existing local assets
- `alt`: accessible image description
- `layout`: visual crop/layout variant, one of `large`, `tall`, `square`, `wide`, `small`
- `order`: lower numbers appear first

Publish entries to make them available through the REST API.

## Frontend Connection

Set these variables in the frontend environment:

```bash
STRAPI_API_URL=http://localhost:1337
STRAPI_API_TOKEN=your-read-only-api-token
```

The frontend reads:

```text
GET /api/featured-works?sort[0]=order:asc&sort[1]=title:asc&populate[image]=true
```

If Strapi is not configured or returns no valid Featured Works, the site falls
back to the curated local project list.
