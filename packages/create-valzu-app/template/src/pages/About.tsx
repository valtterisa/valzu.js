import { Head } from "valzu-core";
import { Link } from "react-router-dom";

export default function About() {
  return (
    <>
      <Head
        title="About Valzu.js"
        description="Learn about Valzu.js - a modern React SSR framework built with Vite for creating high-performance landing pages"
        keywords="valzu, about, react, ssr, framework"
        ogTitle="About Valzu.js"
        ogDescription="Learn about Valzu.js framework"
        ogType="website"
      />
      <div className="about">
        <h1>About Valzu.js</h1>
        <p>
          Valzu.js is a lightweight, full-stack framework built with TypeScript,
          React, and Vite. It's designed for building high-performance,
          SEO-friendly landing pages with server-side rendering.
        </p>

        <section className="why">
          <h2>Why Valzu.js?</h2>
          <ul>
            <li>
              <strong>Performance:</strong> Vite provides instant hot module
              replacement and optimized builds
            </li>
            <li>
              <strong>SEO:</strong> Server-side rendering ensures search engines
              can crawl your content
            </li>
            <li>
              <strong>Developer Experience:</strong> Modern React with
              TypeScript for type safety
            </li>
            <li>
              <strong>Flexibility:</strong> Full control over your pages and
              components
            </li>
          </ul>
        </section>

        <section className="cta">
          <Link to="/" className="btn">
            ← Back to Home
          </Link>
        </section>
      </div>
    </>
  );
}
