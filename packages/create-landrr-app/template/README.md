# My Landrr.js App

A modern React application built with Landrr.js, featuring Bun + Elysia server runtime and Vite SSR for SEO and performance.

## Getting Started

### Development

Start the development server with hot module replacement:

```bash
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your app.

### Production Build

Build your application for production:

```bash
pnpm run build
```

Preview the production build:

```bash
pnpm run preview
```

## Project Structure

```
├── src/
│   ├── App.tsx           # Main app component with routes
│   ├── entry-client.tsx  # Client-side hydration entry
│   ├── entry-server.tsx  # Server-side rendering entry
│   ├── server-modules.ts # SSR + webhook server module entry
│   ├── webhook/          # File-based webhook routes
│   └── pages/            # Page components
│       ├── Home.tsx
│       └── About.tsx
├── server.js             # Bun + Elysia server for SSR
├── index.html            # HTML template
├── styles.css            # Global styles
├── vite.config.ts        # Vite configuration
└── package.json
```

## Features

- ⚡ **Vite** - Lightning-fast development with HMR
- ⚛️ **React 18** - Modern React with hooks
- 🔍 **SSR + getServerData** - Server-side data loading for SEO
- 🎯 **React Router** - Client-side routing
- 📝 **TypeScript** - Full type safety
- 🎨 **CSS** - Simple, responsive styling

## SEO

Use the `Head` component from `@landrr/core` to manage meta tags:

```tsx
import { Head } from "@landrr/core";

export default function MyPage() {
  return (
    <>
      <Head
        title="Page Title"
        description="Page description for search engines"
        ogImage="https://example.com/og-image.jpg"
      />
      <div>Page content</div>
    </>
  );
}
```

## Adding Pages

1. Create a new component in `src/pages/`
2. Add a route in `src/App.tsx`
3. Optionally add `export async function getServerData(ctx)` in the page module

Example:

```tsx
// src/pages/Contact.tsx
import { Head } from "@landrr/core";

export default function Contact() {
  return (
    <>
      <Head title="Contact Us" description="Get in touch" />
      <div>Contact page content</div>
    </>
  );
}

// src/App.tsx
import Contact from "./pages/Contact";

export default function App() {
  return (
    <Routes>
      {/* existing routes */}
      <Route path="/contact" element={<Contact />} />
    </Routes>
  );
}
```

## Deployment

This app can be deployed to any Bun-compatible hosting platform:

- **Vercel** - Zero-config deployment
- **Railway** - Easy container deployment
- **Render** - Simple Node.js hosting
- **AWS/GCP** - For full control

Make sure to set `NODE_ENV=production` in your hosting environment.

### Production Considerations

For production deployments, consider adding:
- Rate limiting middleware (e.g., `express-rate-limit`)
- Security headers (e.g., `helmet`)
- Request logging (e.g., `morgan`)

## Learn More

- [Landrr.js Documentation](https://github.com/valtterisa/landrr.js)
- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
