<div align="center">

# ⚡ Landr.js

**A modern React framework for fast, SEO-ready client sites**

[![npm](https://img.shields.io/npm/v/@landr/core?color=6366f1&label=@landr/core&logo=npm)](https://www.npmjs.com/package/@landr/core)
[![npm](https://img.shields.io/npm/v/create-landr-app?color=6366f1&label=create-landr-app&logo=npm)](https://www.npmjs.com/package/create-landr-app)
[![License: MIT](https://img.shields.io/badge/License-MIT-8b5cf6.svg)](LICENCE.md)

*TypeScript · Vite · SSR · React 18*

</div>

---

## 💡 Motivation

> I wanted to build my own framework for **fast client sites**. I can make sites fast that support the basics from start and are easy to use by the client itself—while still maintaining the speed of **real code with AI**.

---

## ✨ Why Landr?

| | |
|:---:|:---|
| 🚀 | **Vite** — Instant dev server, HMR, tiny production bundles |
| ⚛️ | **React 18** — Hooks, Suspense, concurrent rendering |
| 🔍 | **SSR** — Full server-side rendering for SEO and first paint |
| 📝 | **TypeScript** — Typed from day one |
| 🧭 | **React Router** — SPA routing with SSR support |
| 📱 | **SEO** — `Head` component and meta helpers built in |

---

## 🚀 Quick start

**Create a new app in one command:**

```bash
npx create-landr-app my-landing-page
cd my-landing-page
npm run dev
```

Then open **http://localhost:3000** in your browser.

---

## 📁 Project structure

```
my-landing-page/
├── src/
│   ├── App.tsx              # App shell & routes
│   ├── entry-client.tsx      # Client hydration
│   ├── entry-server.tsx      # SSR entry
│   └── pages/
│       ├── Home.tsx
│       └── About.tsx
├── server.js                 # Express SSR server
├── index.html
├── vite.config.ts
└── package.json
```

---

## 📱 SEO support

Use the **`Head`** component from `@landr/core` for meta tags. Works with SSR out of the box.

```tsx
import { Head } from "@landr/core";

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
|------|-------------|
| `title` | Page title |
| `description` | Meta description |
| `keywords` | Meta keywords |
| `ogTitle` | Open Graph title |
| `ogDescription` | Open Graph description |
| `ogImage` | Open Graph image URL |
| `ogUrl` | Open Graph URL |
| `ogType` | Open Graph type (e.g. `website`, `article`) |
| `twitterCard` | Twitter card type |
| `twitterSite` | Twitter @handle |
| `twitterCreator` | Creator @handle |
| `canonical` | Canonical URL |
| `robots` | Robots meta directive |

---

## 📜 Scripts

| Command | Description |
|--------|-------------|
| `npm run dev` | Start dev server with HMR |
| `npm run build` | Production build |
| `npm run preview` | Run production build locally |

---

## 🛠 Monorepo development

This repo is a **pnpm + Turborepo** monorepo. To hack on `@landr/core` and the template together:

```bash
pnpm install
pnpm dev
```

This runs **@landr/core** in watch mode and the **template app**; edits to the core package are reflected in the template live.

---

## 🌐 Deployment

### Vercel

1. Connect your repo to Vercel.
2. **Build command:** `npm run build`
3. **Output directory:** `dist/client`
4. **Environment:** `NODE_ENV=production`

### Railway / Render

1. Connect the repo.
2. **Build:** `npm run build`
3. **Start:** `npm run preview`

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

<div align="center">

**Contributions welcome** — open an issue or send a PR.

**[MIT License](LICENCE.md)**

</div>
