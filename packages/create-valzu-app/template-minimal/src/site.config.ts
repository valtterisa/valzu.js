export const preset = "minimal" as const;
export const siteName = "My App";

export const pages = {
  home: [
    { block: "navbar", siteName, links: [{ label: "About", href: "/about" }] },
    {
      block: "hero",
      title: "Welcome",
      subtitle: "A minimal start with Valzu.js.",
      ctaText: "Learn more",
      ctaHref: "/about",
    },
    { block: "cta", title: "Get in touch", buttonText: "Contact", buttonHref: "mailto:hello@example.com" },
    { block: "footer", copyright: "© 2025 My App." },
  ],
  about: [
    { block: "navbar", siteName, links: [{ label: "Home", href: "/" }] },
    { block: "hero", title: "About", subtitle: "Minimal and focused.", ctaText: "Back", ctaHref: "/" },
    { block: "footer", copyright: "© 2025 My App." },
  ],
} as const;
