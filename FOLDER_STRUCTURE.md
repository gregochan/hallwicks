# Folder Structure

```text
Hallwicks/
├─ app/                         # Vinext/Vite app routes and page composition
├─ components/                  # React UI components
├─ lib/                         # Animation/content utilities and API clients
├─ public/                      # Static frontend assets and project images
├─ backend/                     # PHP/MySQL CMS to upload to the PHP server
│  ├─ admin/                    # Simple editor for Featured Works
│  ├─ api/                      # Public read API and private create API
│  ├─ includes/                 # PHP config/db/auth/image helpers
│  ├─ uploads/works/public/     # Generated public WebP images
│  ├─ uploads/works/original-private/ # Original uploads, blocked by .htaccess
│  ├─ config.example.php        # Copy to config.php on the server
│  └─ schema.sql                # MySQL table setup
├─ invoice-ninja/               # Invoice Ninja quote template/reference files
├─ archive/
│  ├─ original-html/            # Original standalone HTML export
│  └─ strapi-backend-experiment/# Archived Strapi experiment, not active
├─ .openai/                     # Sites hosting metadata
├─ .agents/                     # Impeccable skill install for agent tooling
└─ .gemini/                     # Impeccable skill install for Gemini tooling
```

## What To Upload To The PHP Server

Upload the **contents of `backend/`** to the PHP hosting document root.

After upload, these URLs should exist on the server:

```text
/admin/login.php
/admin/works.php
/api/featured-works.php
/api/featured-works-create.php
/uploads/works/public/
/uploads/works/original-private/
```

Do not upload `archive/`, `app/`, `components/`, `lib/`, `node_modules/`, or
the Vinext source files to the PHP backend server unless that server also hosts
the frontend source intentionally.
