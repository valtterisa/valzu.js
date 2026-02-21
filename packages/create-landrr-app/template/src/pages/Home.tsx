import { Head } from "@landrr/core";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <>
      <Head
        title="Welcome to Landrr.js"
        description="Build fast, SEO-friendly landing pages with Landrr.js - a modern React SSR framework powered by Vite"
        keywords="landrr, react, ssr, vite, landing page, seo"
        ogTitle="Welcome to Landrr.js"
        ogDescription="Build fast, SEO-friendly landing pages with Landrr.js"
        ogType="website"
        twitterCard="summary_large_image"
      />
      <div className="min-h-screen flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-2xl rounded-lg bg-card text-card-foreground shadow-lg p-8 border border-border">
          <h1 className="text-3xl font-bold text-foreground mb-4">
            🚀 Welcome to Landrr.js!
          </h1>
          <p className="text-muted-foreground mb-6">
            A modern React framework with Vite SSR for building SEO-friendly
            landing pages.
          </p>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-foreground mb-3">
              Features
            </h2>
            <ul className="space-y-2 text-muted-foreground">
              <li>⚡ Lightning-fast development with Vite</li>
              <li>🔍 SEO-optimized with Server-Side Rendering</li>
              <li>⚛️ React 18 with modern hooks</li>
              <li>🎯 File-based routing</li>
              <li>📱 Responsive by default</li>
              <li>🔧 TypeScript support</li>
            </ul>
          </section>

          <section className="flex gap-4 flex-wrap justify-center mt-8">
            <Link
              to="/about"
              className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
            >
              Learn More →
            </Link>
            <a
              href="https://github.com/valtterisa/landrr.js"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-md border border-input bg-background px-6 py-2.5 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground"
            >
              📖 View on GitHub
            </a>
          </section>
        </div>
      </div>
    </>
  );
}
