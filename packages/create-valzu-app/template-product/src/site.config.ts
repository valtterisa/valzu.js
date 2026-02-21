export const preset = "default" as const;
export const siteName = "My App";

export const pages = {
  home: [
    { block: "navbar", siteName, links: [{ label: "About", href: "/about" }, { label: "Product", href: "/product" }] },
    {
      block: "hero",
      title: "Welcome to My App",
      subtitle: "Build something great with Valzu.js.",
      ctaText: "Get started",
      ctaHref: "/about",
    },
    {
      block: "featureGrid",
      heading: "Why us",
      items: [
        { title: "Fast", description: "Lightning-fast with Vite and React." },
        { title: "Simple", description: "Easy to customize and deploy." },
        { title: "Flexible", description: "Full control over your site." },
      ],
    },
    {
      block: "cta",
      title: "Ready to get started?",
      buttonText: "Contact us",
      buttonHref: "/contact",
    },
    { block: "footer", copyright: "© 2025 My App. All rights reserved." },
  ],
  about: [
    { block: "navbar", siteName, links: [{ label: "Home", href: "/" }, { label: "Product", href: "/product" }] },
    {
      block: "hero",
      title: "About us",
      subtitle: "Learn more about what we do.",
      ctaText: "Back to home",
      ctaHref: "/",
    },
    { block: "cta", title: "Get in touch", buttonText: "Email us", buttonHref: "mailto:hello@example.com" },
    { block: "footer", copyright: "© 2025 My App." },
  ],
  product: [
    { block: "navbar", siteName, links: [{ label: "Home", href: "/" }, { label: "About", href: "/about" }] },
    {
      block: "hero",
      title: "Our Product",
      subtitle: "Everything you need to build and ship.",
      ctaText: "Get started",
      ctaHref: "/contact",
    },
    {
      block: "featureGrid",
      heading: "Features",
      items: [
        { title: "Feature one", description: "First key benefit." },
        { title: "Feature two", description: "Second key benefit." },
        { title: "Feature three", description: "Third key benefit." },
      ],
    },
    { block: "cta", title: "Buy now", buttonText: "Purchase", buttonHref: "/contact" },
    { block: "footer", copyright: "© 2025 My App." },
  ],
} as const;
