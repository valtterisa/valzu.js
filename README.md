## Valzu.js - Modern React SSR Framework

**Valzu.js** is a modern, full-stack React framework built with TypeScript and Vite. It provides server-side rendering for optimal SEO and performance, making it perfect for building landing pages and content-focused websites.

---

## Features

- **🚀 Vite Powered:** Lightning-fast development with hot module replacement
- **⚛️ React 18:** Modern React with hooks and concurrent features
- **🔍 Server-Side Rendering:** SEO-optimized pages rendered on the server
- **📝 TypeScript:** Full type safety out of the box
- **🎯 React Router:** Client-side routing with SSR support
- **📱 SEO Components:** Built-in Head component for meta tags management
- **💨 Fast Builds:** Optimized production builds with Vite

---

## Quick Start

Create a new Valzu.js project:

\`\`\`bash
npx create-valzu-app my-landing-page
cd my-landing-page
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) to see your app.

---

## Project Structure

\`\`\`
my-landing-page/
├── src/
│   ├── App.tsx           # Main app with routes
│   ├── entry-client.tsx  # Client hydration
│   ├── entry-server.tsx  # Server rendering
│   └── pages/            # Page components
│       ├── Home.tsx
│       └── About.tsx
├── server.js             # Express SSR server
├── index.html            # HTML template
├── styles.css            # Global styles
├── vite.config.ts        # Vite config
└── package.json
\`\`\`

---

## SEO Support

Valzu.js includes a built-in \`Head\` component for managing SEO meta tags. It works seamlessly with server-side rendering:

\`\`\`tsx
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
        {/* Page content */}
      </div>
    </>
  );
}
\`\`\`

### Available SEO Props

| Prop | Description |
|------|-------------|
| \`title\` | Page title |
| \`description\` | Meta description |
| \`keywords\` | Meta keywords |
| \`ogTitle\` | Open Graph title |
| \`ogDescription\` | Open Graph description |
| \`ogImage\` | Open Graph image URL |
| \`ogUrl\` | Canonical URL for Open Graph |
| \`ogType\` | Open Graph type (website, article, etc.) |
| \`twitterCard\` | Twitter card type |
| \`twitterSite\` | Twitter site handle |
| \`twitterCreator\` | Twitter creator handle |
| \`canonical\` | Canonical URL |
| \`robots\` | Robots meta directive |

---

## Scripts

| Command | Description |
|---------|-------------|
| \`npm run dev\` | Start development server with HMR |
| \`npm run build\` | Build for production |
| \`npm run preview\` | Preview production build |

---

## Deployment

### Vercel

1. Connect your repository to Vercel
2. Set the build command to \`npm run build\`
3. Set the output directory to \`dist/client\`
4. Add \`NODE_ENV=production\` environment variable

### Railway / Render

1. Connect your repository
2. Set the build command to \`npm run build\`
3. Set the start command to \`npm run preview\`

### Docker

\`\`\`dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "server.js"]
\`\`\`

---

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

---

## License

MIT License - see [LICENSE](LICENCE.md) for details.
