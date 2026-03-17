# MedAxis Care Solutions Website + Admin Dashboard

Complete Next.js website for a healthcare operations agency with a fully working internal dashboard.

## What Is Included

- Public website pages:
	- Home
	- About
	- Services
	- Projects + Project Details
	- Blog + Blog Details
	- News + News Details
	- Contact
- Internal dashboard:
	- Login and logout
	- Role-based permissions (RBAC)
	- Editable Home, About, Services, Projects, Blogs, and News content
	- Contact submissions inbox
	- Project-interest submissions inbox
- Forms connected end-to-end:
	- Public contact form -> dashboard contacts
	- Public project interest form -> dashboard interests

## Tech Notes

- Framework: Next.js App Router
- Storage: JSON CMS file (`data/cms.json`) for quick local persistence
- Auth: signed cookie session
- RBAC: permission checks on every dashboard section and action

## Default Users

- Admin (full access):
	- username: `admin`
	- password: `admin123`
- Blog editor (blog-only access):
	- username: `blogger`
	- password: `blog123`

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Validation

```bash
npm run lint
npm run build
```

Both commands pass successfully for the current implementation.

## Key Paths

- Public routes: `app/(site)/...`
- Dashboard routes: `app/dashboard/...`
- Dashboard actions: `app/dashboard/actions.ts`
- Public form APIs: `app/api/public/...`
- Data source: `data/cms.json`
