# VANTA STUDIO

**A fictional fashion e-commerce demonstration built as a developer portfolio
piece. Not a real store. Not a real brand. No real orders are processed.**

VANTA STUDIO is a polished, production-shaped storefront + admin dashboard
that demonstrates front-end, UX and full-stack engineering quality.

## Stack

- React 18 + TypeScript (strict) + Vite
- Tailwind CSS design tokens
- React Router v6
- Zod for input validation
- lucide-react icons
- Supabase (optional) for persistence + auth
- Vitest + Testing Library

## Getting started

    npm install
    cp .env.example .env
    npm run dev

The app boots in **local demo mode** by default — no backend required.
Products, collections and orders live in localStorage.

## Scripts

    npm run dev        Start Vite dev server
    npm run build      Type-check + production build
    npm run preview    Preview the built output
    npm run typecheck  TypeScript only
    npm test           Run the test suite

## Modes

### Local demo mode (default)

- Seeded products, collections and demo orders
- Persists in localStorage
- Admin panel at `/admin` (demo credentials shown on the login screen)
- "Reset demo data" button available on the admin dashboard

### Supabase mode (optional)

Set these in `.env`:

    VITE_SUPABASE_URL=...
    VITE_SUPABASE_ANON_KEY=...

Then run `supabase/schema.sql` in the Supabase SQL editor.
Row Level Security is enabled — admin writes are gated by role claims.

The `SUPABASE_SERVICE_ROLE_KEY` is reserved for trusted server environments
and is **never** imported into browser code or exposed via `VITE_*`.

## Deployment

    npm run build

Deploy `dist/` to any static host. Configure SPA fallback to `/index.html`.
Set `VITE_SITE_URL` to your origin so canonical URLs work.

## Security boundaries

- No real payments. No card numbers, no CVVs, nothing sensitive is stored.
- No public admin registration.
- Demo authentication is NOT real security. In local mode the gate is
  client-side; in Supabase mode authorization is enforced by RLS.
- No credentials committed.

## License

MIT.

**VANTA STUDIO is and always will be a fictional brand.**
