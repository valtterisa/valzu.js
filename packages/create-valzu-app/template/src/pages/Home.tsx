import { Head } from "valzu-core";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <>
      <Head
        title="Welcome to Valzu.js"
        description="Build fast, SEO-friendly landing pages with Valzu.js - a modern React SSR framework powered by Vite"
        keywords="valzu, react, ssr, vite, landing page, seo"
        ogTitle="Welcome to Valzu.js"
        ogDescription="Build fast, SEO-friendly landing pages with Valzu.js"
        ogType="website"
        twitterCard="summary_large_image"
      />
      <div className="home">
        <h1>🚀 Welcome to Valzu.js!</h1>
        <p>
          A modern React framework with Vite SSR for building SEO-friendly
          landing pages.
        </p>

        <section className="features">
          <h2>Features</h2>
          <ul>
            <li>⚡ Lightning-fast development with Vite</li>
            <li>🔍 SEO-optimized with Server-Side Rendering</li>
            <li>⚛️ React 18 with modern hooks</li>
            <li>🎯 File-based routing</li>
            <li>📱 Responsive by default</li>
            <li>🔧 TypeScript support</li>
          </ul>
        </section>

        <section className="cta">
          <Link to="/about" className="btn">
            Learn More →
          </Link>
          <a
            href="https://github.com/valtterisa/valzu.js"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary"
          >
            📖 View on GitHub
          </a>
        </section>
      </div>
    </>
  );
}
