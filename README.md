# Valzu.js

A modern, full-stack React framework with TypeScript and Vite. Server-side rendering for SEO and performance—built for fast client sites and content-focused apps.

---

## Motivation

I wanted to build my own framework for fast client sites. I can make sites fast that support the basics from start and are easy to use by the client itself—while still maintaining the speed of real code with AI.

---

## Features

- **Vite powered** — Fast dev server and HMR
- **React 18** — Hooks and concurrent features
- **Server-side rendering** — SEO-friendly HTML from the server
- **TypeScript** — Typed by default
- **React Router** — Client-side routing with SSR
- **SEO components** — `Head` and helpers for meta tags
- **Small production builds** — Optimized with Vite

---

## Quick start

Create a new project:

```bash
npx create-valzu-app my-landing-page
cd my-landing-page
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Project structure

```
my-landing-page/
├── src/
│   ├── App.tsx
│   ├── entry-client.tsx
│   ├── entry-server.tsx
│   └── pages/
│       ├── Home.tsx
│       └── About.tsx
├── server.js
├── index.html
├── vite.config.ts
└── package.json
```

---

## SEO support

Use the `Head` component from `valzu-core` for meta tags (SSR-safe):

```tsx
import { Head } from "valzu-core";

export default function LandingPage() {
  return (
    <>
      <Head
        title="My Amazing Product"
        description="The best product for your needs"
        ogImage="https://example.com/og-image.jpg"
        ogType="website"
        twitterCard="summary_large_image"
        canonical="https://example.com"
      />
      <div>
        <h1>Welcome to My Product</h1>
      </div>
    </>
  );
}
```

### Head props

| Prop | Description |
|------|--------------|
| `title` | Page title |
| `description` | Meta description |
| `keywords` | Meta keywords |
| `ogTitle` | Open Graph title |
| `ogDescription` | Open Graph description |
| `ogImage` | Open Graph image URL |
| `ogUrl` | Open Graph URL |
| `ogType` | Open Graph type (e.g. website, article) |
| `twitterCard` | Twitter card type |
| `twitterSite` | Twitter site handle |
| `twitterCreator` | Twitter creator handle |
| `canonical` | Canonical URL |
| `robots` | Robots meta directive |

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server with HMR |
| `npm run build` | Production build |
| `npm run preview` | Run production build locally |

---

## Monorepo development

This repo is a pnpm + Turborepo monorepo. To work on valzu-core and the template together:

```bash
pnpm install
pnpm dev
```

Runs valzu-core in watch mode and the template app; changes to valzu-core are reflected in the template.

---

## Deployment

### Vercel

1. Connect the repo to Vercel.
2. Build command: `npm run build`
3. Output directory: `dist/client`
4. Set `NODE_ENV=production`

### Railway / Render

1. Connect the repo.
2. Build: `npm run build`
3. Start: `npm run preview`

### Docker

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "server.js"]
```

---

## Contributing

Issues and pull requests are welcome.

---

## License

MIT. See [LICENCE.md](LICENCE.md).
