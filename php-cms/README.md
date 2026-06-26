# Hallwicks PHP/MySQL Featured Works CMS

This folder contains a small PHP/MySQL editor and JSON API for the Hallwicks
Featured Works section.

## Upload Layout

Upload the contents of `php-cms/` to the PHP host so these paths exist:

```text
/admin/login.php
/admin/works.php
/api/featured-works.php
/api/featured-works-create.php
/uploads/works/public/
/uploads/works/original-private/
```

## Install

1. Create a MySQL database.
2. Import `schema.sql`.
3. Copy `config.example.php` to `config.php`.
4. Update database credentials in `config.php`.
5. Generate an admin password hash:

```bash
php -r "echo password_hash('your-password', PASSWORD_DEFAULT) . PHP_EOL;"
```

6. Paste the generated hash into `config.php`.
7. Set a long random `api.write_token` for future automation.
8. Make sure these folders are writable by PHP:

```text
uploads/works/public/
uploads/works/original-private/
```

## Admin Editor

Open:

```text
/admin/login.php
```

You can add/edit Featured Works, upload images, choose layout, set order, and
publish/unpublish entries.

## Public API

The frontend reads:

```text
GET /api/featured-works.php
```

Response shape:

```json
{
  "data": [
    {
      "id": 1,
      "title": "Great People Branemark Center",
      "meta": "Shanghai, China // Dental Center // 2019",
      "description": "Specialist dental center interior.",
      "image": "/uploads/works/public/great-people.webp",
      "alt": "Great People Shanghai dental center interior",
      "layout": "large",
      "className": "project-card project-card-large"
    }
  ]
}
```

## Image Protection Setup

Uploads are processed server-side:

- validate JPG/PNG/WebP
- resize to max 1800px wide
- convert to WebP
- apply subtle `HALLWICKS` watermark
- store original upload in `uploads/works/original-private/`
- serve only `uploads/works/public/*.webp`

The `.htaccess` files block directory listing and deny direct access to the
private original folder on Apache-compatible hosts.

## Future Bot Endpoint

`POST /api/featured-works-create.php` accepts a multipart image upload and fields:

- `title`
- `meta`
- `description`
- `alt`
- `layout`
- `display_order`
- `published`
- `source`
- `api_token`, or send token as `X-API-Token`

Recommended bot behavior: create entries as drafts with `published=0`, then
review and publish from `/admin/works.php`.
