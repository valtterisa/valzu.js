import { Head } from "@landrr/core";
import { Link } from "react-router-dom";

export default function About() {
  return (
    <>
      <Head
        title="About Valzu.js"
        description="Learn about Valzu.js - a modern React SSR framework built with Vite for creating high-performance landing pages"
        keywords="landrr, about, react, ssr, framework"
        ogTitle="About Valzu.js"
        ogDescription="Learn about Valzu.js framework"
        ogType="website"
      />
      <div className="min-h-screen flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-2xl rounded-lg bg-card text-card-foreground shadow-lg p-8 border border-border">
          <h1 className="text-3xl font-bold text-foreground mb-4">
            About Valzu.js
          </h1>
          <p className="text-muted-foreground mb-6">
            Valzu.js is a lightweight, full-stack framework built with
            TypeScript, React, and Vite. It's designed for building
            high-performance, SEO-friendly landing pages with server-side
            rendering.
          </p>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-foreground mb-3">
              Why Valzu.js?
            </h2>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <strong className="text-primary">Performance:</strong> Vite
                provides instant hot module replacement and optimized builds
              </li>
              <li>
                <strong className="text-primary">SEO:</strong> Server-side
                rendering ensures search engines can crawl your content
              </li>
              <li>
                <strong className="text-primary">Developer Experience:</strong>{" "}
                Modern React with TypeScript for type safety
              </li>
              <li>
                <strong className="text-primary">Flexibility:</strong> Full
                control over your pages and components
              </li>
            </ul>
          </section>

          <section className="mt-8">
            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
            >
              ← Back to Home
            </Link>
          </section>
        </div>
      </div>
    </>
  );
}
